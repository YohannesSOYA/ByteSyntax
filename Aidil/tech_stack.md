# Technology Stack

For the **Parcel Collection Tracking System**, the following tech stack will be used:

## 📅 Date
**Last Updated:** 2026-01-16

## 🖥️ Server Stack
- **XAMPP**: Software package containing Apache (Web Server) and MySQL (Database). Apache will serve the frontend or reverse proxy, or we can run Flask standalone during dev.
- **Python**: Runtime environment for the backend logic.
- **Uvicorn**: An lightning-fast ASGI server to run FastAPI.

## 🗄️ Database
- **MySQL / MariaDB**: To store parcel records, admin details, and collection status.
- **MySQL Connector/Python**: Driver for connecting Python to MySQL.

## ⚙️ Backend (REST API)
- **FastAPI**: Modern, high-performance web framework for building APIs with Python.
- **Pydantic**: For data validation and settings management using Python type annotations.
- **Jinja2**: Template engine to render HTML pages (serves the frontend).
- **MySQL Connector/Python**: Driver for connecting FastAPI to MySQL.

## 🎨 Frontend
- **HTML5**: semantic structure of the website.
- **Vanilla CSS**: Premium, modern styling (Glassmorphism, vibrant colors) without heavy frameworks.
- **JavaScript (ES6+)**: For dynamic interactions (AJAX/Fetch) and form handling.

## 🛠️ Tools
- **VS Code**: Code editor.
- **Web Browser**: For testing (Chrome/Edge/Firefox).
- **Postman/Curl**: For checking API endpoints (optional).
