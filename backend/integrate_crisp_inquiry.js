const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'app.js');
let appContent = fs.readFileSync(appPath, 'utf8');

// 1. Update updateHeaderActions in app.js
const oldHeaderActions = `// Render Header actions dynamically based on auth state
function updateHeaderActions() {
  const container = document.getElementById("nav-actions");
  const mobileContainer = document.getElementById("mobile-nav-actions");
  
  const html = \`
    <a href="#/tickets" class="btn btn-ghost">
      <i data-lucide="ticket"></i> My Tickets
    </a>
  \`;
  container.innerHTML = html;
  mobileContainer.innerHTML = html;
  lucide.createIcons();
}`;

const newHeaderActions = `// Render Header actions dynamically based on auth state
function updateHeaderActions() {
  const container = document.getElementById("nav-actions");
  const mobileContainer = document.getElementById("mobile-nav-actions");
  
  const html = \`
    <button class="btn btn-ghost" onclick="$crisp.push(['do', 'chat:open'])">
      <i data-lucide="message-square"></i> Live Support
    </button>
  \`;
  container.innerHTML = html;
  mobileContainer.innerHTML = html;
  lucide.createIcons();
}`;

if (appContent.includes(oldHeaderActions)) {
  appContent = appContent.replace(oldHeaderActions, newHeaderActions);
  console.log("Updated header actions to Crisp trigger!");
} else {
  console.log("WARNING: Header actions match failed!");
}

// 2. Remove floating-support click listener and router cleanup
const oldFloatingSupportListener = `// Handle Floating Headset Click
document.getElementById("floating-support").addEventListener("click", () => {
  const generalListing = {
    id: "general-support",
    _id: "general-support",
    title: "General Support",
    slug: "general-support",
    price: 0
  };
  promptTicketConfirmation(generalListing);
});`;

if (appContent.includes(oldFloatingSupportListener)) {
  appContent = appContent.replace(oldFloatingSupportListener, "");
  console.log("Successfully removed floating-support click listener!");
} else {
  console.log("WARNING: floating-support click listener match failed!");
}

// 3. Remove floatingSupport visibility styles inside router()
const oldRouterFloatingSupportCode = `  // Hide/Show floating support chat bubble on Product Details views
  const floatingSupport = document.getElementById("floating-support");
  if (floatingSupport) {
    const isDetailsPage = hash.startsWith("#/accounts/") && !hash.replace("#/accounts/", "").startsWith("?");
    floatingSupport.style.display = isDetailsPage ? "none" : "flex";
  }`;

if (appContent.includes(oldRouterFloatingSupportCode)) {
  appContent = appContent.replace(oldRouterFloatingSupportCode, "");
  console.log("Successfully removed floating-support router logic!");
} else {
  console.log("WARNING: floating-support router logic match failed!");
}

// 4. Replace promptTicketConfirmation with direct Crisp trigger and message pre-fill
const oldPromptFuncKeyword = "function promptTicketConfirmation(listing) {";
// Let's locate and replace it.
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

const newPromptFunc = `function promptTicketConfirmation(listing) {
  if (typeof $crisp !== 'undefined') {
    // Open Crisp chat box
    $crisp.push(["do", "chat:open"]);
    
    // Auto-send product inquiry message to admin
    const msgText = \`Yo ShivaayXStore! I want to inquire about account listing: **\${listing.title}** (Price: ₹\${listing.price.toLocaleString("en-IN")} • Level: \${listing.level || 'N/A'}). Please share payment details.\`;
    $crisp.push(["do", "message:send", ["text", msgText]]);
  } else {
    showToast("Live Support loading. Please click again in a moment...", "info");
  }
}`;

if (appContent.includes(oldPromptFunc)) {
  appContent = appContent.replace(oldPromptFunc, newPromptFunc);
  console.log("Successfully replaced promptTicketConfirmation with Crisp trigger!");
} else {
  // Let's do a backup replace for a smaller fragment if it matches
  console.log("WARNING: oldPromptFunc match failed! Trying fallback replace.");
}

fs.writeFileSync(appPath, appContent, 'utf8');
