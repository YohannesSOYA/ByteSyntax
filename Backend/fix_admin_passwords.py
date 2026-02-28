import sys
import os

sys.path.append(os.getcwd())

from app.db.session import SessionLocal
from app.models.database.python.admin import Admin
from app.services.auth_service import AuthService

def fix_passwords():
    db = SessionLocal()
    auth_service = AuthService()
    try:
        admins = db.query(Admin).all()
        fixed = 0
        for admin in admins:
            if not admin.password_hash.startswith('$2'):
                print(f"Found plaintext password for {admin.username}. Hashing...")
                admin.password_hash = auth_service.hash_password(admin.password_hash)
                fixed += 1
        
        if fixed > 0:
            db.commit()
            print(f"Fixed {fixed} passwords in the database.")
        else:
            print("All passwords appear to be correctly hashed.")
            
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    fix_passwords()
