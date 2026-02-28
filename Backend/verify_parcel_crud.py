import urllib.request
import urllib.parse
import json
import sys
import time

BASE_URL = "http://localhost:8000/api/v1"

def get_admin_token(username, password):
    url = f"{BASE_URL}/auth/login"
    data = {"username": username, "password": password}
    encoded_data = urllib.parse.urlencode(data).encode('utf-8')
    
    req = urllib.request.Request(
        url, data=encoded_data, method='POST',
        headers={'Content-Type': 'application/x-www-form-urlencoded'}
    )
    
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read().decode('utf-8'))["access_token"]

def verify_parcel_crud():
    print("--- Verifying Parcel CRUD Operations ---")
    
    # 1. Login
    try:
        print("1. Logging in as admin...")
        token = get_admin_token("admin", "admin123")
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
        print("   Login successful.")
    except Exception as e:
        print(f"   LOGIN FAILED: {e}")
        return

    # 2. Create Parcel
    try:
        print("\n2. Creating new parcel...")
        unique_tracking = f"TEST_CRUD_{int(time.time())}"
        payload = {
            "student_name": "CRUD Test Student",
            "phone_number": "60199999999",
            "tracking_number": unique_tracking,
            "courier_name": "TestService",
            "notes": "Created via verification script"
        }
        
        req = urllib.request.Request(
            f"{BASE_URL}/parcels/",
            data=json.dumps(payload).encode('utf-8'),
            headers=headers,
            method='POST'
        )
        
        with urllib.request.urlopen(req) as response:
            parcel = json.loads(response.read().decode('utf-8'))
            parcel_id = parcel['id']
            print(f"   Parcel created! ID: {parcel_id}, Tracking: {parcel['tracking_number']}")
            print(f"   Status: {parcel['status']}")
            
            if parcel['status'] != 'Pending':
                 print(f"   WARNING: Expected status 'Pending', got '{parcel['status']}'")

    except Exception as e:
        print(f"   CREATE FAILED: {e}")
        return

    # 3. Read All Parcels (Verify it exists in list)
    try:
        print("\n3. Retrieving all parcels...")
        req = urllib.request.Request(
            f"{BASE_URL}/parcels/",
            headers=headers,
            method='GET'
        )
        
        with urllib.request.urlopen(req) as response:
            parcels = json.loads(response.read().decode('utf-8'))
            print(f"   Retrieved {len(parcels)} parcels.")
            
            found = any(p['id'] == parcel_id for p in parcels)
            if found:
                print(f"   Verified: Newly created parcel ID {parcel_id} is in the list.")
            else:
                print(f"   FAILED: Created parcel ID {parcel_id} not found in list.")

    except Exception as e:
        print(f"   READ ALL FAILED: {e}")

    # 4. Mark as Collected
    try:
        print(f"\n4. Marking parcel {parcel_id} as COLLECTED...")
        req = urllib.request.Request(
            f"{BASE_URL}/parcels/{parcel_id}/collect",
            headers=headers,
            method='PATCH'
        )
        
        with urllib.request.urlopen(req) as response:
            updated_parcel = json.loads(response.read().decode('utf-8'))
            print(f"   Update successful. New Status: {updated_parcel['status']}")
            
            if updated_parcel['status'] == 'Collected':
                print("   Verified: Parcel status updated to 'Collected'.")
            else:
                print(f"   FAILED: Expected 'Collected', got '{updated_parcel['status']}'")

    except Exception as e:
        print(f"   MARK COLLECTED FAILED: {e}")

if __name__ == "__main__":
    verify_parcel_crud()
