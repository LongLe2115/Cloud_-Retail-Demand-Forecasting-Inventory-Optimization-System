from datetime import datetime
from uuid import uuid4

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.db import DatabaseConfigError, get_db_cursor

router = APIRouter(
    prefix="/api",
    tags=["Sales Ingestion"]
)

TABLE_NAME = "duanck.ckcloud.new_sales_events"


class SalesEvent(BaseModel):
    sales_date: str
    store_id: int
    product: str
    sales: float


@router.post("/sales")
def ingest_sales(event: SalesEvent):

    event_id = str(uuid4())

    event_time = datetime.utcnow().strftime(
        "%Y-%m-%d %H:%M:%S"
    )

    query = f"""
    INSERT INTO {TABLE_NAME}
    VALUES (
        '{event_id}',
        TIMESTAMP('{event_time}'),
        DATE('{event.sales_date}'),
        {event.store_id},
        '{event.product.replace("'", "''")}',
        {event.sales},
        'API'
    )
    """

    try:

        duplicate_check = f"""
        SELECT COUNT(*)
        FROM {TABLE_NAME}
        WHERE
            sales_date = DATE('{event.sales_date}')
            AND store_id = {event.store_id}
            AND product = '{event.product.replace("'", "''")}'
        """

        with get_db_cursor() as cursor:

            cursor.execute(duplicate_check)

            existing = cursor.fetchone()[0]

        if existing > 0:

            return {
                "status": "duplicate",
                "message": (
                    "Record already exists "
                    "(sales_date, store_id, product)"
                )
            }

            cursor.execute(query)

        return {
            "status": "success",
            "event_id": event_id,
            "message": "Sales event inserted"
        }

    except DatabaseConfigError as exc:
        raise HTTPException(
            status_code=500,
            detail=str(exc)
        ) from exc

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Insert failed: {str(exc)}"
        ) from exc