from flask import Flask, request, jsonify, render_template, session, redirect, url_for
import mysql.connector

app = Flask(__name__)
app.secret_key = 'supersecretkey'  # Needed for session management

import re

# ---------- DATABASE CONNECTION ----------
def get_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="coopmart_parcels"
    )

# ---------- USERS ROUTES ----------
@app.route("/")
def home():
    parcels = []
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        # Fetch parcels created today for the scrolling section
        cursor.execute("SELECT * FROM parcels WHERE DATE(created_at) = CURDATE() ORDER BY created_at DESC")
        parcels = cursor.fetchall()
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Error fetching daily updates: {e}")
    return render_template('index.html', parcels=parcels)

@app.route("/help")
def help_page():
    return render_template('help.html')

@app.route("/daily-updates")
def daily_updates():
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        # Fetch parcels created today (using MySQL CURDATE function)
        cursor.execute("SELECT * FROM parcels WHERE DATE(created_at) = CURDATE() ORDER BY created_at DESC")
        parcels = cursor.fetchall()
        cursor.close()
        conn.close()
        return render_template('daily_updates.html', parcels=parcels)
    except Exception as e:
        return f"Error: {e}"

@app.route("/api/search", methods=["POST"])
def search_parcel():
    data = request.json
    tracking_code = data.get("tracking_code")
    phone_number = data.get("phone_number")

    if not tracking_code and not phone_number:
        return jsonify({"error": "Tracking code or Phone number is required"}), 400

    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        if tracking_code:
            # Search by specific tracking code (Last 4 digits or Full)
            sql = "SELECT * FROM parcels WHERE tracking_code LIKE %s"
            cursor.execute(sql, (f"%{tracking_code}",))
        elif phone_number:
            # CLEAN INPUT: Remove ALL non-digits (keep only 0-9)
            clean_phone = re.sub(r'\D', '', phone_number)
            print(f"DEBUG: Searching for phone '{clean_phone}' (Original: '{phone_number}')")
            
            # Search by Phone Number (List all for user)
            # Match against DB (also stripped of non-digits, though DB should be clean)
            # We use LIKE %clean_phone% to allow partial matches like last 4 digits of phone
            sql = "SELECT * FROM parcels WHERE phone_number LIKE %s ORDER BY created_at DESC"
            cursor.execute(sql, (f"%{clean_phone}%",))

        results = cursor.fetchall()
        print(f"DEBUG: Found {len(results)} results")
        
        cursor.close()
        conn.close()

        if results:
             return jsonify({"found": True, "data": results})
        else:
             return jsonify({"found": False, "message": "No parcels found."})

    except Exception as e:
        print(f"DEBUG: Error - {e}")
        return jsonify({"error": str(e)}), 500

# ---------- ADMIN ROUTES ----------
@app.route("/login", methods=["GET", "POST"])
def login():
    if session.get("logged_in"):
        return redirect(url_for('admin_dashboard'))

    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        
        if not username or not password:
             return render_template("login.html", error="Please enter both username and password")

        try:
            conn = get_connection()
            cursor = conn.cursor(dictionary=True)
            # Check for admin user in DB
            # Note: For production, passwords should be HASHED. This assumes plain text for now as per user context.
            cursor.execute("SELECT * FROM admins WHERE username = %s AND password = %s", (username, password))
            admin = cursor.fetchone()
            
            cursor.close()
            conn.close()

            if admin:
                session["logged_in"] = True
                return redirect(url_for('admin_dashboard'))
            else:
                return render_template("login.html", error="Invalid credentials")
                
        except Exception as e:
            return render_template("login.html", error=f"Database error: {str(e)}")
            
    return render_template("login.html")

@app.route("/logout")
def logout():
    session.pop("logged_in", None)
    return redirect(url_for('login'))

@app.route("/admin")
def admin_dashboard():
    if not session.get("logged_in"):
        return redirect(url_for('login'))
        
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM parcels ORDER BY created_at DESC LIMIT 50")
        parcels = cursor.fetchall()

        # Fetch messages for admin to manage
        cursor.execute("SELECT * FROM messages ORDER BY created_at DESC")
        messages = cursor.fetchall()

        cursor.close()
        conn.close()
        return render_template("admin.html", parcels=parcels, messages=messages)
    except Exception as e:
        return f"Database Error: {e}"

@app.route("/api/add", methods=["POST"])
def add_parcel():
    if not session.get("logged_in"):
         return jsonify({"error": "Unauthorized"}), 401

    data = request.json
    tracking_code = data.get("tracking_code")
    recipient_name = data.get("recipient_name")
    phone_number = data.get("phone_number")
    status = data.get("status", "Pending")

    if not tracking_code or not recipient_name or not phone_number:
        return jsonify({"error": "Missing required fields"}), 400

    try:
        conn = get_connection()
        cursor = conn.cursor()

        sql = """
        INSERT INTO parcels (tracking_code, recipient_name, phone_number, status)
        VALUES (%s, %s, %s, %s)
        """
        cursor.execute(sql, (tracking_code, recipient_name, phone_number, status))

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "Parcel added successfully!"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/update_status", methods=["POST"])
def update_status():
    if not session.get("logged_in"):
         return jsonify({"error": "Unauthorized"}), 401
         
    data = request.json
    parcel_id = data.get("id")
    new_status = data.get("status")
    
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE parcels SET status = %s WHERE id = %s", (new_status, parcel_id))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Status updated"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---------- SERVICE & FORUM ROUTES ----------
@app.route("/service")
def service_page():
    return render_template('service.html')

@app.route("/forum")
def forum_page():
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        # Fetch all messages, ordered by newest first
        cursor.execute("SELECT * FROM messages ORDER BY created_at DESC")
        messages = cursor.fetchall()
        cursor.close()
        conn.close()
        return render_template('forum.html', messages=messages)
    except Exception as e:
        return f"Error loading forum: {e}"

@app.route("/api/send_message", methods=["POST"])
def send_message():
    data = request.json
    name = data.get("name")
    message = data.get("message")

    if not name or not message:
        return jsonify({"error": "Name and Message are required"}), 400

    try:
        conn = get_connection()
        cursor = conn.cursor()
        sql = "INSERT INTO messages (sender_name, message) VALUES (%s, %s)"
        cursor.execute(sql, (name, message))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Message sent successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/reply_message", methods=["POST"])
def reply_message():
    if not session.get("logged_in"):
         return jsonify({"error": "Unauthorized"}), 401

    data = request.json
    message_id = data.get("id")
    reply = data.get("reply")

    if not message_id or not reply:
        return jsonify({"error": "Message ID and Reply content are required"}), 400

    try:
        conn = get_connection()
        cursor = conn.cursor()
        sql = "UPDATE messages SET reply = %s, status = 'Replied' WHERE id = %s"
        cursor.execute(sql, (reply, message_id))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Reply sent successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
