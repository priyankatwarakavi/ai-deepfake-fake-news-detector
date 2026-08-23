import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.config import settings
from app.routers import auth, users, detector, reports, analytics

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API for AI-Powered Deepfake and Fake News Detection System",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://dazzling-elegance-production-1501.up.railway.app"],  # Allow all origins for prototype, restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure upload static directory exists and mount it
uploads_dir = r"C:\Users\PRIYANKA\.gemini\antigravity\scratch\ai-deepfake-fake-news-detector\backend\data\uploads"
os.makedirs(uploads_dir, exist_ok=True)
app.mount("/static/uploads", StaticFiles(directory=uploads_dir), name="uploads")

# Include Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(users.router, prefix=settings.API_V1_STR)
app.include_router(detector.router, prefix=settings.API_V1_STR)
app.include_router(reports.router, prefix=settings.API_V1_STR)
app.include_router(analytics.router, prefix=settings.API_V1_STR)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "AI-Powered Deepfake and Fake News Detection System API is running successfully.",
        "version": "1.0.0"
    }
