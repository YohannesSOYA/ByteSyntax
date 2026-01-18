import mysql.connector

def check_db():
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="coopmart_parcels"
        )
        print("Successfully connected to database 'coopmart_parcels'")
        
        cursor = conn.cursor()
        cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()
        print("\nTables found:")
        for table in tables:
            print(f"- {table[0]}")
            
            # Describe table
            cursor.execute(f"DESCRIBE {table[0]}")
            columns = cursor.fetchall()
            for col in columns:
                print(f"  - {col[0]} ({col[1]})")
                
        cursor.close()
        conn.close()
        
    except mysql.connector.Error as err:
        print(f"Error: {err}")
    except Exception as e:
        print(f"General Error: {e}")

if __name__ == "__main__":
    check_db()
