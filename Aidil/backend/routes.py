from flask import Blueprint, request, jsonify, session
from backend.database import get_connection
import re

api_bp = Blueprint('api', __name__)

@api_bp.route("/search", methods=["POST"])
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
            
            # Search by Phone Number (List all for user)
            # Match against DB (also stripped of non-digits, though DB should be clean)
            # We use LIKE %clean_phone% to allow partial matches like last 4 digits of phone
            sql = "SELECT * FROM parcels WHERE phone_number LIKE %s ORDER BY created_at DESC"
            cursor.execute(sql, (f"%{clean_phone}%",))

        results = cursor.fetchall()
        
        cursor.close()
        conn.close()

        if results:
             return jsonify({"found": True, "data": results})
        else:
             return jsonify({"found": False, "message": "No parcels found."})

    except Exception as e:
        print(f"DEBUG: Error - {e}")
        return jsonify({"error": str(e)}), 500

@api_bp.route("/add", methods=["POST"])
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

@api_bp.route("/update_status", methods=["POST"])
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

@api_bp.route("/contact", methods=["POST"])
def send_message():
    data = request.json
    name = data.get("name")
    email = data.get("email")
    message = data.get("message")

    if not name or not email or not message:
        return jsonify({"error": "All fields are required"}), 400

    try:
        conn = get_connection()
        cursor = conn.cursor()
        sql = "INSERT INTO messages (name, email, message) VALUES (%s, %s, %s)"
        cursor.execute(sql, (name, email, message))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Message sent successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_bp.route("/reply", methods=["POST"])
def reply_message():
    if not session.get("logged_in"):
         return jsonify({"error": "Unauthorized"}), 401
    
    data = request.json
    msg_id = data.get("id")
    reply = data.get("reply")
    
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE messages SET reply = %s WHERE id = %s", (reply, msg_id))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Reply sent!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_bp.route("/delete_message", methods=["POST"])
def delete_message():
    if not session.get("logged_in"):
         return jsonify({"error": "Unauthorized"}), 401
    
    data = request.json
    msg_id = data.get("id")
    
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM messages WHERE id = %s", (msg_id,))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Message deleted!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
