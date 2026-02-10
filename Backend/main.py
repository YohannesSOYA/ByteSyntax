from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import sys

# Add directory to allow absolute imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.api.api import api_router
from app.core.config import settings
from app.core.exceptions import AppException
from app.core.scheduler import start_scheduler
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Start the background scheduler
    start_scheduler()
    yield
    # Shutdown: Add any cleanup here if needed

app = FastAPI(title="ByteSyntax Parcel System", lifespan=lifespan)

# Custom Exception Handler
@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": exc.message, "detail": exc.detail},
    )

import time

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    # Add custom header for debugging
    response.headers["X-Process-Time"] = str(process_time)
    print(f"Request: {request.method} {request.url} - Duration: {process_time:.4f}s")
    return response

from fastapi.staticfiles import StaticFiles

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Bridge: Mount the Frontend directory to serve static assets/demos
# This "links" the frontend without changing any frontend files.
frontend_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "Frontend")
if os.path.exists(frontend_path):
    app.mount("/frontend", StaticFiles(directory=frontend_path), name="frontend")

# Mount uploads directory to serve parcel photos
uploads_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
if not os.path.exists(uploads_path):
    os.makedirs(uploads_path)
app.mount("/uploads", StaticFiles(directory=uploads_path), name="uploads")

app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {
        "message": "ByteSyntax Backend is linked to Frontend",
        "api_docs": "/docs",
        "frontend_demos": "/frontend/dashboard-demo.html"
    }
