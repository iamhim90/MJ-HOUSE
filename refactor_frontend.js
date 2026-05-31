const fs = require('fs');

function refactorFile(file, isIndex) {
  let content = fs.readFileSync(file, 'utf8');

  // Inject config.js
  if (!content.includes('<script src="js/config.js"></script>')) {
    content = content.replace('</head>', '  <script src="js/config.js"></script>\n</head>');
  }

  if (isIndex) {
    // Remove BACKEND_URL declaration block
    content = content.replace(/\/\* ══════════════════════════════════════════════[\s\S]*?BACKEND_URL[\s\S]*?onrender\.com';/g, '');
  } else {
    // Remove admin.html BACKEND_URL declaration
    content = content.replace(/const BACKEND_URL = 'http:\/\/localhost:5000'; \/\/ ← change to your API URL/g, '');
  }

  // Replace BACKEND_URL usage with API_BASE_URL
  content = content.replace(/BACKEND_URL/g, 'API_BASE_URL');

  fs.writeFileSync(file, content);
  console.log(`Refactored ${file}`);
}

refactorFile('index.html', true);
refactorFile('admin.html', false);
