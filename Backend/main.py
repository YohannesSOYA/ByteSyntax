import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="Parcel Tracking System API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the actual frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to the Parcel Tracking System API"}

@app.get("/health")
async def health_check():
    db_status = "unknown"
    try:
        database_url = os.getenv("DATABASE_URL")
        if database_url:
            engine = create_engine(database_url)
            with engine.connect() as connection:
                connection.execute(text("SELECT 1"))
                db_status = "connected"
        else:
            db_status = "error: DATABASE_URL not found"
    except Exception as e:
        db_status = f"error: {str(e)}"
    
    return {
        "status": "healthy",
        "database": db_status
    }
