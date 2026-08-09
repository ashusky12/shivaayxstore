const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'app.js');
let appContent = fs.readFileSync(appPath, 'utf8');

// Replace the polling 404 handler block in app.js
const oldPollBlock = `      const res = await fetch(\`\${getApiUrl()}/api/tickets/\${ticketId}/messages\`);
      if (res.status === 404) {
        // Ticket was deleted from server (likely because admin deleted the Discord channel)
        clearInterval(window.ShivaayX_chatPollInterval);
        
        // Remove ticket locally
        const freshTickets = JSON.parse(localStorage.getItem("ShivaayX_tickets") || "[]");
        const filtered = freshTickets.filter(t => t.id !== ticketId);
        localStorage.setItem("ShivaayX_tickets", JSON.stringify(filtered));
        
        showToast("Ticket closed by owner");
        window.location.hash = "#/tickets";
        return;
      }
      if (res.ok) {`;

const newPollBlock = `      const res = await fetch(\`\${getApiUrl()}/api/tickets/\${ticketId}/messages\`);
      if (res.status === 404) {
        try {
          const errData = await res.json();
          if (errData && errData.error === 'Ticket not found or deleted') {
            // Confirmed deletion by the backend owner!
            clearInterval(window.ShivaayX_chatPollInterval);
            
            // Remove ticket locally
            const freshTickets = JSON.parse(localStorage.getItem("ShivaayX_tickets") || "[]");
            const filtered = freshTickets.filter(t => t.id !== ticketId);
            localStorage.setItem("ShivaayX_tickets", JSON.stringify(filtered));
            
            showToast("Ticket closed by owner");
            window.location.hash = "#/tickets";
            return;
          }
        } catch (jsonErr) {
          // If JSON parse fails, this is Vercel's static 404 (offline server), ignore auto-close!
          console.warn("Vercel static 404 received, server offline. Skipping auto-close.");
        }
      }
      if (res.ok) {`;

if (appContent.includes(oldPollBlock)) {
  appContent = appContent.replace(oldPollBlock, newPollBlock);
  console.log("Successfully replaced app.js polling 404 check block with Vercel protection!");
} else {
  console.log("WARNING: app.js polling block match failed!");
}

fs.writeFileSync(appPath, appContent, 'utf8');
