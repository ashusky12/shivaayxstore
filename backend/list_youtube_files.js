const fs = require('fs');
const path = require('path');

const targetDir = 'C:\\Users\\immad\\\.gemini\\antigravity\\scratch\\auto-shorts-uploader';

function listFiles(dir) {
  if (!fs.existsSync(dir)) {
    console.log("Directory does not exist:", dir);
    return;
  }
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules') {
        console.log("DIR:", fullPath);
        listFiles(fullPath);
      }
    } else {
      console.log("FILE:", fullPath);
    }
  }
}

listFiles(targetDir);
