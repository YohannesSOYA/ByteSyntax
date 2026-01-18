import mysql.connector

def debug_data():
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="coopmart_parcels"
        )
        cursor = conn.cursor(dictionary=True)
        
        print("--- LAST 5 PARCELS ---")
        cursor.execute("SELECT id, recipient_name, phone_number, tracking_code FROM parcels ORDER BY id DESC LIMIT 5")
        for row in cursor.fetchall():
            print(row)
            
        print("\n--- CHECKING SPECIFIC PHONE '0123456789' ---")
        # Try finding a common test number if it exists
        cursor.execute("SELECT * FROM parcels WHERE phone_number LIKE '%0123456789%'")
        print(cursor.fetchall())
        
        cursor.close()
        conn.close()
        
    except mysql.connector.Error as err:
        print(f"Error: {err}")

if __name__ == "__main__":
    debug_data()
