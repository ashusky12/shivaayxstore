const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'app.js');
let appContent = fs.readFileSync(appPath, 'utf8');

// Step 1: Update renderListingCardMarkup to include product card unique ID
const oldCardTag = `<div class="glass listing-card animate-scale-in">`;
const newCardTag = `<div class="glass listing-card animate-scale-in" id="listing-card-\${listing.id}">`;

if (appContent.includes(oldCardTag)) {
  appContent = appContent.replace(oldCardTag, newCardTag);
  console.log("Successfully added ID tag to listing card markup!");
} else {
  console.log("WARNING: Card tag not matched!");
}

// Step 2: Overwrite the router() function completely in app.js
const oldRouterFunction = `function router() {
  window.scrollTo(0, 0);
  const hash = window.location.hash || "#/";
  
  // Highlight navigation link
  document.querySelectorAll(".nav-link, .mobile-nav-link").forEach(link => {
    const route = link.getAttribute("href");
    if (hash === route || (route !== "#/" && hash.startsWith(route))) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  // Basic Router Matcher
  if (hash === "#/") {
    routes.home();
    return;
  }
  
  if (hash.startsWith("#/accounts/")) {
    const slug = hash.replace("#/accounts/", "").split("?")[0];
    if (slug === "" || slug.startsWith("?")) {
      routes.accounts(hash);
    } else {
      routes["accounts/:slug"](slug);
    }
    return;
  }
  
  const cleanHash = hash.replace("#/", "").split("?")[0];
  if (routes[cleanHash]) {
    routes[cleanHash](hash);
  } else {
    // 404 page fallback
    appRoot.innerHTML = \`
      <div class="shell" style="padding-top: 6rem; padding-bottom: 6rem; text-align: center;">
        <h1 style="font-size: 6rem; color: rgba(255, 45, 70, 0.25);">404</h1>
        <h2 style="font-size: 2rem; margin-top: 1rem;">Page not found</h2>
        <p style="color: var(--color-ink-300); margin-top: 0.75rem; max-width: 400px; margin-inline: auto;">
          The listing may have been sold or the link is incorrect. Head back to explore our current stock.
        </p>
        <div style="margin-top: 2rem; display: flex; gap: 1rem; justify-content: center;">
          <a href="#/" class="btn btn-primary"><i data-lucide="home"></i> Go Home</a>
          <a href="#/accounts" class="btn btn-ghost"><i data-lucide="search"></i> Browse Catalog</a>
        </div>
      </div>
    \`;
    lucide.createIcons();
  }
}`;

const newRouterFunction = `function router() {
  const hash = window.location.hash || "#/";
  
  // Track scroll position when leaving Home or Browse to go to details
  const prevHash = sessionStorage.getItem("ShivaayX_prevHash") || "#/";
  if ((prevHash === "#/" || prevHash.startsWith("#/accounts")) && hash.startsWith("#/accounts/")) {
    const slug = hash.replace("#/accounts/", "").split("?")[0];
    if (slug && !slug.startsWith("?")) {
      sessionStorage.setItem("ShivaayX_lastActiveListingId", slug);
      sessionStorage.setItem("ShivaayX_lastScrollY", window.scrollY);
    }
  }
  sessionStorage.setItem("ShivaayX_prevHash", hash);

  let restoreScroll = false;
  const lastActiveListingId = sessionStorage.getItem("ShivaayX_lastActiveListingId");
  
  if ((hash === "#/" || hash.startsWith("#/accounts")) && lastActiveListingId) {
    restoreScroll = true;
  } else {
    window.scrollTo(0, 0);
  }
  
  // Highlight navigation link
  document.querySelectorAll(".nav-link, .mobile-nav-link").forEach(link => {
    const route = link.getAttribute("href");
    if (hash === route || (route !== "#/" && hash.startsWith(route))) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  // Basic Router Matcher
  if (hash === "#/") {
    routes.home();
  } else if (hash.startsWith("#/accounts/")) {
    const slug = hash.replace("#/accounts/", "").split("?")[0];
    if (slug === "" || slug.startsWith("?")) {
      routes.accounts(hash);
    } else {
      routes["accounts/:slug"](slug);
    }
  } else {
    const cleanHash = hash.replace("#/", "").split("?")[0];
    if (routes[cleanHash]) {
      routes[cleanHash](hash);
    } else {
      // 404 page fallback
      appRoot.innerHTML = \`
        <div class="shell" style="padding-top: 6rem; padding-bottom: 6rem; text-align: center;">
          <h1 style="font-size: 6rem; color: rgba(255, 45, 70, 0.25);">404</h1>
          <h2 style="font-size: 2rem; margin-top: 1rem;">Page not found</h2>
          <p style="color: var(--color-ink-300); margin-top: 0.75rem; max-width: 400px; margin-inline: auto;">
            The listing may have been sold or the link is incorrect. Head back to explore our current stock.
          </p>
          <div style="margin-top: 2rem; display: flex; gap: 1rem; justify-content: center;">
            <a href="#/" class="btn btn-primary"><i data-lucide="home"></i> Go Home</a>
            <a href="#/accounts" class="btn btn-ghost"><i data-lucide="search"></i> Browse Catalog</a>
          </div>
        </div>
      \`;
      lucide.createIcons();
    }
  }

  // Restore scroll position if back navigating
  if (restoreScroll) {
    setTimeout(() => {
      const card = document.getElementById(\`listing-card-\${lastActiveListingId}\`);
      if (card) {
        card.scrollIntoView({ behavior: "instant", block: "center" });
      } else {
        const lastScroll = parseInt(sessionStorage.getItem("ShivaayX_lastScrollY") || "0");
        window.scrollTo(0, lastScroll);
      }
      sessionStorage.removeItem("ShivaayX_lastActiveListingId");
      sessionStorage.removeItem("ShivaayX_lastScrollY");
    }, 100);
  }
}`;

if (appContent.includes(oldRouterFunction)) {
  appContent = appContent.replace(oldRouterFunction, newRouterFunction);
  console.log("Successfully refactored router() function with scroll restoration!");
} else {
  console.log("WARNING: router() function block not matched!");
}

fs.writeFileSync(appPath, appContent, 'utf8');
