const fs = require('fs');

function refactorIndex() {
  let content = fs.readFileSync('index.html', 'utf8');

  // Inject config.js
  if (!content.includes('<script src="js/config.js"></script>')) {
    content = content.replace('</head>', '  <script src="js/config.js"></script>\n</head>');
  }

  // Safely remove BACKEND_URL declaration (lines 2013-2020)
  const declaration = `  /* ══════════════════════════════════════════════
     BACKEND CONFIG — Change this to your Render URL before deploying
     e.g. 'https://mj-culture-api.onrender.com'
  ══════════════════════════════════════════════ */
  // Use localhost for development, production URL for deployed version
  const BACKEND_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://mj-cult.onrender.com';`;

  content = content.replace(declaration, '');

  // Replace BACKEND_URL usage with API_BASE_URL
  content = content.replace(/BACKEND_URL/g, 'API_BASE_URL');

  fs.writeFileSync('index.html', content);
  console.log('Safely refactored index.html');
}

refactorIndex();
