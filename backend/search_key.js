const fs = require('fs');
const readline = require('readline');
const path = require('path');

const logFile = 'C:\\Users\\immad\\\.gemini\\antigravity\\brain\\b5bfec08-a6d1-4a99-9937-52771c9499dd\\.system_generated\\logs\\transcript.jsonl';

async function searchLog() {
  const fileStream = fs.createReadStream(logFile);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    if (line.includes('gemini_api_key') || line.includes('AQ.')) {
      console.log(line.substring(0, 1000)); // print first 1000 characters of matching line
    }
  }
}

searchLog();
