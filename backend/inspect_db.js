const Database = require('better-sqlite3');
const dbPath = 'C:\\Users\\immad\\.gemini\\antigravity\\scratch\\auto-shorts-uploader\\database.sqlite';
const db = new Database(dbPath);
const rows = db.prepare('SELECT * FROM settings').all();
console.log(rows);
db.close();
