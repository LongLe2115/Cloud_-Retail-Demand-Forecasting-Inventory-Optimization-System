from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.forecast import router as forecast_router
from app.routes.reorder import router as reorder_router
from app.routes.stats import router as stats_router
from app.routes.debug import router as debug_router

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


@app.get("/health")
def health_check():
    return {"trang_thai": "ok"}
