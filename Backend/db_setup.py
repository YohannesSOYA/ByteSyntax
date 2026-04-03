import sys
import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# Add current directory to path
sys.path.append(os.getcwd())

from app.core.config import settings
from app.db.session import engine, Base
# Import models to ensure they are registered with Base.metadata
from app.models.database.python.parcel import Parcel
from app.models.database.python.admin import Admin

def setup_database():
    try:
        # 1. Connect to MySQL without specifying a database to create it
        # Extract base connection string (e.g., mysql+pymysql://root:@localhost:3306/)
        base_url = settings.DATABASE_URL.rsplit('/', 1)[0] + '/'
        db_name = settings.DATABASE_URL.rsplit('/', 1)[1]
        
        print(f"Connecting to MySQL at {base_url}...")
        temp_engine = create_engine(base_url)
        
        with temp_engine.connect() as conn:
            # Check if DB exists and create if not
            conn.execute(text(f"CREATE DATABASE IF NOT EXISTS {db_name}"))
            print(f"Database '{db_name}' is ready.")
        
        temp_engine.dispose()

        # 2. Create all tables
        print("Initializing tables...")
        Base.metadata.create_all(bind=engine)
        print("All tables initialized successfully.")
        
        print("\n[SUCCESS] Database setup complete!")
        print("You can now run 'python seed_db.py' to add sample data.")

    except Exception as e:
        print(f"\n[ERROR] Error during database setup: {e}")
        if "Can't connect to MySQL server" in str(e):
            print("\nTIP: Is XAMPP MySQL started?")
        sys.exit(1)

if __name__ == "__main__":
    setup_database()
