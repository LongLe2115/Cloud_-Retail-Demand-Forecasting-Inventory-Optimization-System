import os
from contextlib import contextmanager

from databricks import sql
from dotenv import load_dotenv

load_dotenv()


class DatabaseConfigError(Exception):
    """Loi cau hinh ket noi Databricks."""


def _get_db_config() -> dict:
    host = os.getenv("DATABRICKS_HOST")
    http_path = os.getenv("DATABRICKS_HTTP_PATH")
    token = os.getenv("DATABRICKS_TOKEN")

    if not host or not http_path or not token:
        raise DatabaseConfigError(
            "Thieu bien moi truong Databricks. Vui long kiem tra file .env."
        )

    return {"server_hostname": host, "http_path": http_path, "access_token": token}


def get_target_table_name() -> str:
    """
    Ten bang/view can query trong Databricks.

    Mặc định theo yêu cầu bài:
    duanck.ckcloud.reorder_output
    """
    return os.getenv("DATABRICKS_TABLE", "duanck.ckcloud.reorder_output").strip()


@contextmanager
def get_db_cursor():
    config = _get_db_config()
    connection = None
    cursor = None
    try:
        connection = sql.connect(**config)
        cursor = connection.cursor()
        yield cursor
    finally:
        if cursor is not None:
            cursor.close()
        if connection is not None:
            connection.close()
