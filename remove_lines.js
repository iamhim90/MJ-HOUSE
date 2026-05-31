const fs = require('fs');

let lines = fs.readFileSync('index.html', 'utf8').split('\n');
// Arrays are 0-indexed. Lines 2014 to 2019 correspond to indices 2013 to 2018.
lines.splice(2013, 6); // Remove 6 lines starting from index 2013
fs.writeFileSync('index.html', lines.join('\n'));
console.log('Removed duplicate API_BASE_URL block.');
