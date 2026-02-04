import sys
import os
from sqlalchemy import text

# Add current directory to path so 'app' can be found
sys.path.append(os.getcwd())

try:
    from app.db.session import engine
    from app.core.config import settings
    print(f"Attempting to connect to: {settings.DATABASE_URL}")
except ImportError as e:
    print(f"Error importing app: {e}")
    sys.exit(1)

def test_connection():
    try:
        # Try to connect
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            print("Successfully connected to the database!")
            print(f"Result of 'SELECT 1': {result.fetchone()[0]}")
    except Exception as e:
        print(f"Failed to connect to the database: {e}")
        
        # Check if the error is due to missing driver in URL
        if "mysql" in settings.DATABASE_URL and "pymysql" not in settings.DATABASE_URL:
            print("\nTIP: Since you have 'pymysql' installed, you might need to update your DATABASE_URL in .env to:")
            print("DATABASE_URL=mysql+pymysql://root:@localhost:3306/parcel")

if __name__ == "__main__":
    test_connection()
