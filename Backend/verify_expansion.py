from fastapi.testclient import TestClient
from main import app
from datetime import datetime, timedelta
import uuid

client = TestClient(app)
BASE_URL = "/api/v1"

def test_feature_expansion():
    # Helper to get token
    print("Logging in to get admin token...")
    login_resp = client.post(f"{BASE_URL}/auth/login", data={"username": "admin", "password": "admin123"})
    if login_resp.status_code != 200:
        print(f"Login failed: {login_resp.text}")
        return
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Register a parcel with storage location
    print("\n--- Testing Parcel Registration with Storage Mapping ---")
    parcel_data = {
        "student_name": "Test Student",
        "phone_number": "0123456789",
        "tracking_number": f"TEST-{uuid.uuid4().hex[:8]}",
        "storage_location": "Shelf C-1",
        "notes": "Testing feature expansion"
    }
    
    resp = client.post(f"{BASE_URL}/parcels/", json=parcel_data, headers=headers)
    if resp.status_code != 200:
        print(f"Failed to register parcel: {resp.text}")
        return
    
    parcel = resp.json()
    parcel_id = parcel["id"]
    print(f"Registered Parcel ID: {parcel_id} at {parcel['storage_location']}")

    # 2. Generate Delegation Pass
    print("\n--- Testing Delegation Pass Generation ---")
    delegate_data = {
        "parcel_id": parcel_id,
        "delegate_name": "Fries Friend",
        "valid_hours": 48
    }
    resp = client.post(f"{BASE_URL}/delegates/generate", json=delegate_data)
    if resp.status_code != 200:
        print(f"Failed to generate pass: {resp.text}")
        return
    
    delegate_pass = resp.json()
    ptoken = delegate_pass["pass_token"]
    print(f"Generated Delegation Pass Token: {ptoken} for {delegate_pass['delegate_name']}")

    # 3. Verify Pass
    print("\n--- Testing Pass Verification ---")
    resp = client.get(f"{BASE_URL}/delegates/verify/{ptoken}")
    if resp.status_code != 200:
        print(f"Failed to verify pass: {resp.text}")
        return
    print(f"Pass verified for {resp.json()['delegate_name']}")

    # 4. Use Pass
    print("\n--- Testing Pass Usage (Collection) ---")
    resp = client.post(f"{BASE_URL}/delegates/use/{ptoken}")
    if resp.status_code != 200:
        print(f"Failed to use pass: {resp.text}")
        return
    print("Pass used successfully. Parcel should now be marked as collected.")

    # 5. Check Parcel Status
    print("\n--- Verifying Parcel Final Status ---")
    resp = client.get(f"{BASE_URL}/parcels/", headers=headers)
    all_parcels = resp.json()
    updated_parcel = next((p for p in all_parcels if p["id"] == parcel_id), None)
    
    if updated_parcel:
        print(f"Final Status: {updated_parcel['status']}")
        print(f"Collected By: {updated_parcel['collected_by_name']}")
    else:
        print("Parcel not found in list.")

if __name__ == "__main__":
    test_feature_expansion()
