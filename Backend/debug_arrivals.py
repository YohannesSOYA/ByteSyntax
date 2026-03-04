import sys
import os
from datetime import datetime, date
from sqlalchemy import cast, Date

# Add current directory to path
sys.path.append(os.getcwd())

from app.db.session import SessionLocal
from app.models.database.python.parcel import Parcel

def check_parcels():
    db = SessionLocal()
    try:
        today = date.today()
        print(f"Checking for parcels with arrived_at date: {today}")
        
        # Check all parcels
        all_parcels = db.query(Parcel).all()
        print(f"Total parcels in DB: {len(all_parcels)}")
        
        # Check today's arrivals
        arrivals_today = db.query(Parcel).filter(
            cast(Parcel.arrived_at, Date) == today
        ).all()
        
        print(f"Arrivals today: {len(arrivals_today)}")
        for p in arrivals_today:
            print(f" - {p.student_name} ({p.tracking_number}) at {p.arrived_at}")
            
        if len(arrivals_today) == 0 and len(all_parcels) > 0:
            print("\nSuggesting re-seeding some parcels to today's date for testing.")
            latest = db.query(Parcel).order_by(Parcel.arrived_at.desc()).first()
            if latest:
                print(f"Latest parcel was at: {latest.arrived_at}")
                
    finally:
        db.close()

if __name__ == "__main__":
    check_parcels()
