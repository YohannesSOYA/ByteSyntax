# ByteSyntax Backend API Documentation

Base URL: `http://localhost:8000/api/v1`

## 🔑 Authentication

### Login
- **URL**: `/auth/login`
- **Method**: `POST`
- **Description**: Authenticate admin and receive a JWT token.
- **Request (Form Data)**:
    - `username`: string
    - `password`: string
- **Response**: `Token`
    ```json
    {
      "access_token": "string",
      "token_type": "bearer"
    }
    ```

### Forgot Password
- **URL**: `/auth/forgot-password`
- **Method**: `POST`
- **Description**: Request a password reset link to be sent to the admin's email.
- **Request Body**:
    ```json
    { "email": "string" }
    ```

### Reset Password
- **URL**: `/auth/reset-password`
- **Method**: `POST`
- **Description**: Reset password using a valid token.
- **Request Body**:
    ```json
    {
      "token": "string",
      "new_password": "string"
    }
    ```

---

## 🌐 Public Endpoints

### Public Parcel Lookup
- **URL**: `/public/check`
- **Method**: `POST`
- **Description**: Check parcel status using 3-field verification (Name, Phone, Tracking Suffix).
- **Request Body**: `ParcelPublicLookup`
    ```json
    {
      "student_name": "string",
      "phone_number": "string",
      "tracking_suffix": "string (4 digits)"
    }
    ```
- **Response**: `List[ParcelRead]`

---

## 📦 Parcel Management (Protected)
*Requires Bearer Token*

### List All Parcels
- **URL**: `/parcels/`
- **Method**: `GET`
- **Description**: Retrieve a list of all parcels in the system.
- **Response**: `List[ParcelRead]`

### Register New Parcel
- **URL**: `/parcels/`
- **Method**: `POST`
- **Description**: Add a new parcel to the tracking system.
- **Request Body**: `ParcelCreate`
    ```json
    {
      "student_name": "string",
      "phone_number": "string",
      "tracking_number": "string",
      "courier_name": "string (optional)",
      "notes": "string (optional)"
    }
    ```
- **Response**: `ParcelRead`

### Mark as Collected
- **URL**: `/parcels/{id}/collect`
- **Method**: `PATCH`
- **Description**: Mark a specific parcel id as collected.
- **Response**: `ParcelRead`

---

## 👤 Admin Operations (Protected)
*Requires Bearer Token*

### Dashboard Statistics
- **URL**: `/admin/dashboard/stats`
- **Method**: `GET`
- **Description**: Get summary counts for the dashboard.
- **Response**: `DashboardStats`
    ```json
    {
      "pending_parcels": 0,
      "collected_today": 0,
      "arrived_today": 0,
      "timestamp": "ISO-8601 string"
    }
    ```

### Read Admin Profile
- **URL**: `/admin/profile`
- **Method**: `GET`
- **Description**: Get the profile of the currently logged-in admin.
- **Response**: `AdminRead`

### Update Admin Profile
- **URL**: `/admin/profile`
- **Method**: `PATCH`
- **Description**: Update username, full name, or password.
- **Request Body**: `AdminUpdate` (All fields optional)
- **Response**: `AdminRead`

---

## 📝 Common Objects

### ParcelRead
```json
{
  "id": 0,
  "student_name": "string",
  "phone_number": "601...",
  "tracking_number": "string",
  "courier_name": "string",
  "arrived_at": "ISO-8601 string",
  "status": "PENDING | COLLECTED",
  "collected_at": "ISO-8601 string | null",
  "collected_by_name": "string | null",
  "notes": "string"
}
```
