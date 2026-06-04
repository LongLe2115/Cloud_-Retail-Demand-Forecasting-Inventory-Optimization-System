from fastapi import APIRouter, HTTPException, Query

from app.db import DatabaseConfigError, get_db_cursor

router = APIRouter(
    prefix="/api",
    tags=["Future Forecast"]
)

TABLE_NAME = "duanck.ckcloud.future_forecast"


@router.get("/future-forecast")
def get_future_forecast(
    store_id: str | None = Query(default=None),
    product: str | None = Query(default=None),
    risk_level: str | None = Query(default=None),
):
    def safe_sql(value: str) -> str:
        return value.replace("'", "''")

    filters = []

    if store_id:
        filters.append(
            f"CAST(store_id AS STRING) = '{safe_sql(store_id)}'"
        )

    if product:
        filters.append(
            f"product = '{safe_sql(product)}'"
        )

    if risk_level:
        filters.append(
            f"risk_level = '{safe_sql(risk_level)}'"
        )

    where_clause = (
        f"WHERE {' AND '.join(filters)}"
        if filters
        else ""
    )

    query = f"""
        SELECT
            forecast_date,
            store_id,
            product,
            predicted_demand,
            recommended_order_qty,
            risk_level,
            action
        FROM {TABLE_NAME}
        {where_clause}
        ORDER BY forecast_date ASC
        LIMIT 500
    """

    try:
        with get_db_cursor() as cursor:
            cursor.execute(query)
            rows = cursor.fetchall()

        return [
            {
                "forecast_date": str(row[0]),
                "store_id": str(row[1]),
                "product": row[2],
                "predicted_demand": float(row[3] or 0),
                "recommended_order_qty": float(row[4] or 0),
                "risk_level": row[5],
                "action": row[6]
            }
            for row in rows
        ]

    except DatabaseConfigError as exc:
        raise HTTPException(
            status_code=500,
            detail=str(exc)
        ) from exc

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Khong the lay future forecast: {str(exc)}"
        ) from exc