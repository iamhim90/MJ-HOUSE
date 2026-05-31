# MJ Farmhouse Booking System - Frontend/Backend Integration

## Overview
The booking system is now fully integrated between the frontend (index.html) and backend (Node.js + Express + PostgreSQL).

---

## Frontend Changes (index.html)

### 1. Backend URL Configuration (Line ~2011)
**Before:**
```javascript
const BACKEND_URL = 'https://mj-cult.onrender.com';
```

**After:**
```javascript
const BACKEND_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000'
  : 'https://mj-cult.onrender.com';
```

**Why:** Automatically detects development vs. production environment.

### 2. Form Submission (Lines 2493-2683)
- Form ID: `id="bookForm"` (required for JavaScript reference)
- Submit button ID: `id="submitBtn"`
- Message display: `id="bookingMessage"`
- Prevents default form refresh with `e.preventDefault()`

### 3. Payload Format (Line 2558)
Frontend sends exactly what backend expects:
```javascript
const payload = {
  name,           // string (required)
  phone,          // string, 10 digits (required)
  email,          // string (optional)
  date,           // string, YYYY-MM-DD format (required)
  timeSlot,       // string: "fullday", "hday-morning", "hday-evening" (required)
  occasion,       // string (required)
  price,          // number (required)
  guests,         // number (required)
  specialRequirements  // string (optional)
};
```

### 4. Validation (Lines 2524-2538)
Frontend validates before sending:
- ✓ All required fields present
- ✓ Phone is exactly 10 digits: `/^[0-9]{10}$/`
- ✓ Date is selected
- ✓ Slot is available (checks cache)

### 5. Error Handling (Lines 2672-2678)
- Network errors: Shows connection message
- API errors: Shows response message
- Validation errors: Shows specific field errors
- All logged to browser console with 🔴 emoji prefix

### 6. Success Flow (Lines 2595-2634)
On successful booking:
1. Gets `bookingId` from response
2. Calculates 30% advance payment
3. Resets form and slots
4. Populates booking status tracker
5. Updates payment QR code display
6. Scrolls to payment section

### 7. Payment Flow (Lines 2640-2664)
After user marks payment as complete:
1. Sends `PATCH /api/bookings/:id/paydone`
2. Starts status polling to check confirmation
3. Shows "waiting for owner" message
4. Updates tracker UI to "confirmed" when owner approves

---

## Backend Changes (backend/server.js)

### 1. POST /api/bookings - Create Booking
**Endpoint:** `POST http://localhost:5000/api/bookings`

**Request Body:**
```json
{
  "name": "John Doe",
  "phone": "9876543210",
  "email": "john@example.com",
  "date": "2026-06-15",
  "timeSlot": "fullday",
  "occasion": "Wedding",
  "price": 30000,
  "guests": 150,
  "specialRequirements": "Decorations needed"
}
```

**Validation:**
- ✓ All required fields: name, phone, date, timeSlot, occasion, price, guests
- ✓ Returns 400 if any required field missing

**Response (Success - 200):**
```json
{
  "success": true,
  "bookingId": 42,
  "booking": {
    "id": 42,
    "customer_name": "John Doe",
    "phone": "9876543210",
    "email": "john@example.com",
    "check_in": "2026-06-15",
    "check_out": "2026-06-15",
    "guests": 150,
    "total_amount": 30000,
    "occasion": "Wedding",
    "notes": "Decorations needed",
    "slot": "fullday",
    "status": "pending",
    "created_at": "2026-05-31T10:30:00.000Z"
  }
}
```

**Response (Error - 400/500):**
```json
{
  "success": false,
  "error": "Missing required fields: name, phone, date..."
}
```

### 2. GET /api/bookings - List All Bookings
**Endpoint:** `GET http://localhost:5000/api/bookings`

**Response:**
```json
[
  { "id": 42, "customer_name": "John Doe", ... },
  { "id": 41, "customer_name": "Jane Smith", ... }
]
```

### 3. GET /api/bookings/:id - Get Booking Status
**Endpoint:** `GET http://localhost:5000/api/bookings/:id`

**Example:** `GET http://localhost:5000/api/bookings/42`

**Response:**
```json
{
  "id": 42,
  "customer_name": "John Doe",
  "status": "pending",
  ...
}
```

Used by frontend to poll for status changes (every ~2 seconds after payment marked).

### 4. PATCH /api/bookings/:id/paydone - Mark Payment Complete
**Endpoint:** `PATCH http://localhost:5000/api/bookings/:id/paydone`

**Example:** `PATCH http://localhost:5000/api/bookings/42`

**Body:** Empty (can be empty object `{}`)

**Response:**
```json
{
  "success": true,
  "message": "Payment received and booking confirmed",
  "booking": {
    "id": 42,
    "status": "confirmed",
    ...
  }
}
```

Updates booking status from "pending" to "confirmed".

---

## Database Schema

