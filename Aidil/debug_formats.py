import mysql.connector

def check_formats():
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="coopmart_parcels"
        )
        cursor = conn.cursor(dictionary=True)
        
        # Check for any phone numbers with non-digit characters
        print("--- PHONES WITH FORMATTING ---")
        cursor.execute("SELECT id, phone_number FROM parcels WHERE phone_number REGEXP '[^0-9]'")
        formatted = cursor.fetchall()
        for row in formatted:
            print(row)
            
        if not formatted:
            print("No formatted numbers found (all are pure digits).")
            
        cursor.close()
        conn.close()
        
    except mysql.connector.Error as err:
        print(f"Error: {err}")

if __name__ == "__main__":
    check_formats()
