const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'app.js');
if (!fs.existsSync(appPath)) {
  console.log("app.js not found at:", appPath);
  process.exit(1);
}

const content = fs.readFileSync(appPath, 'utf8');
const lines = content.split('\n');

const queries = ['details', 'render', 'html', 'class=', 'style='];

queries.forEach(q => {
  console.log(`=== Matches for: "${q}" ===`);
  let count = 0;
  lines.forEach((line, idx) => {
    if (line.toLowerCase().includes(q.toLowerCase()) && count < 60) {
      console.log(`${idx + 1}: ${line.trim()}`);
      count++;
    }
  });
  console.log('');
});
