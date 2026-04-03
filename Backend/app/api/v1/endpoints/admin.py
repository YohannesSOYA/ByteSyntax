from datetime import datetime
from typing import Annotated, Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api import deps
from app.models.database.python.admin import Admin
from app.services.analytics_service import AnalyticsService
from app.services.admin_service import AdminService
from app.repositories.parcel_repository import ParcelRepository
from app.models.schemas.request.admin_request import AdminUpdate
from app.models.schemas.response.admin_response import AdminRead, DashboardStats

router = APIRouter()

def get_analytics_service(db: Session = Depends(deps.get_db)) -> AnalyticsService:
    return AnalyticsService(ParcelRepository(db))

@router.get("/dashboard/stats", response_model=DashboardStats)
def get_dashboard_stats(
    service: Annotated[AnalyticsService, Depends(get_analytics_service)],
) -> Any:
    """
    Get basic dashboard statistics.
    """
    stats = service.repo.get_stats()
    return DashboardStats(
        pending_parcels=stats["pending"],
        collected_today=stats["collected_today"],
        arrived_today=stats["arrived_today"],
        timestamp=datetime.utcnow()
    )

@router.get("/analytics/summary", response_model=dict)
def get_analytics_summary(
    service: Annotated[AnalyticsService, Depends(get_analytics_service)],
    current_admin: Annotated[Admin, Depends(deps.get_current_admin)],
) -> Any:
    """
    Get detailed analytics and reporting data.
    """
    return service.get_analytics_summary()

@router.get("/profile", response_model=AdminRead)
def read_current_admin( 
    current_admin: Annotated[Admin, Depends(deps.get_current_admin)],
) -> Any:
    """
    Get current logged in admin profile.
    """
    return current_admin

@router.patch("/profile", response_model=AdminRead)
def update_current_admin(
    *,
    service: Annotated[AdminService, Depends(deps.get_admin_service)],
    current_admin: Annotated[Admin, Depends(deps.get_current_admin)],
    admin_in: AdminUpdate,
) -> Any:
    """
    Update current admin profile.
    """
    return service.update_admin_profile(
        admin_id=current_admin.id,
        username=admin_in.username,
        email=admin_in.email,
        full_name=admin_in.full_name,
        password=admin_in.password
    )
