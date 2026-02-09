from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import select, Date
from app.models.database.python.parcel import Parcel
from app.models.database.python.enums import ParcelStatus
from .base_repository import BaseRepository

class ParcelRepository(BaseRepository):
    def get_by_id(self, parcel_id: int) -> Parcel | None:
        return self.db.get(Parcel, parcel_id)

    def get_all(self, 
                status: ParcelStatus | None = None, 
                tracking_number: str | None = None,
                student_name: str | None = None,
                phone_number: str | None = None) -> list[Parcel]:
        query = select(Parcel)
        if status:
            query = query.where(Parcel.status == status)
        if tracking_number:
            query = query.where(Parcel.tracking_number == tracking_number)
        if student_name:
            query = query.where(Parcel.student_name.ilike(f"%{student_name}%"))
        if phone_number:
            query = query.where(Parcel.phone_number == phone_number)
        
        return list(self.db.execute(query).scalars().all())

    def find_for_public_lookup(self, 
                               student_name: str, 
                               phone_number: str, 
                               tracking_suffix: str) -> list[Parcel]:
        query = select(Parcel).where(
            Parcel.student_name.ilike(f"%{student_name}%"),
            Parcel.phone_number == phone_number,
            Parcel.tracking_number.endswith(tracking_suffix)
        )
        return list(self.db.execute(query).scalars().all())

    def create(self, 
               student_name: str, 
               phone_number: str, 
               tracking_number: str, 
               arrived_at: datetime,
               email: str | None = None,
               courier_name: str | None = None,
               notes: str | None = None) -> Parcel:
        parcel = Parcel(
            student_name=student_name,
            phone_number=phone_number,
            tracking_number=tracking_number,
            email=email,
            arrived_at=arrived_at,
            courier_name=courier_name,
            notes=notes,
            status=ParcelStatus.PENDING
        )
        self.db.add(parcel)
        self.db.commit()
        self.db.refresh(parcel)
        return parcel

    def update_status(self, parcel_id: int, status: ParcelStatus) -> Parcel | None:
        parcel = self.get_by_id(parcel_id)
        if parcel:
            parcel.status = status
            self.db.commit()
            self.db.refresh(parcel)
        return parcel

    def mark_as_collected(self, parcel_id: int, collected_by_name: str | None = None) -> Parcel | None:
        parcel = self.get_by_id(parcel_id)
        if parcel:
            parcel.status = ParcelStatus.COLLECTED
            parcel.collected_at = datetime.utcnow()
            parcel.collected_by_name = collected_by_name
            self.db.commit()
            self.db.refresh(parcel)
        return parcel

    def get_stats(self) -> dict:
        from sqlalchemy import func
        from datetime import date
        today = date.today()
        
        pending_count = self.db.query(func.count(Parcel.id)).filter(
            Parcel.status == ParcelStatus.PENDING
        ).scalar()
        
        collected_today = self.db.query(func.count(Parcel.id)).filter(
            Parcel.status == ParcelStatus.COLLECTED,
            func.cast(Parcel.collected_at, Date) == today
        ).scalar()
        
        arrived_today = self.db.query(func.count(Parcel.id)).filter(
            func.cast(Parcel.arrived_at, Date) == today
        ).scalar()
        
        return {
            "pending": pending_count,
            "collected_today": collected_today,
            "arrived_today": arrived_today
        }
