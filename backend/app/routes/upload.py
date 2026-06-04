from datetime import datetime
from uuid import uuid4
from io import StringIO

import pandas as pd

from fastapi import APIRouter, UploadFile, File, HTTPException

from app.db import (
DatabaseConfigError,
get_db_cursor
)

router = APIRouter(
prefix="/api",
tags=["CSV Upload"]
)

TABLE_NAME = "duanck.ckcloud.new_sales_events"

@router.post("/upload-sales")
async def upload_sales_csv(
file: UploadFile = File(...)
):


    try:

        content = await file.read()

        df = pd.read_csv(
            StringIO(
                content.decode("utf-8")
            )
        )

        required_cols = [
            "sales_date",
            "store_id",
            "product",
            "sales"
        ]

        missing = [
            c
            for c in required_cols
            if c not in df.columns
        ]

        if missing:
            raise HTTPException(
                status_code=400,
                detail=f"Missing columns: {missing}"
            )

        inserted = 0
        duplicates = 0

        with get_db_cursor() as cursor:

            for _, row in df.iterrows():

                sales_date = str(row["sales_date"])
                store_id = int(row["store_id"])
                product = str(
                    row["product"]
                ).replace("'", "''")
                sales = float(row["sales"])

                duplicate_check = f"""
                SELECT COUNT(*)
                FROM {TABLE_NAME}
                WHERE
                    sales_date = DATE('{sales_date}')
                    AND store_id = {store_id}
                    AND product = '{product}'
                """

                cursor.execute(
                    duplicate_check
                )

                existing = (
                    cursor.fetchone()[0]
                )

                if existing > 0:

                    duplicates += 1
                    continue

                event_id = str(
                    uuid4()
                )

                event_time = (
                    datetime.utcnow()
                    .strftime(
                        "%Y-%m-%d %H:%M:%S"
                    )
                )

                insert_sql = f"""
                INSERT INTO {TABLE_NAME}
                VALUES (
                    '{event_id}',
                    TIMESTAMP('{event_time}'),
                    DATE('{sales_date}'),
                    {store_id},
                    '{product}',
                    {sales},
                    'CSV'
                )
                """

                cursor.execute(
                    insert_sql
                )

                inserted += 1

        return {
            "status": "success",
            "rows_inserted": inserted,
            "duplicates_skipped": duplicates,
            "total_rows": len(df)
        }

    except DatabaseConfigError as exc:

        raise HTTPException(
            status_code=500,
            detail=str(exc)
        ) from exc

    except Exception as exc:

        raise HTTPException(
            status_code=500,
            detail=str(exc)
        ) from exc

