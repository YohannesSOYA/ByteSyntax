from fastapi import APIRouter
from app.api.v1.endpoints import auth, parcels, public, admin

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(parcels.router, prefix="/parcels", tags=["parcels"])
api_router.include_router(public.router, prefix="/public", tags=["public"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
