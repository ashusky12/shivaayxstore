const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'app.js');
let appContent = fs.readFileSync(appPath, 'utf8');

// 1. Initialize messages array to completely empty inside createTicketFlow
const oldTicketObj = `    messages: [
      {
        sender: "bot",
        text: \`Yo \${currentUser.username}! ShivaayXStore me aapka welcome hai. Aapne **\${listing.title}** (Price: ₹\${listing.price.toLocaleString("en-IN")}) ke liye ticket open kiya hai.\\n\\nKya aap is ID ko lock karke payment details lena chahte hain?\`,
        time: new Date().toISOString()
      }
    ],
    stage: 1 // Stage 1: Negotiating/Greet`;

const newTicketObj = `    messages: [],
    stage: 1`;

if (appContent.includes(oldTicketObj)) {
  appContent = appContent.replace(oldTicketObj, newTicketObj);
  console.log("Successfully initialized tickets messages to empty array!");
} else {
  console.log("WARNING: app.js oldTicketObj match failed!");
}

// 2. Remove shortcut HTML rendering and simplify header in renderSingleTicket
const oldHeaderAndShortcuts = `  // Render input panel based on stage
  let inputBarHtml = "";
  if (ticket.status === "closed") {
    inputBarHtml = \`
      <p style="text-align: center; font-size: 0.8125rem; color: var(--color-ink-400);">This ticket has been resolved and is closed.</p>
    \`;
  } else {
    // Stage-based action shortcuts
    let shortcutHtml = "";
    if (ticket.stage === 1) {
      shortcutHtml = \`<button type="button" class="btn btn-ghost btn-sm" id="btn-agree-buy">Ha bhai, ID lock karke payment details do</button>\`;
    } else if (ticket.stage === 2) {
      shortcutHtml = \`<button type="button" class="btn btn-primary btn-sm" id="btn-simulate-pay"><i data-lucide="credit-card"></i> Simulate Payment (UPI ₹\${ticket.listingPrice.toLocaleString("en-IN")})</button>\`;
    } else if (ticket.stage === 3) {
      shortcutHtml = \`<button type="button" class="btn btn-ghost btn-sm" id="btn-request-logins">Handover login details de do</button>\`;
    }

    inputBarHtml = \`
      <div style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem; flex-wrap: wrap;">
        \${shortcutHtml}
      </div>
      <form class="chat-form" id="chat-input-form">
        <input type="text" class="form-control" placeholder="Type a message..." id="chat-input" required autocomplete="off">
        <button type="submit" class="btn btn-primary"><i data-lucide="send"></i></button>
      </form>
    \`;
  }

  appRoot.innerHTML = \`
    <div class="shell section-py" style="padding-top: 2rem; max-width: 768px;">
      <nav style="display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; font-size: 0.875rem; color: var(--color-ink-300); margin-bottom: 1.5rem;">
        <a href="#/tickets" style="color: var(--color-blood);">My Tickets</a>
        <i data-lucide="chevron-right" style="width: 14px; height: 14px;"></i>
        <span style="color: var(--color-ink-50);">Chat Thread</span>
      </nav>

      <div class="glass chat-container">
        <!-- Header -->
        <div class="chat-header">
          <div class="chat-title-wrapper">
            <h2 style="font-size: 1.125rem;">Purchase: \${ticket.listingTitle}</h2>
            <span class="chat-status">Status: active • Deal Stage: \${ticket.stage === 4 ? "Completed" : "In Progress"}</span>
          </div>`;

