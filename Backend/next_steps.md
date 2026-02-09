# 🚀 Next Steps: Backend Service & API Orchestration

This document outlines the tactical plan for transitioning from the **Repository Layer** (Data Access) to the **Service Layer** (Business Logic) and **API Layer** (Exposition) for the ByteSyntax Parcel Management System.

---

## 🛠️ Phase 1: Service Layer Development
The goal is to encapsulate business logic within dedicated services, ensuring the API routers remain clean and focused on HTTP concerns.

### 📦 Parcel Service (`app/services/parcel_service.py`)
- **Data Integrity**: 
    - `duplicate_tracking_check`: Ensure a parcel with the same tracking number isn't already assigned to a student.
    - `normalize_phone`: Enforce `601xxxxxxxxx` format for database consistency as per PDF requirements.
- **Enhanced Tracking Logic**: Implement the exact 3-field verification required for public lookup:
    1.  `student_name` (Full Name)
    2.  `phone_number` (Full Number)
    3.  `tracking_number_suffix` (Last 4 digits of tracking number)
- **Status Lifecycle**: Logic to prevent unauthorized status changes (e.g., reverting "Collected" to "Pending").
- **Notification Preparation**: Logic to trigger internal events when a parcel is "Collected".

### 🔐 Auth & Admin Service (`app/services/auth_service.py`, `app/services/admin_service.py`)
- **Security**: Implement password hashing using `passlib` (bcrypt) and validation logic.
- **Token Management**: JWT generation and decoding for secure admin sessions.
- **Profile Management**: Logic for updating admin account details (Full Name, Username, Password).

### 📊 Analytics Service (`app/services/analytics_service.py`) [NEW]
- **Dashboard Stats**: Logic to calculate "Parcels Today", "Pending", and "Collected Today" counts.
- **Activity Log**: (Optional) Logic to retrieve recent parcel events.

### ⚠️ Exception Handling (`app/core/exceptions.py`)
- Define custom service-level exceptions (e.g., `ParcelNotFoundError`, `DuplicateParcelError`, `InvalidAuthError`) to be handled by API middleware.

---

## 🌐 Phase 2: API Exposition & Schemas
We will define the external interface of our system using Pydantic for strict data validation.

### 📝 Models (Pydantic Schemas)
- `ParcelCreate`: Data required to register a new parcel.
- `ParcelRead`: Data returned to the user (excluding sensitive internal fields).
- `ParcelStatusUpdate`: Schema for changing status or marking as collected.

### 🛣️ Endpoints (`app/api/`)
1.  **Public API**:
    - `POST /api/public/check`: Implementation of the 3-field lookup (No auth required).
2.  **Admin API (Protected)**:
    - `POST /api/parcels/`: Create new parcel records (Student Name, Phone, Tracking #, Courier, Notes).
    - `GET /api/admin/dashboard/stats`: Get counts for "Parcels Today", "Pending", and "Collected" as per PDF wireframe.
    - `GET /api/parcels/`: List all parcels (Paginated with search by Name/Phone/Status/Date).
    - `PATCH /api/parcels/{id}/collect`: Specifically for the "Mark as Collected" action with timestamp.
    - `POST /api/auth/login`: Admin authentication (JWT-based).

---

## 🔒 Phase 3: Security & Middleware
- **JWT Middleware**: Secure the `/admin` routes so only authenticated staff can modify data.
- **CORS Finalization**: Lock down the `Allow-Origins` to the specific Vite/React production URL (once deployed).

---

## 🔗 Phase 4: Frontend-to-Backend Bridge
- **API Client**: Initialize an Axios instance with base configuration in the `Frontend/` project.
- **Environment Variables**: Set `VITE_API_URL` to point to the FastAPI development server (`http://localhost:8000`).

---

## ✅ Progress Check-in
| Task | Status | 담당 (Responsibility) |
| :--- | :---: | :--- |
| Repository Layer Completion | [x] | Backend |
| Service Layer Implementation | [x] | Backend |
| API Route Implementation | [x] | Backend |
| Database Seeding | [ ] | Backend |
| Admin Authentication Test | [ ] | Backend |
| Frontend Integration Bridge | [x] | Backend |
| Production CORS Hardening | [ ] | Backend |

---
*Updated by Antigravity for ByteSyntax - 2026-02-09*
