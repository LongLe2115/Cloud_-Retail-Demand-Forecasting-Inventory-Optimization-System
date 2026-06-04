from fastapi import APIRouter, HTTPException

from app.db import DatabaseConfigError, get_db_cursor

router = APIRouter(prefix="/api", tags=["Monitoring"])

TABLE_NAME = "duanck.ckcloud.pipeline_metadata"


@router.get("/monitoring")
def get_monitoring():

    latest_query = f"""
        SELECT
            pipeline_name,
            run_time,
            status,
            rows_processed,
            model_version,
            duration_seconds
        FROM {TABLE_NAME}
        ORDER BY run_time DESC
        LIMIT 1
    """

    history_query = f"""
        SELECT
            run_time,
            status,
            rows_processed,
            duration_seconds
        FROM {TABLE_NAME}
        ORDER BY run_time DESC
        LIMIT 10
    """

    try:

        with get_db_cursor() as cursor:

            cursor.execute(latest_query)
            latest = cursor.fetchone()

            cursor.execute(history_query)
            history = cursor.fetchall()

        if latest is None:
            return {
                "status": "NO_DATA"
            }

        return {

            "pipeline_name": latest[0],
            "run_time": str(latest[1]),
            "status": latest[2],
            "rows_processed": int(latest[3] or 0),
            "model_version": latest[4],
            "duration_seconds": int(latest[5] or 0),

            "history": [
                {
                    "run_time": str(row[0]),
                    "status": row[1],
                    "rows_processed": int(row[2] or 0),
                    "duration_seconds": int(row[3] or 0)
                }
                for row in history
            ]
        }

    except DatabaseConfigError as exc:

        raise HTTPException(
            status_code=500,
            detail=str(exc)
        ) from exc

    except Exception as exc:

        raise HTTPException(
            status_code=500,
            detail=f"Khong the lay monitoring data: {str(exc)}"
        ) from exc