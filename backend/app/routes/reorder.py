from fastapi import APIRouter, HTTPException, Query

from app.db import DatabaseConfigError, get_db_cursor, get_target_table_name

router = APIRouter(prefix="/api", tags=["Nhap hang"])
TABLE_NAME = get_target_table_name()


@router.get("/reorder")
def get_reorder_data(
    store_id: str | None = Query(default=None),
    action: str | None = Query(default=None),
    product: str | None = Query(default=None),
):
    # Escape don gian de tranh loi SQL syntax khi chuoi filter co dau nhay don.
    def safe_sql(value: str) -> str:
        return value.replace("'", "''")

    filters = []
    if store_id:
        filters.append(f"CAST(store_id AS STRING) = '{safe_sql(store_id)}'")
    if action:
        filters.append(f"action = '{safe_sql(action)}'")
    if product:
        filters.append(f"product = '{safe_sql(product)}'")

    where_clause = f"WHERE {' AND '.join(filters)}" if filters else ""

    query = f"""
        SELECT
            date,
            store_id,
            product,
            predicted_demand,
            reorder_point,
            action
        FROM {TABLE_NAME}
        {where_clause}
        ORDER BY date DESC
        LIMIT 100
    """

    try:
        with get_db_cursor() as cursor:
            cursor.execute(query)
            rows = cursor.fetchall()

        return [
            {
                "date": str(row[0]),
                "store_id": str(row[1]),
                "product": row[2],
                "predicted_demand": float(row[3] or 0),
                "reorder_point": float(row[4] or 0),
                "action": row[5],
            }
            for row in rows
        ]
    except DatabaseConfigError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=500, detail=f"Khong the lay du lieu nhap hang: {str(exc)}"
        ) from exc
