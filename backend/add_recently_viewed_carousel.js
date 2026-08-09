const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'app.js');
let appContent = fs.readFileSync(appPath, 'utf8');

// Step 1: Update calculation logic for similarListings
const oldCalc = `  // Filter other available listings of similar tier/rarity
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

const newCalc = `  // Track viewed listings in localStorage
  let viewedListings = JSON.parse(localStorage.getItem("ShivaayX_viewedListings") || "[]");
  // Add current listing to viewed if not already there, and move it to the front
  viewedListings = viewedListings.filter(id => id !== listing.id);
  viewedListings.unshift(listing.id);
  // Limit to 8 items
  viewedListings = viewedListings.slice(0, 8);
  localStorage.setItem("ShivaayX_viewedListings", JSON.stringify(viewedListings));

  // Filter other available listings
  const availableListings = listings.filter(l => l.id !== listing.id && l.status === "available");
  
  // Sort listings: show recently viewed ones first!
  const recentlyViewedIds = viewedListings.filter(id => id !== listing.id);
  
  // Group 1: Available listings that have been viewed recently
  const recentlyViewedListings = availableListings.filter(l => recentlyViewedIds.includes(l.id));
  // Sort Group 1 by their order in recentlyViewedIds (most recent first!)
  recentlyViewedListings.sort((a, b) => recentlyViewedIds.indexOf(a.id) - recentlyViewedIds.indexOf(b.id));

  // Group 2: Other available listings (not viewed recently) sorted by rarity similarity
  const otherListings = availableListings.filter(l => !recentlyViewedIds.includes(l.id));
  otherListings.sort((a, b) => {
    if (a.rarity === listing.rarity && b.rarity !== listing.rarity) return -1;
    if (b.rarity === listing.rarity && a.rarity !== listing.rarity) return 1;
    return 0;
  });

  // Combine both groups (recently viewed first, then others) up to 6 items to make the slider rich
  const recommendedListings = [...recentlyViewedListings, ...otherListings].slice(0, 6);
  
  let similarListingsHtml = "";
  recommendedListings.forEach(l => {
    similarListingsHtml += renderListingCardMarkup(l);
  });`;

if (appContent.includes(oldCalc)) {
  appContent = appContent.replace(oldCalc, newCalc);
  console.log("Successfully updated recommendations logic!");
} else {
  console.log("WARNING: Recommendations calculation block not matched!");
}

// Step 2: Update the template class from listings-grid to horizontal-listings-slider
const oldTemplateSection = `          <div class="listings-grid">
            \${similarListingsHtml}
          </div>`;

const newTemplateSection = `          <div class="horizontal-listings-slider">
            \${similarListingsHtml}
          </div>`;

if (appContent.includes(oldTemplateSection)) {
  appContent = appContent.replace(oldTemplateSection, newTemplateSection);
  console.log("Successfully replaced listings-grid with horizontal-listings-slider class!");
} else {
  console.log("WARNING: Template section class wrapper not matched!");
}

fs.writeFileSync(appPath, appContent, 'utf8');
