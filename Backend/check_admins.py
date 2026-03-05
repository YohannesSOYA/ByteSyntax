import sys
import os

# Add current directory to path
sys.path.append(os.getcwd())

from app.db.session import SessionLocal
from app.models.database.python.admin import Admin

def check_admins():
    db = SessionLocal()
    try:
        admins = db.query(Admin).all()
        print(f"Found {len(admins)} admins:")
        for admin in admins:
            is_hashed = admin.password_hash.startswith('$2')
            status = "HASHED" if is_hashed else "PLAINTEXT"
            print(f"ID: {admin.id} | Username: {admin.username} | Status: {status} | Hash: {admin.password_hash[:10]}...")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_admins()
