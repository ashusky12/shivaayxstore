const fs = require('fs');
const path = require('path');

// 1. Add DELETE ticket API route and channelDelete event listener in backend/server.js
const serverPath = path.join(__dirname, '..', 'backend', 'server.js');
let serverContent = fs.readFileSync(serverPath, 'utf8');

// Add DELETE single ticket endpoint code
const oldPostMessagesRoute = `// 4. Send a new message inside a ticket (and forward to Discord)
app.post('/api/tickets/:id/messages', async (req, res) => {`;

const newDeleteTicketRoute = `// 6. Delete a single ticket (initiated from website)
app.delete('/api/tickets/:id', async (req, res) => {
  try {
    const ticketId = req.params.id;
    const ticket = await Ticket.findOne({ id: ticketId });
    if (ticket) {
      // If there's an associated Discord channel, delete it
      if (ticket.discordChannelId && discordClient && discordClient.isReady()) {
        try {
          const channel = await discordClient.channels.fetch(ticket.discordChannelId);
          if (channel) {
            await channel.delete('Ticket deleted from website');
          }
        } catch (discordErr) {
          console.error('Failed to delete Discord channel:', discordErr);
        }
      }
      
      await Ticket.deleteOne({ id: ticketId });
      await TicketMessage.deleteMany({ ticketId: ticketId });
      res.json({ success: true, message: 'Ticket deleted successfully.' });
    } else {
      res.status(404).json({ success: false, error: 'Ticket not found' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Send a new message inside a ticket (and forward to Discord)
app.post('/api/tickets/:id/messages', async (req, res) => {`;

if (serverContent.includes(oldPostMessagesRoute)) {
  serverContent = serverContent.replace(oldPostMessagesRoute, newDeleteTicketRoute);
  console.log("Added DELETE ticket route in server.js!");
} else {
  console.log("WARNING: server.js post message route match failed!");
}

// Add channelDelete event listener code
const oldReadyEvent = `discordClient.on('ready', () => {
    console.log(\`Discord Support Bot logged in as \${discordClient.user.tag}\`);
  });`;

const newReadyAndChannelDeleteEvents = `discordClient.on('ready', () => {
    console.log(\`Discord Support Bot logged in as \${discordClient.user.tag}\`);
  });

  // Listen to channel deletion (to delete ticket from MongoDB)
  discordClient.on('channelDelete', async (channel) => {
    try {
      const Ticket = mongoose.model('Ticket');
      const TicketMessage = mongoose.model('TicketMessage');
      
      // Find ticket with this channel ID
      const ticket = await Ticket.findOne({ discordChannelId: channel.id });
      if (ticket) {
        console.log(\`Discord channel \${channel.name} was deleted. Purging ticket \${ticket.id} from database.\`);
        await Ticket.deleteOne({ id: ticket.id });
        await TicketMessage.deleteMany({ ticketId: ticket.id });
      }
    } catch (err) {
      console.error('Error handling channelDelete event:', err);
    }
  });`;

if (serverContent.includes(oldReadyEvent)) {
  serverContent = serverContent.replace(oldReadyEvent, newReadyAndChannelDeleteEvents);
  console.log("Added channelDelete event listener in server.js!");
} else {
  console.log("WARNING: server.js ready event match failed!");
}

fs.writeFileSync(serverPath, serverContent, 'utf8');

// 2. Add Delete Button, click listener, and polling 404 auto-purge in app.js
const appPath = path.join(__dirname, '..', 'app.js');
let appContent = fs.readFileSync(appPath, 'utf8');

// Update chat header HTML to include Delete Button
const oldChatHeaderHtml = `        <!-- Header -->
        <div class="chat-header">
          <div class="chat-title-wrapper">
            <h2 style="font-size: 1.125rem;">Purchase: \${ticket.listingTitle}</h2>
            <span class="chat-status">Status: active</span>
          </div>
          <a href="#/accounts/\${ticket.listingSlug}" class="btn btn-ghost btn-sm">View Listing</a>
        </div>`;

