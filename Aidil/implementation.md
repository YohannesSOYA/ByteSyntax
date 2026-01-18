# Implementation Plan: Parcel Collection Tracking System

**Date:** 2026-01-16

This document outlines the technical steps to build the system using Python (Flask) and MySQL.

## Phase 1: Database Setup
- **File: `database.sql`**
    - Create `parcels` table with columns: `id`, `tracking_code`, `recipient_name`, `phone_number`, `status` (Pending/Collected), `created_at`.
    - Create `admins` table for potential future auth (optional for MVP).

## Phase 2: Backend Development (Python/Flask)
- **File: `app.py`**
    - Main Flask application file.
    - Routes:
        - `/`: Serve the User Tracking Page.
        - `/admin`: Serve the Admin Insert Page.
        - `/api/search`: Endpoint to search for parcels.
        - `/api/add`: Endpoint to add new parcels.
- **File: `db.py`**
    - Module to handle MySQL database connections.

## Phase 3: Frontend Development (UI/UX)
- **File: `static/style.css`**
    - High-quality, premium design CSS.
- **File: `templates/index.html`**
    - User facing page. Input fields: Name, Phone, Last 4 digits of Parcel ID.
- **File: `templates/admin.html`**
    - Admin facing page. Input fields for new parcel details.

## Phase 4: Integration & Testing
1.  **Backend Test**: Verify Flask can connect to XAMPP MySQL.
2.  **Admin Test**: Insert a parcel via the Admin UI and verify it appears in the database.
3.  **User Test**: Search for the parcel using the web form and verify the correct status is returned.
4.  **UI Polish**: Ensure animations and layout look premium.

---
*Note: Ensure XAMPP MySQL service is running before starting the Flask app.*
