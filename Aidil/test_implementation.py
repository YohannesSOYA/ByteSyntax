import requests
import mysql.connector
import time
import subprocess
import sys
import threading

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="coopmart_parcels"
    )

def ensure_admin_exists():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM admins WHERE username = 'admin'")
        if not cursor.fetchone():
            print("Creating test admin user...")
            cursor.execute("INSERT INTO admins (username, password) VALUES ('admin', 'admin123')")
            conn.commit()
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"DB Error: {e}")

def run_tests():
    base_url = "http://127.0.0.1:5000"
    session = requests.Session()

    # 1. Test Send Message
    print("\n[TEST] Sending Message via /api/send_message...")
    resp = session.post(f"{base_url}/api/send_message", json={
        "name": "Test User",
        "message": "Hello, this is a test message."
    })
    if resp.status_code == 200:
        print("PASS: Message sent.")
    else:
        print(f"FAIL: {resp.text}")
        return

    # 2. Verify Message in Forum
    print("\n[TEST] Checking Forum for message...")
    resp = session.get(f"{base_url}/forum")
    if "Test User" in resp.text and "Hello, this is a test message" in resp.text:
        print("PASS: Message found in Forum.")
    else:
        print("FAIL: Message not found in Forum HTML.")

    # 3. Login as Admin
    print("\n[TEST] Logging in as Admin...")
    resp = session.post(f"{base_url}/login", data={
        "username": "admin",
        "password": "admin123"
    })
    if "Dashboard" in resp.text or resp.history: # Check for redirect or dashboard content
        print("PASS: Login successful.")
    else:
        print("FAIL: Login failed.", resp.text)
        return

    # Get Message ID for reply
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id FROM messages WHERE sender_name='Test User' ORDER BY id DESC LIMIT 1")
    msg = cursor.fetchone()
    cursor.close()
    conn.close()
    
    if not msg:
        print("FAIL: Could not retrieve message ID from DB.")
        return
    
    msg_id = msg['id']

    # 4. Reply to Message
    print(f"\n[TEST] Replying to Message ID {msg_id}...")
    resp = session.post(f"{base_url}/api/reply_message", json={
        "id": msg_id,
        "reply": "This is an admin reply."
    })
    if resp.status_code == 200:
        print("PASS: Reply sent.")
    else:
        print(f"FAIL: {resp.text}")

    # 5. Verify Reply in Forum
    print("\n[TEST] Checking Forum for reply...")
    resp = session.get(f"{base_url}/forum")
    if "This is an admin reply" in resp.text:
        print("PASS: Reply found in Forum.")
    else:
        print("FAIL: Reply not found in Forum HTML.")

if __name__ == "__main__":
    ensure_admin_exists()
    
    # Start the app in a subprocess
    print("Starting Flask app...")
    server = subprocess.Popen([sys.executable, "app.py"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    
    # Give it time to start
    time.sleep(5)
    
    try:
        run_tests()
    except Exception as e:
        print(f"Test Execution Error: {e}")
    finally:
        print("Stopping Flask app...")
        server.terminate()
