from fastapi import APIRouter, HTTPException

from app.db import DatabaseConfigError, get_db_cursor, get_target_table_name

router = APIRouter(prefix="/api", tags=["Du bao"])
TABLE_NAME = get_target_table_name()


@router.get("/forecast")
def get_forecast_trend():
    query = f"""
        SELECT
            date,
            SUM(COALESCE(sales, 0)) AS tong_sales,
            SUM(COALESCE(predicted_demand, 0)) AS tong_predicted_demand
        FROM {TABLE_NAME}
        GROUP BY date
        ORDER BY date ASC
    """

    try:
        with get_db_cursor() as cursor:
            cursor.execute(query)
            rows = cursor.fetchall()

        return [
            {
                "date": str(row[0]),
                "tong_sales": float(row[1] or 0),
                "tong_predicted_demand": float(row[2] or 0),
            }
            for row in rows
        ]
    except DatabaseConfigError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=500, detail=f"Khong the lay du lieu du bao: {str(exc)}"
        ) from exc
