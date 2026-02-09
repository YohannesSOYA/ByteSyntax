import urllib.request
import urllib.parse
import json
import sys

def verify_admin_login(username, password):
    login_url = "http://localhost:8000/api/v1/auth/login"
    
    # OAuth2 Password Bearer expects form data (x-www-form-urlencoded)
    data = {
        "username": username,
        "password": password
    }
    encoded_data = urllib.parse.urlencode(data).encode('utf-8')
    
    print(f"\n--- 🔐 Attempting Admin Login ---")
    print(f"URL: {login_url}")
    print(f"Username: {username}")
    
    req = urllib.request.Request(
        login_url, 
        data=encoded_data, 
        headers={'Content-Type': 'application/x-www-form-urlencoded'},
        method='POST'
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            status_code = response.getcode()
            response_body = response.read().decode('utf-8')
            token_response = json.loads(response_body)
            
            token = token_response.get("access_token")
            print(f"✅ Login Successful! Status: {status_code}")
            print(f"Received Token: {token[:20]}...")
            
            # Step 2: Verify access to a protected route
            verify_protected_route(token)
                
    except urllib.error.HTTPError as e:
        print(f"\n❌ Login Failed")
        print(f"HTTP Status: {e.code}")
        print(f"Message: {e.read().decode('utf-8')}")
    except urllib.error.URLError as e:
        print(f"\n❌ Connection Error")
        print(f"Reason: {e.reason}")

def verify_protected_route(token):
    profile_url = "http://localhost:8000/api/v1/admin/profile"
    
    print(f"\n--- 🛡️ Verifying Protected Route Access ---")
    print(f"URL: {profile_url}")
    
    req = urllib.request.Request(
        profile_url,
        headers={'Authorization': f'Bearer {token}'},
        method='GET'
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            status_code = response.getcode()
            response_body = response.read().decode('utf-8')
            profile = json.loads(response_body)
            
            print(f"✅ Access Granted! Status: {status_code}")
            print(f"Admin Profile: {json.dumps(profile, indent=2)}")
            
    except urllib.error.HTTPError as e:
        print(f"\n❌ Access Denied")
        print(f"HTTP Status: {e.code}")
        print(f"Message: {e.read().decode('utf-8')}")

if __name__ == "__main__":
    print("ByteSyntax Admin Security Verification Tool")
    print("===========================================")
    
    if len(sys.argv) == 3:
        user = sys.argv[1]
        pwd = sys.argv[2]
    else:
        print("\nEnter admin credentials:")
        user = input("Username (default: admin): ") or "admin"
        pwd = input("Password (default: admin123): ") or "admin123"
    
    verify_admin_login(user, pwd)
