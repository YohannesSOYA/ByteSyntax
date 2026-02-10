from apscheduler.schedulers.asyncio import AsyncIOScheduler
from app.db.session import SessionLocal
from app.repositories.parcel_repository import ParcelRepository
from app.services.email_service import EmailService
import logging

logger = logging.getLogger(__name__)

async def check_stale_parcels_task():
    logger.info("Running scheduled task: Checking for stale parcels...")
    db = SessionLocal()
    try:
        repo = ParcelRepository(db)
        email_service = EmailService()
        
        # Get parcels older than 5 days
        stale_parcels = repo.get_stale_parcels(days_threshold=5)
        logger.info(f"Found {len(stale_parcels)} stale parcels.")
        
        for parcel in stale_parcels:
            if parcel.email:
                try:
                    await email_service.send_reminder_email(
                        email=parcel.email,
                        student_name=parcel.student_name,
                        tracking_number=parcel.tracking_number,
                        storage_location=parcel.storage_location
                    )
                    logger.info(f"Sent reminder for parcel {parcel.id} to {parcel.email}")
                except Exception as e:
                    logger.error(f"Failed to send reminder for parcel {parcel.id}: {e}")
            else:
                logger.info(f"Parcel {parcel.id} has no email, skipping reminder.")
                
    finally:
        db.close()

def start_scheduler():
    scheduler = AsyncIOScheduler()
    # Run once every 24 hours
    scheduler.add_job(check_stale_parcels_task, 'interval', hours=24)
    # Also run once at startup for testing (optional, but good for verification)
    # scheduler.add_job(check_stale_parcels_task) 
    scheduler.start()
    logger.info("Scheduler started successfully.")
