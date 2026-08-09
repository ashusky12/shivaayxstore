const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'app.js');
let appContent = fs.readFileSync(appPath, 'utf8');

// Target the start of innerHTML in renderAccountDetails
const oldStart = `    <div class="shell section-py" style="padding-top: 2rem;">
      <!-- Breadcrumbs -->`;

const newStart = `    <div class="shell section-py" style="padding-top: 2rem; padding-bottom: 6rem;">
      <!-- Breadcrumbs -->`;

if (appContent.includes(oldStart)) {
  appContent = appContent.replace(oldStart, newStart);
}

// Target the end of innerHTML in renderAccountDetails
const oldEnd = `        <!-- Item 3: Info & Specifications Section -->
        <div class="detail-info-section">`;

// Let's replace the template string closing part to insert the mobile-sticky-bar
const oldEndFull = `          <!-- Rare items tags list -->
          <section style="margin-top: 2.25rem;">
            <h3 style="font-size: 1rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-ink-300); margin-bottom: 0.75rem;">Rare items included</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
              \${rareItemsHtml}
            </div>
          </section>
        </div>
      </div>
    </div>
  \`;`;

const newEndFull = `          <!-- Rare items tags list -->
          <section style="margin-top: 2.25rem;">
            <h3 style="font-size: 1rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-ink-300); margin-bottom: 0.75rem;">Rare items included</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
              \${rareItemsHtml}
            </div>
          </section>
        </div>
      </div>

      <!-- Sticky Mobile Bottom Bar -->
      <div class="mobile-sticky-bar">
        <div class="sticky-bar-info">
          <span class="sticky-bar-label">Total Price</span>
          <span class="sticky-bar-val">₹\${listing.price.toLocaleString("en-IN")}</span>
        </div>
        <button class="btn btn-primary sticky-bar-btn" id="sticky-inquire-btn">
          <i data-lucide="message-square"></i> Inquire Now
        </button>
      </div>
    </div>
  \`;`;

if (appContent.includes(oldEndFull)) {
  appContent = appContent.replace(oldEndFull, newEndFull);
  console.log("Successfully inserted mobile-sticky-bar markup!");
} else {
  console.log("WARNING: End markup not matched!");
}

// Target the inquiry trigger click handler
const oldTrigger = `  // Inquiry ticket trigger
  const inquireBtn = document.getElementById("inquire-btn");
  if (inquireBtn) {
    inquireBtn.addEventListener("click", () => {
      if (!currentUser) {
        showToast("Please register or log in to create a purchase ticket.", "error");
        openAuthModal("login-modal");
      } else {
        createTicketFlow(listing);
      }
    });
  }`;

const newTrigger = `  // Inquiry ticket trigger
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

if (appContent.includes(oldTrigger)) {
  appContent = appContent.replace(oldTrigger, newTrigger);
  console.log("Successfully inserted stickyInquireBtn event listener!");
} else {
  // Try matching updated trigger (without login check since we cleaned it earlier)
  const oldTriggerSimplified = `  // Inquiry ticket trigger
  const inquireBtn = document.getElementById("inquire-btn");
  if (inquireBtn) {
    inquireBtn.addEventListener("click", () => {
      createTicketFlow(listing);
    });
  }`;
  if (appContent.includes(oldTriggerSimplified)) {
    appContent = appContent.replace(oldTriggerSimplified, newTrigger);
    console.log("Successfully inserted stickyInquireBtn event listener (simplified match)!");
  } else {
    console.log("WARNING: Inquiry trigger click handler not matched!");
  }
}

fs.writeFileSync(appPath, appContent, 'utf8');
