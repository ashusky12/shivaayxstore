const fs = require('fs');
const path = require('path');

// 1. Add DELETE tickets purge endpoint to backend/server.js
const serverPath = path.join(__dirname, '..', 'backend', 'server.js');
let serverContent = fs.readFileSync(serverPath, 'utf8');

const targetEndpointCode = `// 4. Send a new message inside a ticket (and forward to Discord)
app.post('/api/tickets/:id/messages', async (req, res) => {`;

const newEndpointCode = `// 5. Purge all tickets (for testing/cleanup)
app.delete('/api/tickets/all', async (req, res) => {
  try {
    await Ticket.deleteMany({});
    await TicketMessage.deleteMany({});
    res.json({ success: true, message: 'All tickets and messages deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Send a new message inside a ticket (and forward to Discord)
app.post('/api/tickets/:id/messages', async (req, res) => {`;

if (serverContent.includes(targetEndpointCode)) {
  serverContent = serverContent.replace(targetEndpointCode, newEndpointCode);
  console.log("Successfully added purge endpoint in server.js!");
} else {
  console.log("WARNING: server.js match failed!");
}
fs.writeFileSync(serverPath, serverContent, 'utf8');

// 2. Add Reset Button markup and click listener to renderTickets in app.js
const appPath = path.join(__dirname, '..', 'app.js');
let appContent = fs.readFileSync(appPath, 'utf8');

const oldHeaderHtml = `        <a href="#/accounts" class="btn btn-ghost btn-sm"><i data-lucide="plus"></i> New Ticket</a>
      </header>

      \${ticketListHtml}
    </div>
  \`;
  lucide.createIcons();
}`;

const newHeaderHtml = `        <div style="display: flex; gap: 0.5rem; align-items: center;">
          <button class="btn btn-ghost btn-sm" id="btn-reset-all-tickets" style="color: var(--color-blood); border: 1px dashed rgba(255, 45, 70, 0.3);">
            <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i> Reset All
          </button>
          <a href="#/accounts" class="btn btn-ghost btn-sm"><i data-lucide="plus"></i> New Ticket</a>
        </div>
      </header>

      \${ticketListHtml}
    </div>
  \`;
  lucide.createIcons();

  const resetBtn = document.getElementById("btn-reset-all-tickets");
  if (resetBtn) {
    resetBtn.addEventListener("click", async () => {
      if (confirm("Kya aap sach me saare purane tickets aur channels delete karna chahte hain?")) {
        localStorage.setItem("ShivaayX_tickets", JSON.stringify([]));
        try {
          await fetch(\`\${getApiUrl()}/api/tickets/all\`, { method: 'DELETE' });
        } catch (err) {
          console.error(err);
        }
        showToast("Saare tickets successfully clear ho gaye hain.");
        router();
      }
    });
  }
}`;

if (appContent.includes(oldHeaderHtml)) {
  appContent = appContent.replace(oldHeaderHtml, newHeaderHtml);
  console.log("Successfully added Reset All button click listener and markup in app.js!");
} else {
  console.log("WARNING: app.js header match failed!");
}
fs.writeFileSync(appPath, appContent, 'utf8');
