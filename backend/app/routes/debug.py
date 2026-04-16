from fastapi import APIRouter, HTTPException, Query

from app.db import DatabaseConfigError, get_db_cursor

router = APIRouter(prefix="/api", tags=["Debug"])


@router.get("/debug/discovery")
def discovery(pattern: str = Query(default="reorder")):
    """
    Kiem tra backend dang ket noi toi warehouse nao va co nhung bang/view nao
    phu hop voi pattern hay khong.
    """
    pattern_escaped = pattern.replace("%", r"\%").replace("_", r"\_")
    like_expr = f"%{pattern_escaped}%"

    # Metadata query nay khong phu thuoc vao ten bang cu the, giup ta discover
    # xem trong warehouse hien tai co doi tuong nao khop ten khong.
    query_tables = f"""
        SELECT table_catalog, table_schema, table_name
        FROM system.information_schema.tables
        WHERE lower(table_name) LIKE lower('{like_expr}')
        ORDER BY table_catalog, table_schema, table_name
        LIMIT 50
    """

    query_views = f"""
        SELECT table_catalog, table_schema, table_name
        FROM system.information_schema.views
        WHERE lower(table_name) LIKE lower('{like_expr}')
        ORDER BY table_catalog, table_schema, table_name
        LIMIT 50
    """

    try:
        with get_db_cursor() as cursor:
            cursor.execute(query_tables)
            tables = cursor.fetchall()

            cursor.execute(query_views)
            views = cursor.fetchall()

        return {
            "pattern": pattern,
            "tables": [
                {"table_catalog": row[0], "table_schema": row[1], "table_name": row[2]}
                for row in tables
            ],
            "views": [
                {"table_catalog": row[0], "table_schema": row[1], "table_name": row[2]}
                for row in views
            ],
        }
    except DatabaseConfigError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=500, detail=f"Khong the lay metadata Databricks: {str(exc)}"
        ) from exc


def _filter_match(name: str, pattern: str) -> bool:
    if not name:
        return False
    # pattern dang don gian: "reorder" (khong ho tro % _ trong backend)
    return pattern.lower() in name.lower()


@router.get("/debug/discovery-show")
def discovery_show(
    catalog: str = Query(..., description="Catalog (vi du: duanck hoac workspace)"),
    pattern: str = Query(default="reorder"),
):
    """
    Duyet danh sach schemas trong catalog, sau do list tables/views theo pattern.
    Ham nay giup discover ten dung dang catalog.schema.table/view khi
    system.information_schema.khong tra duoc ket qua theo cau hinh ket noi hien tai.
    """
    try:
        schemas_resp = []
        with get_db_cursor() as cursor:
            # SHOW DATABASES IN <catalog> (Databricks SQL)
            cursor.execute(f"SHOW DATABASES IN {catalog}")
            schemas_resp = cursor.fetchall()

            # Lay ten cot "databaseName" hoac tuong duong
            schema_col_idx = 0
            if cursor.description:
                cols = [d[0] for d in cursor.description]
                for key in ["databaseName", "DatabaseName", "database_name", "dbName", "schemaName", "SchemaName"]:
                    if key in cols:
                        schema_col_idx = cols.index(key)
                        break

            schema_names = []
            for r in schemas_resp:
                schema_names.append(str(r[schema_col_idx]))

            matched_tables = []
            matched_views = []

            for schema in schema_names:
                # SHOW TABLES IN catalog.schema
                cursor.execute(f"SHOW TABLES IN {catalog}.{schema}")
                show_tables_rows = cursor.fetchall()
                table_name_idx = 0
                if cursor.description:
                    cols = [d[0] for d in cursor.description]
                    for key in ["tableName", "tablename", "table_name", "Table Name", "TableName"]:
                        if key in cols:
                            table_name_idx = cols.index(key)
                            break
                for r in show_tables_rows:
                    name = str(r[table_name_idx]) if r and len(r) > table_name_idx else ""
                    if _filter_match(name, pattern):
                        matched_tables.append(
                            {"table_catalog": catalog, "table_schema": schema, "table_name": name}
                        )

                # SHOW VIEWS IN catalog.schema
                cursor.execute(f"SHOW VIEWS IN {catalog}.{schema}")
                show_views_rows = cursor.fetchall()
                view_name_idx = 0
                if cursor.description:
                    cols = [d[0] for d in cursor.description]
                    for key in ["viewName", "view_name", "tableName", "TableName", "viewname"]:
                        if key in cols:
                            view_name_idx = cols.index(key)
                            break
                for r in show_views_rows:
                    name = str(r[view_name_idx]) if r and len(r) > view_name_idx else ""
                    if _filter_match(name, pattern):
                        matched_views.append(
                            {"table_catalog": catalog, "table_schema": schema, "table_name": name}
                        )

        return {
            "catalog": catalog,
            "pattern": pattern,
            "matched_tables": matched_tables[:50],
            "matched_views": matched_views[:50],
        }
    except DatabaseConfigError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Khong the discovery SHOW trong Databricks: {str(exc)}",
        ) from exc

