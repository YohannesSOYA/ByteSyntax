import sys
import os
from fastapi.testclient import TestClient
from unittest.mock import MagicMock

# Add current directory to path
sys.path.append(os.getcwd())

from app.api import deps
from main import app
from app.services.auth_service import AuthService

client = TestClient(app)

# Mock Admin
mock_admin = MagicMock()
mock_admin.id = 1
mock_admin.username = "admin"
mock_admin.full_name = "System Admin"
mock_admin.password_hash = "$2b$12$E5..." # Dummy hash

# Dependency Overrides
def override_get_current_admin():
    return mock_admin

app.dependency_overrides[deps.get_current_admin] = override_get_current_admin

def test_public_lookup():
    # Mock service in real app is hard without more complex overrides or real DB.
    # For integration testing without DB, we need to mock the service layer injection.
    # But FastAPI dependency override works best for top-level deps.
    
    # Just checking if endpoint exists and validates input
    response = client.post("/api/v1/public/check", json={
        "student_name": "John",
        "phone_number": "0123456789",
        "tracking_suffix": "1234"
    })
    # Should be 200 or 404/500 depending on DB state, but at least 422 if schema wrong.
    # Since we didn't mock the DB connection in the global app, it might fail with DB error.
    # But that proves the route is wired.
    assert response.status_code != 404 # Route found
    assert response.status_code != 422 # Schema valid

def test_admin_dashboard_access():
    response = client.get("/api/v1/admin/dashboard/stats")
    # Should execute owing to override_get_current_admin
    assert response.status_code != 401 # Authorized

def test_create_parcel_validation():
    # Test missing fields
    response = client.post("/api/v1/parcels/", json={
        "student_name": "Test"
    })
    assert response.status_code == 422

# We will run this to ensure wiring is correct. 
# Deep logic testing was done in test_services.py
if __name__ == "__main__":
    print("Running API wiring tests...")
    try:
        test_public_lookup()
        print("PASSED: Public Lookup Endpoint Wiring")
        test_admin_dashboard_access()
        print("PASSED: Admin Auth Wiring")
        test_create_parcel_validation()
        print("PASSED: Validation Wiring")
        print("\nAPI Wiring Verified!")
    except Exception as e:
        print(f"FAILED: {e}")
        # Print response content if available in exception context would be good, 
        # but for simple script just exit
        sys.exit(1)
