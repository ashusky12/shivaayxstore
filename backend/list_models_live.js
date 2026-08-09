const axios = require('axios');
const Database = require('better-sqlite3');

function getYoutubeCredentials() {
  const dbPath = 'C:\\Users\\immad\\.gemini\\antigravity\\scratch\\auto-shorts-uploader\\database.sqlite';
  const db = new Database(dbPath);
  const rows = db.prepare('SELECT * FROM settings').all();
  const settings = {};
  rows.forEach(r => settings[r.key] = r.value);
  db.close();
  return settings;
}

async function listModels() {
  const settings = getYoutubeCredentials();
  const apiKey = settings.gemini_api_key;
  try {
    const response = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    console.log("Status:", response.status);
    if (response.data && response.data.models) {
      console.log("Available Models:", response.data.models.map(m => m.name));
    } else {
      console.log("No models returned:", response.data);
    }
  } catch(e) {
    console.error("Failed to query models list:", e.response?.data || e.message);
  }
}

listModels();
