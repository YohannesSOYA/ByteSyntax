import sys
import os
from datetime import datetime, timedelta

# Add current directory to path so 'app' can be found
sys.path.append(os.getcwd())

from app.db.session import SessionLocal
from app.models.database.python.parcel import Parcel
from app.models.database.python.enums import ParcelStatus

def seed_data():
    db = SessionLocal()
    try:
        from app.core.config import settings
        print(f"DEBUG: Using DATABASE_URL: {settings.DATABASE_URL}")
        count = db.query(Parcel).count()
        if count > 0:
            print(f"Database already has {count} parcels. Skipping seeding to avoid duplicates.")
            print("Tip: If you want to re-seed, clear the 'parcels' table first.")
            return

        print("Seeding database with sample parcels...")
        
        sample_parcels = [
            {
                "student_name": "Ahmad Zaki",
                "phone_number": "60123456789",
                "tracking_number": "MY1234567890",
                "courier_name": "PosLaju",
                "status": ParcelStatus.PENDING,
                "arrived_at": datetime.utcnow() - timedelta(hours=2)
            },
            {
                "student_name": "Siti Nurhaliza",
                "phone_number": "60198765432",
                "tracking_number": "JNT9876543210",
                "courier_name": "J&T Express",
                "status": ParcelStatus.PENDING,
                "arrived_at": datetime.utcnow() - timedelta(days=1)
            },
            {
                "student_name": "Chong Wei Fen",
                "phone_number": "601122334455",
                "tracking_number": "NINJA112233",
                "courier_name": "NinjaVan",
                "status": ParcelStatus.COLLECTED,
                "arrived_at": datetime.utcnow() - timedelta(days=2),
                "collected_at": datetime.utcnow() - timedelta(hours=5),
                "collected_by_name": "Self"
            },
            {
                "student_name": "Ramasamy Govindasamy",
                "phone_number": "60134455667",
                "tracking_number": "SPX33445566",
                "courier_name": "Shopee Xpress",
                "status": ParcelStatus.PENDING,
                "arrived_at": datetime.utcnow() - timedelta(hours=5)
            },
            {
                "student_name": "Nurul Izzah",
                "phone_number": "60176677889",
                "tracking_number": "DHL55667788",
                "courier_name": "DHL",
                "status": ParcelStatus.COLLECTED,
                "arrived_at": datetime.utcnow() - timedelta(days=3),
                "collected_at": datetime.utcnow() - timedelta(days=1),
                "collected_by_name": "Friend (Ali)"
            },
            {
                "student_name": "Muhammad Ali",
                "phone_number": "60122334455",
                "tracking_number": "MY6677889900",
                "courier_name": "PosLaju",
                "status": ParcelStatus.PENDING,
                "arrived_at": datetime.utcnow() - timedelta(minutes=30)
            },
            {
                "student_name": "Sarah Jenkins",
                "phone_number": "60144556677",
                "tracking_number": "FEDEX112233",
                "courier_name": "FedEx",
                "status": ParcelStatus.PENDING,
                "arrived_at": datetime.utcnow() - timedelta(hours=12)
            },
            {
                "student_name": "Lee Min Ho",
                "phone_number": "60188899001",
                "tracking_number": "JNT11223344",
                "courier_name": "J&T Express",
                "status": ParcelStatus.PENDING,
                "arrived_at": datetime.utcnow() - timedelta(hours=1)
            }
        ]

        for data in sample_parcels:
            parcel = Parcel(**data)
            db.add(parcel)
        
        db.commit()
        print(f"Successfully seeded {len(sample_parcels)} parcels!")
        
    except Exception as e:
        import traceback
        print(f"Error seeding database: {e}")
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
