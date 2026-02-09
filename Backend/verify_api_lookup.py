import urllib.request
import json
import sys

def verify_lookup(student_name, phone_number, tracking_suffix):
    url = "http://localhost:8000/api/v1/public/check"
    data = {
        "student_name": student_name,
        "phone_number": phone_number,
        "tracking_suffix": tracking_suffix
    }
    
    # Encode data to JSON
    json_data = json.dumps(data).encode('utf-8')
    
    print(f"\n--- API Request ---")
    print(f"URL: {url}")
    print(f"Payload: {json.dumps(data, indent=2)}")
    
    req = urllib.request.Request(
        url, 
        data=json_data, 
        headers={'Content-Type': 'application/json'},
        method='POST'
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            status_code = response.getcode()
            response_body = response.read().decode('utf-8')
            results = json.loads(response_body)
            
            print(f"\n--- API Response (Status: {status_code}) ---")
            if not results:
                print("No parcels found matching those details.")
            else:
                print(f"Found {len(results)} parcel(s):")
                print(json.dumps(results, indent=2))
                
    except urllib.error.HTTPError as e:
        print(f"\n--- API Error ---")
        print(f"HTTP Status: {e.code}")
        print(f"Message: {e.read().decode('utf-8')}")
    except urllib.error.URLError as e:
        print(f"\n--- Connection Error ---")
        print(f"Reason: {e.reason}")
        print("\nTIP: Is your backend server running? Run 'uvicorn main:app --reload' in the Backend folder.")

if __name__ == "__main__":
    print("ByteSyntax API Verification Tool")
    print("================================")
    
    # Allow command line args or prompt
    if len(sys.argv) == 4:
        name = sys.argv[1]
        phone = sys.argv[2]
        suffix = sys.argv[3]
    else:
        print("\nEnter details to search (or press Ctrl+C to exit):")
        name = input("Student Name (e.g., Yohannes): ")
        phone = input("Phone Number (e.g., 0123456789): ")
        suffix = input("Tracking Suffix (last 4 digits): ")
    
    if not name or not phone or not suffix:
        print("Error: All fields are required.")
    else:
        verify_lookup(name, phone, suffix)
