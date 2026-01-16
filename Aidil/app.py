from flask import Flask, request, jsonify, render_template
import mysql.connector

app = Flask(__name__)

# ---------- DATABASE CONNECTION ----------
def get_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="coopmart_parcels"
    )

# ---------- TEST ROUTE ----------
@app.route("/")
def home():
    return render_template('index.html')

# ---------- ADD PARCEL (ADMIN API) ----------
@app.route("/api/add", methods=["POST"])
def add_parcel():
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

if __name__ == "__main__":
    app.run(debug=True)
