import sys
import os
from sqlalchemy.orm import Session
from sqlalchemy import text

# Add current directory to path
sys.path.append(os.getcwd())

from app.db.session import SessionLocal, engine
from app.repositories.parcel_repository import ParcelRepository
from app.services.parcel_service import ParcelService
from app.services.email_service import EmailService

def debug_public_lookup():
    db = SessionLocal()
    try:
        print("Testing database connection...")
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        print("Connection OK.")

        email_service = EmailService()
        parcel_repo = ParcelRepository(db)
        service = ParcelService(parcel_repo, email_service)

        print("Executing public_lookup...")
        results = service.public_lookup(
            student_name="Ahmad Zaki",
            phone_number="60123456789",
            tracking_suffix="7890"
        )
        
        print(f"Results found: {len(results)}")
        for p in results:
            print(f"- {p.student_name}: {p.tracking_number} (Link: {p.whatsapp_link})")

    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    debug_public_lookup()
