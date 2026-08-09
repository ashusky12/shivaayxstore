const Database = require('better-sqlite3');
const { GoogleGenerativeAI } = require('@google/generative-ai');

function getYoutubeCredentials() {
  const dbPath = 'C:\\Users\\immad\\.gemini\\antigravity\\scratch\\auto-shorts-uploader\\database.sqlite';
  const db = new Database(dbPath);
  const rows = db.prepare('SELECT * FROM settings').all();
  const settings = {};
  rows.forEach(r => settings[r.key] = r.value);
  db.close();
  return settings;
}

async function test35() {
  const settings = getYoutubeCredentials();
  const apiKey = settings.gemini_api_key;
  const genAI = new GoogleGenerativeAI(apiKey);

  const testList = ['gemini-3.5-flash', 'gemini-2.5-flash', 'gemini-3.6-flash'];
  for (const m of testList) {
    try {
      console.log(`Testing model: ${m}...`);
      const model = genAI.getGenerativeModel({ model: m });
      const result = await model.generateContent("Hello, respond in one word.");
      console.log(`✅ Success with model ${m}: "${result.response.text().trim()}"`);
    } catch (err) {
      console.log(`❌ Failed for ${m}:`, err.message);
    }
  }
}

test35();
