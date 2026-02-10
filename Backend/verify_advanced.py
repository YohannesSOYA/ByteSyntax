from fastapi.testclient import TestClient
from main import app
import os
import io

client = TestClient(app)
BASE_URL = "/api/v1"

def test_advanced_features():
    # 1. Login as admin
    print("Logging in to get admin token...")
    login_resp = client.post(f"{BASE_URL}/auth/login", data={"username": "admin", "password": "admin123"})
    if login_resp.status_code != 200:
        print(f"Login failed: {login_resp.text}")
        return
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Test Photo Upload
    print("\n--- Testing Photo Upload ---")
    file_content = b"fake-image-binary-data"
    file = io.BytesIO(file_content)
    
    resp = client.post(
        f"{BASE_URL}/parcels/upload-photo",
        headers=headers,
        files={"file": ("test_parcel.jpg", file, "image/jpeg")}
    )
    
    if resp.status_code == 200:
        photo_url = resp.json()["url"]
        print(f"PASS: Photo uploaded successfully. URL: {photo_url}")
        
        # Verify static serving
        print(f"Testing static access to {photo_url}...")
        static_resp = client.get(photo_url)
        if static_resp.status_code == 200:
            print("PASS: Static photo access working.")
        else:
            print(f"FAIL: Static photo access failed. Code: {static_resp.status_code}")
    else:
        print(f"FAIL: Photo upload failed. Code: {resp.status_code}, Detail: {resp.text}")

    # 3. Test Enhanced Analytics
    print("\n--- Testing Enhanced Analytics ---")
    resp = client.get(f"{BASE_URL}/admin/analytics/summary", headers=headers)
    if resp.status_code == 200:
        data = resp.json()
        print("PASS: Analytics summary retrieved successfully.")
        print(f"Couriers tracked: {list(data['courier_distribution'].keys())}")
        print(f"Efficiency metrics: {data['efficiency']}")
    else:
        print(f"FAIL: Analytics retrieval failed. Code: {resp.status_code}, Detail: {resp.text}")

    # 4. Test Basic Dashboard Stats (with new timestamp fix)
    print("\n--- Testing Dashboard Stats ---")
    resp = client.get(f"{BASE_URL}/admin/dashboard/stats", headers=headers)
    if resp.status_code == 200:
        print(f"PASS: Dashboard stats retrieved. Pending: {resp.json()['pending_parcels']}")
    else:
        print(f"FAIL: Dashboard stats failed. Code: {resp.status_code}, Detail: {resp.text}")

if __name__ == "__main__":
    test_advanced_features()
