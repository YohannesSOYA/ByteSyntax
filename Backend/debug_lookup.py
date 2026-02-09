import sys
import os

# Add current directory to path
sys.path.append(os.getcwd())

from app.db.session import SessionLocal
from app.repositories.parcel_repository import ParcelRepository

def test_lookup():
    db = SessionLocal()
    repo = ParcelRepository(db)
    
    student_name = "Ahmad Zaki"
    phone_number = "60123456789"
    tracking_suffix = "7890" # "MY1234567890" ends with this
    
    print(f"Testing lookup for: {student_name}, {phone_number}, suffix={tracking_suffix}")
    
    try:
        results = repo.find_for_public_lookup(student_name, phone_number, tracking_suffix)
        print(f"Found {len(results)} results.")
        for p in results:
            print(f"- {p.tracking_number} ({p.student_name})")
    except Exception as e:
        print(f"❌ Error during lookup: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    test_lookup()
