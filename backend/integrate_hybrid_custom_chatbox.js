const fs = require('fs');
const path = require('path');

// 1. Append Crisp CSS overrides to style.css to hide Crisp widget globally
const stylePath = path.join(__dirname, '..', 'style.css');
let styleContent = fs.readFileSync(stylePath, 'utf8');

const crispCss = `

/* Crisp Widget UI Hide Overrides */
.crisp-client, #crisp-client, [class*="crisp-"] {
  display: none !important;
  visibility: hidden !important;
  pointer-events: none !important;
  opacity: 0 !important;
}
`;

if (!styleContent.includes("Crisp Widget UI Hide Overrides")) {
  styleContent += crispCss;
  fs.writeFileSync(stylePath, styleContent, 'utf8');
  console.log("Successfully added Crisp hide overrides to style.css!");
} else {
  console.log("Crisp CSS overrides already present.");
}

// 2. Modify app.js to integrate hybrid custom chat box flows
const appPath = path.join(__dirname, '..', 'app.js');
let appContent = fs.readFileSync(appPath, 'utf8');

// Update boot-level Crisp listener to hide, listen to messages, and save to DB
const oldCrispInit = `// Hide Crisp widget on page load, only show it when triggered by our custom buttons
if (typeof $crisp !== 'undefined') {
  $crisp.push(["do", "chat:hide"]);
  $crisp.push(["on", "chat:closed", () => {
    $crisp.push(["do", "chat:hide"]);
  }]);
}`;

const newCrispInit = `// Hide Crisp widget on page load, and sync Crisp incoming messages to MongoDB
if (typeof $crisp !== 'undefined') {
  $crisp.push(["do", "chat:hide"]);
  $crisp.push(["on", "chat:closed", () => {
    $crisp.push(["do", "chat:hide"]);
  }]);

  // Global listener for replies sent by the admin from Crisp App
  $crisp.push(["on", "message:received", (message) => {
    if (message && message.content) {
      const hash = window.location.hash;
      if (hash.startsWith("#/tickets/")) {
        const ticketId = hash.split("/")[2];
        const freshTickets = JSON.parse(localStorage.getItem("ShivaayX_tickets") || "[]");
        const currentTicket = freshTickets.find(t => t.id === ticketId);
        if (currentTicket) {
          const text = message.content;
          const time = new Date().toISOString();
          
          // Check for duplicate messages
          const exists = currentTicket.messages.some(m => m.text === text && m.sender === 'bot');
          if (!exists) {
            currentTicket.messages.push({
              sender: 'bot', // Appends as received bubble
              text: text,
              time: time
            });
            localStorage.setItem("ShivaayX_tickets", JSON.stringify(freshTickets));
            renderSingleTicket(ticketId); // Refresh custom chatbox screen
            
            // POST Crisp reply to central MongoDB so it is permanently synced
            fetch(\`\${getApiUrl()}/api/tickets/\${ticketId}/messages\`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                sender: 'admin',
                text: text
              })
            }).catch(err => console.error("Error saving Crisp reply to DB:", err));
          }
        }
      }
    }
  }]);
}`;

if (appContent.includes(oldCrispInit)) {
  appContent = appContent.replace(oldCrispInit, newCrispInit);
  console.log("Updated Crisp boot-level handler in app.js!");
} else {
  console.log("WARNING: Crisp boot-level handler match failed!");
}

// 3. Update promptTicketConfirmation to redirect to custom chatbox
const oldPromptFunc = `function promptTicketConfirmation(listing) {
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

// We keep this function EXACTLY as it is, since it handles custom modals and routes!
// But when it triggers createTicketFlow, we will sync with Crisp inside createTicketFlow!
console.log("Custom promptTicketConfirmation remains active.");

// 4. Update createTicketFlow to link the new ticket with Crisp session
const oldCreateTicketFlowPost = `  // POST to central DB (triggers Discord Bot ticket channel creation)
  fetch(\`\${getApiUrl()}/api/tickets\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: ticketId,
      listingId: listing.id || listing._id || 'unknown',
      listingTitle: listing.title,
      price: listing.price,
      userEmail: currentUser.email,
      username: currentUser.username
    })
  })
  .then(() => {
    showToast("Support ticket created successfully.");
    window.location.hash = \`#/tickets/\${ticketId}\`;
  })
  .catch(err => {
    console.error("Discord Sync Error:", err);
    showToast("Support ticket created successfully.");
    window.location.hash = \`#/tickets/\${ticketId}\`;
  });`;

const newCreateTicketFlowPost = `  // Sync with Crisp Session
  if (typeof $crisp !== 'undefined') {
    $crisp.push(["set", "user:email", [currentUser.email]]);
    $crisp.push(["set", "user:nickname", [currentUser.username]]);
    const contextMsg = \`🔄 Buyer opened a support ticket for account: **\${listing.title}** (Price: ₹\${listing.price.toLocaleString("en-IN")} • Slug: \${listing.slug || 'general-support'}).\`;
    $crisp.push(["do", "message:send", ["text", contextMsg]]);
  }

  // POST to central DB (triggers Discord Bot ticket channel creation)
  fetch(\`\${getApiUrl()}/api/tickets\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: ticketId,
      listingId: listing.id || listing._id || 'unknown',
      listingTitle: listing.title,
      price: listing.price,
      userEmail: currentUser.email,
      username: currentUser.username
    })
  })
  .then(() => {
    showToast("Support ticket created successfully.");
    window.location.hash = \`#/tickets/\${ticketId}\`;
  })
  .catch(err => {
    console.error("Discord Sync Error:", err);
    showToast("Support ticket created successfully.");
    window.location.hash = \`#/tickets/\${ticketId}\`;
  });`;

if (appContent.includes(oldCreateTicketFlowPost)) {
  appContent = appContent.replace(oldCreateTicketFlowPost, newCreateTicketFlowPost);
  console.log("Successfully linked createTicketFlow with Crisp!");
} else {
  console.log("WARNING: createTicketFlow post match failed!");
}

// 5. Update sendUserMessage to also push user message to Crisp
const oldSendUserMessage = `    // POST to backend (forwards message to Discord channel)
    fetch(\`\${getApiUrl()}/api/tickets/\${ticketId}/messages\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender: 'buyer',
        text: text
      })
    }).catch(err => console.error("Discord message sync error:", err));`;

const newSendUserMessage = `    // Send message to Crisp backend
    if (typeof $crisp !== 'undefined') {
      $crisp.push(["do", "message:send", ["text", text]]);
    }

    // POST to backend (forwards message to Discord channel)
    fetch(\`\${getApiUrl()}/api/tickets/\${ticketId}/messages\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender: 'buyer',
        text: text
      })
    }).catch(err => console.error("Discord message sync error:", err));`;

if (appContent.includes(oldSendUserMessage)) {
  appContent = appContent.replace(oldSendUserMessage, newSendUserMessage);
  console.log("Successfully linked sendUserMessage with Crisp!");
} else {
  console.log("WARNING: sendUserMessage post match failed!");
}

fs.writeFileSync(appPath, appContent, 'utf8');
