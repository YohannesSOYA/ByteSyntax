import sys
import os
from datetime import datetime

# Add current directory to path
sys.path.append(os.getcwd())

from app.db.session import SessionLocal
from app.repositories.parcel_repository import ParcelRepository
from app.services.parcel_service import ParcelService
from app.services.email_service import EmailService

def test_db_write():
    db = SessionLocal()
    try:
        email_service = EmailService()
        parcel_repo = ParcelRepository(db)
        service = ParcelService(parcel_repo, email_service)

        print("Testing database write (register_parcel)...")
        # Use a unique tracking number to avoid conflict
        tracking = f"TEST{int(datetime.now().timestamp())}"
        parcel = service.get_parcel_service = None # Just making sure we call register_parcel
        
        # Actually calling register_parcel is async, but our service methods are a mix.
        # Let's check parcel_service.py again.
        # Oh, register_parcel is `async def`.
        
        import asyncio
        
        async def run_test():
            p = await service.register_parcel(
                student_name="Test Student",
                phone_number="0123456789",
                tracking_number=tracking,
                courier_name="Test Courier"
            )
            print(f"Parcel created successfully with ID: {p.id}")
            return p

        loop = asyncio.get_event_loop()
        p = loop.run_until_complete(run_test())
        
        # Verify it was written
        p_verify = parcel_repo.get_by_id(p.id)
        if p_verify:
            print(f"Verification: Parcel {p_verify.id} found in database.")
        else:
            print("Verification FAILED: Parcel not found after creation.")

    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    test_db_write()
