# Backend Feature Suggestions

Based on the analysis of the current `ByteSyntax/Backend` architecture and project goals, here are the recommended features for the system.

## 🟢 Core Features (Must-Have)
These are essential for the system to function as described in the `project_idea.md` and `next_steps.md`.

### 1. Robust Public Parcel Lookup 🔍
- **3-Factor Authentication**: As currently planned, verify identity using:
    - Student Name (Partial/Full match)
    - Phone Number (Strict format: `601xxxxxxxxx`)
    - Tracking Number Suffix (Last 4 digits)
- **Privacy Protection**: Ensure the API *never* exposes full tracking numbers or personal details in the response, only the status and generic info (e.g., "Ready for Collection").

### 2. Admin Dashboard & Operations 🛡️
- **Secure Authentication**: JWT (JSON Web Token) implementation for session management (already in progress).
- **Dashboard Statistics**: Real-time counters for:
    - 📦 Parcels Arrived Today
    - ⏳ Pending Collections
- **Secure Authentication**: JWT implementation complete! ✅
- **Account Recovery**: Token-based Password Reset flow implemented! ✅
- **Dashboard Statistics**: Real-time counters for Pending, Collected, and Arrived Today. ✅
- **Pagination & Filtering**:
    - Server-side pagination for parcel lists (crucial as data grows).
    - Filters: "Show only Pending", "Search by Student Name".

### 3. Parcel Lifecycle Management ♻️
- **Check-in (Arrival)**: Quick entry form for admins.
- **Check-out (Collection)**:
    - **Timestamping**: Auto-record `collected_at` time.
    - **Verifier Recording**: Record *which* admin processed the collection (audit trail).

---

## 🟡 Enhanced Features (Highly Recommended)
These features significantly improve user experience and operational efficiency.

### 4. Automated Notifications 🔔
- **Email/SMS Alerts**:
    - **Status**: Foundation Ready! ✅ (Integrated `fastapi-mail`).
    - Currently used for Password Reset. Next phase: Automatic arrival alerts.
- **Reminders**: Automated jobs (cron) to email students who haven't collected parcels in > 3 days.

### 5. QR Code Integration 📱
- **Collection Pass**:
    - When a student checks their status, generate a temporary QR code on their screen.
    - **Fast Retrieval**: Admin scans the QR code to instantly pull up the parcel record and mark it as collected, eliminating manual searching.

### 6. Audit Logging 📜
- Track sensitive actions for security:
    - *"Admin X deleted parcel Y"*
    - *"Admin Z forced status change to Collected"*
- Keep a separate `audit_logs` table.

---

## 🔴 Advanced Features (Future Scope)
Features to consider for version 2.0.

### 7. Bulk Operations 📦📦
- **CSV Import**: Allow admins to upload a CSV manifest from couriers to bulk-insert parcels.
- **Bulk Check-out**: Mark multiple parcels as collected in one go (useful for picking up friends' parcels).

### 8. Analytics & Reporting 📈
- **Peak Times**: Analyze when most collections happen to staff counters appropriately.
- **Courier Performance**: Track which couriers deliver the most parcels.
- **Export**: detailed CSV/Excel reports for administration.

### 9. Kiosk Mode 🖥️
- A simplified, self-service tablet view for students to "Check-in" their queue number when they arrive at the counter.
