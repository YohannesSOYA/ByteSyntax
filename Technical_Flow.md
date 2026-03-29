# ByteSyntax - Behind the Scenes ⚙️

This document explains the technical flow and "back scene" logic of the ByteSyntax project. Use this to prepare for technical Q&A during your presentation.

---

## 🏗️ 1. System Architecture (The Stack)
- **Frontend:** Built with **React** (TypeScript). Uses **Vite** for fast builds and **Tailwind CSS** for the premium UI.
- **Backend:** Built with **FastAPI** (Python). Uses **Uvicorn** as the high-performance ASGI server.
- **Database:** **MySQL** managed via **SQLAlchemy ORM**. This allows for structured and reliable data storage.
- **Authentication:** **JWT (JSON Web Tokens)** ensures that only authorized administrators can access the dashboard and mark parcels as collected.

---

## 🔄 2. The Project Flow (Member Part 3: IPO)

### **A. Input (Registration)**
- **Staff side:** Admin logs in and fills out the `RegisterParcelModal`.
- **Data captured:** Student Name, Phone Number, Tracking Number, Courier, and Storage Location.
- **Process:** The frontend sends a `POST` request to the backend `/api/v1/parcels/` endpoint.

### **B. Process (Database & Security)**
- **Verification:** The backend checks for duplicate tracking numbers.
- **Persistence:** SQLAlchemy saves the record to the `parcels` table in MySQL.
- **Status:** The parcel is automatically set to `PENDING`.
- **QR Generation:** The system generates a unique QR code link for that specific parcel ID.

### **C. Output (Student Tracking)**
- **Student side:** Accesses the public `TrackingPage`.
- **Lookup:** Enters Name, Phone, and the last 4 digits of the tracking number (3-Factor Authentication).
- **Result:** The system returns the status (`PENDING` or `COLLECTED`) and the location.

---

## ⚡ 3. The "Exceeded Scope" Features

### **Real-time Email Notifications**
- Uses **FastAPI-Mail** to connect to a Gmail SMTP server.
- When an admin requests a password reset, the system generates a temporary recovery token and sends it as a clickable link to their registered email.

### **QR Scanner Collection Flow**
1. **QR Display:** The student shows their unique parcel QR code (found on the tracking page).
2. **Scan:** Admin opens the `QrScannerPage` on their device.
3. **Logic:** The scanner extracts the Parcel ID from the QR code and sends a `PATCH` request to the backend.
4. **Conclusion:** The database updates `status` to `COLLECTED` and records the timestamp.

---

## 📊 4. Database Schema (Quick View)
- `id`: Primary Key (Unique identifier)
- `student_name`: Name of the recipient
- `phone_number`: Normalised contact info
- `tracking_number`: Full courier tracking ID
- `status`: Enum (Pending / Collected)
- `arrived_at`: Auto-timestamp on registration
- `collected_at`: Timestamp on collection

**Good luck with the Q&A! 🚀**
