import mysql.connector

def fix_messages_table():
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="coopmart_parcels"
        )
        cursor = conn.cursor()
        
        print("Dropping existing messages table...")
        cursor.execute("DROP TABLE IF EXISTS messages")
        
        print("Creating new messages table...")
        sql = """
        CREATE TABLE messages (
            id INT AUTO_INCREMENT PRIMARY KEY,
            sender_name VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            reply TEXT,
            status VARCHAR(50) DEFAULT 'Pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
        cursor.execute(sql)
        conn.commit()
        print("Table 'messages' fixed successfully.")
        
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    fix_messages_table()
