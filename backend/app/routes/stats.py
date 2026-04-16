from fastapi import APIRouter, HTTPException

from app.db import DatabaseConfigError, get_db_cursor, get_target_table_name

router = APIRouter(prefix="/api", tags=["Thong ke"])
TABLE_NAME = get_target_table_name()


@router.get("/stats")
def get_stats():
    query = f"""
        SELECT
            COUNT(*) AS tong_ban_ghi,
            SUM(CASE WHEN action = 'REORDER' THEN 1 ELSE 0 END) AS tong_reorder,
            AVG(predicted_demand) AS nhu_cau_trung_binh,
            COUNT(DISTINCT store_id) AS so_cua_hang
        FROM {TABLE_NAME}
    """
    try:
        with get_db_cursor() as cursor:
            cursor.execute(query)
            row = cursor.fetchone()

        return {
            "tong_ban_ghi": int(row[0] or 0),
            "tong_reorder": int(row[1] or 0),
            "nhu_cau_trung_binh": round(float(row[2] or 0), 2),
            "so_cua_hang": int(row[3] or 0),
        }
    except DatabaseConfigError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=500, detail=f"Khong the lay thong ke: {str(exc)}"
        ) from exc
