const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'app.js');
let appContent = fs.readFileSync(appPath, 'utf8');

// Step 1: Add getApiUrl helper and update syncListingsWithServer
const oldSync = `// Fetch database products from MongoDB server and update local cache
async function syncListingsWithServer() {
  try {
    const response = await fetch('http://localhost:5000/api/listings');`;

const newSync = `// Helper to resolve API host dynamically for Local Dev and Vercel Production
function getApiUrl() {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000';
  }
  return window.location.origin;
}

// Fetch database products from MongoDB server and update local cache
async function syncListingsWithServer() {
  try {
    const response = await fetch(\`\${getApiUrl()}/api/listings\`);`;

if (appContent.includes(oldSync)) {
  appContent = appContent.replace(oldSync, newSync);
  console.log("Successfully added getApiUrl helper!");
} else {
  console.log("WARNING: syncListingsWithServer match failed!");
}

// Step 2: Update createTicketFlow to call backend tickets API
const oldCreateTicket = `  tickets.push(newTicket);
  localStorage.setItem("ShivaayX_tickets", JSON.stringify(tickets));
  
  showToast("Support ticket created successfully.");
  window.location.hash = \`#/tickets/\${ticketId}\`;`;

const newCreateTicket = `  tickets.push(newTicket);
  localStorage.setItem("ShivaayX_tickets", JSON.stringify(tickets));
  
  // POST to central DB (triggers Discord Bot ticket channel creation)
  fetch(\`\${getApiUrl()}/api/tickets\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: ticketId,
      listingId: listing.id,
      listingTitle: listing.title,
      price: listing.price,
      userEmail: currentUser.email,
      username: currentUser.username
    })
  }).catch(err => console.error("Discord Sync Error:", err));
  
  showToast("Support ticket created successfully.");
  window.location.hash = \`#/tickets/\${ticketId}\`;`;

if (appContent.includes(oldCreateTicket)) {
  appContent = appContent.replace(oldCreateTicket, newCreateTicket);
  console.log("Successfully updated createTicketFlow with backend sync!");
} else {
  console.log("WARNING: createTicketFlow match failed!");
}

// Step 3: Update sendUserMessage to POST new messages to the backend
const oldSendUserMessage = `  // Send message helper
  function sendUserMessage(text) {
    const freshTickets = JSON.parse(localStorage.getItem("ShivaayX_tickets"));
    const currentTicket = freshTickets.find(t => t.id === ticketId);
    
    currentTicket.messages.push({
      sender: "user",
      text: text,
      time: new Date().toISOString()
    });
    
    localStorage.setItem("ShivaayX_tickets", JSON.stringify(freshTickets));
    renderSingleTicket(ticketId); // Re-render chat
    
    // Trigger simulated reply delay
    setTimeout(() => {
      simulateBotReply(text);
    }, 1200);
  }`;

const newSendUserMessage = `  // Send message helper
  function sendUserMessage(text) {
    const freshTickets = JSON.parse(localStorage.getItem("ShivaayX_tickets"));
    const currentTicket = freshTickets.find(t => t.id === ticketId);
    
    currentTicket.messages.push({
      sender: "user",
      text: text,
      time: new Date().toISOString()
    });
    
    localStorage.setItem("ShivaayX_tickets", JSON.stringify(freshTickets));
    renderSingleTicket(ticketId); // Re-render chat
    
    // POST to backend (forwards message to Discord channel)
    fetch(\`\${getApiUrl()}/api/tickets/\${ticketId}/messages\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender: 'buyer',
        text: text
      })
    }).catch(err => console.error("Discord message sync error:", err));
    
    // Trigger simulated reply delay
    setTimeout(() => {
      simulateBotReply(text);
    }, 1200);
  }`;

if (appContent.includes(oldSendUserMessage)) {
  appContent = appContent.replace(oldSendUserMessage, newSendUserMessage);
  console.log("Successfully updated sendUserMessage with Discord forwarding!");
} else {
  console.log("WARNING: sendUserMessage match failed!");
}

// Step 4: Add polling inside renderSingleTicket to fetch Discord Admin replies
const oldScroll = `  // Scroll chat box to bottom
  const msgBox = document.getElementById("chat-messages-box");
  msgBox.scrollTop = msgBox.scrollHeight;`;

const newScroll = `  // Scroll chat box to bottom
  const msgBox = document.getElementById("chat-messages-box");
  msgBox.scrollTop = msgBox.scrollHeight;

  // Clear any existing chat polling interval
  if (window.ShivaayX_chatPollInterval) {
    clearInterval(window.ShivaayX_chatPollInterval);
  }

  // Poll backend database for Discord Admin messages every 3 seconds
  window.ShivaayX_chatPollInterval = setInterval(async () => {
    // If user navigated away, clear polling
    if (window.location.hash !== \`#/tickets/\${ticketId}\`) {
      clearInterval(window.ShivaayX_chatPollInterval);
      return;
    }

    try {
      const res = await fetch(\`\${getApiUrl()}/api/tickets/\${ticketId}/messages\`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.messages) {
          const freshTickets = JSON.parse(localStorage.getItem("ShivaayX_tickets"));
          const currentTicket = freshTickets.find(t => t.id === ticketId);
          if (!currentTicket) return;

          let hasNew = false;
          data.messages.forEach(srvMsg => {
            if (srvMsg.sender === 'admin') {
              const exists = currentTicket.messages.some(m => m.text === srvMsg.text && m.sender === 'bot');
              if (!exists) {
                currentTicket.messages.push({
                  sender: 'bot', // Appends as received message
                  text: srvMsg.text,
                  time: srvMsg.createdAt || new Date().toISOString()
                });
                hasNew = true;
              }
            }
          });

          if (hasNew) {
            localStorage.setItem("ShivaayX_tickets", JSON.stringify(freshTickets));
            
            const msgsBox = document.getElementById("chat-messages-box");
            const wasAtBottom = msgsBox ? (msgsBox.scrollHeight - msgsBox.clientHeight - msgsBox.scrollTop < 100) : false;
            
            let chatHtml = "";
            currentTicket.messages.forEach(m => {
              if (m.sender === "system") {
                const sysClass = m.type === "success" ? "chat-sys-success" : "chat-sys-lock";
                const icon = m.type === "success" ? "check-circle" : "lock";
                chatHtml += \`
                  <div class="chat-sys-msg \${sysClass}">
                    <i data-lucide="\${icon}" style="width: 14px; height: 14px;"></i>
                    <span>\${m.text}</span>
                  </div>
                \`;
              } else {
                const isSent = m.sender === "user";
                const senderClass = isSent ? "chat-msg-sent" : "chat-msg-received";
                const formattedTime = new Date(m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                chatHtml += \`
                  <div class="chat-msg \${senderClass}">
                    <div class="chat-bubble">\${m.text.replace(/\\n/g, "<br>")}</div>
                    <span class="chat-msg-time">\${formattedTime}</span>
                  </div>
                \`;
              }
            });
            
            if (msgsBox) {
              msgsBox.innerHTML = chatHtml;
              lucide.createIcons();
              if (wasAtBottom) {
                msgsBox.scrollTop = msgsBox.scrollHeight;
              }
            }
          }
        }
      }
    } catch (err) {
      console.error("Chat polling error:", err);
    }
  }, 3000);`;

if (appContent.includes(oldScroll)) {
  appContent = appContent.replace(oldScroll, newScroll);
  console.log("Successfully integrated polling loop for Discord replies!");
} else {
  console.log("WARNING: Scroll and event bindings match failed!");
}

fs.writeFileSync(appPath, appContent, 'utf8');
