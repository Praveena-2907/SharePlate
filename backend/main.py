from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import models  # noqa: F401  ensures all models are registered on Base before create_all
from config import settings
from database import Base, engine
from routers import analytics, auth, donations, notifications

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.app_name,
    description=(
        "SharePlate API — connects food donors, NGOs, volunteers, and admins "
        "to rescue surplus food and distribute it to people in need."
    ),
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(donations.router)
app.include_router(notifications.router)
app.include_router(analytics.router)


@app.get("/health", tags=["health"])
def health_check():
    return {"status": "ok"}
