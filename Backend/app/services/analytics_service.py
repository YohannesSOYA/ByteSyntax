from app.repositories.parcel_repository import ParcelRepository

class AnalyticsService:
    def __init__(self, repo: ParcelRepository):
        self.repo = repo

    def get_analytics_summary(self) -> dict:
        stats = self.repo.get_stats()
        couriers = self.repo.get_courier_distribution()
        trends = self.repo.get_daily_trends()
        efficiency = self.repo.get_efficiency_metrics()
        
        return {
            "overview": stats,
            "courier_distribution": couriers,
            "daily_trends": trends,
            "efficiency": efficiency
        }
