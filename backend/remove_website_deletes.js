const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'app.js');
let appContent = fs.readFileSync(appPath, 'utf8');

// 1. Remove Reset All button markup from renderTickets
const oldResetBtnHtml = `        <div style="display: flex; gap: 0.5rem; align-items: center;">
          <button class="btn btn-ghost btn-sm" id="btn-reset-all-tickets" style="color: var(--color-blood); border: 1px dashed rgba(255, 45, 70, 0.3);">
            <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i> Reset All
          </button>
          <a href="#/accounts" class="btn btn-ghost btn-sm"><i data-lucide="plus"></i> New Ticket</a>
        </div>`;

const newResetBtnHtml = `        <a href="#/accounts" class="btn btn-ghost btn-sm"><i data-lucide="plus"></i> New Ticket</a>`;

if (appContent.includes(oldResetBtnHtml)) {
  appContent = appContent.replace(oldResetBtnHtml, newResetBtnHtml);
  console.log("Successfully removed Reset All button markup!");
} else {
  console.log("WARNING: Reset All button markup match failed!");
}

// 2. Remove Reset All click listener from renderTickets
const oldResetListener = `  const resetBtn = document.getElementById("btn-reset-all-tickets");
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
  }`;

if (appContent.includes(oldResetListener)) {
  appContent = appContent.replace(oldResetListener, "");
  console.log("Successfully removed Reset All button click listener!");
} else {
  console.log("WARNING: Reset All listener match failed!");
}

// 3. Remove Delete ticket icon from chat header markup in renderSingleTicket
const oldDeleteTicketHtml = `          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <a href="#/accounts/\${ticket.listingSlug}" class="btn btn-ghost btn-sm">View Listing</a>
            <button class="btn btn-ghost btn-sm" id="btn-delete-this-ticket" style="color: var(--color-blood);" title="Delete support ticket">
              <i data-lucide="trash-2" style="width: 16px; height: 16px;"></i>
            </button>
          </div>`;

const newDeleteTicketHtml = `          <a href="#/accounts/\${ticket.listingSlug}" class="btn btn-ghost btn-sm">View Listing</a>`;

if (appContent.includes(oldDeleteTicketHtml)) {
  appContent = appContent.replace(oldDeleteTicketHtml, newDeleteTicketHtml);
  console.log("Successfully removed Delete ticket icon markup!");
} else {
  console.log("WARNING: Delete ticket icon markup match failed!");
}

// 4. Remove Delete ticket click listener in renderSingleTicket
const oldDeleteTicketListener = `  // Delete current ticket click listener
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
  }`;

if (appContent.includes(oldDeleteTicketListener)) {
  appContent = appContent.replace(oldDeleteTicketListener, "");
  console.log("Successfully removed Delete ticket click listener!");
} else {
  console.log("WARNING: Delete ticket click listener match failed!");
}

fs.writeFileSync(appPath, appContent, 'utf8');
