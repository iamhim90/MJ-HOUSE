const SUPABASE_URL = 'https://komjptdcvsycpbmtanpq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvbWpwdGRjdnN5Y3BibXRhbnBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0NTM5OTIsImV4cCI6MjA5ODAyOTk5Mn0.pU_x-VgFJaD5WbfOX6vq6Ph259vdRs1v_lQyUVHM390';

// Initialize Supabase client
window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
