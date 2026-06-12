const pool = require('./db');

async function migrate() {
  const client = await pool.connect();
  try {
    console.log('🔄 Starting database migration...');
    await client.query('BEGIN');

    // 1. Create bookings table if it doesn't exist (CRITICAL FOR NEW DEPLOYS)
    console.log('Ensuring bookings table exists...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        email VARCHAR(255),
        check_in DATE NOT NULL,
        check_out DATE NOT NULL,
        guests INTEGER NOT NULL,
        total_amount NUMERIC NOT NULL,
        occasion VARCHAR(255),
        notes TEXT,
        slot VARCHAR(50),
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 1.1 Add new columns to bookings table (for older schemas)
    console.log('Adding columns to bookings table...');
    await client.query(`
      ALTER TABLE bookings 
      ADD COLUMN IF NOT EXISTS advance_paid NUMERIC DEFAULT 0,
      ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'not_paid',
      ADD COLUMN IF NOT EXISTS payment_notes TEXT;
    `);

    // 2. Create staff table
    console.log('Creating staff table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS staff (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        salary NUMERIC DEFAULT 0,
        salary_status VARCHAR(50) DEFAULT 'pending',
        salary_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Ensure salary_date exists on older schemas
    await client.query(`
      ALTER TABLE staff
      ADD COLUMN IF NOT EXISTS salary_date DATE;
    `);

    // 3. Create expenses table
    console.log('Creating expenses table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS expenses (
        id SERIAL PRIMARY KEY,
        category VARCHAR(100) NOT NULL,
        amount NUMERIC NOT NULL,
        date DATE NOT NULL,
        status VARCHAR(50) DEFAULT 'unpaid',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query('COMMIT');
    console.log('✅ Migration completed successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', err);
  } finally {
    client.release();
    pool.end();
  }
}

migrate();
