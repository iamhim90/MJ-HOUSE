const fs = require('fs');
const file = 'server.js';
let content = fs.readFileSync(file, 'utf8');

const target = 'console.log(`📊 Database: ${process.env.DB_NAME} (${process.env.DB_HOST}:${process.env.DB_PORT})`);';
const replacement = 'console.log(`📊 Database: Connected via DATABASE_URL`);';

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(file, content);
  console.log('Fixed log!');
} else {
  console.log('Target not found!');
}
