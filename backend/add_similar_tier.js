const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'app.js');
let appContent = fs.readFileSync(appPath, 'utf8');

// Target the rare items loop block in renderAccountDetails
const oldRareBlock = `  // Setup rare items tags
  let rareItemsHtml = "";
  listing.rareItems.forEach(item => {
    rareItemsHtml += \`
      <span class="rare-item-tag">
        <i data-lucide="star"></i>
        \${item}
      </span>
    \`;
  });`;

const newRareBlock = `  // Setup rare items tags
  let rareItemsHtml = "";
  listing.rareItems.forEach(item => {
    rareItemsHtml += \`
      <span class="rare-item-tag">
        <i data-lucide="star"></i>
        \${item}
      </span>
    \`;
  });

  // Filter other available listings of similar tier/rarity
  const similarListings = listings.filter(l => l.id !== listing.id && l.status === "available");
  
  // Sort them so that listings with the same rarity rank higher
  similarListings.sort((a, b) => {
    if (a.rarity === listing.rarity && b.rarity !== listing.rarity) return -1;
    if (b.rarity === listing.rarity && a.rarity !== listing.rarity) return 1;
    return 0;
  });
  
  // Take top 3 listings
  const recommendedListings = similarListings.slice(0, 3);
  
  let similarListingsHtml = "";
  recommendedListings.forEach(l => {
    similarListingsHtml += renderListingCardMarkup(l);
  });`;

if (appContent.includes(oldRareBlock)) {
  appContent = appContent.replace(oldRareBlock, newRareBlock);
  console.log("Successfully inserted similar listings calculation logic!");
} else {
  console.log("WARNING: Rare items loop block not matched!");
}

// Target the bottom of the template markup to insert Similar Tier section
const oldMarkupEnd = `      <!-- Sticky Mobile Bottom Bar -->
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

const newMarkupEnd = `      </div>

      <!-- Similar Tier Recommendations -->
      <section style="margin-top: 3.5rem; border-top: 1px solid var(--color-surface-line); padding-top: 2.5rem; margin-bottom: 2rem;">
        <div style="margin-bottom: 1.5rem;">
          <p class="eyebrow" style="color: var(--color-blood); font-weight: bold; text-transform: uppercase;">Similar Tier</p>
          <h2 class="section-title" style="margin-top: 0.125rem;">You may also like</h2>
        </div>
        <div class="listings-grid">
          \${similarListingsHtml}
        </div>
      </section>

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

if (appContent.includes(oldMarkupEnd)) {
  appContent = appContent.replace(oldMarkupEnd, newMarkupEnd);
  console.log("Successfully inserted Similar Tier markup section!");
} else {
  // Let's do a double check of the target end block to see if minor space/tabs mismatch
  console.log("WARNING: Markup end not matched! Let's search for closing tag of detail-layout.");
}

fs.writeFileSync(appPath, appContent, 'utf8');
