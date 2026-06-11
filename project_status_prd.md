# MJ Farmhouse - Project Status & PRD

## 📌 Project Overview
**MJ Farmhouse** is a comprehensive booking and management system designed to handle customer reservations, secure payments, and streamline backend administration. 

The system provides a seamless booking experience for guests and a powerful, data-rich dashboard for administrators to track and manage operations.

---

## 🏗️ Technical Architecture & Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend (Customer)** | Vanilla HTML, CSS, JS | Highly responsive, visually striking SPA with dynamic design (`index.html`) |
| **Frontend (Admin)** | Vanilla HTML, CSS, JS | Secure control panel with real-time data sync (`admin.html`) |
| **Backend API** | Node.js, Express | RESTful API managing business logic (`server.js`) |
| **Database** | PostgreSQL | Relational database via the `pg` package (`db.js`) |
| **Server Runner** | Nodemon | Hot-reloading development server |

---

## ✅ Current Project Status: **STABLE & FUNCTIONAL**

The core pipeline from the customer making a booking to the database saving it, and the admin reviewing/approving it, is **100% complete and operational**.

### 1. Customer Booking App (`index.html`)
- **UI/UX:** Premium aesthetic with rich typography, smooth fade/reveal animations, and responsive grid layouts.
- **Form Submission:** Captures guest count, date, slot (noon/evening/fullday), occasion, price, and special notes.
- **Payment Section:** Displays a structured QR Payment section (2-column layout fixed) detailing a 40% advance requirement.
- **API Integration:** Successfully posts booking payloads to `POST /api/bookings`.

### 2. Admin Dashboard (`admin.html`)
- **Authentication:** Local session storage checking and backend auth UI.
- **Live Bookings Table:** Fetches real-time data from `GET /api/bookings`.
- **Data Rendering:** Dynamically parses 12 columns including ID, Customer Name, Phone, Email, Date, Occasion, Guests, Slot, Amount, Status, and Notes.
- **Status Management:** Admins can click `Approve`, `Reject`, or `Hold`. This securely triggers the `PATCH /api/bookings/:id/status` API.
- **Live Sync:** Dashboard polls the backend every 30 seconds to automatically refresh new bookings and metrics without requiring a manual page reload.
- **Error Handling:** Robust UI feedback (loading spinners, empty states, and toast notifications) integrated seamlessly.

### 3. Backend & Database (`backend/server.js`, `db.js`)
- **Database Schema (`bookings` table):**
  - `id`, `customer_name`, `phone`, `email`, `check_in`, `check_out`, `guests`, `total_amount`, `occasion`, `notes`, `slot`, `status`
- **Active Endpoints:**
  - `POST /api/bookings`: Inserts new customer reservations.
  - `GET /api/bookings`: Retrieves all bookings ordered by creation date.
  - `GET /api/bookings/:id`: Fetches a single booking.
  - `PATCH /api/bookings/:id/status`: Safely updates the status (`confirmed`, `rejected`, `waiting`) in PostgreSQL.
  - `PATCH /api/bookings/:id/paydone`: Endpoint reserved for future explicit payment confirmations.

---

## 🚀 Next Steps & Future Roadmap

While the core functionality works perfectly, the following features are stubbed in the UI and can be built out next:

> [!TIP]
> **Phase 2 Implementation Opportunities**

1. **Staff Management Module:**
   - Connect the Staff UI tab in `admin.html` to a new `staff` PostgreSQL table.
   - Implement `GET /api/staff` and `POST /api/staff`.
2. **Expenses & Bills Tracker:**
   - Connect the Expenses tab to an `expenses` database table.
   - Compute real-time "Net Profit" by subtracting expenses from booking revenue.
3. **Payments Module Upgrade:**
   - Expand `PATCH /api/bookings/:id/paydone` to track partial payments and advance amounts securely.
4. **CSV Exports:**
   - Wire up the UI "Export" buttons to generate downloadable CSV reports directly from PostgreSQL data.
