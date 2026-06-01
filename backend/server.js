require('dotenv').config();

const express   = require('express');
const cors      = require('cors');
const helmet    = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt       = require('jsonwebtoken');
const pool      = require('./db');
const { requireAuth } = require('./middleware/auth');

const app = express();

/* ═══════════════════════════════════════════
   SECURITY HEADERS — helmet
═══════════════════════════════════════════ */
app.use(helmet());

/* ═══════════════════════════════════════════
   CORS — restrict to allowed origin only
═══════════════════════════════════════════ */
const allowedOrigins = [
  process.env.ALLOWED_ORIGIN,
  'http://127.0.0.1:5500',  // local live-server dev
  'http://127.0.0.1:5501',
  'http://localhost:5500',
  'http://localhost:5501',
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (curl, Render health checks)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10kb' })); // prevent huge payloads

/* ═══════════════════════════════════════════
   RATE LIMITING — admin login only
═══════════════════════════════════════════ */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                   // max 10 attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please try again in 15 minutes.' },
  skipSuccessfulRequests: true,
});

/* ═══════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════ */
const isProd = process.env.NODE_ENV === 'production';

// Safe error responder — never exposes stack traces in production
function sendError(res, status, message, err) {
  if (!isProd && err) {
    console.error('❌', message, err.message);
  }
  return res.status(status).json({ error: message });
}

/* ═══════════════════════════════════════════
   PUBLIC HEALTH ROUTES
═══════════════════════════════════════════ */
app.get('/', (req, res) => res.send('MJ Farmhouse Backend Running'));

app.get('/health', (req, res) => res.status(200).json({
  status: 'ok',
  service: 'MJ Farmhouse Backend',
  time: new Date().toISOString(),
}));

