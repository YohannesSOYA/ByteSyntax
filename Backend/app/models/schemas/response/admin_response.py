from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AdminRead(BaseModel):
    id: int
    username: str
    email: Optional[str] = None
    full_name: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class DashboardStats(BaseModel):
    pending_parcels: int
    collected_today: int
    arrived_today: int
    timestamp: datetime
