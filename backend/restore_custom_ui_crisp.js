const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'app.js');
let appContent = fs.readFileSync(appPath, 'utf8');

// 1. Add Crisp hide on startup and closed listener at the very beginning of app.js (e.g. after let currentUser)
const targetInitPoint = `// Current session user
let currentUser = { id: "guest_session", username: "Buyer", email: "buyer@shivaayxstore.in" };`;

const crispInitCode = `// Current session user
let currentUser = { id: "guest_session", username: "Buyer", email: "buyer@shivaayxstore.in" };

// Hide Crisp widget on page load, only show it when triggered by our custom buttons
if (typeof $crisp !== 'undefined') {
  $crisp.push(["do", "chat:hide"]);
  $crisp.push(["on", "chat:closed", () => {
    $crisp.push(["do", "chat:hide"]);
  }]);
}`;

if (appContent.includes(targetInitPoint)) {
  appContent = appContent.replace(targetInitPoint, crispInitCode);
  console.log("Successfully added Crisp startup hide listener!");
} else {
  console.log("WARNING: targetInitPoint match failed!");
}

// 2. Add floating support button visibility check inside router()
const oldRouterStart = `function router() {
  const hash = window.location.hash || "#/";`;

const newRouterStart = `function router() {
  const hash = window.location.hash || "#/";
  
  // Hide/Show floating support chat bubble on Product Details views
  const floatingSupport = document.getElementById("floating-support");
  if (floatingSupport) {
    const isDetailsPage = hash.startsWith("#/accounts/") && !hash.replace("#/accounts/", "").startsWith("?");
    floatingSupport.style.display = isDetailsPage ? "none" : "flex";
  }`;

if (appContent.includes(oldRouterStart)) {
  appContent = appContent.replace(oldRouterStart, newRouterStart);
  console.log("Successfully restored floating-support visibility inside router!");
} else {
  console.log("WARNING: oldRouterStart match failed!");
}

// 3. Add floating headset click listener and window close modal helpers
const oldHeaderActionsCode = `// Render Header actions dynamically based on auth state
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

const newHeaderActionsAndHeadsetListeners = `// Render Header actions dynamically based on auth state
function updateHeaderActions() {
  const container = document.getElementById("nav-actions");
  const mobileContainer = document.getElementById("mobile-nav-actions");
  
  const html = \`
    <button class="btn btn-ghost" id="btn-header-support">
      <i data-lucide="message-square"></i> Live Support
    </button>
  \`;
  container.innerHTML = html;
  mobileContainer.innerHTML = html;
  lucide.createIcons();

  const headerSupportBtn = document.getElementById("btn-header-support");
  if (headerSupportBtn) {
    headerSupportBtn.addEventListener("click", () => {
      triggerGeneralSupportConfirm();
    });
  }
}

// Handle Floating Headset Click
document.getElementById("floating-support").addEventListener("click", () => {
  triggerGeneralSupportConfirm();
});

function triggerGeneralSupportConfirm() {
  const generalListing = {
    id: "general-support",
    _id: "general-support",
    title: "General Support",
    slug: "general-support",
    price: 0
  };
  promptTicketConfirmation(generalListing);
}

window.closeTicketConfirmModal = function() {
  const modal = document.getElementById("ticket-confirm-modal");
  if (modal) modal.classList.remove("open");
};`;

if (appContent.includes(oldHeaderActionsCode)) {
  appContent = appContent.replace(oldHeaderActionsCode, newHeaderActionsAndHeadsetListeners);
  console.log("Successfully restored custom headset listeners and modal closing function!");
} else {
  console.log("WARNING: oldHeaderActionsCode match failed!");
}

// 4. Update promptTicketConfirmation in app.js to open our confirm modal
// When they click confirm inside our modal, we open Crisp and send the pre-filled message!
const oldPromptFunc = `function promptTicketConfirmation(listing) {
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

const newPromptFunc = `function promptTicketConfirmation(listing) {
  const modal = document.getElementById("ticket-confirm-modal");
  if (modal) {
    modal.classList.add("open");
    lucide.createIcons();
    
    const confirmBtn = document.getElementById("confirm-ticket-btn");
    if (confirmBtn) {
      confirmBtn.onclick = () => {
        modal.classList.remove("open");
        
        if (typeof $crisp !== 'undefined') {
          // Unhide, open and focus the Crisp chat widget
          $crisp.push(["do", "chat:show"]);
          $crisp.push(["do", "chat:open"]);
          
          // Send pre-filled message if it's a specific product inquiry (not general-support)
          if (listing.id !== 'general-support') {
            const msgText = \`Yo ShivaayXStore! I want to inquire about account listing: **\${listing.title}** (Price: ₹\${listing.price.toLocaleString("en-IN")} • Level: \${listing.level || 'N/A'}). Please share payment details.\`;
            $crisp.push(["do", "message:send", ["text", msgText]]);
          }
        } else {
          showToast("Live Support Widget loading. Please try again...", "info");
        }
      };
    }
  } else {
    // Failsafe: if our custom modal is not present, open Crisp directly
    if (typeof $crisp !== 'undefined') {
      $crisp.push(["do", "chat:show"]);
      $crisp.push(["do", "chat:open"]);
    }
  }
}`;

if (appContent.includes(oldPromptFunc)) {
  appContent = appContent.replace(oldPromptFunc, newPromptFunc);
  console.log("Successfully integrated Crisp activation inside custom confirmation modal!");
} else {
  console.log("WARNING: oldPromptFunc match failed!");
}

fs.writeFileSync(appPath, appContent, 'utf8');
