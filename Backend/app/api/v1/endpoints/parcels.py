from typing import Annotated, Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api import deps
from app.models.database.python.admin import Admin
from app.services.parcel_service import ParcelService
from app.repositories.parcel_repository import ParcelRepository
from app.services.email_service import EmailService
from app.models.schemas.request.parcel_request import ParcelCreate, ParcelStatusUpdate
from app.models.schemas.response.parcel_response import ParcelRead

router = APIRouter()

def get_parcel_service(
    db: Session = Depends(deps.get_db),
    email_service: EmailService = Depends(deps.get_email_service)
) -> ParcelService:
    return ParcelService(ParcelRepository(db), email_service)

@router.get("/", response_model=List[ParcelRead])
def read_parcels(
    service: Annotated[ParcelService, Depends(get_parcel_service)],
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve parcels.
    """
    # Note: Pagination logic is in the service/repo, currently basic get_all 
    # For now, just returning all, assuming repo can handle filters later if needed via query params
    return service.get_all_parcels()

@router.post("/", response_model=ParcelRead)
async def create_parcel(
    *,
    service: Annotated[ParcelService, Depends(get_parcel_service)],
    parcel_in: ParcelCreate,
) -> Any:
    """
    Create new parcel.
    """
    return await service.register_parcel(
        student_name=parcel_in.student_name,
        phone_number=parcel_in.phone_number,
        tracking_number=parcel_in.tracking_number,
        courier_name=parcel_in.courier_name,
        notes=parcel_in.notes
    )

@router.patch("/{id}/collect", response_model=ParcelRead)
def mark_collected(
    *,
    service: Annotated[ParcelService, Depends(get_parcel_service)],
    # We might still want current_admin to record WHO collected it
    current_admin: Annotated[Admin, Depends(deps.get_current_admin)], 
    id: int,
) -> Any:
    """
    Mark a parcel as collected.
    """
    return service.mark_collected(id, collected_by_name=current_admin.full_name)
