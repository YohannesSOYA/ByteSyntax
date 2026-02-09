
import urllib.request
import json
import sys

def verify_email_registration(name, phone, tracking, email):
    url = "http://localhost:8000/api/v1/parcels/"
    data = {
        "student_name": name,
        "phone_number": phone,
        "tracking_number": tracking,
        "email": email,
        "courier_name": "Test Courier",
        "notes": "Testing email notification flow"
    }
    
    json_data = json.dumps(data).encode('utf-8')
    
    print(f"\n--- Testing Parcel Registration with Email ---")
    print(f"URL: {url}")
    print(f"Recipient: {email}")
    
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
            result = json.loads(response_body)
            
            print(f"\n--- API Response (Status: {status_code}) ---")
            print(f"Parcel ID: {result.get('id')}")
            print(f"Status: {result.get('status')}")
            print(f"Email sent to: {result.get('email')}")
            print("\nSUCCESS: Check the console output of your FastAPI server for any email sending logs.")
                
    except urllib.error.HTTPError as e:
        print(f"\n--- API Error ---")
        print(f"HTTP Status: {e.code}")
        print(f"Message: {e.read().decode('utf-8')}")
    except urllib.error.URLError as e:
        print(f"\n--- Connection Error ---")
        print(f"Reason: {e.reason}")
        print("\nTIP: Is your backend server running? Run 'python -m uvicorn main:app --reload'")

if __name__ == "__main__":
    print("ByteSyntax Email Integration Verification")
    print("=========================================")
    
    name = "Test Student"
    phone = "0123456789"
    tracking = f"TEST{int(__import__('time').time())}"
    email = input("Enter a test email address to receive notification: ") or "test@example.com"
    
    verify_email_registration(name, phone, tracking, email)
