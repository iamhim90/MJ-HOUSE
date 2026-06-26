-- Create Bookings Table
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
  advance_paid NUMERIC DEFAULT 0,
  payment_status VARCHAR(50) DEFAULT 'not_paid',
  payment_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Staff Table
CREATE TABLE IF NOT EXISTS staff (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  salary NUMERIC DEFAULT 0,
  salary_status VARCHAR(50) DEFAULT 'pending',
  salary_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Expenses Table
CREATE TABLE IF NOT EXISTS expenses (
  id SERIAL PRIMARY KEY,
  category VARCHAR(100) NOT NULL,
  amount NUMERIC NOT NULL,
  date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'unpaid',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- 1. Bookings Policies
-- Allow anyone (public) to insert bookings
CREATE POLICY "Public can insert bookings" ON bookings
  FOR INSERT WITH CHECK (true);

-- Allow anyone (public) to read bookings (needed to fetch available slots)
CREATE POLICY "Public can read bookings" ON bookings
  FOR SELECT USING (true);

-- Allow authenticated admins to do everything (update, delete)
CREATE POLICY "Admins can do everything on bookings" ON bookings
  FOR ALL USING (auth.role() = 'authenticated');

-- 2. Staff Policies
-- Only authenticated admins can manage staff
CREATE POLICY "Admins can manage staff" ON staff
  FOR ALL USING (auth.role() = 'authenticated');

-- 3. Expenses Policies
-- Only authenticated admins can manage expenses
CREATE POLICY "Admins can manage expenses" ON expenses
  FOR ALL USING (auth.role() = 'authenticated');
