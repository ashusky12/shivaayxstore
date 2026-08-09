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

async function testModels() {
  const settings = getYoutubeCredentials();
  const apiKey = settings.gemini_api_key;
  if (!apiKey) {
    console.error("No API key found.");
    return;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const models = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro', 'gemini-1.5-flash-latest', 'gemini-2.0-flash-exp', 'gemini-1.5-flash-8b'];

  for (const m of models) {
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

testModels();
