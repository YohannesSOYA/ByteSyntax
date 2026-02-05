from datetime import datetime
from typing import List, Optional
import re
from app.repositories.parcel_repository import ParcelRepository
from app.models.database.python.parcel import Parcel
from app.models.database.python.enums import ParcelStatus
from app.core.exceptions import NotFoundException, ConflictException, ValidationException

class ParcelService:
    def __init__(self, parcel_repo: ParcelRepository):
        self.parcel_repo = parcel_repo

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

    def register_parcel(self, 
                        student_name: str, 
                        phone_number: str, 
                        tracking_number: str, 
                        arrived_at: Optional[datetime] = None,
                        courier_name: Optional[str] = None,
                        notes: Optional[str] = None) -> Parcel:
        
        normalized_phone = self.normalize_phone(phone_number)
        
        # Check for duplicates (same tracking number)
        existing = self.parcel_repo.get_all(tracking_number=tracking_number)
        if existing:
            raise ConflictException(f"Parcel with tracking number {tracking_number} already exists.")

        if not arrived_at:
            arrived_at = datetime.utcnow()

        return self.parcel_repo.create(
            student_name=student_name,
            phone_number=normalized_phone,
            tracking_number=tracking_number,
            arrived_at=arrived_at,
            courier_name=courier_name,
            notes=notes
        )

    def public_lookup(self, student_name: str, phone_number: str, tracking_suffix: str) -> List[Parcel]:
        normalized_phone = self.normalize_phone(phone_number)
        return self.parcel_repo.find_for_public_lookup(
            student_name=student_name,
            phone_number=normalized_phone,
            tracking_suffix=tracking_suffix
        )

    def mark_collected(self, parcel_id: int, collected_by_name: Optional[str] = None) -> Parcel:
        parcel = self.parcel_repo.get_by_id(parcel_id)
        if not parcel:
            raise NotFoundException(f"Parcel with id {parcel_id} not found.")
        
        if parcel.status == ParcelStatus.COLLECTED:
            # Already collected, no need to update but could be idempotent
            return parcel

        return self.parcel_repo.mark_as_collected(parcel_id, collected_by_name)

    def get_all_parcels(self, **filters) -> List[Parcel]:
        if 'phone_number' in filters and filters['phone_number']:
            filters['phone_number'] = self.normalize_phone(filters['phone_number'])
        return self.parcel_repo.get_all(**filters)

    def get_parcel(self, parcel_id: int) -> Parcel:
        parcel = self.parcel_repo.get_by_id(parcel_id)
        if not parcel:
            raise NotFoundException(f"Parcel with id {parcel_id} not found.")
        return parcel
