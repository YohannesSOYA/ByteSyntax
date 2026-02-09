
import urllib.request
import json
import sys

def verify_whatsapp_link(name, phone, tracking):
    url = "http://localhost:8000/api/v1/parcels/"
    data = {
        "student_name": name,
        "phone_number": phone,
        "tracking_number": tracking,
        "courier_name": "WhatsApp Test",
        "notes": "Testing link generation"
    }
    
    json_data = json.dumps(data).encode('utf-8')
    
    print(f"\n--- Testing WhatsApp Link Generation ---")
    print(f"Name: {name}")
    print(f"Phone: {phone}")
    
    req = urllib.request.Request(
        url, 
        data=json_data, 
        headers={'Content-Type': 'application/json'},
        method='POST'
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            status_code = response.getcode()
            result = json.loads(response.read().decode('utf-8'))
            
            print(f"\n--- API Response (Status: {status_code}) ---")
            link = result.get('whatsapp_link')
            if link:
                print(f"SUCCESS! WhatsApp Link Generated:")
                print(link)
                print("\nNote: When this is clicked in the frontend, it will open WhatsApp with a pre-filled message.")
            else:
                print("FAILURE: No whatsapp_link found in response.")
                
    except urllib.error.HTTPError as e:
        print(f"\n--- API Error ---")
        print(f"Status: {e.code}")
        print(f"Message: {e.read().decode('utf-8')}")
    except urllib.error.URLError as e:
        print(f"\n--- Connection Error ---")
        print("Is your server running? 'python -m uvicorn main:app --reload'")

if __name__ == "__main__":
    print("ByteSyntax WhatsApp Integration Verification")
    print("============================================")
    
    verify_whatsapp_link("Ali Hassan", "601122334455", "WA123456789")
