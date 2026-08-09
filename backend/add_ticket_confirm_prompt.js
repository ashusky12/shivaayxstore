const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'app.js');
let appContent = fs.readFileSync(appPath, 'utf8');

// 1. Update the click event handlers in renderAccountDetails
const oldListeners = `  // Inquiry ticket trigger
  const inquireBtn = document.getElementById("inquire-btn");
  if (inquireBtn) {
    inquireBtn.addEventListener("click", () => {
      createTicketFlow(listing);
    });
  }

  // Sticky Bottom Bar Inquiry trigger
  const stickyInquireBtn = document.getElementById("sticky-inquire-btn");
  if (stickyInquireBtn) {
    stickyInquireBtn.addEventListener("click", () => {
      createTicketFlow(listing);
    });
  }`;

const newListeners = `  // Inquiry ticket trigger
  const inquireBtn = document.getElementById("inquire-btn");
  if (inquireBtn) {
    inquireBtn.addEventListener("click", () => {
      promptTicketConfirmation(listing);
    });
  }

  // Sticky Bottom Bar Inquiry trigger
  const stickyInquireBtn = document.getElementById("sticky-inquire-btn");
  if (stickyInquireBtn) {
    stickyInquireBtn.addEventListener("click", () => {
      promptTicketConfirmation(listing);
    });
  }`;

if (appContent.includes(oldListeners)) {
  appContent = appContent.replace(oldListeners, newListeners);
  console.log("Successfully replaced inquireBtn and stickyInquireBtn listeners!");
} else {
  console.log("WARNING: inquireBtn and stickyInquireBtn match failed!");
}

// 2. Add promptTicketConfirmation and closeTicketConfirmModal helper functions at the end of app.js
const appendCode = `

// --- TICKET CONFIRMATION MODAL LOGIC ---
window.closeTicketConfirmModal = function() {
  const modal = document.getElementById("ticket-confirm-modal");
  if (modal) modal.classList.remove("active");
};

function promptTicketConfirmation(listing) {
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
    modal.classList.add("active");
    
    // Bind Lucide icons for the modal
    lucide.createIcons();
    
    const confirmBtn = document.getElementById("confirm-ticket-btn");
    if (confirmBtn) {
      confirmBtn.onclick = () => {
        modal.classList.remove("active");
        createTicketFlow(listing);
      };
    }
  } else {
    // Failsafe: if modal element is not in DOM, proceed directly
    createTicketFlow(listing);
  }
}`;

appContent += appendCode;
console.log("Appended promptTicketConfirmation logic to the end of app.js!");

fs.writeFileSync(appPath, appContent, 'utf8');
