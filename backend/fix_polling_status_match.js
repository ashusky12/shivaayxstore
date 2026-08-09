const fs = require('fs');
const path = require('path');

// 1. Update /api/tickets/:id/messages endpoint in backend/server.js to return 404 if ticket doesn't exist
const serverPath = path.join(__dirname, '..', 'backend', 'server.js');
let serverContent = fs.readFileSync(serverPath, 'utf8');

const oldMessagesGetRoute = `// 2. Fetch all messages for a ticket
app.get('/api/tickets/:id/messages', async (req, res) => {
  try {
    const messages = await TicketMessage.find({ ticketId: req.params.id }).sort({ createdAt: 1 });
    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});`;

const newMessagesGetRoute = `// 2. Fetch all messages for a ticket
app.get('/api/tickets/:id/messages', async (req, res) => {
  try {
    const ticketExists = await Ticket.findOne({ id: req.params.id });
    if (!ticketExists) {
      return res.status(404).json({ success: false, error: 'Ticket not found or deleted' });
    }
    const messages = await TicketMessage.find({ ticketId: req.params.id }).sort({ createdAt: 1 });
    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});`;

if (serverContent.includes(oldMessagesGetRoute)) {
  serverContent = serverContent.replace(oldMessagesGetRoute, newMessagesGetRoute);
  console.log("Successfully updated server messages GET route!");
} else {
  console.log("WARNING: server messages GET route match failed!");
}
fs.writeFileSync(serverPath, serverContent, 'utf8');

// 2. Update polling toast notification in app.js
const appPath = path.join(__dirname, '..', 'app.js');
let appContent = fs.readFileSync(appPath, 'utf8');

const oldToastCode = `        showToast("Support ticket has been closed and deleted by administrator.");`;
const newToastCode = `        showToast("Ticket closed by owner");`;

if (appContent.includes(oldToastCode)) {
  appContent = appContent.replace(oldToastCode, newToastCode);
  console.log("Successfully updated app.js toast notification!");
} else {
  console.log("WARNING: app.js toast code match failed!");
}
fs.writeFileSync(appPath, appContent, 'utf8');
