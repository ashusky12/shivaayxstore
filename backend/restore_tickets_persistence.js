const fs = require('fs');
const path = require('path');

// 1. Restore ticket persistence in app.js
const appPath = path.join(__dirname, '..', 'app.js');
let appContent = fs.readFileSync(appPath, 'utf8');

const oldClearCode = `// Force clear tickets once for testing
localStorage.setItem("ShivaayX_tickets", JSON.stringify([]));`;

const newPersistenceCode = `// Initialise tickets database if not exists (preserved across reloads)
if (!localStorage.getItem("ShivaayX_tickets")) {
  localStorage.setItem("ShivaayX_tickets", JSON.stringify([]));
}`;

if (appContent.includes(oldClearCode)) {
  appContent = appContent.replace(oldClearCode, newPersistenceCode);
  console.log("Successfully restored ticket persistence check in app.js!");
} else {
  console.log("WARNING: app.js oldClearCode match failed!");
}
fs.writeFileSync(appPath, appContent, 'utf8');

// 2. Update discord bot ready check in backend/server.js
const serverPath = path.join(__dirname, '..', 'backend', 'server.js');
let serverContent = fs.readFileSync(serverPath, 'utf8');

// Replace readyAt with isReady() in post ticket creation route
const oldBotReady1 = "if (discordClient && discordClient.readyAt) {";
const newBotReady1 = "if (discordClient && discordClient.isReady()) {";

serverContent = serverContent.replaceAll(oldBotReady1, newBotReady1);
console.log("Successfully replaced readyAt with isReady() in server.js!");

fs.writeFileSync(serverPath, serverContent, 'utf8');
