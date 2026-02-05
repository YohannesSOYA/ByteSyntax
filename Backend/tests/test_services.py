import sys
import os
from unittest.mock import MagicMock
import pytest
from datetime import datetime

# Add current directory to path
sys.path.append(os.getcwd())

from app.services.parcel_service import ParcelService
from app.services.auth_service import AuthService
from app.repositories.parcel_repository import ParcelRepository
from app.models.database.python.enums import ParcelStatus

def test_phone_normalization():
    service = ParcelService(MagicMock())
    
    assert service.normalize_phone("0123456789") == "60123456789"
    assert service.normalize_phone("123456789") == "60123456789"
    assert service.normalize_phone("60123456789") == "60123456789"
    assert service.normalize_phone("+6012-345 6789") == "60123456789"

def test_auth_password_hashing():
    auth = AuthService()
    password = "secret_password"
    hashed = auth.hash_password(password)
    
    assert hashed != password
    assert auth.verify_password(password, hashed)
    assert not auth.verify_password("wrong_password", hashed)

def test_parcel_registration_duplicate_check():
    repo = MagicMock(spec=ParcelRepository)
    service = ParcelService(repo)
    
    # Mock repo to return an existing parcel
    repo.get_all.return_value = [MagicMock()]
    
    from app.core.exceptions import ConflictException
    import pytest
    
    with pytest.raises(ConflictException):
        service.register_parcel("Student", "012", "TRK123")

def test_public_lookup_logic():
    repo = MagicMock(spec=ParcelRepository)
    service = ParcelService(repo)
    
    service.public_lookup("John Doe", "012345", "1234")
    
    repo.find_for_public_lookup.assert_called_once_with(
        student_name="John Doe",
        phone_number="6012345",
        tracking_suffix="1234"
    )

if __name__ == "__main__":
    # Run tests manually if pytest is not used
    print("Running manual tests...")
    try:
        print("Testing phone normalization...")
        test_phone_normalization()
        print("PASSED: test_phone_normalization")
        
        print("Testing password hashing...")
        test_auth_password_hashing()
        print("PASSED: test_auth_password_hashing")
        
        print("Testing parcel registration...")
        test_parcel_registration_duplicate_check()
        print("PASSED: test_parcel_registration_duplicate_check")
        
        print("Testing public lookup...")
        test_public_lookup_logic()
        print("PASSED: test_public_lookup_logic")
        print("\nAll tests passed!")
    except Exception as e:
        print(f"\nTest failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
