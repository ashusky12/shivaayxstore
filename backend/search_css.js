const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'style.css');
if (!fs.existsSync(cssPath)) {
  console.log("CSS file not found at:", cssPath);
  process.exit(1);
}

const content = fs.readFileSync(cssPath, 'utf8');
const lines = content.split('\n');

const queries = ['.details', '.filter', '.modal', '.chat', 'grid', '@media'];

queries.forEach(q => {
  console.log(`=== Matches for: "${q}" ===`);
  lines.forEach((line, idx) => {
    if (line.toLowerCase().includes(q.toLowerCase())) {
      console.log(`${idx + 1}: ${line.trim()}`);
    }
  });
  console.log('');
});
