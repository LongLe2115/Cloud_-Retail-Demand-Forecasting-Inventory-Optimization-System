from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.forecast import router as forecast_router
from app.routes.reorder import router as reorder_router
from app.routes.stats import router as stats_router
from app.routes.debug import router as debug_router
from app.routes.monitoring import router as monitoring_router
from app.routes.future_forecast import (
    router as future_forecast_router
)
from app.routes.sales import (
    router as sales_router
)
from app.routes.upload import (
    router as upload_router
)
from app.api.refresh import router as refresh_router
app = FastAPI(
    title="Retail Forecast API",
    description="API phuc vu dashboard du bao nhu cau ban le.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(stats_router)
app.include_router(reorder_router)
app.include_router(forecast_router)
app.include_router(debug_router)
app.include_router(monitoring_router)
app.include_router(
    future_forecast_router
)
app.include_router(sales_router)
app.include_router(upload_router)
app.include_router(
    refresh_router,
    prefix="/api",
    tags=["Refresh"]
)

@app.get("/health")
def health_check():
    return {"trang_thai": "ok"}
