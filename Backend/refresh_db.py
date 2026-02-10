from sqlalchemy import text
from app.db.session import engine, Base
from app.models.database.python.parcel import Parcel
from app.models.database.python.admin import Admin

def force_refresh():
    with engine.connect() as conn:
        print("Disabling foreign key checks...")
        conn.execute(text("SET FOREIGN_KEY_CHECKS = 0;"))
        
        print("Dropping tables...")
        conn.execute(text("DROP TABLE IF EXISTS delegate_passes;"))
        conn.execute(text("DROP TABLE IF EXISTS parcels;"))
        conn.execute(text("DROP TABLE IF EXISTS admins;"))
        
        print("Enabling foreign key checks...")
        conn.execute(text("SET FOREIGN_KEY_CHECKS = 1;"))
        conn.commit()
    
    print("Re-creating tables...")
    Base.metadata.create_all(bind=engine)
    print("Database schema refreshed successfully.")

if __name__ == "__main__":
    force_refresh()