/* ═══════════════════════════════════════════
   ADMIN LOGIN — credentials validated server-side only
   POST /api/admin/login
═══════════════════════════════════════════ */
app.post('/api/admin/login', loginLimiter, (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const validUsername = process.env.ADMIN_USERNAME;
  const validPassword = process.env.ADMIN_PASSWORD;

  if (!validUsername || !validPassword) {
    console.error('❌ ADMIN_USERNAME or ADMIN_PASSWORD not set in environment');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  if (username !== validUsername || password !== validPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Sign a JWT valid for 8 hours
  const token = jwt.sign(
    { role: 'admin', username },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.json({ success: true, token });
});

/* ═══════════════════════════════════════════
   PUBLIC BOOKING ROUTES
   (used by the public booking form on index.html)
═══════════════════════════════════════════ */

// POST /api/bookings — Create new booking (public)
app.post('/api/bookings', async (req, res) => {
  try {
    const { name, phone, email, date, timeSlot, occasion, price, guests, specialRequirements } = req.body;

    // ── Input validation ──
    if (!name || !phone || !date || !timeSlot || !occasion || !price || !guests) {
      return res.status(400).json({ error: 'Missing required fields: name, phone, date, timeSlot, occasion, price, guests' });
    }
    if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
      return res.status(400).json({ error: 'Name must be between 2 and 100 characters' });
    }
    if (!/^[0-9]{10}$/.test(String(phone).replace(/[\s\-\+]/g, '').slice(-10))) {
      return res.status(400).json({ error: 'Phone number must be a valid 10-digit Indian mobile number' });
    }
    const guestCount = parseInt(guests, 10);
    if (isNaN(guestCount) || guestCount < 1 || guestCount > 500) {
      return res.status(400).json({ error: 'Guest count must be between 1 and 500' });
    }
    const bookingDate = new Date(date);
    if (isNaN(bookingDate.getTime()) || bookingDate < new Date(Date.now() - 86400000)) {
      return res.status(400).json({ error: 'Invalid or past booking date' });
    }
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0 || priceNum > 10000000) {
      return res.status(400).json({ error: 'Invalid price amount' });
    }

    const result = await pool.query(
      `INSERT INTO bookings (customer_name, phone, email, check_in, check_out, guests, total_amount, occasion, notes, slot, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [name.trim(), phone.trim(), email?.trim() || null, date, date, guestCount, priceNum,
       occasion.trim(), specialRequirements?.trim() || null, timeSlot, 'pending']
    );

    console.log('✅ New booking created — ID:', result.rows[0].id);

    res.json({ success: true, bookingId: result.rows[0].id, booking: result.rows[0] });
  } catch (err) {
    sendError(res, 500, 'Failed to create booking', err);
  }
});

// GET /api/bookings/availability — Public slot availability (used by booking form)
app.get('/api/bookings/availability', async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT check_in as date, slot, status FROM bookings WHERE status IN ('confirmed', 'pending', 'waiting')"
    );
    const availability = {};
    result.rows.forEach(r => {
      const d = r.date.toISOString ? r.date.toISOString().split('T')[0] : String(r.date).split('T')[0];
      if (!availability[d]) availability[d] = {};
      availability[d][r.slot] = 'booked';
    });
    res.json({ success: true, availability });
  } catch (err) {
    sendError(res, 500, 'Failed to fetch availability', err);
  }
});

/* ═══════════════════════════════════════════
   PROTECTED ADMIN ROUTES — requireAuth on all
═══════════════════════════════════════════ */

// GET /api/bookings — List all bookings (admin only)
app.get('/api/bookings', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT *, advance_paid as "advancePaid", payment_status as "paymentStatus", payment_notes as "paymentNotes" FROM bookings ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    sendError(res, 500, 'Failed to fetch bookings', err);
  }
});

// GET /api/bookings/:id — Get single booking (admin only)
app.get('/api/bookings/:id', requireAuth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM bookings WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Booking not found' });
    res.json(result.rows[0]);
  } catch (err) {
    sendError(res, 500, 'Failed to fetch booking', err);
  }
});

// PATCH /api/bookings/:id/status (admin only)
app.patch('/api/bookings/:id/status', requireAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'confirmed', 'rejected', 'hold', 'waiting'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }
    const result = await pool.query(
      'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Booking not found' });
    res.json({ success: true, booking: result.rows[0] });
  } catch (err) {
    sendError(res, 500, 'Failed to update booking status', err);
  }
});

// PATCH /api/bookings/:id/payment (admin only)
app.patch('/api/bookings/:id/payment', requireAuth, async (req, res) => {
  try {
    const { advancePaid, paymentStatus, paymentNotes } = req.body;
    const allowedPayStatus = ['not_paid', 'advance_paid', 'partially_paid', 'fully_paid'];
    if (paymentStatus && !allowedPayStatus.includes(paymentStatus)) {
      return res.status(400).json({ error: 'Invalid payment status' });
    }
    const result = await pool.query(
      'UPDATE bookings SET advance_paid = $1, payment_status = $2, payment_notes = $3 WHERE id = $4 RETURNING *',
      [advancePaid, paymentStatus, paymentNotes, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Booking not found' });
    res.json({ success: true, booking: result.rows[0] });
  } catch (err) {
    sendError(res, 500, 'Failed to update payment', err);
  }
});

// PATCH /api/bookings/:id/verify-advance (admin only)
app.patch('/api/bookings/:id/verify-advance', requireAuth, async (req, res) => {
  try {
    const current = await pool.query('SELECT total_amount FROM bookings WHERE id = $1', [req.params.id]);
    if (current.rows.length === 0) return res.status(404).json({ error: 'Booking not found' });
    const total = parseFloat(current.rows[0].total_amount) || 0;
    const advancePaid = +(total * 0.3).toFixed(2);
    const result = await pool.query(
      'UPDATE bookings SET status = $1, payment_status = $2, advance_paid = $3 WHERE id = $4 RETURNING *',
      ['confirmed', 'advance_paid', advancePaid, req.params.id]
    );
    res.json({ success: true, booking: result.rows[0] });
  } catch (err) {
    sendError(res, 500, 'Failed to verify advance', err);
  }
});

// PATCH /api/bookings/:id/collect-cash (admin only)
app.patch('/api/bookings/:id/collect-cash', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE bookings SET payment_status = $1 WHERE id = $2 RETURNING *',
      ['fully_paid', req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Booking not found' });
    res.json({ success: true, booking: result.rows[0] });
  } catch (err) {
    sendError(res, 500, 'Failed to collect cash', err);
  }
});

// PATCH /api/bookings/:id/paydone (admin only — legacy)
app.patch('/api/bookings/:id/paydone', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *',
      ['confirmed', req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Booking not found' });
    res.json({ success: true, booking: result.rows[0] });
  } catch (err) {
    sendError(res, 500, 'Failed to update booking', err);
  }
});

/* ── STAFF (admin only) ── */

app.get('/api/staff', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id as _id, name, role, salary, salary_status as "salaryStatus", created_at FROM staff ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    sendError(res, 500, 'Failed to fetch staff', err);
  }
});

app.post('/api/staff', requireAuth, async (req, res) => {
  try {
    const { name, role, salary, salaryStatus } = req.body;
    if (!name || !role || salary == null) {
      return res.status(400).json({ error: 'Name, role, and salary are required' });
    }
    const result = await pool.query(
      'INSERT INTO staff (name, role, salary, salary_status) VALUES ($1, $2, $3, $4) RETURNING id as _id, *',
      [name.trim(), role.trim(), salary, salaryStatus || 'pending']
    );
    res.json({ success: true, staff: result.rows[0] });
  } catch (err) {
    sendError(res, 500, 'Failed to add staff', err);
  }
});

app.patch('/api/staff/:id', requireAuth, async (req, res) => {
  try {
    const { salaryStatus } = req.body;
    if (!['paid', 'pending'].includes(salaryStatus)) {
      return res.status(400).json({ error: 'Invalid salary status' });
    }
    const result = await pool.query(
      'UPDATE staff SET salary_status = $1 WHERE id = $2 RETURNING id as _id, *',
      [salaryStatus, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Staff not found' });
    res.json({ success: true, staff: result.rows[0] });
  } catch (err) {
    sendError(res, 500, 'Failed to update staff', err);
  }
});

app.delete('/api/staff/:id', requireAuth, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM staff WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Staff not found' });
    res.json({ success: true });
  } catch (err) {
    sendError(res, 500, 'Failed to delete staff', err);
  }
});

/* ── EXPENSES (admin only) ── */

app.get('/api/expenses', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id as _id, category, amount, date, status, notes, created_at FROM expenses ORDER BY date DESC'
    );
    res.json(result.rows);
  } catch (err) {
    sendError(res, 500, 'Failed to fetch expenses', err);
  }
});

app.post('/api/expenses', requireAuth, async (req, res) => {
  try {
    const { category, amount, date, status, notes } = req.body;
    if (!category || amount == null || !date) {
      return res.status(400).json({ error: 'Category, amount, and date are required' });
    }
    const result = await pool.query(
      'INSERT INTO expenses (category, amount, date, status, notes) VALUES ($1, $2, $3, $4, $5) RETURNING id as _id, *',
      [category, amount, date, status || 'paid', notes?.trim() || null]
    );
    res.json({ success: true, expense: result.rows[0] });
  } catch (err) {
    sendError(res, 500, 'Failed to add expense', err);
  }
});

app.delete('/api/expenses/:id', requireAuth, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM expenses WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Expense not found' });
    res.json({ success: true });
  } catch (err) {
    sendError(res, 500, 'Failed to delete expense', err);
  }
});

/* ═══════════════════════════════════════════
   START SERVER
═══════════════════════════════════════════ */
pool.query('SELECT NOW()')
  .then(() => console.log('✅ Database connected successfully'))
  .catch(err => console.error('❌ Database connection failed:', err.message));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 MJ Farmhouse backend running on port ${PORT}`);
  console.log(`🔒 Security: helmet ✓ | CORS restricted ✓ | Rate limiting ✓ | JWT auth ✓`);
  console.log(`🌍 NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
});