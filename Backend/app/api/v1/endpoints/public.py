from typing import Annotated, Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api import deps
from app.services.parcel_service import ParcelService
from app.repositories.parcel_repository import ParcelRepository
from app.services.email_service import EmailService
from app.models.schemas.request.parcel_request import ParcelPublicLookup, ParcelCheckAll
from app.models.schemas.response.parcel_response import ParcelRead, PublicStats

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

@router.post("/check-all", response_model=List[ParcelRead])
def check_all_parcels(
    *,
    service: Annotated[ParcelService, Depends(get_parcel_service)],
    lookup_data: ParcelCheckAll,
) -> Any:
    """
    Public endpoint to check all parcels for a user by name and phone.
    """
    return service.public_lookup_all(
        student_name=lookup_data.student_name,
        phone_number=lookup_data.phone_number
    )

@router.get("/stats", response_model=PublicStats)
def get_public_stats(
    service: Annotated[ParcelService, Depends(get_parcel_service)],
) -> Any:
    """
    Get public situational awareness stats.
    """
    stats = service.parcel_repo.get_stats()
    return PublicStats(
        arrived_today=stats["arrived_today"],
        pending_total=stats["pending"]
    )

@router.get("/arrivals-today", response_model=List[ParcelRead])
def get_arrivals_today(
    service: Annotated[ParcelService, Depends(get_parcel_service)],
) -> Any:
    """
    Get list of parcels arrived today.
    """
    return service.parcel_repo.get_arrivals_today()
