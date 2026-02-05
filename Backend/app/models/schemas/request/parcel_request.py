from pydantic import BaseModel, Field
from typing import Optional
from app.models.database.python.enums import ParcelStatus

class ParcelCreate(BaseModel):
    student_name: str = Field(..., min_length=1, description="Full name of the student")
    phone_number: str = Field(..., description="Phone number (will be normalized)")
    tracking_number: str = Field(..., description="Unique tracking number")
    courier_name: Optional[str] = None
    notes: Optional[str] = None

class ParcelUpdate(BaseModel):
    student_name: Optional[str] = None
    phone_number: Optional[str] = None
    courier_name: Optional[str] = None
    notes: Optional[str] = None

class ParcelStatusUpdate(BaseModel):
    status: ParcelStatus

class ParcelPublicLookup(BaseModel):
    student_name: str
    phone_number: str
    tracking_suffix: str = Field(..., min_length=4, max_length=4, description="Last 4 digits of tracking number")