const newChatHeaderHtml = `        <!-- Header -->
        <div class="chat-header">
          <div class="chat-title-wrapper">
            <h2 style="font-size: 1.125rem;">Purchase: \${ticket.listingTitle}</h2>
            <span class="chat-status">Status: active</span>
          </div>
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <a href="#/accounts/\${ticket.listingSlug}" class="btn btn-ghost btn-sm">View Listing</a>
            <button class="btn btn-ghost btn-sm" id="btn-delete-this-ticket" style="color: var(--color-blood);" title="Delete support ticket">
              <i data-lucide="trash-2" style="width: 16px; height: 16px;"></i>
            </button>
          </div>
        </div>`;

if (appContent.includes(oldChatHeaderHtml)) {
  appContent = appContent.replace(oldChatHeaderHtml, newChatHeaderHtml);
  console.log("Added delete button markup in app.js!");
} else {
  console.log("WARNING: app.js chat header match failed!");
}

// Add delete button click listener in app.js
const oldPollStart = `  // Poll backend database for Discord Admin messages every 3 seconds
  window.ShivaayX_chatPollInterval = setInterval(async () => {`;

const newDeleteListenerAndPollStart = `  // Delete current ticket click listener
  const deleteThisBtn = document.getElementById("btn-delete-this-ticket");
  if (deleteThisBtn) {
    deleteThisBtn.addEventListener("click", async () => {
      if (confirm("Kya aap sach me is support ticket ko delete karna chahte hain? (Isse Discord channel bhi delete ho jayega)")) {
        // Clear polling
        if (window.ShivaayX_chatPollInterval) {
          clearInterval(window.ShivaayX_chatPollInterval);
        }
        
        // Delete locally
        const freshTickets = JSON.parse(localStorage.getItem("ShivaayX_tickets") || "[]");
        const filtered = freshTickets.filter(t => t.id !== ticketId);
        localStorage.setItem("ShivaayX_tickets", JSON.stringify(filtered));
        
        // Delete from backend server
        try {
          await fetch(\`\${getApiUrl()}/api/tickets/\${ticketId}\`, { method: 'DELETE' });
        } catch (err) {
          console.error(err);
        }
        
        showToast("Ticket deleted successfully.");
        window.location.hash = "#/tickets";
      }
    });
  }

  // Poll backend database for Discord Admin messages every 3 seconds
  window.ShivaayX_chatPollInterval = setInterval(async () => {`;

if (appContent.includes(oldPollStart)) {
  appContent = appContent.replace(oldPollStart, newDeleteListenerAndPollStart);
  console.log("Added delete click listener in app.js!");
} else {
  console.log("WARNING: app.js poll start match failed!");
}

// Add 404 auto-purge logic in polling loop
const oldPollFetch = `    try {
      const res = await fetch(\`\${getApiUrl()}/api/tickets/\${ticketId}/messages\`);
      if (res.ok) {`;

const newPollFetchWithAutoPurge = `    try {
      const res = await fetch(\`\${getApiUrl()}/api/tickets/\${ticketId}/messages\`);
      if (res.status === 404) {
        // Ticket was deleted from server (likely because admin deleted the Discord channel)
        clearInterval(window.ShivaayX_chatPollInterval);
        
        // Remove ticket locally
        const freshTickets = JSON.parse(localStorage.getItem("ShivaayX_tickets") || "[]");
        const filtered = freshTickets.filter(t => t.id !== ticketId);
        localStorage.setItem("ShivaayX_tickets", JSON.stringify(filtered));
        
        showToast("Support ticket has been closed and deleted by administrator.");
        window.location.hash = "#/tickets";
        return;
      }
      if (res.ok) {`;

if (appContent.includes(oldPollFetch)) {
  appContent = appContent.replace(oldPollFetch, newPollFetchWithAutoPurge);
  console.log("Added polling 404 auto-purge block in app.js!");
} else {
  console.log("WARNING: app.js poll fetch match failed!");
}

fs.writeFileSync(appPath, appContent, 'utf8');