const newHeaderAndShortcuts = `  // Render input panel
  let inputBarHtml = "";
  if (ticket.status === "closed") {
    inputBarHtml = \`
      <p style="text-align: center; font-size: 0.8125rem; color: var(--color-ink-400);">This ticket has been resolved and is closed.</p>
    \`;
  } else {
    inputBarHtml = \`
      <form class="chat-form" id="chat-input-form">
        <input type="text" class="form-control" placeholder="Type a message..." id="chat-input" required autocomplete="off">
        <button type="submit" class="btn btn-primary"><i data-lucide="send"></i></button>
      </form>
    \`;
  }

  appRoot.innerHTML = \`
    <div class="shell section-py" style="padding-top: 2rem; max-width: 768px;">
      <nav style="display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; font-size: 0.875rem; color: var(--color-ink-300); margin-bottom: 1.5rem;">
        <a href="#/tickets" style="color: var(--color-blood);">My Tickets</a>
        <i data-lucide="chevron-right" style="width: 14px; height: 14px;"></i>
        <span style="color: var(--color-ink-50);">Chat Thread</span>
      </nav>

      <div class="glass chat-container">
        <!-- Header -->
        <div class="chat-header">
          <div class="chat-title-wrapper">
            <h2 style="font-size: 1.125rem;">Purchase: \${ticket.listingTitle}</h2>
            <span class="chat-status">Status: active</span>
          </div>`;

if (appContent.includes(oldHeaderAndShortcuts)) {
  appContent = appContent.replace(oldHeaderAndShortcuts, newHeaderAndShortcuts);
  console.log("Successfully removed shortcuts and cleaned header info!");
} else {
  console.log("WARNING: app.js oldHeaderAndShortcuts match failed!");
}

// 3. Remove shortcut button click listeners in renderSingleTicket
const oldShortcutListeners = `  // Action shortcuts
  const btnAgree = document.getElementById("btn-agree-buy");
  if (btnAgree) {
    btnAgree.addEventListener("click", () => {
      sendUserMessage("I want to proceed and purchase this account, lock the listing.");
    });
  }

  const btnPay = document.getElementById("btn-simulate-pay");
  if (btnPay) {
    btnPay.addEventListener("click", () => {
      sendUserMessage("Simulating payment of ₹" + ticket.listingPrice + " now...");
      simulatePaymentTrigger();
    });
  }

  const btnLogins = document.getElementById("btn-request-logins");
  if (btnLogins) {
    btnLogins.addEventListener("click", () => {
      sendUserMessage("Please send the handover logins and security recovery details.");
    });
  }

  // Send message helper`;

const newShortcutListeners = `  // Send message helper`;

if (appContent.includes(oldShortcutListeners)) {
  appContent = appContent.replace(oldShortcutListeners, newShortcutListeners);
  console.log("Successfully removed shortcut listeners!");
} else {
  console.log("WARNING: app.js oldShortcutListeners match failed!");
}

// 4. Remove simulateBotReply call inside sendUserMessage
const oldDelayCall = `    // Trigger simulated reply delay
    setTimeout(() => {
      simulateBotReply(text);
    }, 1200);`;

if (appContent.includes(oldDelayCall)) {
  appContent = appContent.replace(oldDelayCall, "");
  console.log("Successfully removed simulateBotReply delay call!");
} else {
  console.log("WARNING: app.js oldDelayCall match failed!");
}

// 5. Delete simulateBotReply function from app.js entirely
// The simulateBotReply function starts with "function simulateBotReply(userText) {" and goes until the end of that scope.
// Let's do a substring locate and slice.
const simulateStartKeyword = "  // Simulated Chatbot Support Team logic\n  function simulateBotReply(userText) {";
const simulateEndKeyword = "  // Simulate payment button shortcut logic"; // Starts the next logic block

if (appContent.includes(simulateStartKeyword) && appContent.includes(simulateEndKeyword)) {
  const startIndex = appContent.indexOf(simulateStartKeyword);
  const endIndex = appContent.indexOf(simulateEndKeyword);
  
  appContent = appContent.substring(0, startIndex) + appContent.substring(endIndex);
  console.log("Successfully deleted simulateBotReply function code entirely!");
} else {
  console.log("WARNING: simulateBotReply block index locate failed!");
}

fs.writeFileSync(appPath, appContent, 'utf8');
