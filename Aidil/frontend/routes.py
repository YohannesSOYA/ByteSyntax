from flask import Blueprint, render_template, session, redirect, url_for, request
from backend.database import get_connection

views_bp = Blueprint('views', __name__)

@views_bp.route("/")
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

@views_bp.route("/help")
def help_page():
    return render_template('help.html')

@views_bp.route("/customer-service")
def customer_service():
    return render_template('customer_service.html')

@views_bp.route("/daily-updates")
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

@views_bp.route("/forum")
def forum_page():
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM messages ORDER BY created_at DESC")
        messages = cursor.fetchall()
        cursor.close()
        conn.close()
        return render_template('forum.html', messages=messages)
    except Exception as e:
        return f"Error: {e}"

@views_bp.route("/login", methods=["GET", "POST"])
def login():
    if session.get("logged_in"):
        return redirect(url_for('views.admin_dashboard'))

    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        
        if not username or not password:
             return render_template("login.html", error="Please enter both username and password")

        try:
            conn = get_connection()
            cursor = conn.cursor(dictionary=True)
            # Check for admin user in DB
            cursor.execute("SELECT * FROM admins WHERE username = %s AND password = %s", (username, password))
            admin = cursor.fetchone()
            
            cursor.close()
            conn.close()

            if admin:
                session["logged_in"] = True
                return redirect(url_for('views.admin_dashboard'))
            else:
                return render_template("login.html", error="Invalid credentials")
                
        except Exception as e:
            return render_template("login.html", error=f"Database error: {str(e)}")
            
    return render_template("login.html")

@views_bp.route("/logout")
def logout():
    session.pop("logged_in", None)
    return redirect(url_for('views.login'))

@views_bp.route("/admin")
def admin_dashboard():
    if not session.get("logged_in"):
        return redirect(url_for('views.login'))
        
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM parcels ORDER BY created_at DESC LIMIT 50")
        parcels = cursor.fetchall()
        
        # Fetch messages
        cursor.execute("SELECT * FROM messages ORDER BY created_at DESC")
        messages = cursor.fetchall()

        cursor.close()
        conn.close()
        return render_template("admin.html", parcels=parcels, messages=messages)
    except Exception as e:
        return f"Database Error: {e}"
