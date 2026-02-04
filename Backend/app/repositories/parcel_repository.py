from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.database.python.parcel import Parcel
from app.models.database.python.enums import ParcelStatus
from .base_repository import BaseRepository

class ParcelRepository(BaseRepository):
    def get_by_id(self, parcel_id: int) -> Parcel | None:
        return self.db.get(Parcel, parcel_id)

    def get_all(self, status: ParcelStatus | None = None, tracking_number: str | None = None) -> list[Parcel]:
        query = select(Parcel)
        if status:
            query = query.where(Parcel.status == status)
        if tracking_number:
            query = query.where(Parcel.tracking_number == tracking_number)
        
        return list(self.db.execute(query).scalars().all())

    def create(self, 
               student_name: str, 
               phone_number: str, 
               tracking_number: str, 
               arrived_at: datetime,
               courier_name: str | None = None,
               notes: str | None = None) -> Parcel:
        parcel = Parcel(
            student_name=student_name,
            phone_number=phone_number,
            tracking_number=tracking_number,
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