```sql
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INTEGER NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  occasion VARCHAR(100) NOT NULL,
  notes TEXT,
  slot VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Status Values:**
- `pending` - Booking created, waiting for payment
- `confirmed` - Payment received and owner approved
- `rejected` - Owner declined booking

---

## Field Mapping

| Frontend Field | Database Column | Type | Notes |
|---|---|---|---|
| name | customer_name | string | 1-255 chars |
| phone | phone | string | 10 digits |
| email | email | string | Optional |
| date | check_in, check_out | date | Both set to same date |
| timeSlot | slot | string | fullday, hday-morning, hday-evening |
| occasion | occasion | string | Wedding, Birthday, etc. |
| price | total_amount | number | In rupees |
| guests | guests | number | 10-500 |
| specialRequirements | notes | text | Optional |

---

## How to Run

### Backend Setup
```bash
cd backend
npm install
```

### Environment Variables (.env)
```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mj_farmhouse
DB_USER=postgres
DB_PASSWORD=your_password
```

### Start Backend
```bash
node server.js
```

Expected output:
```
🚀 Server running on port 5000
📊 Database: mj_farmhouse (localhost:5432)
```

### Frontend
- Open `index.html` in browser
- If using `localhost:5000` backend, it auto-detects
- For production, URL stays as `https://mj-cult.onrender.com`

---

## Console Logging

### Frontend (Browser Console)
When user clicks "Confirm Booking":
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 FORM SUBMISSION DETECTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Form data extracted:
  name: John Doe
  phone: 9876543210
  email: john@example.com
  date: 2026-06-15
  slot (timeSlot): fullday
  occasion: Wedding
  guests: 150
  notes: Decorations needed
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📤 SENDING TO BACKEND:
{ JSON payload here }
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📥 RESPONSE FROM BACKEND:
Status: 200
Data: { success: true, bookingId: 42, ... }
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ BOOKING SAVED — redirecting to payment section
```

### Backend (Server Console)
When receiving booking:
```
📥 INCOMING BOOKING REQUEST:
  name: John Doe
  phone: 9876543210
  email: john@example.com
  date: 2026-06-15
  timeSlot: fullday
  occasion: Wedding
  guests: 150
  price: 30000
  notes: Decorations needed

✅ Booking created - ID: 42
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

When user marks payment:
```
💳 Payment marked as done - ID: 42
✅ Booking confirmed - ID: 42
```

---

## Testing Checklist

- [ ] Form submits with all required fields
- [ ] Form validates phone number (10 digits only)
- [ ] Form shows error for missing fields
- [ ] Booking appears in database after submission
- [ ] Booking ID is returned and displayed
- [ ] Payment section scrolls automatically
- [ ] Payment QR code shows correct advance amount
- [ ] "I Have Completed Payment" button updates status
- [ ] Status polling updates booking to "confirmed"
- [ ] Error handling shows user-friendly messages
- [ ] Console logs show detailed request/response data
- [ ] Works on both localhost and production URLs

---

## Common Issues & Solutions

### Backend Connection Error
**Issue:** "Connection Error" message in booking form
**Solution:** 
- Check if backend is running: `node server.js`
- Verify PostgreSQL is running
- Check .env file has correct DB credentials
- Check firewall allows localhost:5000

### Database Error
**Issue:** "Error: table "bookings" does not exist"
**Solution:**
- Create table using SQL schema provided above
- Or run database initialization script

### Phone Validation Fails
**Issue:** Phone field shows error even with correct number
**Solution:**
- Must be exactly 10 digits
- No spaces, dashes, or special characters
- Example: `9876543210` ✓ (not `98 7654 3210` ✗)

### Form Doesn't Submit
**Issue:** Clicking "Confirm Booking" does nothing
**Solution:**
- Check browser console for errors
- Ensure all required fields are filled
- Check that checkbox for Terms & Conditions was accepted
- Verify form ID is `id="bookForm"`

---

## Security Notes

⚠️ **Important for Production:**
1. Store database password in secure vault (not in .env)
2. Add input sanitization to prevent SQL injection
3. Add rate limiting to prevent booking spam
4. Use HTTPS for all API calls
5. Add authentication before payment confirmation
6. Validate phone uniqueness if needed
7. Add CSRF tokens to form submission

---

## Future Enhancements

1. **Slot Availability Check** - Query database for booked dates before submission
2. **Email Confirmation** - Send confirmation email to customer
3. **SMS Notification** - Send SMS with booking reference number
4. **Payment Gateway** - Integrate Razorpay/Stripe/PhonePe
5. **Admin Dashboard** - View all bookings, confirm/reject
6. **Cancellation** - Allow users to cancel bookings
7. **Rescheduling** - Allow users to change date/slot
8. **Analytics** - Track booking trends, revenue

---

## Modified Files

### Frontend
- **index.html** (Line 2011): BACKEND_URL now auto-detects localhost vs production

### Backend
- **server.js**: Complete rewrite with:
  - Enhanced validation
  - Proper error handling
  - Additional GET /api/bookings/:id endpoint
  - Additional PATCH /api/bookings/:id/paydone endpoint
  - Comprehensive console logging
  - Status management (pending → confirmed)

### No Changes Needed
- `.env` - Already configured
- `db.js` - Already correct
- `package.json` - Already correct
