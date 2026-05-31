const fs = require('fs');
const path = require('path');

const serverFile = path.join(__dirname, 'server.js');
let code = fs.readFileSync(serverFile, 'utf8');

// Find the end of the DELETE expenses route
const deleteExpensesRouteEnd = "app.delete('/api/expenses/:id', async (req, res) => {\n  try {\n    await pool.query('DELETE FROM expenses WHERE id = $1', [req.params.id]);\n    res.json({ success: true });\n  } catch (err) {\n    console.error(err);\n    res.status(500).json({ message: err.message, stack: err.stack });\n  }\n});";

const cutIndex = code.indexOf(deleteExpensesRouteEnd);

if (cutIndex !== -1) {
  // Keep everything up to the end of that route
  let newCode = code.substring(0, cutIndex + deleteExpensesRouteEnd.length);
  
  // Append the proper tail
  newCode += `\n\npool.query('SELECT NOW()')\n  .then(() => console.log('✅ Database connected successfully'))\n  .catch(err => console.error('❌ Database connection failed:', err.message));\n\napp.listen(process.env.PORT || 5000, () => {\n  console.log(\`🚀 Server running on port \${process.env.PORT || 5000}\`);\n  console.log(\`📊 Database: Connected via DATABASE_URL\`);\n});\n`;
  
  fs.writeFileSync(serverFile, newCode);
  console.log("Fixed server.js!");
} else {
  console.log("Could not find the target string.");
}
