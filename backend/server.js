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
      'SELECT * FROM bookings ORDER BY created_at DESC'
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

app.listen(process.env.PORT || 5000, () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
  console.log(`📊 Database: ${process.env.DB_NAME} (${process.env.DB_HOST}:${process.env.DB_PORT})`);
});