from pydantic import BaseModel, Field
from typing import Optional
from app.models.database.python.enums import ParcelStatus

class ParcelCreate(BaseModel):
    student_name: str = Field(..., min_length=1, description="Full name of the student")
    phone_number: str = Field(..., description="Phone number (will be normalized)")
    tracking_number: str = Field(..., description="Unique tracking number")
    email: Optional[str] = Field(None, description="Student's email for notifications")
    courier_name: Optional[str] = None
    storage_location: Optional[str] = Field(None, description="Shelf or bin location")
    arrival_photo_url: Optional[str] = Field(None, description="URL to the photo of the parcel label")
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

class ParcelCheckAll(BaseModel):
    student_name: str
    phone_number: str
