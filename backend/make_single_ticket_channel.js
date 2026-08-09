const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'app.js');
let appContent = fs.readFileSync(appPath, 'utf8');

// 1. Update createTicketFlow to check for ANY active ticket
const oldCreateTicketFlowStart = `function createTicketFlow(listing) {
  const tickets = JSON.parse(localStorage.getItem("ShivaayX_tickets") || "[]");
  
  // Check if ticket already exists for this listing and current user
  const existing = tickets.find(t => t.userEmail === currentUser.email && t.listingId === listing.id);
  if (existing) {
    showToast("Opening existing support thread for this account.");
    window.location.hash = \`#/tickets/\${existing.id}\`;
    return;
  }`;

const newCreateTicketFlowStart = `function createTicketFlow(listing) {
  const tickets = JSON.parse(localStorage.getItem("ShivaayX_tickets") || "[]");
  
  // Check if ANY active ticket thread already exists for this user
  const activeTicket = tickets.find(t => t.userEmail === currentUser.email && t.status === "active");
  if (activeTicket) {
    window.location.hash = \`#/tickets/\${activeTicket.id}\`;
    return;
  }`;

if (appContent.includes(oldCreateTicketFlowStart)) {
  appContent = appContent.replace(oldCreateTicketFlowStart, newCreateTicketFlowStart);
  console.log("Successfully updated createTicketFlow start!");
} else {
  console.log("WARNING: oldCreateTicketFlowStart match failed!");
}

// 2. Replace promptTicketConfirmation with single ticket thread routing & logging logic
// Let's locate the promptTicketConfirmation function at the end of app.js.
const oldPromptFunc = `function promptTicketConfirmation(listing) {
  // Check if ticket already exists first!
  const tickets = JSON.parse(localStorage.getItem("ShivaayX_tickets") || "[]");
  const existing = tickets.find(t => t.userEmail === currentUser.email && t.listingId === (listing.id || listing._id));
  if (existing) {
    showToast("Opening existing support thread for this account.");
    window.location.hash = \`#/tickets/\${existing.id}\`;
    return;
  }

  // Open confirmation modal
  const modal = document.getElementById("ticket-confirm-modal");
  if (modal) {
    modal.classList.add("open");
    
    // Bind Lucide icons for the modal
    lucide.createIcons();
    
    const confirmBtn = document.getElementById("confirm-ticket-btn");
    if (confirmBtn) {
      confirmBtn.onclick = () => {
        modal.classList.remove("open");
        createTicketFlow(listing);
      };
    }
  } else {
    // Failsafe: if modal element is not in DOM, proceed directly
    createTicketFlow(listing);
  }
}`;

const newPromptFunc = `function promptTicketConfirmation(listing) {
  const tickets = JSON.parse(localStorage.getItem("ShivaayX_tickets") || "[]");
  
  // Find if user already has ANY active support chat thread
  const activeTicket = tickets.find(t => t.userEmail === currentUser.email && t.status === "active");
  
  if (activeTicket) {
    // If it's a product page inquiry (not general-support click), log the new product context
    if (listing.id !== "general-support") {
      const updateText = \`🔄 Inquiring about listing: **\${listing.title}** (Price: ₹\${listing.price.toLocaleString("en-IN")})\`;
      
      // Ensure we don't log duplicate consecutive product changes
      const lastMsg = activeTicket.messages[activeTicket.messages.length - 1];
      if (!lastMsg || lastMsg.text !== updateText) {
        activeTicket.messages.push({
          sender: "system",
          text: \`Inquiring about: \${listing.title} (Price: ₹\${listing.price.toLocaleString("en-IN")})\`,
          time: new Date().toISOString(),
          type: "success"
        });
        localStorage.setItem("ShivaayX_tickets", JSON.stringify(tickets));
        
        // POST system notification to database & forward to Discord channel
        fetch(\`\${getApiUrl()}/api/tickets/\${activeTicket.id}/messages\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sender: 'buyer',
            text: \`🔄 Inquiring about listing: **\${listing.title}** (Price: ₹\${listing.price.toLocaleString("en-IN")})\`
          })
        }).catch(err => console.error(err));
      }
    }
    
    showToast("Opening your active support chat.");
    window.location.hash = \`#/tickets/\${activeTicket.id}\`;
    return;
  }

  // Open confirmation modal if no active chat thread exists
  const modal = document.getElementById("ticket-confirm-modal");
  if (modal) {
    modal.classList.add("open");
    lucide.createIcons();
    
    const confirmBtn = document.getElementById("confirm-ticket-btn");
    if (confirmBtn) {
      confirmBtn.onclick = () => {
        modal.classList.remove("open");
        createTicketFlow(listing);
      };
    }
  } else {
    createTicketFlow(listing);
  }
}`;

if (appContent.includes(oldPromptFunc)) {
  appContent = appContent.replace(oldPromptFunc, newPromptFunc);
  console.log("Successfully updated promptTicketConfirmation to enforce single ticket!");
} else {
  console.log("WARNING: oldPromptFunc match failed!");
}

fs.writeFileSync(appPath, appContent, 'utf8');
