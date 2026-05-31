const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// POST /api/bookings - Create new booking
app.post('/api/bookings', async (req, res) => {
  try {
    const { name, phone, email, date, timeSlot, occasion, price, guests, specialRequirements } = req.body;

    // Validation
    if (!name || !phone || !date || !timeSlot || !occasion || !price || !guests) {
      console.log('❌ Validation failed - missing required fields');
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, phone, date, timeSlot, occasion, price, guests'
      });
    }

    // Log incoming request
    console.log('\n📥 INCOMING BOOKING REQUEST:');
    console.log('  name:', name);
    console.log('  phone:', phone);
    console.log('  email:', email || 'N/A');
    console.log('  date:', date);
    console.log('  timeSlot:', timeSlot);
    console.log('  occasion:', occasion);
    console.log('  guests:', guests);
    console.log('  price:', price);
    console.log('  notes:', specialRequirements || 'N/A');

    const result = await pool.query(
      `INSERT INTO bookings (customer_name, phone, email, check_in, check_out, guests, total_amount, occasion, notes, slot, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [name, phone, email || null, date, date, guests, price, occasion, specialRequirements || null, timeSlot, 'pending']
    );

    console.log('✅ Booking created - ID:', result.rows[0].id);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    res.json({
      success: true,
      bookingId: result.rows[0].id,
      booking: result.rows[0]
    });
  } catch (err) {
    console.error('❌ Database error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/bookings - List all bookings
app.get('/api/bookings', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT *, advance_paid as "advancePaid", payment_status as "paymentStatus", payment_notes as "paymentNotes" FROM bookings ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching bookings:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/bookings/:id - Get specific booking by ID
app.get('/api/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM bookings WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    console.log('📋 Booking status check - ID:', id, '- Status:', result.rows[0].status);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('❌ Error fetching booking:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/bookings/:id/paydone - Mark booking as payment received
app.patch('/api/bookings/:id/paydone', async (req, res) => {
  try {
    const { id } = req.params;

    console.log('💳 Payment marked as done - ID:', id);

    const result = await pool.query(
      'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *',
      ['confirmed', id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    console.log('✅ Booking confirmed - ID:', id);
    res.json({
      success: true,
      message: 'Payment received and booking confirmed',
      booking: result.rows[0]
    });
  } catch (err) {
    console.error('❌ Error updating booking:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/bookings/:id/status - Update booking status
app.patch('/api/bookings/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log(`📝 Status update - ID: ${id} -> ${status}`);

    const result = await pool.query(
      'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    console.log(`✅ Booking ${status} - ID: ${id}`);
    res.json({
      success: true,
      message: `Booking status updated to ${status}`,
      booking: result.rows[0]
    });
  } catch (err) {
    console.error('❌ Error updating booking status:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// --- PAYMENTS ---
app.patch('/api/bookings/:id/payment', async (req, res) => {
  try {
    const { id } = req.params;
    const { advancePaid, paymentStatus, paymentNotes } = req.body;
    const result = await pool.query(
      'UPDATE bookings SET advance_paid = $1, payment_status = $2, payment_notes = $3 WHERE id = $4 RETURNING *',
      [advancePaid, paymentStatus, paymentNotes, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Booking not found' });
    res.json({ success: true, booking: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/bookings/:id/verify-advance
app.patch('/api/bookings/:id/verify-advance', async (req, res) => {
  try {
    const { id } = req.params;
    const current = await pool.query('SELECT total_amount FROM bookings WHERE id = $1', [id]);
    if (current.rows.length === 0) return res.status(404).json({ error: 'Booking not found' });
    
    const total = parseFloat(current.rows[0].total_amount) || 0;
    const advancePaid = total * 0.3;

    const result = await pool.query(
      'UPDATE bookings SET status = $1, payment_status = $2, advance_paid = $3 WHERE id = $4 RETURNING *',
      ['confirmed', 'advance_paid', advancePaid, id]
    );
    res.json({ success: true, booking: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/bookings/:id/collect-cash
app.patch('/api/bookings/:id/collect-cash', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'UPDATE bookings SET payment_status = $1 WHERE id = $2 RETURNING *',
      ['fully_paid', id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Booking not found' });
    res.json({ success: true, booking: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- STAFF ---
app.get('/api/staff', async (req, res) => {
  try {
    const result = await pool.query('SELECT id as _id, name, role, salary, salary_status as "salaryStatus", created_at FROM staff ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/staff', async (req, res) => {
  try {
    const { name, role, salary, salaryStatus } = req.body;
    const result = await pool.query(
      'INSERT INTO staff (name, role, salary, salary_status) VALUES ($1, $2, $3, $4) RETURNING id as _id, *',
      [name, role, salary, salaryStatus]
    );
    res.json({ success: true, staff: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/staff/:id', async (req, res) => {
  try {
    const { salaryStatus } = req.body;
    const result = await pool.query(
      'UPDATE staff SET salary_status = $1 WHERE id = $2 RETURNING id as _id, *',
      [salaryStatus, req.params.id]
    );
    res.json({ success: true, staff: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/staff/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM staff WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- EXPENSES ---
app.get('/api/expenses', async (req, res) => {
  try {
    const result = await pool.query('SELECT id as _id, category, amount, date, status, notes, created_at FROM expenses ORDER BY date DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/expenses', async (req, res) => {
  try {
    const { category, amount, date, status, notes } = req.body;
    const result = await pool.query(
      'INSERT INTO expenses (category, amount, date, status, notes) VALUES ($1, $2, $3, $4, $5) RETURNING id as _id, *',
      [category, amount, date, status, notes]
    );
    res.json({ success: true, expense: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/expenses/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM expenses WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
  console.log(`📊 Database: ${process.env.DB_NAME} (${process.env.DB_HOST}:${process.env.DB_PORT})`);
});