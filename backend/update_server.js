const fs = require('fs');
const path = require('path');

const serverFile = path.join(__dirname, 'server.js');
let code = fs.readFileSync(serverFile, 'utf8');

// 1. Replace error catching
code = code.replace(/res\.status\(500\)\.json\(\{ error: err\.message \}\);/g, `console.error(err);\n    res.status(500).json({ message: err.message, stack: err.stack });`);
code = code.replace(/res\.status\(500\)\.json\(\{ success: false, error: err\.message \}\);/g, `console.error(err);\n    res.status(500).json({ success: false, message: err.message, stack: err.stack });`);

// 2. Add GET / and GET /health
if (!code.includes("app.get('/health'")) {
  const healthEndpoints = `
// Health Endpoints
app.get('/', (req, res) => res.send('MJ Farmhouse Backend Running'));
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ server: 'ok', database: 'ok' });
  } catch (err) {
    res.status(500).json({ server: 'ok', database: 'error', message: err.message });
  }
});
`;
  code = code.replace('app.use(express.json());', 'app.use(express.json());\n' + healthEndpoints);
}

// 3. Add Startup Connectivity Check
if (!code.includes("SELECT NOW()")) {
  const startupCheck = `
pool.query('SELECT NOW()')
  .then(() => console.log('✅ Database connected successfully'))
  .catch(err => console.error('❌ Database connection failed:', err.message));

app.listen`;
  code = code.replace('app.listen', startupCheck);
}

fs.writeFileSync(serverFile, code);
console.log('✅ Server.js updated successfully!');
