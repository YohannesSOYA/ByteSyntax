from flask import Flask
from backend.routes import api_bp
from frontend.routes import views_bp

app = Flask(__name__, template_folder='frontend/templates', static_folder='frontend/static')
app.secret_key = 'supersecretkey'  # Needed for session management

# Register Blueprints
app.register_blueprint(api_bp, url_prefix='/api')
app.register_blueprint(views_bp)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
