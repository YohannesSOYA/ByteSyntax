# Project Idea: Parcel Collection Tracking System

This system is designed to facilitate digital, organized, and fast management and tracking of parcel collections.

## User Roles

### 1. Admin (Administrator)
- **Access**: Requires an account (username & password).
- **Functions**:
    - Log into the system.
    - Input new parcel data (Recipient Name, Phone Number, Tracking Number).
    - Update parcel collection status (e.g., "Pending" or "Collected").
    - Manage existing parcel records.

### 2. User (General User)
- **Access**: Open (no account required).
- **Functions**:
    - Check their own parcel status.
    - **Data Input for Verification**:
        1. Recipient Name
        2. Phone Number
        3. Last 4 digits of the tracking number
    - View whether their parcel is ready for collection or has been picked up.

## System Flow
1. **Parcel Arrives**: Admin enters information into the database via the dashboard.
2. **Verification**: User visits the website, enters identification details, and views the status.
3. **Collection**: When the parcel is picked up, the Admin updates the status in the system.

## Project Objectives
- Replace manual recording systems with digital ones.
- Speed up the status verification process for users.
- Ensure parcel collection records are more organized and easier to track.
