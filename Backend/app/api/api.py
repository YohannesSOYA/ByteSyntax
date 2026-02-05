from fastapi import APIRouter, Depends
from app.api.v1.endpoints import auth, parcels, public, admin
from app.api import deps

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(public.router, prefix="/public", tags=["public"])

# Protected Routes (Require Admin Auth)
api_router.include_router(
    parcels.router, 
    prefix="/parcels", 
    tags=["parcels"],
    dependencies=[Depends(deps.get_current_admin)]
)
api_router.include_router(
    admin.router, 
    prefix="/admin", 
    tags=["admin"],
    dependencies=[Depends(deps.get_current_admin)]
)
