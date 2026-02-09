import sys
import os

# Add current directory to path so 'app' can be found
sys.path.append(os.getcwd())

from app.db.session import SessionLocal
from app.models.database.python.admin import Admin
from app.services.auth_service import AuthService

def create_admin(username, password, full_name):
    db = SessionLocal()
    auth_service = AuthService()
    try:
        # Check if admin already exists
        existing = db.query(Admin).filter(Admin.username == username).first()
        if existing:
            print(f"Admin '{username}' already exists.")
            return

        print(f"Creating admin user: {username}...")
        hashed_password = auth_service.hash_password(password)
        
        admin = Admin(
            username=username,
            password_hash=hashed_password,
            full_name=full_name
        )
        db.add(admin)
        db.commit()
        print(f"Successfully created admin: {username}")
        
    except Exception as e:
        print(f"Error creating admin: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Create a test admin user.")
    parser.add_argument("--username", default="admin", help="Admin username")
    parser.add_argument("--password", default="admin123", help="Admin password")
    parser.add_argument("--name", default="Super Admin", help="Full name")
    
    args = parser.parse_args()
    create_admin(args.username, args.password, args.name)
