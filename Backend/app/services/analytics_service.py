from datetime import datetime
from typing import Dict, Any
from app.repositories.parcel_repository import ParcelRepository

class AnalyticsService:
    def __init__(self, parcel_repo: ParcelRepository):
        self.parcel_repo = parcel_repo

    def get_dashboard_summary(self) -> Dict[str, Any]:
        stats = self.parcel_repo.get_stats()
        
        return {
            "pending_parcels": stats["pending"],
            "collected_today": stats["collected_today"],
            "arrived_today": stats["arrived_today"],
            "timestamp": datetime.utcnow()
        }
