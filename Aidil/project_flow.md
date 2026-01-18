# Project Flow Documentation - CoopMart Parcel Tracking

This document outlines the flow of the **Parcel Tracking System**. The application is a Flask-based web app connected to a MySQL database.

## 1. System Overview
- **Backend**: Python (Flask) handles routing and database logic.
- **Frontend**: HTML/CSS (Glassmorphism design) with JavaScript for interactivity.
- **Database**: MySQL table `parcels` stores tracking info.

## 2. User Flow (Public)
The public interface is a single-page scrolling application.

### A. Home Page (/)
1.  **Landing**: Users see the "Track Your Collection" hero section.
2.  **Tracking Search**:
    - Users enter a **Phone Number** (required) and/or **Tracking Code**.
    - Click "Track Parcel".
    - **Result**:
        - System queries the database via `/api/search`.
        - If found, displays status (Pending/Collected), recipient name, and partial code.
        - If not found, shows an error message.
3.  **About Us Section** (`#about`):
    - Scroll down to read about the CoopMart mission.
4.  **Daily Updates** (`#updates`):
    - Displays a table of all parcels processed **today**.
    - Users can quickly scan this list to see if their parcel arrived recently.
5.  **Help Center** (`#help`):
    - FAQ section answering common questions about statuses and hours.

## 3. Admin Flow (Private)
Designated for staff members to manage parcels.

### A. Login (/login)
- Staff enters username and password.
- Credentials checked against `admins` table (or hardcoded check in current dev version).
- **Success**: Redirects to Dashboard.
- **Failure**: Shows error message.

### B. Admin Dashboard (/admin)
1.  **View All**: Displays a table of the most recent 50 parcels.
2.  **Add Parcel**:
    - Admin enters Recipient Name, Tracking Code, and Phone Number.
    - Status defaults to "Pending".
    - Submitting sends data to `/api/add`.
3.  **Update Status**:
    - Admin can click buttons to change status from "Pending" to "Collected".
    - Sends request to `/api/update_status`.
4.  **Logout**: Clears session and redirects to Login.

## 4. Data Flow
1.  **Input**: Admin enters parcel -> Saved to DB.
2.  **Retrieval**: User searches -> System queries DB (filtered by inputs).
3.  **Display**: Frontend renders JSON response dynamically.
