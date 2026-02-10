from datetime import datetime
from sqlalchemy import String, DateTime, Text, Enum
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base
from .enums import ParcelStatus

class Parcel(Base):
    __tablename__ = "parcels"

    id: Mapped[int] = mapped_column(primary_key=True)
    student_name: Mapped[str] = mapped_column(String(100), nullable=False)
    phone_number: Mapped[str] = mapped_column(String(20), nullable=False)  # Normalized: 601xxxxxxxxx
    tracking_number: Mapped[str] = mapped_column(String(50), nullable=False)
    email: Mapped[str | None] = mapped_column(String(255), nullable=True) # For notifications
    courier_name: Mapped[str | None] = mapped_column(String(50), nullable=True)
    arrived_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    status: Mapped[ParcelStatus] = mapped_column(
        Enum(ParcelStatus, values_callable=lambda x: [e.value for e in x]), 
        default=ParcelStatus.PENDING, 
        nullable=False
    )
    collected_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    collected_by_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    storage_location: Mapped[str | None] = mapped_column(String(100), nullable=True) # e.g., "Shelf A-1"
    arrival_photo_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, 
        default=datetime.utcnow, 
        onupdate=datetime.utcnow
    )
