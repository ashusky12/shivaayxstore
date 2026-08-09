const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\immad\\.gemini\\antigravity\\brain';
const dirs = fs.readdirSync(brainDir);

for (const dir of dirs) {
  const logFile = path.join(brainDir, dir, '.system_generated', 'logs', 'transcript.jsonl');
  if (fs.existsSync(logFile)) {
    try {
      const content = fs.readFileSync(logFile, 'utf8');
      if (content.toLowerCase().includes('youtube shorts') || content.toLowerCase().includes('shorts uploader')) {
        console.log("FOUND MATCHING DIR:", dir);
      }
    } catch(e) {}
  }
}
