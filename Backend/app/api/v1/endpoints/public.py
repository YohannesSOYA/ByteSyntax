from typing import Annotated, Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api import deps
from app.services.parcel_service import ParcelService
from app.repositories.parcel_repository import ParcelRepository
from app.services.email_service import EmailService
from app.models.schemas.request.parcel_request import ParcelPublicLookup
from app.models.schemas.response.parcel_response import ParcelRead

router = APIRouter()

def get_parcel_service(
    db: Session = Depends(deps.get_db),
    email_service: EmailService = Depends(deps.get_email_service)
) -> ParcelService:
    return ParcelService(ParcelRepository(db), email_service)

@router.post("/check", response_model=List[ParcelRead])
def check_parcel_status(
    *,
    service: Annotated[ParcelService, Depends(get_parcel_service)],
    lookup_data: ParcelPublicLookup,
) -> Any:
    """
    Public endpoint to check parcel status using 3-field verification.
    """
    return service.public_lookup(
        student_name=lookup_data.student_name,
        phone_number=lookup_data.phone_number,
        tracking_suffix=lookup_data.tracking_suffix
    )
