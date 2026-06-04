import os
import requests

from fastapi import APIRouter, HTTPException

router = APIRouter()

@router.post("/refresh-forecast")
def refresh_forecast():

    host = os.getenv("DATABRICKS_HOST")
    token = os.getenv("DATABRICKS_TOKEN")
    job_id = int(os.getenv("DATABRICKS_JOB_ID"))

    url = (
        f"https://{host}"
        "/api/2.1/jobs/run-now"
    )

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    payload = {
        "job_id": job_id
    }

    response = requests.post(
        url,
        headers=headers,
        json=payload,
        timeout=30
    )

    if response.status_code != 200:
        raise HTTPException(
            status_code=500,
            detail=response.text
        )

    return response.json()

@router.get("/job-status/{run_id}")
def get_job_status(run_id: int):

    host = os.getenv("DATABRICKS_HOST")
    token = os.getenv("DATABRICKS_TOKEN")

    url = (
        f"https://{host}"
        "/api/2.1/jobs/runs/get"
    )

    headers = {
        "Authorization": f"Bearer {token}"
    }

    response = requests.get(
        url,
        headers=headers,
        params={
            "run_id": run_id
        },
        timeout=30
    )

    if response.status_code != 200:
        raise HTTPException(
            status_code=500,
            detail=response.text
        )

    data = response.json()

    state = data.get("state", {})

    start_time = data.get("start_time")
    end_time = data.get("end_time")

    duration_seconds = None

    if start_time and end_time:
        duration_seconds = int(
            (end_time - start_time) / 1000
        )

    return {
        "run_id": run_id,

        "life_cycle_state":
            state.get("life_cycle_state"),

        "result_state":
            state.get("result_state"),

        "duration_seconds":
            duration_seconds,

        "run_page_url":
            data.get("run_page_url")
    }