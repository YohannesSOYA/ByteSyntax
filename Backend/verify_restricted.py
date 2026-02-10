from fastapi.testclient import TestClient
from main import app
import uuid

client = TestClient(app)
BASE_URL = "/api/v1"

def test_restriction():
    # 1. Check if delegation endpoint is gone
    print("--- Testing Delegation Removal ---")
    resp = client.post(f"{BASE_URL}/delegates/generate", json={})
    if resp.status_code == 404:
        print("PASS: Delegation endpoint is gone (404).")
    else:
        print(f"FAIL: Delegation endpoint still exists! Code: {resp.status_code}")

    # 2. Login as admin
    print("\nLogging in to get admin token...")
    login_resp = client.post(f"{BASE_URL}/auth/login", data={"username": "admin", "password": "admin123"})
    if login_resp.status_code != 200:
        print(f"Login failed: {login_resp.text}")
        return
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 3. Register a parcel
    print("\n--- Testing Owner-Only Collection Flow ---")
    parcel_data = {
        "student_name": "Strict Owner",
        "phone_number": "0123456789",
        "tracking_number": f"STRICT-{uuid.uuid4().hex[:8]}",
        "storage_location": "Safe Zone",
        "notes": "Testing owner-only restriction"
    }
    
    resp = client.post(f"{BASE_URL}/parcels/", json=parcel_data, headers=headers)
    if resp.status_code != 200:
        print(f"Failed to register parcel: {resp.text}")
        return
    
    parcel = resp.json()
    parcel_id = parcel["id"]
    print(f"Registered Parcel ID: {parcel_id} for {parcel['student_name']}")

    # 4. Mark as collected (Self-Collection)
    print(f"\nMarking parcel {parcel_id} as collected by owner (verified by admin)...")
    resp = client.patch(f"{BASE_URL}/parcels/{parcel_id}/collect", headers=headers)
    if resp.status_code != 200:
        print(f"Failed to collect parcel: {resp.text}")
        return
    
    updated_parcel = resp.json()
    print(f"Collection Successful! Status: {updated_parcel['status']}, Collected By: {updated_parcel['collected_by_name']}")
    
    if "Delegate" in updated_parcel['collected_by_name']:
         print("FAIL: Still showing delegate name pattern!")
    else:
         print("PASS: Collection correctly attribution to owner/admin recorded name.")

if __name__ == "__main__":
    test_restriction()
