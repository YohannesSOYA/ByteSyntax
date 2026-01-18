import mysql.connector

def update_messages_table():
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="coopmart_parcels"
        )
        cursor = conn.cursor()

        # Add reply column if it doesn't exist
        try:
            cursor.execute("ALTER TABLE messages ADD COLUMN reply TEXT")
            print("Column 'reply' added to 'messages' table.")
        except mysql.connector.Error as err:
            if "Duplicate column name" in str(err):
                print("Column 'reply' already exists.")
            else:
                print(f"Error adding column: {err}")

        conn.commit()
        cursor.close()
        conn.close()

    except Exception as e:
        print(f"Database Error: {e}")

if __name__ == "__main__":
    update_messages_table()
