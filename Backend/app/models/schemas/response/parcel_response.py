from pydantic import BaseModel,  Field
from datetime import datetime
from typing import Optional
from app.models.database.python.enums import ParcelStatus

class ParcelRead(BaseModel):
    id: int
    student_name: str
    phone_number: str
    tracking_number: str
    email: Optional[str] = None
    courier_name: Optional[str] = None
    arrived_at: datetime
    status: ParcelStatus
    collected_at: Optional[datetime] = None
    collected_by_name: Optional[str] = None
    storage_location: Optional[str] = None
    arrival_photo_url: Optional[str] = None
    notes: Optional[str] = None
    whatsapp_link: Optional[str] = None
    
    class Config:
        from_attributes = True

class ParcelPublicRead(BaseModel):
    student_name: str
    status: ParcelStatus
    arrived_at: datetime
    collected_at: Optional[datetime] = None
    storage_location: Optional[str] = None
    
    class Config:
        from_attributes = True
