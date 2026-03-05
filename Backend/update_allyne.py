import bcrypt
import os
import sys

# Add current directory to path
sys.path.append(os.getcwd())

from app.db.session import SessionLocal
from app.models.database.python.admin import Admin

def update_allyne_password():
    h = bcrypt.hashpw('12345'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    db = SessionLocal()
    try:
        admin = db.query(Admin).filter(Admin.username == 'Allyne').first()
        if admin:
            admin.password_hash = h
            db.commit()
            print(f"SUCCESS_HASH: {h}")
        else:
            print("ERROR: User Allyne not found")
    except Exception as e:
        print(f"ERROR: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    update_allyne_password()
