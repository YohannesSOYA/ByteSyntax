# ByteSyntax - Parcel Tracking System

A modern, full-stack parcel management and tracking system designed for student centers and administration offices.

## 🚀 Quick Start Guide...

### 1. Prerequisites
- **Python 3.10+**
- **Node.js (LTS)**
- **XAMPP** (for MySQL)

---

### 2. Backend Setup
1. **Navigate to Backend directory:**
   ```bash
   cd Backend
   ```
2. **Create & Activate Virtual Environment:**
   ```powershell
   python -m venv venv
   .\venv\Scripts\activate
   ```
3. **Install Dependencies:**
   ```powershell
   pip install -r requirements.txt
   ```
4. **Configure Environment:**
   Create a `.env` file based on the existing template and add your:
   - `DATABASE_URL` (MySQL)
   - `MAIL_USERNAME` & `MAIL_PASSWORD` (Gmail App Password)
5. **Start Server:**
   ```bash
   uvicorn main:app --reload
   ```

---

### 3. Frontend Setup
1. **Navigate to Frontend directory:**
   ```bash
   cd Frontend
   ```
2. **Install Dependencies:**
   ```bash
   npm install
   ```
3. **Run Application:**
   ```bash
   npm run dev
   ```

---

### 🛠️ Key Features
- **Admin Dashboard**: Real-time stats and parcel management.
- **Secure Auth**: JWT-based login with "Forgot Password" recovery.
- **Email Notifications**: Real-time password reset emails.
- **Public Tracking**: Secure 3-factor lookup for students.
- **Premium UI**: Modern typography (Outfit & Inter) with smooth animations.

---

## 📄 Documentation
- [Tech Stack](Backend/tech_stack.md)
- [API Documentation](Backend/api.md)
- [SQL Schema](Backend/SQLCode.md)
