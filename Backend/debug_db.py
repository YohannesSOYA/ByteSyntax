import sys
import os

# Add project root to path
sys.path.append(os.getcwd())

from app.db.session import SessionLocal
from app.models.database.python.parcel import Parcel
from app.models.database.python.admin import Admin
from app.repositories.parcel_repository import ParcelRepository
from app.services.parcel_service import ParcelService
from app.services.email_service import EmailService

db = SessionLocal()
try:
    print("--- Database Diagnostics ---")
    
    # Check Admins
    admins = db.query(Admin).all()
    print(f"Admins Found: {len(admins)}")
    for a in admins:
        print(f"  - {a.username} ({a.full_name})")
        
    # Check Parcels
    parcels = db.query(Parcel).all()
    print(f"Parcels Found: {len(parcels)}")
    
    # Try the repository method
    repo = ParcelRepository(db)
    print("Testing repo.get_all()...")
    repo_parcels = repo.get_all()
    print(f"Repo items: {len(repo_parcels)}")
    
    # Try the service method
    print("Testing service.get_all_parcels()...")
    service = ParcelService(repo, EmailService())
    service_parcels = service.get_all_parcels()
    print(f"Service items: {len(service_parcels)}")
    
    print("SUCCESS: All internal calls passed.")
    
except Exception as e:
    print(f"ERROR: {e}")
    import traceback
    traceback.print_exc()
finally:
    db.close()
