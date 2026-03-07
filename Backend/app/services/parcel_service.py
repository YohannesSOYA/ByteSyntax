from datetime import datetime
from typing import List, Optional
import re
import urllib.parse
from app.repositories.parcel_repository import ParcelRepository
from app.models.database.python.parcel import Parcel
from app.models.database.python.enums import ParcelStatus
from app.core.exceptions import NotFoundException, ConflictException, ValidationException
from app.services.email_service import EmailService

class ParcelService:
    def __init__(self, parcel_repo: ParcelRepository, email_service: EmailService):
        self.parcel_repo = parcel_repo
        self.email_service = email_service

    def generate_whatsapp_link(self, phone_number: str, student_name: str, tracking_number: str) -> str:
        message = f"Hi {student_name}, your parcel ({tracking_number}) has arrived and is ready for collection at the counter. Please bring your ID. Thank you!"
        encoded_message = urllib.parse.quote(message)
        return f"https://wa.me/{phone_number}?text={encoded_message}"

    def _attach_whatsapp_link(self, parcel: Parcel) -> Parcel:
        if parcel:
            parcel.whatsapp_link = self.generate_whatsapp_link(
                parcel.phone_number, 
                parcel.student_name, 
                parcel.tracking_number
            )
        return parcel

    def normalize_phone(self, phone: str) -> str:
        # Remove any non-digit characters
        digits = re.sub(r'\D', '', phone)
        
        # Ensure it starts with 60
        if digits.startswith('0'):
            # If starts with 0 (e.g. 012...), replace with 60
            digits = '60' + digits[1:]
        elif digits.startswith('1'):
            # If starts with 1 (e.g. 12...), prepend 60
            digits = '60' + digits
        elif digits.startswith('60'):
            # Already correct
            pass
        else:
            # Fallback
            digits = '60' + digits
            
        return digits

    async def register_parcel(self, 
                        student_name: str, 
                        phone_number: str, 
                        tracking_number: str, 
                        email: Optional[str] = None,
                        arrived_at: Optional[datetime] = None,
                        courier_name: Optional[str] = None,
                        storage_location: Optional[str] = None,
                        arrival_photo_url: Optional[str] = None,
                        notes: Optional[str] = None) -> Parcel:
        
        normalized_phone = self.normalize_phone(phone_number)
        
        # Check for duplicates (same tracking number)
        existing = self.parcel_repo.get_all(tracking_number=tracking_number)
        if existing:
            raise ConflictException(f"Parcel with tracking number {tracking_number} already exists.")

        if not arrived_at:
            arrived_at = datetime.utcnow()

        parcel = self.parcel_repo.create(
            student_name=student_name,
            phone_number=normalized_phone,
            tracking_number=tracking_number,
            email=email,
            arrived_at=arrived_at,
            courier_name=courier_name,
            storage_location=storage_location,
            arrival_photo_url=arrival_photo_url,
            notes=notes
        )

        # Trigger email notification asynchronously if email is provided
        if email:
            try:
                await self.email_service.send_parcel_arrival_email(
                    email=email,
                    student_name=student_name,
                    tracking_number=tracking_number
                )
            except Exception as e:
                # Log error but don't fail the registration
                print(f"Failed to send email: {e}")

        return self._attach_whatsapp_link(parcel)

    def public_lookup(self, student_name: str, phone_number: str, tracking_suffix: str) -> List[Parcel]:
        normalized_phone = self.normalize_phone(phone_number)
        parcels = self.parcel_repo.find_for_public_lookup(
            student_name=student_name,
            phone_number=normalized_phone,
            tracking_suffix=tracking_suffix
        )
        return [self._attach_whatsapp_link(p) for p in parcels]

    def public_lookup_all(self, student_name: str, phone_number: str) -> List[Parcel]:
        normalized_phone = self.normalize_phone(phone_number)
        parcels = self.parcel_repo.get_all(
            student_name=student_name,
            phone_number=normalized_phone
        )
        return [self._attach_whatsapp_link(p) for p in parcels]

    def mark_collected(self, parcel_id: int, collected_by_name: Optional[str] = None) -> Parcel:
        parcel = self.parcel_repo.get_by_id(parcel_id)
        if not parcel:
            raise NotFoundException(f"Parcel with id {parcel_id} not found.")
        
        if parcel.status == ParcelStatus.COLLECTED:
            # Already collected, no need to update but could be idempotent
            return parcel

        return self.parcel_repo.mark_as_collected(parcel_id, collected_by_name)

    def uncollect_parcel(self, parcel_id: int) -> Parcel:
        parcel = self.parcel_repo.get_by_id(parcel_id)
        if not parcel:
            raise NotFoundException(f"Parcel with id {parcel_id} not found.")
        
        if parcel.status == ParcelStatus.PENDING:
            return parcel

        return self.parcel_repo.unmark_as_collected(parcel_id)

    def get_all_parcels(self, **filters) -> List[Parcel]:
        if 'phone_number' in filters and filters['phone_number']:
            filters['phone_number'] = self.normalize_phone(filters['phone_number'])
        parcels = self.parcel_repo.get_all(**filters)
        return [self._attach_whatsapp_link(p) for p in parcels]

    def get_parcel(self, parcel_id: int) -> Parcel:
        parcel = self.parcel_repo.get_by_id(parcel_id)
        if not parcel:
            raise NotFoundException(f"Parcel with id {parcel_id} not found.")
        return self._attach_whatsapp_link(parcel)
