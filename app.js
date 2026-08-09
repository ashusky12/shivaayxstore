/* ==========================================================================
   ShivaayXStore JS Logic, Routing and simulated database systems.
   ========================================================================== */

// --- Custom Mock Data Database ---
const MOCK_LISTINGS = [
  {
    id: "6a782b7581b71209f76e7d75",
    title: "RAFTAR - S8",
    slug: "raftar-s8",
    description: "SEASON 8 ELITEPASS | 8 YEARS OLD (10 DAYS LEFT) | AK MAX | RARE OLD COLLECTION. Stacked skins, mythic items and legendary weapon configurations verified.",
    price: 9999,
    originalPrice: null,
    level: 75,
    rank: "Bronze",
    region: "India",
    rarity: "mythic",
    status: "available",
    boundType: "google",
    badges: 35,
    likes: 16362,
    elitePasses: 28,
    evoGuns: 6,
    accountAgeYears: 8,
    primeLevel: 6,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Rick Roll or gameplay placeholder
    rareItems: [
      "Unseen Custodian Bundle", "Desert Forces Bundle", "Deadly Strike Bundle", 
      "Gaze Of Ancient Bundle", "The Elusive Soul Bundle", "Doomsday Raider Bundle", 
      "The Frosted Blue Bundle", "Ruby Demon Bundle", "Mercenary Bundle", 
      "Street Thug Bundle", "Zonbified Samurai Bundle", "Season 10 Heroic Shirt", 
      "Season 5 Gold Shirt", "Black Turtleneck", "Azure Stormbringer Bundle", 
      "Devil's Move Emote", "Shoot Dance Emote", "Flowers Of Love Emote", 
      "Draco's Summon Emote", "Mummy Dance Emote", "Furious Slam Emote", 
      "Top Criminal (Neon)", "Top Criminal (Red)", "Denim Dino", 
      "Ancient Wolf Bundle", "Sea Hunter - Crossbow"
    ],
    images: [
      "/uploads/screenshot_raftar.jpg",
      "/uploads/screenshot_butcher.jpg",
      "/uploads/screenshot_nox.jpg"
    ],
    views: 508,
    createdAt: "2026-08-09T07:25:41.219Z"
  },
  {
    id: "6a76e953216eb40435fb5e33",
    title: "BUTCHER - PRIME 8",
    slug: "butcher-prime-8",
    description: "PRIME 8 ID | 20 EVO WITH 5 EVO MAX AND 11 EVO 4+ LEVEL| 200+ DAYS MONTHLY & 190+ DAYS WEEKLY | RARE COLLECTION | 95 EMOTES | 10 ARRIVAL ANIMATIONS | 2 LOOK CHANGERS | SUSANO'O SUPER EMOTE",
    price: 14999,
    originalPrice: null,
    level: 71,
    rank: "Heroic",
    region: "India",
    rarity: "mythic",
    status: "reserved",
    boundType: "google",
    badges: 100,
    likes: 11000,
    elitePasses: 27,
    evoGuns: 20,
    accountAgeYears: 4,
    primeLevel: 8,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    rareItems: [
      "Nightmare Bundle", "Sweet Dream Bundle", "Ember Fracture Bundle", 
      "Satoru Gojo Bundle", "Molten Fury Bundle", "Beat Beast Bundle", 
      "The Sunscorch Priest Bundle", "Rampage Event", "Ryomen Sukuna Bundle", 
      "Madara Bundle", "Fluorescent Angelis Pants", "Top Criminal (Ghost)", 
      "Top Criminal (Yellow)"
    ],
    images: [
      "/uploads/screenshot_butcher.jpg",
      "/uploads/screenshot_raftar.jpg",
      "/uploads/screenshot_nox.jpg"
    ],
    views: 409,
    createdAt: "2026-08-08T08:31:15.727Z"
  },
  {
    id: "6a7621ee3736cb418af94a82",
    title: "NOX - PRIME 6",
    slug: "nox-prime-6",
    description: "Free fire old and rare account with high level and good collection. Features the classic S1 HipHop items and maxed AK guns.",
    price: 5999,
    originalPrice: null,
    level: 80,
    rank: "Elite Heroic",
    region: "India",
    rarity: "legendary",
    status: "reserved",
    boundType: "google",
    badges: 6,
    likes: 34000,
    elitePasses: 0,
    evoGuns: 4,
    accountAgeYears: 6,
    primeLevel: 6,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    rareItems: [
      "Elite Pass Legacy", "Dragon AK", "Cobra MP40", "Sakura Mask", "HipHop Hat"
    ],
    images: [
      "/uploads/screenshot_nox.jpg",
      "/uploads/screenshot_raftar.jpg",
      "/uploads/screenshot_butcher.jpg"
    ],
    views: 458,
    createdAt: "2026-08-07T18:20:30.517Z"
  },
  {
    id: "6a7621ee3736cb418af94a99",
    title: "ZEUS - HYPER 7",
    slug: "zeus-hyper-7",
    description: "HYPERBOOK MAXED | COBRA MP40 LEVEL 5 | STACKED ACCOUNT. Perfect for competitive players seeking maximum advantage.",
    price: 7499,
    originalPrice: 8999,
    level: 73,
    rank: "Grandmaster",
    region: "India",
    rarity: "legendary",
    status: "available",
    boundType: "facebook",
    badges: 45,
    likes: 12000,
    elitePasses: 15,
    evoGuns: 8,
    accountAgeYears: 5,
    primeLevel: 7,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    rareItems: [
      "Cyber Cobra Bundle", "Venom Touch M1014", "Golden Blade Katana", "Rampage Hyperbook"
    ],
    images: [
      "/uploads/screenshot_butcher.jpg",
      "/uploads/screenshot_nox.jpg",
      "/uploads/screenshot_raftar.jpg"
    ],
    views: 290,
    createdAt: "2026-08-06T12:10:00.000Z"
  }
];

// Initialize local DB structures if not exists
if (!localStorage.getItem("ShivaayX_listings")) {
  localStorage.setItem("ShivaayX_listings", JSON.stringify(MOCK_LISTINGS));
}

// Helper to get fresh data
function getListings() {
  return JSON.parse(localStorage.getItem("ShivaayX_listings"));
}

function saveListings(listings) {
  localStorage.setItem("ShivaayX_listings", JSON.stringify(listings));
}

// Helper to resolve API host dynamically for Local Dev and Vercel Production
function getApiUrl() {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000';
  }
  return window.location.origin;
}

// Fetch database products from MongoDB server and update local cache
async function syncListingsWithServer() {
  try {
    const response = await fetch(`${getApiUrl()}/api/listings`);
    if (response.ok) {
      const serverListings = await response.json();
      if (serverListings && serverListings.length > 0) {
        localStorage.setItem("ShivaayX_listings", JSON.stringify(serverListings));
        // Refresh catalog/home page display
        if (typeof router === 'function') {
          router();
        }
      }
    }
  } catch (err) {
    console.log("MongoDB Server offline: Using local cache mode.");
  }
}

// Run synchronization
syncListingsWithServer();

// Initialise auth and ticket databases
if (!localStorage.getItem("ShivaayX_users")) {
  localStorage.setItem("ShivaayX_users", JSON.stringify([]));
}
// Force clear tickets once for testing
localStorage.setItem("ShivaayX_tickets", JSON.stringify([]));

// Current session user
let currentUser = { id: "guest_session", username: "Buyer", email: "buyer@shivaayxstore.in" };

// --- Global UI State & Helpers ---
const appRoot = document.getElementById("app-root");
const siteHeader = document.getElementById("site-header");
const menuToggle = document.getElementById("menu-toggle");
const mobileNav = document.getElementById("mobile-nav");
const spotlight = document.getElementById("spotlight");

// Spotlight Cursor Follower
document.addEventListener("mousemove", (e) => {
  spotlight.style.left = `${e.clientX}px`;
  spotlight.style.top = `${e.clientY}px`;
});

// Sticky Header Styling on Scroll
window.addEventListener("scroll", () => {
  if (window.scrollY > 20) {
    siteHeader.classList.add("scrolled");
  } else {
    siteHeader.classList.remove("scrolled");
  }
});

// Mobile Hamburger toggle
menuToggle.addEventListener("click", () => {
  mobileNav.classList.toggle("open");
  const icon = menuToggle.querySelector("i");
  if (mobileNav.classList.contains("open")) {
    icon.setAttribute("data-lucide", "x");
  } else {
    icon.setAttribute("data-lucide", "menu");
  }
  lucide.createIcons();
});

// Close Mobile Nav when clicking a link
document.querySelectorAll(".mobile-nav-link").forEach(link => {
  link.addEventListener("click", () => {
    mobileNav.classList.remove("open");
    menuToggle.querySelector("i").setAttribute("data-lucide", "menu");
    lucide.createIcons();
  });
});

// Custom Toasts Notification System
function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  
  const iconName = type === "success" ? "check-circle" : "alert-triangle";
  toast.innerHTML = `
    <i data-lucide="${iconName}"></i>
    <span>${message}</span>
  `;
  container.appendChild(toast);
  lucide.createIcons();
  
  setTimeout(() => {
    toast.style.animation = "toastEnter 0.3s cubic-bezier(0.16, 1, 0.3, 1) reverse forwards";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// --- Auth Utilities ---
function openAuthModal(modalId) {
  document.getElementById(modalId).classList.add("open");
}

window.closeAuthModals = function() {
  document.getElementById("login-modal").classList.remove("open");
  document.getElementById("register-modal").classList.remove("open");
};

window.switchToRegister = function() {
  document.getElementById("login-modal").classList.remove("open");
  document.getElementById("register-modal").classList.add("open");
};

window.switchToLogin = function() {
  document.getElementById("register-modal").classList.remove("open");
  document.getElementById("login-modal").classList.add("open");
};

// Handle Login Form Submit
document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;
  
  const users = JSON.parse(localStorage.getItem("ShivaayX_users"));
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    currentUser = { username: user.username, email: user.email };
    localStorage.setItem("ShivaayX_session", JSON.stringify(currentUser));
    closeAuthModals();
    updateHeaderActions();
    showToast(`Welcome back, ${user.username}!`);
    router(); // Re-render current page to reflect login
  } else {
    showToast("Invalid credentials. Try again or register.", "error");
  }
});

// Handle Register Form Submit
document.getElementById("register-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("register-username").value.trim();
  const email = document.getElementById("register-email").value.trim();
  const password = document.getElementById("register-password").value;
  
  const users = JSON.parse(localStorage.getItem("ShivaayX_users"));
  if (users.some(u => u.email === email)) {
    showToast("Email already registered.", "error");
    return;
  }
  
  users.push({ username, email, password });
  localStorage.setItem("ShivaayX_users", JSON.stringify(users));
  
  currentUser = { username, email };
  localStorage.setItem("ShivaayX_session", JSON.stringify(currentUser));
  closeAuthModals();
  updateHeaderActions();
  showToast(`Account created successfully! Welcome, ${username}`);
  router(); // Re-render
});



// Render Header actions dynamically based on auth state
function updateHeaderActions() {
  const container = document.getElementById("nav-actions");
  const mobileContainer = document.getElementById("mobile-nav-actions");
  
  const html = `
    <a href="#/tickets" class="btn btn-ghost">
      <i data-lucide="ticket"></i> My Tickets
    </a>
  `;
  container.innerHTML = html;
  mobileContainer.innerHTML = html;
  lucide.createIcons();
}

// Handle Floating Headset Click
document.getElementById("floating-support").addEventListener("click", () => {
  window.location.hash = "#/tickets";
});


// --- Router & Page Renderers ---
const routes = {
  home: renderHome,
  accounts: renderAccounts,
  "accounts/:slug": renderAccountDetails,
  "how-it-works": renderHowItWorks,
  faq: renderFaq,
  tickets: renderTickets,
  admin: renderAdmin,
  terms: renderTerms,
  privacy: renderPrivacy,
  "refund-policy": renderRefundPolicy,
  login: () => openAuthModal("login-modal"),
  register: () => openAuthModal("register-modal")
};

function router() {
  const hash = window.location.hash || "#/";
  
  // Hide/Show floating support chat bubble on Product Details views
  const floatingSupport = document.getElementById("floating-support");
  if (floatingSupport) {
    const isDetailsPage = hash.startsWith("#/accounts/") && !hash.replace("#/accounts/", "").startsWith("?");
    floatingSupport.style.display = isDetailsPage ? "none" : "flex";
  }
  
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
  
  const isCatalogPage = hash === "#/" || hash === "#/accounts" || hash.startsWith("#/accounts?");
  if (isCatalogPage && lastActiveListingId) {
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
  } else if (hash.startsWith("#/tickets/")) {
    routes.tickets(hash);
  } else {
    const cleanHash = hash.replace("#/", "").split("?")[0];
    if (routes[cleanHash]) {
      routes[cleanHash](hash);
    } else {
      // 404 page fallback
      appRoot.innerHTML = `
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
      `;
      lucide.createIcons();
    }
  }

  // Restore scroll position if back navigating
  if (restoreScroll) {
    setTimeout(() => {
      const card = document.getElementById(`listing-card-${lastActiveListingId}`);
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
}

// Listen to Hash Changes
window.addEventListener("hashchange", router);
window.addEventListener("load", () => {
  updateHeaderActions();
  router();
});


// --- Render Functions ---

// 1. HOME PAGE
function renderHome() {
  const listings = getListings();
  const availableCount = listings.filter(l => l.status === "available").length;
  const featuredListings = listings.slice(0, 3);
  
  let featuredGridHtml = "";
  featuredListings.forEach(l => {
    featuredGridHtml += renderListingCardMarkup(l);
  });

  appRoot.innerHTML = `
    <!-- Hero Banner -->
    <section class="hero-section section-py">
      <div class="hero-glow"></div>
      <div class="shell">
        <div class="hero-badge animate-fade-in-up">
          <i data-lucide="sparkles"></i>
          <span>${availableCount} verified accounts in stock right now</span>
        </div>
        <h1 class="hero-title animate-fade-in-up delay-100">
          Rare Free Fire IDs,<br>
          <span class="glow-text">Proof On Every Listing</span>
        </h1>
        <p class="hero-desc animate-fade-in-up delay-200">
          Season 8 Hip-Hop, Sakura, stacked weapon configurations, and rare Evo guns. 10+ screenshots and inventory video details on every listing before you make a transaction.
        </p>
        <div class="hero-actions animate-fade-in-up delay-300">
          <a href="#/accounts" class="btn btn-primary">
            Browse Accounts <i data-lucide="arrow-right"></i>
          </a>
          <a href="#/how-it-works" class="btn btn-ghost">How It Works</a>
        </div>
        
        <div class="hero-stats animate-fade-in-up delay-400">
          <div class="stat-item">
            <p class="stat-num">240+</p>
            <p class="stat-label">Accounts Delivered</p>
          </div>
          <div class="stat-item">
            <p class="stat-num">4.9/5</p>
            <p class="stat-label">Buyer Rating</p>
          </div>
          <div class="stat-item">
            <p class="stat-num">&lt;10 min</p>
            <p class="stat-label">Avg. Reply Time</p>
          </div>
        </div>

        <div class="hero-checks animate-fade-in-up delay-500">
          <span class="check-item"><i data-lucide="shield-check" style="color: #34d399;"></i> Hand-Verified Screenshots</span>
          <span class="check-item"><i data-lucide="zap" style="color: #fbbf24;"></i> Direct Support Ticket Chat</span>
        </div>
      </div>
    </section>

    <!-- Featured Stock -->
    <section class="shell section-py featured-section" style="border-top: 1px solid var(--color-surface-line);">
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <p class="eyebrow">Fresh Stock</p>
          <h2 class="section-title">Featured Accounts</h2>
        </div>
        <a href="#/accounts" class="btn btn-ghost btn-sm">
          View All <i data-lucide="arrow-right"></i>
        </a>
      </div>
      <div class="listings-grid">
        ${featuredGridHtml}
      </div>
    </section>

    <!-- How Buying Works -->
    <section class="shell section-py" style="border-top: 1px solid var(--color-surface-line);">
      <div style="text-align: center; margin-bottom: 3rem;">
        <p class="eyebrow">Simple Process</p>
        <h2 class="section-title">How Buying Works</h2>
        <p style="color: var(--color-ink-300); max-w: 480px; margin-inline: auto; font-size: 0.875rem; margin-top: 0.5rem;">
          Four simple steps from browsing to secure handover. Start a ticket thread directly when you find the perfect account.
        </p>
      </div>
      <div class="process-grid">
        <div class="glass process-card">
          <span class="process-step">01</span>
          <span class="process-icon"><i data-lucide="search"></i></span>
          <h3 class="process-title">Browse Freely</h3>
          <p class="process-text">No signup needed to explore details, check item lists and screenshot galleries.</p>
        </div>
        <div class="glass process-card">
          <span class="process-step">02</span>
          <span class="process-icon"><i data-lucide="message-square"></i></span>
          <h3 class="process-title">Raise a Ticket</h3>
          <p class="process-text">Create a free account to open a chat. Ask for custom video clips or lobby verification.</p>
        </div>
        <div class="glass process-card">
          <span class="process-step">03</span>
          <span class="process-icon"><i data-lucide="credit-card"></i></span>
          <h3 class="process-title">Lock and Pay</h3>
          <p class="process-text">Once terms are agreed, we lock the ID to reserved status and share secure billing.</p>
        </div>
        <div class="glass process-card">
          <span class="process-step">04</span>
          <span class="process-icon"><i data-lucide="package-check"></i></span>
          <h3 class="process-title">Secure Handover</h3>
          <p class="process-text">Receive account logins and recovery credentials directly in your encrypted thread.</p>
        </div>
      </div>
    </section>

    <!-- Found the account you want CTA -->
    <section class="shell section-py">
      <div class="cta-banner">
        <h2 class="cta-title">Found the account you want?</h2>
        <p class="cta-desc">Create a free account, initiate a support thread and chat directly with our team in real-time.</p>
        <div class="cta-actions">
          <a href="#/register" class="btn btn-primary">Create Free Account <i data-lucide="arrow-right"></i></a>
          <a href="#/accounts" class="btn btn-ghost">Keep Browsing</a>
        </div>
      </div>
    </section>
  `;
  lucide.createIcons();
}

// 2. ACCOUNTS CATALOG PAGE
function renderAccounts(hashRoute) {
  const listings = getListings();
  
  // Extract query filters from hash path
  const params = {};
  if (hashRoute.includes("?")) {
    const queryStr = hashRoute.split("?")[1];
    queryStr.split("&").forEach(p => {
      const parts = p.split("=");
      params[parts[0]] = decodeURIComponent(parts[1] || "");
    });
  }

  // Set default filter properties
  let filterStatus = params.status || "available";
  let filterRarity = params.rarity || "all";
  let sortOption = params.sort || "date_desc";
  let searchQuery = params.search || "";
  
  // Advanced Filter Variables
  let minPrice = params.minPrice ? parseInt(params.minPrice) : null;
  let maxPrice = params.maxPrice ? parseInt(params.maxPrice) : null;
  let minLevel = params.minLevel ? parseInt(params.minLevel) : null;
  let minBadges = params.minBadges ? parseInt(params.minBadges) : null;
  let minEvoGuns = params.minEvoGuns ? parseInt(params.minEvoGuns) : null;
  let regionFilter = params.region || "all";
  let selectedRareItems = params.rareItems ? params.rareItems.split(",") : [];

  const allRareItems = [
    "Bunny Warrior", "Criminal Red", "Criminal Blue", "Criminal Yellow",
    "Hip Hop Season 1", "Hip Hop Season 2", "Sakura", "Pharaoh",
    "Cobra", "Angelic Pants", "Yellow Hairband", "Winterlands",
    "Purgatory", "Megalodon Alpha", "Dragon AK", "Blue Flame Draco",
    "Cupid Scar", "Titan Mark", "Booyah Day", "Elite Pass Legacy"
  ];

  appRoot.innerHTML = `
    <div class="shell section-py" style="padding-top: 2rem;">
      <header style="margin-bottom: 1.5rem;">
        <p class="eyebrow">Marketplace</p>
        <h1 class="page-title">Browse Accounts</h1>
        <p style="color: var(--color-ink-300); font-size: 0.875rem; margin-top: 0.5rem;">
          Filter by price, level, region, badges, evo guns or specific rare bundles. Browsing is open to everyone.
        </p>
      </header>

      <!-- Advanced Filter Dashboard Bar -->
      <div class="advanced-filter-bar-container" style="margin-bottom: 2rem;">
        <div class="filter-header-row">
          <!-- Search input -->
          <div class="search-box-wrapper">
            <i data-lucide="search" class="search-icon"></i>
            <input type="text" id="search-input" placeholder="Search bundles, ranks, items" value="${searchQuery}">
          </div>
          
          <div class="filter-header-actions-right">
            <!-- Sort dropdown select -->
            <select class="custom-sort-select" id="sort-select">
              <option value="date_desc" ${sortOption === "date_desc" ? "selected" : ""}>Featured</option>
              <option value="price_asc" ${sortOption === "price_asc" ? "selected" : ""}>Price: Low to High</option>
              <option value="price_desc" ${sortOption === "price_desc" ? "selected" : ""}>Price: High to Low</option>
              <option value="level_desc" ${sortOption === "level_desc" ? "selected" : ""}>Highest Level</option>
              <option value="badges_desc" ${sortOption === "badges_desc" ? "selected" : ""}>Badge Count</option>
            </select>
            
            <!-- Filters Toggle Button -->
            <button class="btn btn-ghost filter-toggle-btn" id="filters-toggle-btn">
              <i data-lucide="sliders-horizontal" style="width: 15px; height: 15px;"></i>
              <span>Filters</span>
            </button>
          </div>
        </div>

        <!-- Rarity Horizontal Pills Row -->
        <div class="rarity-pills-row" style="margin-top: 1rem;">
          <div class="rarity-pills-list">
            <button class="rarity-pill-btn ${filterRarity === "all" ? "active" : ""}" data-rarity="all">All Tiers</button>
            <button class="rarity-pill-btn ${filterRarity === "common" ? "active" : ""}" data-rarity="common">Common</button>
            <button class="rarity-pill-btn ${filterRarity === "rare" ? "active" : ""}" data-rarity="rare">Rare</button>
            <button class="rarity-pill-btn ${filterRarity === "epic" ? "active" : ""}" data-rarity="epic">Epic</button>
            <button class="rarity-pill-btn ${filterRarity === "legendary" ? "active" : ""}" data-rarity="legendary">Legendary</button>
            <button class="rarity-pill-btn ${filterRarity === "mythic" ? "active" : ""}" data-rarity="mythic">Mythic</button>
          </div>
          <span class="catalog-count-pill" id="catalog-count-pill">0 accounts</span>
        </div>
        <!-- Collapsible Filters Drawer Panel -->
        <div class="advanced-filters-panel" id="advanced-filters-panel">
          <div class="advanced-filters-grid">
            <!-- Min Price -->
            <div class="filter-group">
              <label class="filter-label">Min Price</label>
              <input type="number" class="form-control" id="min-price-input" placeholder="0" value="${minPrice !== null ? minPrice : ''}">
            </div>
            
            <!-- Max Price -->
            <div class="filter-group">
              <label class="filter-label">Max Price</label>
              <input type="number" class="form-control" id="max-price-input" placeholder="50000" value="${maxPrice !== null ? maxPrice : ''}">
            </div>
            
            <!-- Min Level -->
            <div class="filter-group">
              <label class="filter-label">Min Level</label>
              <input type="number" class="form-control" id="min-level-input" placeholder="50" value="${minLevel !== null ? minLevel : ''}">
            </div>
            
            <!-- Region Select -->
            <div class="filter-group">
              <label class="filter-label">Region</label>
              <select class="form-control" id="region-select">
                <option value="all" ${regionFilter === "all" ? "selected" : ""}>Any region</option>
                <option value="India" ${regionFilter === "India" ? "selected" : ""}>India</option>
                <option value="Bangladesh" ${regionFilter === "Bangladesh" ? "selected" : ""}>Bangladesh</option>
                <option value="Pakistan" ${regionFilter === "Pakistan" ? "selected" : ""}>Pakistan</option>
                <option value="Singapore" ${regionFilter === "Singapore" ? "selected" : ""}>Singapore</option>
              </select>
            </div>
            
            <!-- Min Badges -->
            <div class="filter-group">
              <label class="filter-label">Min Badges</label>
              <input type="number" class="form-control" id="min-badges-input" placeholder="10" value="${minBadges !== null ? minBadges : ''}">
            </div>
            
            <!-- Min Evo Guns -->
            <div class="filter-group">
              <label class="filter-label">Min Evo Guns</label>
              <input type="number" class="form-control" id="min-evo-guns-input" placeholder="3" value="${minEvoGuns !== null ? minEvoGuns : ''}">
            </div>
            
            <!-- Availability Select -->
            <div class="filter-group">
              <label class="filter-label">Availability</label>
              <select class="form-control" id="status-select">
                <option value="all" ${filterStatus === "all" ? "selected" : ""}>Any status</option>
                <option value="available" ${filterStatus === "available" ? "selected" : ""}>Available Now</option>
                <option value="reserved" ${filterStatus === "reserved" ? "selected" : ""}>Reserved</option>
                <option value="sold" ${filterStatus === "sold" ? "selected" : ""}>Sold</option>
              </select>
            </div>
            
            <!-- Reset Filters -->
            <div class="filter-group" style="display: flex; align-items: flex-end;">
              <button class="btn btn-ghost w-full reset-filters-btn" id="reset-filters-btn" style="border: 1px solid var(--color-surface-line); height: 42px;">
                Reset Filters
              </button>
            </div>
          </div>

          <!-- Rare items tags selection list -->
          <div class="rare-items-filter-section" style="margin-top: 1.5rem; border-top: 1px solid var(--color-surface-line); padding-top: 1.25rem;">
            <h4 class="rare-items-filter-title" style="font-size: 0.75rem; text-transform: uppercase; color: var(--color-ink-300); margin-bottom: 0.75rem; letter-spacing: 0.05em; font-weight: 700;">Rare Items</h4>
            <div class="rare-items-chips-list" id="rare-items-chips-list" style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
              <!-- Populated dynamically -->
            </div>
          </div>
        </div>
      </div>

      <!-- Listings Grid wrapper -->
      <div id="catalog-grid-wrapper">
        <!-- Rendered by applyFilters() -->
      </div>
    </div>
  `;

  // Populate the rare items tags list
  function renderRareItemChips() {
    const listContainer = document.getElementById("rare-items-chips-list");
    if (!listContainer) return;
    
    let chipsHtml = "";
    allRareItems.forEach(item => {
      const isSelected = selectedRareItems.includes(item);
      chipsHtml += `
        <button class="rare-filter-chip ${isSelected ? 'active' : ''}" data-item="${item}">
          ${item}
        </button>
      `;
    });
    listContainer.innerHTML = chipsHtml;
    
    // Add click listeners to rare items chips
    document.querySelectorAll(".rare-filter-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        const item = chip.getAttribute("data-item");
        if (selectedRareItems.includes(item)) {
          selectedRareItems = selectedRareItems.filter(x => x !== item);
        } else {
          selectedRareItems.push(item);
        }
        chip.classList.toggle("active");
        triggerFilterUpdate();
      });
    });
  }

  // Filter application handler
  function applyFilters() {
    let filteredListings = [...listings];

    // Search query match
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filteredListings = filteredListings.filter(l => 
        l.title.toLowerCase().includes(q) || 
        l.description.toLowerCase().includes(q) ||
        l.rareItems.some(i => i.toLowerCase().includes(q))
      );
    }

    // Rarity filter (pills)
    if (filterRarity !== "all") {
      filteredListings = filteredListings.filter(l => l.rarity === filterRarity);
    }

    // Status filter (availability)
    if (filterStatus !== "all") {
      filteredListings = filteredListings.filter(l => l.status === filterStatus);
    }

    // Min price
    if (minPrice !== null && !isNaN(minPrice)) {
      filteredListings = filteredListings.filter(l => l.price >= minPrice);
    }

    // Max price
    if (maxPrice !== null && !isNaN(maxPrice)) {
      filteredListings = filteredListings.filter(l => l.price <= maxPrice);
    }

    // Min level
    if (minLevel !== null && !isNaN(minLevel)) {
      filteredListings = filteredListings.filter(l => l.level >= minLevel);
    }

    // Min badges
    if (minBadges !== null && !isNaN(minBadges)) {
      filteredListings = filteredListings.filter(l => l.badges >= minBadges);
    }

    // Min evo guns
    if (minEvoGuns !== null && !isNaN(minEvoGuns)) {
      filteredListings = filteredListings.filter(l => l.evoGuns >= minEvoGuns);
    }

    // Region
    if (regionFilter !== "all") {
      filteredListings = filteredListings.filter(l => l.region.toLowerCase() === regionFilter.toLowerCase());
    }

    // Selected rare items
    if (selectedRareItems.length > 0) {
      filteredListings = filteredListings.filter(l => 
        selectedRareItems.every(item => l.rareItems.some(ri => ri.toLowerCase() === item.toLowerCase()))
      );
    }

    // Sort order
    if (sortOption === "price_asc") {
      filteredListings.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price_desc") {
      filteredListings.sort((a, b) => b.price - a.price);
    } else if (sortOption === "level_desc") {
      filteredListings.sort((a, b) => b.level - a.level);
    } else if (sortOption === "badges_desc") {
      filteredListings.sort((a, b) => b.badges - a.badges);
    } else {
      // Default: Newest first
      filteredListings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Update count pill
    const countPill = document.getElementById("catalog-count-pill");
    if (countPill) {
      countPill.textContent = `${filteredListings.length} accounts`;
    }

    const gridContainer = document.getElementById("catalog-grid-wrapper");
    if (filteredListings.length === 0) {
      gridContainer.innerHTML = `
        <div style="text-align: center; padding: 4rem 1.5rem; color: var(--color-ink-300);">
          <i data-lucide="search-x" style="width: 3rem; height: 3rem; color: var(--color-blood); margin-bottom: 1rem;"></i>
          <h3 style="font-size: 1.25rem; color: var(--color-ink-50);">No listings match your filters</h3>
          <p style="font-size: 0.875rem; margin-top: 0.5rem;">Try clearing search fields or broadening parameters.</p>
        </div>
      `;
    } else {
      let cardsHtml = `<div class="listings-grid">`;
      filteredListings.forEach(l => {
        cardsHtml += renderListingCardMarkup(l);
      });
      cardsHtml += `</div>`;
      gridContainer.innerHTML = cardsHtml;
    }
    lucide.createIcons();
  }

  // Event handler to rebuild state and refresh view
  const triggerFilterUpdate = () => {
    searchQuery = document.getElementById("search-input").value;
    sortOption = document.getElementById("sort-select").value;
    
    const minPriceVal = document.getElementById("min-price-input").value;
    minPrice = minPriceVal !== "" ? parseInt(minPriceVal) : null;
    
    const maxPriceVal = document.getElementById("max-price-input").value;
    maxPrice = maxPriceVal !== "" ? parseInt(maxPriceVal) : null;
    
    const minLevelVal = document.getElementById("min-level-input").value;
    minLevel = minLevelVal !== "" ? parseInt(minLevelVal) : null;
    
    const minBadgesVal = document.getElementById("min-badges-input").value;
    minBadges = minBadgesVal !== "" ? parseInt(minBadgesVal) : null;
    
    const minEvoGunsVal = document.getElementById("min-evo-guns-input").value;
    minEvoGuns = minEvoGunsVal !== "" ? parseInt(minEvoGunsVal) : null;
    
    regionFilter = document.getElementById("region-select").value;
    filterStatus = document.getElementById("status-select").value;

    // Silent URL state sync
    const paramsList = [];
    if (searchQuery) paramsList.push(`search=${encodeURIComponent(searchQuery)}`);
    if (filterRarity !== "all") paramsList.push(`rarity=${filterRarity}`);
    if (filterStatus !== "available") paramsList.push(`status=${filterStatus}`);
    if (sortOption !== "date_desc") paramsList.push(`sort=${sortOption}`);
    if (minPrice !== null) paramsList.push(`minPrice=${minPrice}`);
    if (maxPrice !== null) paramsList.push(`maxPrice=${maxPrice}`);
    if (minLevel !== null) paramsList.push(`minLevel=${minLevel}`);
    if (minBadges !== null) paramsList.push(`minBadges=${minBadges}`);
    if (minEvoGuns !== null) paramsList.push(`minEvoGuns=${minEvoGuns}`);
    if (regionFilter !== "all") paramsList.push(`region=${regionFilter}`);
    if (selectedRareItems.length > 0) paramsList.push(`rareItems=${encodeURIComponent(selectedRareItems.join(","))}`);
    
    const newHash = `#/accounts${paramsList.length > 0 ? "?" + paramsList.join("&") : ""}`;
    history.replaceState(null, null, newHash);
    
    applyFilters();
  };

  // Bind key inputs and changes
  document.getElementById("search-input").addEventListener("input", triggerFilterUpdate);
  document.getElementById("sort-select").addEventListener("change", triggerFilterUpdate);
  document.getElementById("min-price-input").addEventListener("input", triggerFilterUpdate);
  document.getElementById("max-price-input").addEventListener("input", triggerFilterUpdate);
  document.getElementById("min-level-input").addEventListener("input", triggerFilterUpdate);
  document.getElementById("region-select").addEventListener("change", triggerFilterUpdate);
  document.getElementById("min-badges-input").addEventListener("input", triggerFilterUpdate);
  document.getElementById("min-evo-guns-input").addEventListener("input", triggerFilterUpdate);
  document.getElementById("status-select").addEventListener("change", triggerFilterUpdate);

  // Toggle Advanced Filters Drawer Panel
  const filtersToggleBtn = document.getElementById("filters-toggle-btn");
  const advancedPanel = document.getElementById("advanced-filters-panel");
  filtersToggleBtn.addEventListener("click", () => {
    advancedPanel.classList.toggle("open");
    filtersToggleBtn.classList.toggle("active");
  });

  // Bind Rarity horizontal pills buttons
  document.querySelectorAll(".rarity-pill-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".rarity-pill-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      filterRarity = btn.getAttribute("data-rarity");
      triggerFilterUpdate();
    });
  });

  // Bind Reset Filters Button
  document.getElementById("reset-filters-btn").addEventListener("click", () => {
    document.getElementById("search-input").value = "";
    document.getElementById("sort-select").value = "date_desc";
    document.getElementById("min-price-input").value = "";
    document.getElementById("max-price-input").value = "";
    document.getElementById("min-level-input").value = "";
    document.getElementById("region-select").value = "all";
    document.getElementById("min-badges-input").value = "";
    document.getElementById("min-evo-guns-input").value = "";
    document.getElementById("status-select").value = "available"; // Default back to available as requested earlier
    
    // Reset rarity pills
    document.querySelectorAll(".rarity-pill-btn").forEach(b => b.classList.remove("active"));
    document.querySelector(".rarity-pill-btn[data-rarity='all']").classList.add("active");
    
    filterRarity = "all";
    selectedRareItems = [];
    
    // Re-render chips and update filters
    renderRareItemChips();
    triggerFilterUpdate();
  });

  // Init rare items chips
  renderRareItemChips();

  // Run initial render
  applyFilters();
}

// 3. SINGLE LISTING CARD MARKUP GENERATOR
function renderListingCardMarkup(listing) {
  const rarityChip = listing.rarity === "mythic" ? 
    `<span class="chip chip-mythic">Mythic</span>` : 
    `<span class="chip chip-legendary">Legendary</span>`;

  let statusClass = "chip-available";
  let statusText = "Available";
  if (listing.status === "reserved") {
    statusClass = "chip-reserved";
    statusText = "Reserved";
  } else if (listing.status === "sold") {
    statusClass = "chip-sold";
    statusText = "Sold";
  }
  const statusChip = `<span class="chip ${statusClass}">${statusText}</span>`;

  return `
    <div class="glass listing-card animate-scale-in" id="listing-card-${listing.id}">
      <div class="card-img-wrapper">
        <img class="card-img" src="${listing.images[0]}" alt="${listing.title}" loading="lazy">
        <div class="card-img-overlay"></div>
        <div class="card-badges-top">
          ${rarityChip}
          ${statusChip}
        </div>
        <span class="card-images-count">
          <i data-lucide="image" style="width: 11px; height: 11px;"></i>
          ${listing.images.length}
        </span>
      </div>
      <div class="card-info">
        <h3 class="card-title">${listing.title}</h3>
        <div class="card-specs">
          <span class="card-spec-item"><i data-lucide="zap"></i> Lv ${listing.level}</span>
          <span class="card-spec-item"><i data-lucide="award"></i> ${listing.badges} badges</span>
          <span class="card-spec-item"><i data-lucide="eye"></i> ${listing.views}</span>
        </div>
        <div class="card-footer">
          <p class="card-price">₹${listing.price.toLocaleString("en-IN")}</p>
          <a href="#/accounts/${listing.slug}" class="btn btn-primary btn-sm">View Account</a>
        </div>
      </div>
    </div>
  `;
}

// 4. ACCOUNT DETAILS VIEW
function renderAccountDetails(slug) {
  const listings = getListings();
  const listing = listings.find(l => l.slug === slug);
  
  if (!listing) {
    appRoot.innerHTML = `
      <div class="shell" style="padding-top: 6rem; padding-bottom: 6rem; text-align: center;">
        <h2 class="page-title" style="text-align: center;">Listing not found</h2>
        <p style="color: var(--color-ink-300); margin-top: 1rem;">The account you are looking for does not exist or has been deleted.</p>
        <a href="#/accounts" class="btn btn-primary" style="margin-top: 2rem;">Back to Accounts</a>
      </div>
    `;
    return;
  }

  // Setup Gallery Images
  let mainSlides = "";
  let thumbSlides = "";
  listing.images.forEach((img, idx) => {
    mainSlides += `
      <div class="gallery-slide ${idx === 0 ? "active" : ""}" data-slide="${idx}">
        <img src="${img}" alt="Screenshot showcase ${idx+1}">
      </div>
    `;
    thumbSlides += `
      <div class="gallery-thumb ${idx === 0 ? "active" : ""}" data-thumb="${idx}">
        <img src="${img}" alt="Thumbnail ${idx+1}">
      </div>
    `;
  });

  // Setup specifications chip properties
  const rarityChip = listing.rarity === "mythic" ? 
    `<span class="chip chip-mythic">Mythic</span>` : 
    `<span class="chip chip-legendary">Legendary</span>`;

  let statusClass = "chip-available";
  let statusText = "Available Now";
  if (listing.status === "reserved") {
    statusClass = "chip-reserved";
    statusText = "Reserved";
  } else if (listing.status === "sold") {
    statusClass = "chip-sold";
    statusText = "Sold";
  }
  const statusChip = `<span class="chip ${statusClass}">${statusText}</span>`;

  // Setup rare items tags
  let rareItemsHtml = "";
  listing.rareItems.forEach(item => {
    rareItemsHtml += `
      <span class="rare-item-tag">
        <i data-lucide="star"></i>
        ${item}
      </span>
    `;
  });

  // Track viewed listings in localStorage
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
  });

  // Side bar buy actions card
  let buyActionsHtml = "";
  if (listing.status === "sold") {
    buyActionsHtml = `
      <div class="glass" style="padding: 1.5rem; text-align: center; border-color: rgba(255, 255, 255, 0.05);">
        <span class="chip chip-sold" style="margin-bottom: 1rem;">SOLD OUT</span>
        <h3 style="font-size: 1.75rem; color: var(--color-ink-400);">₹${listing.price.toLocaleString("en-IN")}</h3>
        <p style="font-size: 0.8125rem; color: var(--color-ink-400); margin-top: 0.5rem;">This listing was purchased and secured successfully.</p>
        <a href="#/accounts" class="btn btn-ghost w-full" style="margin-top: 1.25rem;">Browse Other Stock</a>
      </div>
    `;
  } else {
    buyActionsHtml = `
      <div class="glass" style="padding: 1.5rem; border-color: rgba(255, 45, 70, 0.2);">
        <span class="chip ${statusClass}">${statusText}</span>
        <div style="display: flex; align-items: baseline; gap: 0.5rem; margin-top: 1rem;">
          <h3 style="font-size: 2rem;">₹${listing.price.toLocaleString("en-IN")}</h3>
          ${listing.originalPrice ? `<span style="text-decoration: line-through; font-size: 0.875rem; color: var(--color-ink-400);">₹${listing.originalPrice.toLocaleString("en-IN")}</span>` : ""}
        </div>
        <p style="font-size: 0.75rem; color: var(--color-ink-300); margin-top: 0.25rem;">Price is negotiable on bulk orders or combined deals.</p>
        
        <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1.5rem;">
          <button class="btn btn-primary w-full" id="inquire-btn">
            <i data-lucide="message-square"></i> Open Purchase Ticket
          </button>
          <a href="https://t.me/ShivaayXvault" target="_blank" class="btn btn-ghost w-full">
            <i data-lucide="send"></i> Chat on Telegram
          </a>
        </div>
        
        <div style="display: flex; gap: 0.5rem; margin-top: 1.5rem; align-items: flex-start; padding: 0.75rem; background-color: rgba(52, 211, 153, 0.05); border: 1px dashed rgba(52, 211, 153, 0.2); border-radius: 0.75rem;">
          <i data-lucide="lock" style="color: #34d399; width: 14px; height: 14px; margin-top: 0.125rem; flex-shrink: 0;"></i>
          <p style="font-size: 0.6875rem; color: #34d399; line-height: 1.4;">
            Safe transactions. All chat details are logged in our ticket records. No external middlemen.
          </p>
        </div>
      </div>
    `;
  }

  appRoot.innerHTML = `
    <div class="shell section-py" style="padding-top: 2rem; padding-bottom: 6rem;">
      <!-- Breadcrumbs -->
      <nav style="display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; font-size: 0.875rem; color: var(--color-ink-300); margin-bottom: 1.5rem;">
        <a href="#/" style="color: var(--color-blood);">Home</a>
        <i data-lucide="chevron-right" style="width: 14px; height: 14px;"></i>
        <a href="#/accounts" style="color: var(--color-blood);">Accounts</a>
        <i data-lucide="chevron-right" style="width: 14px; height: 14px;"></i>
        <span style="color: var(--color-ink-50); text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">${listing.title}</span>
      </nav>

      <!-- Title details (Full-Width Top Header) -->
      <div style="margin-bottom: 1.5rem;">
        <div style="display: flex; gap: 0.5rem;">
          ${rarityChip}
        </div>
        <h1 class="detail-title">${listing.title}</h1>
        <div style="display: flex; flex-wrap: wrap; gap: 1rem; font-size: 0.8125rem; color: var(--color-ink-300); margin-top: 0.5rem;">
          <span><i data-lucide="eye" style="width: 12px; height: 12px; vertical-align: middle;"></i> ${listing.views} views</span>
          <span><i data-lucide="clock" style="width: 12px; height: 12px; vertical-align: middle;"></i> Listed recently</span>
        </div>
      </div>

      <div class="detail-layout">
        <!-- Item 1: Swipeable Gallery -->
        <div class="detail-gallery-section">
          <div class="gallery-container">
            <div class="gallery-main">
              ${mainSlides}
              <button class="gallery-nav-btn gallery-prev" id="gallery-prev-btn"><i data-lucide="chevron-left"></i></button>
              <button class="gallery-nav-btn gallery-next" id="gallery-next-btn"><i data-lucide="chevron-right"></i></button>
              <div class="gallery-counter"><span id="gallery-current-slide">1</span> / ${listing.images.length}</div>
              <button class="gallery-zoom" id="gallery-zoom-btn"><i data-lucide="expand"></i></button>
            </div>
            <div class="gallery-thumbs">
              ${thumbSlides}
            </div>
          </div>
        </div>

        <!-- Item 2: Sidebar Purchase Panel -->
        <aside class="detail-price-section">
          <div class="sidebar-sticky">
            ${buyActionsHtml}
          </div>
        </aside>

        <!-- Item 3: Info & Specifications Section -->
        <div class="detail-info-section">
          <!-- Description Section -->
          <section>
            <h2 class="detail-section-title">Overview Description</h2>
            <p style="color: var(--color-ink-200); margin-top: 0.5rem; line-height: 1.6; font-size: 0.875rem; white-space: pre-line;">
              ${listing.description}
            </p>
          </section>

          <!-- Video Walkthrough -->
          <section style="margin-top: 2.25rem;">
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;">
              <span class="process-icon" style="margin-bottom: 0; width: 2.25rem; height: 2.25rem;"><i data-lucide="circle-play"></i></span>
              <div>
                <h2 class="detail-section-title">Collection Walkthrough</h2>
                <p style="font-size: 0.75rem; color: var(--color-ink-400);">Full inventory video recorded live in-game</p>
              </div>
            </div>
            <div class="video-showcase-container">
              <div class="video-placeholder" id="video-load-trigger">
                <span class="video-play-btn"><i data-lucide="play" style="fill: white; width: 1.5rem; height: 1.5rem; transform: translateX(2px);"></i></span>
                <span style="font-size: 0.875rem; font-weight: 500;">Click to load inventory walkthrough video</span>
              </div>
              <iframe id="video-iframe" style="display:none; width:100%; height:100%; border:none;" src="" allowfullscreen></iframe>
            </div>
          </section>

          <!-- Specifications Table -->
          <section style="margin-top: 2.25rem;">
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;">
              <span class="process-icon" style="margin-bottom: 0; width: 2.25rem; height: 2.25rem;"><i data-lucide="shield-check"></i></span>
              <div>
                <h2 class="detail-section-title">Account Specifications</h2>
                <p style="font-size: 0.75rem; color: var(--color-ink-400);">Verified specification parameters</p>
              </div>
            </div>
            <div class="specs-detail-grid">
              <div class="specs-detail-item">
                <span class="specs-detail-label"><i data-lucide="gauge"></i> Account Level</span>
                <span class="specs-detail-val">${listing.level}</span>
              </div>
              <div class="specs-detail-item">
                <span class="specs-detail-label"><i data-lucide="calendar-days"></i> Account Age</span>
                <span class="specs-detail-val">${listing.accountAgeYears} years</span>
              </div>
              <div class="specs-detail-item">
                <span class="specs-detail-label"><i data-lucide="crown"></i> VIP Prime Level</span>
                <span class="specs-detail-val">Prime ${listing.primeLevel || "N/A"}</span>
              </div>
              <div class="specs-detail-item">
                <span class="specs-detail-label"><i data-lucide="award"></i> Badges count</span>
                <span class="specs-detail-val">${listing.badges}</span>
              </div>
              <div class="specs-detail-item">
                <span class="specs-detail-label"><i data-lucide="crosshair"></i> Evo Weapons</span>
                <span class="specs-detail-val">${listing.evoGuns} Weapons</span>
              </div>
              <div class="specs-detail-item">
                <span class="specs-detail-label"><i data-lucide="ticket"></i> Elite Passes</span>
                <span class="specs-detail-val">${listing.elitePasses} passes</span>
              </div>
              <div class="specs-detail-item">
                <span class="specs-detail-label"><i data-lucide="map-pin"></i> Region Server</span>
                <span class="specs-detail-val">${listing.region}</span>
              </div>
              <div class="specs-detail-item">
                <span class="specs-detail-label"><i data-lucide="link"></i> Bound Type</span>
                <span class="specs-detail-val" style="text-transform: uppercase;">${listing.boundType}</span>
              </div>
            </div>
          </section>

          <!-- Rare items tags list -->
          <section style="margin-top: 2.25rem;">
            <h3 style="font-size: 1rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-ink-300); margin-bottom: 0.75rem;">Rare items included</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
              ${rareItemsHtml}
            </div>
          </section>
        </div>
      </div>

      </div>

      <!-- Similar Tier Recommendations -->
      <section style="margin-top: 3.5rem; border-top: 1px solid var(--color-surface-line); padding-top: 2.5rem; margin-bottom: 2rem;">
        <div class="shell">
          <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
            <div>
              <p class="eyebrow" style="color: var(--color-blood); font-weight: bold; text-transform: uppercase;">Similar Tier</p>
              <h2 class="section-title" style="margin-top: 0.125rem;">You may also like</h2>
            </div>
            <a href="#/accounts" class="btn btn-ghost btn-sm" style="border: 1px solid var(--color-surface-line); padding: 0.5rem 1rem; border-radius: 0.5rem; font-size: 0.8125rem; display: inline-flex; align-items: center; gap: 0.25rem;">
              View All <i data-lucide="arrow-right" style="width: 14px; height: 14px;"></i>
            </a>
          </div>
          <div class="horizontal-listings-slider">
            ${similarListingsHtml}
          </div>
        </div>
      </section>

      <!-- Sticky Mobile Bottom Bar -->
      <div class="mobile-sticky-bar">
        <div class="sticky-bar-info">
          <span class="sticky-bar-label">Total Price</span>
          <span class="sticky-bar-val">₹${listing.price.toLocaleString("en-IN")}</span>
        </div>
        <button class="btn btn-primary sticky-bar-btn" id="sticky-inquire-btn">
          <i data-lucide="message-square"></i> Inquire Now
        </button>
      </div>
    </div>
  `;
  lucide.createIcons();

  // --- Interactive slider events ---
  let activeIndex = 0;
  const slides = document.querySelectorAll(".gallery-slide");
  const thumbs = document.querySelectorAll(".gallery-thumb");
  const slideCounter = document.getElementById("gallery-current-slide");
  const totalSlides = slides.length;

  const showSlide = (index) => {
    slides[activeIndex].classList.remove("active");
    thumbs[activeIndex].classList.remove("active");
    
    activeIndex = (index + totalSlides) % totalSlides;
    
    slides[activeIndex].classList.add("active");
    thumbs[activeIndex].classList.add("active");
    slideCounter.textContent = activeIndex + 1;
    
    // Scroll thumb into view
    thumbs[activeIndex].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  document.getElementById("gallery-prev-btn").addEventListener("click", () => showSlide(activeIndex - 1));
  document.getElementById("gallery-next-btn").addEventListener("click", () => showSlide(activeIndex + 1));

  thumbs.forEach(t => {
    t.addEventListener("click", () => {
      const targetIdx = parseInt(t.getAttribute("data-thumb"));
      showSlide(targetIdx);
    });
  });

  // Lightbox view zoom
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  document.getElementById("gallery-zoom-btn").addEventListener("click", () => {
    lightboxImg.src = listing.images[activeIndex];
    lightbox.classList.add("open");
  });
  document.getElementById("lightbox-close").addEventListener("click", () => {
    lightbox.classList.remove("open");
  });
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) lightbox.classList.remove("open");
  });

  // Video walkthrough loader
  const videoTrigger = document.getElementById("video-load-trigger");
  if (videoTrigger) {
    videoTrigger.addEventListener("click", () => {
      const iframe = document.getElementById("video-iframe");
      iframe.src = listing.videoUrl;
      iframe.style.display = "block";
      videoTrigger.style.display = "none";
    });
  }

  // Inquiry ticket trigger
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
  }
}

// 5. HOW IT WORKS PAGE
function renderHowItWorks() {
  appRoot.innerHTML = `
    <div class="shell section-py" style="padding-top: 2rem;">
      <header style="text-align: center; max-width: 500px; margin-inline: auto; margin-bottom: 3rem;">
        <p class="eyebrow">Process</p>
        <h1 class="page-title">How Buying Works</h1>
        <p style="color: var(--color-ink-300); font-size: 0.875rem; margin-top: 0.5rem;">
          Four simple stages from browsing to account credentials delivery. Transparent, simple, safe.
        </p>
      </header>

      <ol class="process-list">
        <li class="glass process-list-item">
          <span class="process-icon"><i data-lucide="search"></i></span>
          <div class="process-list-content">
            <p class="process-list-step">STEP 1</p>
            <h3 class="process-list-title">Explore our catalog</h3>
            <p class="process-list-desc">
              Browse all listed Free Fire IDs. Filters allow matching price budgets, level parameters, region servers, and specific rare items easily. Every account carries direct spec list proof.
            </p>
          </div>
        </li>
        <li class="glass process-list-item">
          <span class="process-icon"><i data-lucide="message-square"></i></span>
          <div class="process-list-content">
            <p class="process-list-step">STEP 2</p>
            <h3 class="process-list-title">Register and open a ticket</h3>
            <p class="process-list-desc">
              Sign up with email to activate secure dashboard tickets. Raise a purchase ticket directly against the desired account slug. Our live support team will connect with you immediately in a private chat thread.
            </p>
          </div>
        </li>
        <li class="glass process-list-item">
          <span class="process-icon"><i data-lucide="credit-card"></i></span>
          <div class="process-list-content">
            <p class="process-list-step">STEP 3</p>
            <h3 class="process-list-title">Finalize deal terms and pay</h3>
            <p class="process-list-desc">
              We reserve the selected account exclusively for you. All secure payment information, UPI details, and QR codes are shared only inside the official ticket channel for ultimate security.
            </p>
          </div>
        </li>
        <li class="glass process-list-item">
          <span class="process-icon"><i data-lucide="shield-check"></i></span>
          <div class="process-list-content">
            <p class="process-list-step">STEP 4</p>
            <h3 class="process-list-title">Receive logins & recovery access</h3>
            <p class="process-list-desc">
              Get instant password handover, linked recovery email control guides, and verification keys inside your ticket details. The ticket stays active until you log in and confirm all details work perfectly.
            </p>
          </div>
        </li>
      </ol>

      <section class="glass guarantee-box">
        <h2 class="guarantee-title">Our Security Guarantee</h2>
        <ul class="guarantee-list">
          <li class="guarantee-item">
            <i data-lucide="circle-check" class="guarantee-icon"></i>
            <span>Screenshots are verified against active game lobbies before any listing is placed online.</span>
          </li>
          <li class="guarantee-item">
            <i data-lucide="circle-check" class="guarantee-icon"></i>
            <span>No external trades. We never ask for payments on discord direct messages, telegram channels, or group chats.</span>
          </li>
          <li class="guarantee-item">
            <i data-lucide="circle-check" class="guarantee-icon"></i>
            <span>Every single support ticket chat log is saved to your account permanently for record validation.</span>
          </li>
        </ul>
      </section>

      <div style="margin-top: 3rem; text-align: center; display: flex; justify-content: center; gap: 1rem;">
        <a href="#/accounts" class="btn btn-primary">Browse Catalog</a>
        <a href="#/faq" class="btn btn-ghost">Read FAQ</a>
      </div>
    </div>
  `;
  lucide.createIcons();
}

// 6. FAQ ACCORDION PAGE
function renderFaq() {
  const faqs = [
    {
      q: "Do I need an account to browse listings?",
      a: "No. The entire catalog, every spec sheet, list of items, and screenshots are public. You only need to register when you decide to raise a support ticket or request to purchase an account."
    },
    {
      q: "Why do I have to log in to raise a ticket?",
      a: "Tickets represent a private secure chat history thread tied to your unique identity. Requiring login keeps payment logs private to you, controls bot spam, and creates a valid transaction history database."
    },
    {
      q: "How do I know the screenshots are real?",
      a: "Every listing displays images taken directly from the live game inventory. You can open a ticket to request video logs of the lobby or custom screenshots displaying any outfit item you want to verify."
    },
    {
      q: "What does the Reserved status mean?",
      a: "Reserved means a buyer is currently mid-transaction or negotiating on that listing, and the account is held for them. If the purchase falls through, it will revert to available immediately."
    },
    {
      q: "What is included in a handover?",
      a: "You get the login ID, password, recovery email access keys, and step-by-step instructions to bind/secure the credentials. We guide you through signing out other devices to make it 100% yours."
    },
    {
      q: "Is account trading allowed by Garena?",
      a: "No. Garena's terms explicitly prohibit transfer or sale of user IDs. Trading holds risks of enforcement suspension if Garena flags location/ownership changes. Buy or sell at your own discretion."
    },
    {
      q: "What if something goes wrong after payment?",
      a: "Your purchase ticket will remain active until you confirm credentials and bind files successfully. If any login locking issues happen during secure handover, reply in the ticket for resolution."
    },
    {
      q: "Which payment methods do you accept?",
      a: "We share active UPI details, bank transfers, or QR scan codes inside your private ticket channel. We never request payments via direct DMs, external groups, or emails."
    }
  ];

  let faqItemsHtml = "";
  faqs.forEach((f, idx) => {
    faqItemsHtml += `
      <div class="faq-item" data-index="${idx}">
        <button class="faq-trigger" aria-expanded="false">
          <span class="faq-title">${f.q}</span>
          <span class="faq-icon-box"><i data-lucide="plus" style="width: 14px; height: 14px;"></i></span>
        </button>
        <div class="faq-panel">
          <p class="faq-content">${f.a}</p>
        </div>
      </div>
    `;
  });

  appRoot.innerHTML = `
    <div class="shell section-py" style="padding-top: 2rem;">
      <header style="text-align: center; max-width: 500px; margin-inline: auto; margin-bottom: 3.5rem;">
        <p class="eyebrow">Support</p>
        <h1 class="page-title">Frequently Asked Questions</h1>
        <p style="color: var(--color-ink-300); font-size: 0.875rem; margin-top: 0.5rem;">
          Straightforward answers about buying, payment security, and account secure handovers.
        </p>
      </header>

      <div class="faq-accordion" style="max-width: 768px; margin-inline: auto;">
        ${faqItemsHtml}
      </div>

      <div class="glass" style="max-width: 768px; margin-inline: auto; margin-top: 4rem; padding: 2rem; text-align: center;">
        <h2 style="font-size: 1.125rem;">Still unsure about something?</h2>
        <p style="font-size: 0.875rem; color: var(--color-ink-300); margin-top: 0.5rem;">
          Register, create a ticket, and talk to us. Opening a chat carries no purchasing commitment.
        </p>
        <div style="margin-top: 1.5rem; display: flex; justify-content: center; gap: 1rem;">
          <a href="#/tickets" class="btn btn-primary">Open a Ticket</a>
          <a href="#/accounts" class="btn btn-ghost">Explore Listings</a>
        </div>
      </div>
    </div>
  `;
  lucide.createIcons();

  // --- Attach Accordion Toggles ---
  document.querySelectorAll(".faq-item").forEach(item => {
    const trigger = item.querySelector(".faq-trigger");
    trigger.addEventListener("click", () => {
      const isActive = item.classList.contains("active");
      
      // Close all open items
      document.querySelectorAll(".faq-item.active").forEach(openItem => {
        openItem.classList.remove("active");
        openItem.querySelector(".faq-trigger").setAttribute("aria-expanded", "false");
        openItem.querySelector("i").setAttribute("data-lucide", "plus");
      });

      if (!isActive) {
        item.classList.add("active");
        trigger.setAttribute("aria-expanded", "true");
        item.querySelector("i").setAttribute("data-lucide", "minus");
      }
      lucide.createIcons();
    });
  });
}

// 7. TICKETS DASHBOARD / CHAT VIEW
function renderTickets() {
  if (!currentUser) {
    appRoot.innerHTML = `
      <div class="shell section-py" style="text-align: center;">
        <i data-lucide="lock" style="width: 3rem; height: 3rem; color: var(--color-blood); margin-bottom: 1rem;"></i>
        <h2>Authentication Required</h2>
        <p style="color: var(--color-ink-300); margin-top: 0.5rem;">Please log in or register to access the support tickets panel.</p>
        <div style="margin-top: 2rem; display: flex; gap: 1rem; justify-content: center;">
          <button class="btn btn-primary" onclick="openAuthModal('login-modal')">Log In</button>
          <button class="btn btn-ghost" onclick="openAuthModal('register-modal')">Register</button>
        </div>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  // Check if viewing single ticket or ticket list
  const hash = window.location.hash;
  if (hash.includes("/") && hash.split("/").length > 2) {
    const ticketId = hash.split("/")[2];
    renderSingleTicket(ticketId);
    return;
  }

  // Renders Ticket List
  const tickets = JSON.parse(localStorage.getItem("ShivaayX_tickets") || "[]").filter(t => t.userEmail === currentUser.email);

  let ticketListHtml = "";
  if (tickets.length === 0) {
    ticketListHtml = `
      <div class="glass" style="text-align: center; padding: 4rem 1.5rem; color: var(--color-ink-300);">
        <i data-lucide="ticket" style="width: 2.5rem; height: 2.5rem; color: var(--color-ink-400); margin-bottom: 1rem;"></i>
        <h3>No active support tickets</h3>
        <p style="font-size: 0.875rem; margin-top: 0.5rem;">Navigate to Accounts and click 'Open Purchase Ticket' to start a chat thread.</p>
        <a href="#/accounts" class="btn btn-primary" style="margin-top: 1.5rem;">Browse Accounts</a>
      </div>
    `;
  } else {
    ticketListHtml = `<div class="tickets-list-container">`;
    tickets.forEach(t => {
      const statusLabel = t.status === "active" ? 
        `<span class="chip chip-available">Active</span>` : 
        `<span class="chip chip-sold">Closed</span>`;
      
      ticketListHtml += `
        <div class="glass ticket-row" onclick="window.location.hash = '#/tickets/${t.id}'">
          <div class="ticket-info">
            <h3 class="ticket-title">Purchase: ${t.listingTitle}</h3>
            <p class="ticket-meta">Ticket ID: #${t.id.slice(0,8)} • Created: ${new Date(t.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            ${statusLabel}
          </div>
        </div>
      `;
    });
    ticketListHtml += `</div>`;
  }

  appRoot.innerHTML = `
    <div class="shell section-py" style="padding-top: 2rem; max-width: 800px;">
      <header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem;">
        <div>
          <p class="eyebrow">Dashboard</p>
          <h1 style="font-size: 2rem; margin-top: 0.25rem;">My Support Tickets</h1>
        </div>
        <a href="#/accounts" class="btn btn-ghost btn-sm"><i data-lucide="plus"></i> New Ticket</a>
      </header>

      ${ticketListHtml}
    </div>
  `;
  lucide.createIcons();
}

// 8. TICKET CREATION LOGIC
function createTicketFlow(listing) {
  const tickets = JSON.parse(localStorage.getItem("ShivaayX_tickets") || "[]");
  
  // Check if ticket already exists for this listing and current user
  const existing = tickets.find(t => t.userEmail === currentUser.email && t.listingId === listing.id);
  if (existing) {
    showToast("Opening existing support thread for this account.");
    window.location.hash = `#/tickets/${existing.id}`;
    return;
  }

  // Create new ticket
  const ticketId = Math.random().toString(36).substr(2, 16);
  const newTicket = {
    id: ticketId,
    userEmail: currentUser.email,
    username: currentUser.username,
    listingId: listing.id || listing._id || 'unknown',
    listingTitle: listing.title,
    listingSlug: listing.slug,
    listingPrice: listing.price,
    status: "active",
    createdAt: new Date().toISOString(),
    messages: [
      {
        sender: "bot",
        text: `Yo ${currentUser.username}! ShivaayXStore me aapka welcome hai. Aapne **${listing.title}** (Price: ₹${listing.price.toLocaleString("en-IN")}) ke liye ticket open kiya hai.\n\nKya aap is ID ko lock karke payment details lena chahte hain?`,
        time: new Date().toISOString()
      }
    ],
    stage: 1 // Stage 1: Negotiating/Greet
  };

  tickets.push(newTicket);
  localStorage.setItem("ShivaayX_tickets", JSON.stringify(tickets));
  
  // POST to central DB (triggers Discord Bot ticket channel creation)
  fetch(`${getApiUrl()}/api/tickets`, {
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
  }).catch(err => console.error("Discord Sync Error:", err));
  
  showToast("Support ticket created successfully.");
  window.location.hash = `#/tickets/${ticketId}`;
}

// 9. SINGLE SUPPORT TICKET CHAT SCREEN
function renderSingleTicket(ticketId) {
  const tickets = JSON.parse(localStorage.getItem("ShivaayX_tickets") || "[]");
  const ticket = tickets.find(t => t.id === ticketId && t.userEmail === currentUser.email);

  if (!ticket) {
    appRoot.innerHTML = `
      <div class="shell section-py" style="text-align: center;">
        <h2>Ticket Not Found</h2>
        <p style="color: var(--color-ink-300); margin-top: 1rem;">This ticket is invalid or does not belong to your account.</p>
        <a href="#/tickets" class="btn btn-primary" style="margin-top: 2rem;">Back to Tickets</a>
      </div>
    `;
    return;
  }

  // Render chat messages
  let chatHtml = "";
  ticket.messages.forEach(m => {
    if (m.sender === "system") {
      const sysClass = m.type === "success" ? "chat-sys-success" : "chat-sys-lock";
      const icon = m.type === "success" ? "check-circle" : "lock";
      chatHtml += `
        <div class="chat-sys-msg ${sysClass}">
          <i data-lucide="${icon}" style="width: 14px; height: 14px;"></i>
          <span>${m.text}</span>
        </div>
      `;
    } else {
      const isSent = m.sender === "user";
      const senderClass = isSent ? "chat-msg-sent" : "chat-msg-received";
      const formattedTime = new Date(m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      chatHtml += `
        <div class="chat-msg ${senderClass}">
          <div class="chat-bubble">${m.text.replace(/\n/g, "<br>")}</div>
          <span class="chat-msg-time">${formattedTime}</span>
        </div>
      `;
    }
  });

  // Render input panel based on stage
  let inputBarHtml = "";
  if (ticket.status === "closed") {
    inputBarHtml = `
      <p style="text-align: center; font-size: 0.8125rem; color: var(--color-ink-400);">This ticket has been resolved and is closed.</p>
    `;
  } else {
    // Stage-based action shortcuts
    let shortcutHtml = "";
    if (ticket.stage === 1) {
      shortcutHtml = `<button type="button" class="btn btn-ghost btn-sm" id="btn-agree-buy">Ha bhai, ID lock karke payment details do</button>`;
    } else if (ticket.stage === 2) {
      shortcutHtml = `<button type="button" class="btn btn-primary btn-sm" id="btn-simulate-pay"><i data-lucide="credit-card"></i> Simulate Payment (UPI ₹${ticket.listingPrice.toLocaleString("en-IN")})</button>`;
    } else if (ticket.stage === 3) {
      shortcutHtml = `<button type="button" class="btn btn-ghost btn-sm" id="btn-request-logins">Handover login details de do</button>`;
    }

    inputBarHtml = `
      <div style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem; flex-wrap: wrap;">
        ${shortcutHtml}
      </div>
      <form class="chat-form" id="chat-input-form">
        <input type="text" class="form-control" placeholder="Type a message..." id="chat-input" required autocomplete="off">
        <button type="submit" class="btn btn-primary"><i data-lucide="send"></i></button>
      </form>
    `;
  }

  appRoot.innerHTML = `
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
            <h2 style="font-size: 1.125rem;">Purchase: ${ticket.listingTitle}</h2>
            <span class="chat-status">Status: active • Deal Stage: ${ticket.stage === 4 ? "Completed" : "In Progress"}</span>
          </div>
          <a href="#/accounts/${ticket.listingSlug}" class="btn btn-ghost btn-sm">View Listing</a>
        </div>

        <!-- Message logs -->
        <div class="chat-messages" id="chat-messages-box">
          ${chatHtml}
        </div>

        <!-- Input control bar -->
        <div class="chat-input-bar">
          ${inputBarHtml}
        </div>
      </div>
    </div>
  `;
  lucide.createIcons();

  // Scroll chat box to bottom
  const msgBox = document.getElementById("chat-messages-box");
  msgBox.scrollTop = msgBox.scrollHeight;

  // Clear any existing chat polling interval
  if (window.ShivaayX_chatPollInterval) {
    clearInterval(window.ShivaayX_chatPollInterval);
  }

  // Poll backend database for Discord Admin messages every 3 seconds
  window.ShivaayX_chatPollInterval = setInterval(async () => {
    // If user navigated away, clear polling
    if (window.location.hash !== `#/tickets/${ticketId}`) {
      clearInterval(window.ShivaayX_chatPollInterval);
      return;
    }

    try {
      const res = await fetch(`${getApiUrl()}/api/tickets/${ticketId}/messages`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.messages) {
          const freshTickets = JSON.parse(localStorage.getItem("ShivaayX_tickets") || "[]");
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
                chatHtml += `
                  <div class="chat-sys-msg ${sysClass}">
                    <i data-lucide="${icon}" style="width: 14px; height: 14px;"></i>
                    <span>${m.text}</span>
                  </div>
                `;
              } else {
                const isSent = m.sender === "user";
                const senderClass = isSent ? "chat-msg-sent" : "chat-msg-received";
                const formattedTime = new Date(m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                chatHtml += `
                  <div class="chat-msg ${senderClass}">
                    <div class="chat-bubble">${m.text.replace(/\n/g, "<br>")}</div>
                    <span class="chat-msg-time">${formattedTime}</span>
                  </div>
                `;
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
  }, 3000);

  // --- Attach Chat Event Listeners ---
  const chatForm = document.getElementById("chat-input-form");
  if (chatForm) {
    chatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = document.getElementById("chat-input");
      const messageText = input.value.trim();
      if (!messageText) return;
      
      input.value = "";
      sendUserMessage(messageText);
    });
  }

  // Action shortcuts
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

  // Send message helper
  function sendUserMessage(text) {
    const freshTickets = JSON.parse(localStorage.getItem("ShivaayX_tickets") || "[]");
    const currentTicket = freshTickets.find(t => t.id === ticketId);
    
    currentTicket.messages.push({
      sender: "user",
      text: text,
      time: new Date().toISOString()
    });
    
    localStorage.setItem("ShivaayX_tickets", JSON.stringify(freshTickets));
    renderSingleTicket(ticketId); // Re-render chat
    
    // POST to backend (forwards message to Discord channel)
    fetch(`${getApiUrl()}/api/tickets/${ticketId}/messages`, {
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
  }

  // Simulated Chatbot Support Team logic
  function simulateBotReply(userText) {
    const freshTickets = JSON.parse(localStorage.getItem("ShivaayX_tickets") || "[]");
    const currentTicket = freshTickets.find(t => t.id === ticketId);
    
    let botReply = "";
    let systemAlert = null;
    let nextStage = currentTicket.stage;
    
    const lowercaseText = userText.toLowerCase();

    if (currentTicket.stage === 1) {
      if (lowercaseText.includes("yes") || lowercaseText.includes("proceed") || lowercaseText.includes("purchase") || lowercaseText.includes("lock")) {
        nextStage = 2;
        botReply = `Bhai, aapki ID reserve ho chuki hai! Catalog me isko **Reserved** mark kar diya hai.\n\n**Payment Details (₹${currentTicket.listingPrice.toLocaleString("en-IN")}):**\n- **UPI ID**: \`ShivaayXStore@upi\`\n\nPayment complete hone ke baad yaha screenshot bhej dijiye ya niche simulated payment button par click karein!`;
        systemAlert = {
          sender: "system",
          text: `Listing ${currentTicket.listingTitle} status set to RESERVED`,
          type: "lock"
        };
        
        // Update listing status locally
        const listings = getListings();
        const listingToUpdate = listings.find(l => l.id === currentTicket.listingId);
        if (listingToUpdate) {
          listingToUpdate.status = "reserved";
          saveListings(listings);
        }
      } else {
        botReply = "Thik hai bhai. Agar badges, Evo guns ya kisi chiz ka doubt ho toh pooch lena. Jab ready ho toh bata dena!";
      }
    } else if (currentTicket.stage === 2) {
      if (lowercaseText.includes("paid") || lowercaseText.includes("simulating") || lowercaseText.includes("confirm")) {
        // Handled directly by simulatePaymentTrigger usually, but added fallback
        nextStage = 3;
        botReply = "Ledger check kar liya hai... Payment receive ho gayi hai bhai! Handover credentials ready ho rahi hain. Login details lene ke liye niche button par click karein ya 'Logins' type karein.";
        systemAlert = {
          sender: "system",
          text: "Payment of ₹" + currentTicket.listingPrice.toLocaleString("en-IN") + " confirmed successfully via UPI ledger",
          type: "success"
        };
      } else {
        botReply = "Awaiting verification. Payment complete karke message kijiye. ID bas 2 ghante tak reserved rahegi.";
      }
    } else if (currentTicket.stage === 3) {
      if (lowercaseText.includes("login") || lowercaseText.includes("handover") || lowercaseText.includes("detail") || lowercaseText.includes("credential")) {
        nextStage = 4;
        botReply = `Ye lijiye aapki secure login details:\n\n- **Google Login**: \`ShivaayX_player_${Math.floor(1000 + Math.random() * 9000)}@gmail.com\`\n- **Password**: \`bx_pass_${Math.floor(100000 + Math.random() * 900000)}\`\n- **Recovery Email**: \`ShivaayX_backup@gmail.com\`\n\n**Bohut important instructions**:\n1. ID ko device me login karein.\n2. Google security settings me recovery details ko change kar lein.\n3. Two-factor authentication (2FA) ON kar lein.\n\nShivaayXStore se shopping karne ke liye thank you! Ye ticket ab close ho gayi hai.`;
        systemAlert = {
          sender: "system",
          text: "Handover credentials shared. Account status updated to SOLD.",
          type: "success"
        };
        
        // Update listing status locally to sold
        const listings = getListings();
        const listingToUpdate = listings.find(l => l.id === currentTicket.listingId);
        if (listingToUpdate) {
          listingToUpdate.status = "sold";
          saveListings(listings);
        }
        
        currentTicket.status = "closed";
      } else {
        botReply = "Account ready hai handover ke liye. Credentials lene ke liye 'logins' type kijiye.";
      }
    } else {
      botReply = "Ye deal complete ho chuki hai bhai! Agar koi doosri ID pasand aaye toh naya ticket open kar lena.";
    }

    // Push replies to ticket log
    if (systemAlert) {
      currentTicket.messages.push(systemAlert);
    }
    currentTicket.messages.push({
      sender: "bot",
      text: botReply,
      time: new Date().toISOString()
    });
    currentTicket.stage = nextStage;

    // Save changes and re-render single chat
    localStorage.setItem("ShivaayX_tickets", JSON.stringify(freshTickets));
    renderSingleTicket(ticketId);
    
    // Show toast for updates
    if (systemAlert) {
      showToast(systemAlert.text, systemAlert.type);
    }
  }

  // Simulate payment button shortcut logic
  function simulatePaymentTrigger() {
    setTimeout(() => {
      const freshTickets = JSON.parse(localStorage.getItem("ShivaayX_tickets") || "[]");
      const currentTicket = freshTickets.find(t => t.id === ticketId);
      
      currentTicket.messages.push({
        sender: "system",
        text: "Simulating UPI Payment Gateway authentication...",
        type: "lock"
      });
      
      localStorage.setItem("ShivaayX_tickets", JSON.stringify(freshTickets));
      renderSingleTicket(ticketId);
    }, 400);
  }
}

// YouTube Embed URL Formatter helper
function formatYoutubeEmbedUrl(url) {
  if (!url) return "https://www.youtube.com/embed/dQw4w9WgXcQ"; // Default fallback
  let videoId = "";
  if (url.includes("youtube.com/watch")) {
    try {
      const parts = url.split("?");
      if (parts.length > 1) {
        const queryParams = parts[1].split("&");
        for (let param of queryParams) {
          const pair = param.split("=");
          if (pair[0] === "v") {
            videoId = pair[1];
            break;
          }
        }
      }
    } catch(e) {}
  } else if (url.includes("youtu.be/")) {
    try {
      videoId = url.split("youtu.be/")[1].split("?")[0];
    } catch(e) {}
  } else if (url.includes("youtube.com/embed/")) {
    return url.trim();
  } else {
    videoId = url.trim();
  }
  return videoId ? `https://www.youtube.com/embed/${videoId}` : "https://www.youtube.com/embed/dQw4w9WgXcQ";
}

// 10. ADMIN DASHBOARD - VISUAL CATALOG CONTROL
function renderAdmin() {
  const listings = getListings();
  
  let listingsRowsHtml = "";
  listings.forEach((l) => {
    listingsRowsHtml += `
      <tr style="border-bottom: 1px solid var(--color-surface-line); vertical-align: middle;">
        <td style="padding: 1rem 0.5rem; font-weight: 600; color: var(--color-ink-50);">${l.title}</td>
        <td style="padding: 1rem 0.5rem;">
          <input type="number" class="form-control" style="width: 80px; padding: 0.25rem 0.5rem;" value="${l.price}" id="admin-price-${l.id}">
        </td>
        <td style="padding: 1rem 0.5rem;">
          <select class="form-control" style="width: 110px; padding: 0.25rem 0.5rem;" id="admin-status-${l.id}">
            <option value="available" ${l.status === "available" ? "selected" : ""}>Available</option>
            <option value="reserved" ${l.status === "reserved" ? "selected" : ""}>Reserved</option>
            <option value="sold" ${l.status === "sold" ? "selected" : ""}>Sold</option>
          </select>
        </td>
        <td style="padding: 1rem 0.5rem;">
          <input type="text" class="form-control" style="width: 140px; padding: 0.25rem 0.5rem; font-size: 0.75rem;" value="${l.videoUrl || ''}" id="admin-video-${l.id}" placeholder="YouTube URL/ID">
        </td>
        <td style="padding: 1rem 0.5rem;">
          <div style="display: flex; gap: 0.375rem;">
            <button class="btn btn-primary btn-sm" onclick="saveAdminListing('${l.id}')">Save</button>
            <button class="btn btn-danger btn-sm" onclick="deleteAdminListing('${l.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `;
  });

  appRoot.innerHTML = `
    <div class="shell section-py" style="padding-top: 2rem;">
      <header style="margin-bottom: 2.5rem;">
        <p class="eyebrow">Control Panel</p>
        <h1 class="page-title">Admin Dashboard</h1>
        <p style="color: var(--color-ink-300); font-size: 0.875rem; margin-top: 0.5rem;">
          Directly manage, edit status, delete, and add new Free Fire ID listings to the store.
        </p>
      </header>

      <div class="detail-layout">
        <!-- Manage Listings Table -->
        <div class="glass" style="padding: 1.5rem; overflow-x: auto;">
          <h2 style="font-size: 1.25rem; margin-bottom: 1.25rem;">Current Stock</h2>
          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.875rem;">
            <thead>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.15); color: var(--color-ink-300);">
                <th style="padding-bottom: 0.75rem; padding-left: 0.5rem;">Title</th>
                <th style="padding-bottom: 0.75rem; padding-left: 0.5rem;">Price (₹)</th>
                <th style="padding-bottom: 0.75rem; padding-left: 0.5rem;">Status</th>
                <th style="padding-bottom: 0.75rem; padding-left: 0.5rem;">YouTube Link</th>
                <th style="padding-bottom: 0.75rem; padding-left: 0.5rem;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${listingsRowsHtml}
            </tbody>
          </table>
          <button class="btn btn-ghost w-full" style="margin-top: 2rem;" onclick="resetAdminStock()">
            <i data-lucide="refresh-cw"></i> Revert to Default Seed Stock
          </button>
        </div>

        <!-- Add New Listing Form -->
        <div class="glass" style="padding: 1.5rem; border-color: rgba(255, 45, 70, 0.15);">
          <h2 style="font-size: 1.25rem; margin-bottom: 1.25rem;">Add New Account</h2>
          <form class="auth-form" id="admin-add-form" style="gap: 0.875rem;">
            <div class="form-group">
              <label class="form-label">Title / Name</label>
              <input type="text" class="form-control" placeholder="e.g. S9 VIP Stacked" required id="add-title">
            </div>
            
            <div class="form-group">
              <label class="form-label">Description overview</label>
              <textarea class="form-control" style="height: 60px; font-family: inherit; font-size: 0.8125rem;" placeholder="e.g. S9 Elite Pass..." required id="add-desc"></textarea>
            </div>
            
            <div style="display: flex; gap: 0.5rem;">
              <div class="form-group" style="flex: 1;">
                <label class="form-label">Price (₹)</label>
                <input type="number" class="form-control" placeholder="4999" required id="add-price">
              </div>
              <div class="form-group" style="flex: 1;">
                <label class="form-label">Level</label>
                <input type="number" class="form-control" placeholder="72" required id="add-level">
              </div>
            </div>

            <div style="display: flex; gap: 0.5rem;">
              <div class="form-group" style="flex: 1;">
                <label class="form-label">Rarity</label>
                <select class="form-control" id="add-rarity">
                  <option value="mythic">Mythic</option>
                  <option value="legendary">Legendary</option>
                </select>
              </div>
              <div class="form-group" style="flex: 1;">
                <label class="form-label">Bound To</label>
                <select class="form-control" id="add-bound">
                  <option value="google">Google</option>
                  <option value="facebook">Facebook</option>
                </select>
              </div>
            </div>

            <div style="display: flex; gap: 0.5rem;">
              <div class="form-group" style="flex: 1;">
                <label class="form-label">Badges</label>
                <input type="number" class="form-control" value="25" required id="add-badges">
              </div>
              <div class="form-group" style="flex: 1;">
                <label class="form-label">Evo Guns</label>
                <input type="number" class="form-control" value="4" required id="add-evo">
              </div>
            </div>

            <div style="display: flex; gap: 0.5rem;">
              <div class="form-group" style="flex: 1;">
                <label class="form-label">Likes</label>
                <input type="number" class="form-control" value="8000" required id="add-likes">
              </div>
              <div class="form-group" style="flex: 1;">
                <label class="form-label">Elite Passes</label>
                <input type="number" class="form-control" value="12" required id="add-elite">
              </div>
            </div>

            <div style="display: flex; gap: 0.5rem;">
              <div class="form-group" style="flex: 1;">
                <label class="form-label">Age (Years)</label>
                <input type="number" class="form-control" value="5" required id="add-age">
              </div>
              <div class="form-group" style="flex: 1;">
                <label class="form-label">Prime Level</label>
                <input type="number" class="form-control" value="5" required id="add-prime">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Rare items (comma-separated)</label>
              <input type="text" class="form-control" value="Cobra MP40, Dragon AK, HipHop Hoodie" required id="add-rare">
            </div>

            <div class="form-group">
              <label class="form-label">Walkthrough Video Link (YouTube)</label>
              <input type="text" class="form-control" placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ" value="https://www.youtube.com/watch?v=dQw4w9WgXcQ" required id="add-video">
            </div>

            <div class="form-group">
              <label class="form-label">Upload Showcase Image</label>
              <input type="file" class="form-control" accept="image/*" required id="add-image-file" style="padding: 0.35rem;">
              <p style="font-size: 0.6875rem; color: var(--color-ink-400); margin-top: 0.25rem;">Select a local JPG/PNG screenshot from your computer.</p>
            </div>

            <button type="submit" class="btn btn-primary w-full" style="margin-top: 0.5rem;">
              <i data-lucide="plus-circle"></i> Create Listing
            </button>
          </form>
        </div>
      </div>
    </div>
  `;
  lucide.createIcons();

  // Attach submit event for add form
  document.getElementById("admin-add-form").addEventListener("submit", (e) => {
    e.preventDefault();
    
    const fileInput = document.getElementById("add-image-file");
    const file = fileInput.files[0];
    
    if (!file) {
      showToast("Please select a showcase image file.", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = function(evt) {
      const base64Image = evt.target.result;
      
      const title = document.getElementById("add-title").value.trim();
      const desc = document.getElementById("add-desc").value.trim();
      const price = parseInt(document.getElementById("add-price").value);
      const level = parseInt(document.getElementById("add-level").value);
      const rarity = document.getElementById("add-rarity").value;
      const bound = document.getElementById("add-bound").value;
      const badges = parseInt(document.getElementById("add-badges").value);
      const evo = parseInt(document.getElementById("add-evo").value);
      const likes = parseInt(document.getElementById("add-likes").value);
      const elite = parseInt(document.getElementById("add-elite").value);
      const age = parseInt(document.getElementById("add-age").value);
      const prime = parseInt(document.getElementById("add-prime").value);
      const videoVal = document.getElementById("add-video").value.trim();
      const videoUrl = formatYoutubeEmbedUrl(videoVal);
      const rareStr = document.getElementById("add-rare").value.trim();
      const rareItems = rareStr.split(",").map(i => i.trim()).filter(Boolean);

      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

      const newListings = getListings();
      if (newListings.some(l => l.slug === slug)) {
        showToast("Account slug conflict! Change the title.", "error");
        return;
      }

      const newListing = {
        id: Math.random().toString(36).substr(2, 16),
        title,
        slug,
        description: desc,
        price,
        originalPrice: null,
        level,
        rank: "Bronze",
        region: "India",
        rarity,
        status: "available",
        boundType: bound,
        badges,
        likes,
        elitePasses: elite,
        evoGuns: evo,
        accountAgeYears: age,
        primeLevel: prime,
        videoUrl: videoUrl,
        rareItems,
        images: [base64Image, "/uploads/screenshot_butcher.jpg", "/uploads/screenshot_nox.jpg"],
        views: 12,
        createdAt: new Date().toISOString()
      };

      newListings.push(newListing);
      saveListings(newListings);
      showToast("Added " + title + " to stock successfully!");
      renderAdmin(); // Re-render
    };
    
    reader.onerror = function() {
      showToast("Failed to read image file.", "error");
    };
    
    reader.readAsDataURL(file);
  });
}

// Admin Utility Globals
window.saveAdminListing = function(id) {
  const listings = getListings();
  const item = listings.find(l => l.id === id);
  if (item) {
    const priceInput = document.getElementById(`admin-price-${id}`);
    const statusSelect = document.getElementById(`admin-status-${id}`);
    const videoInput = document.getElementById(`admin-video-${id}`);
    
    item.price = parseInt(priceInput.value) || 0;
    item.status = statusSelect.value;
    item.videoUrl = formatYoutubeEmbedUrl(videoInput.value.trim());
    
    saveListings(listings);
    showToast(`Updated parameters for ${item.title}`);
    renderAdmin();
  }
};

window.deleteAdminListing = function(id) {
  if (confirm("Are you sure you want to delete this listing?")) {
    const listings = getListings();
    const filtered = listings.filter(l => l.id !== id);
    saveListings(filtered);
    showToast("Listing deleted successfully.");
    renderAdmin();
  }
};

window.resetAdminStock = function() {
  if (confirm("Reset current stock back to default listings? This clears edits.")) {
    localStorage.removeItem("ShivaayX_listings");
    saveListings(MOCK_LISTINGS);
    showToast("Stock reset complete.");
    renderAdmin();
  }
};

// 11. TERMS OF SERVICE
function renderTerms() {
  appRoot.innerHTML = `
    <div class="shell section-py" style="padding-top: 2rem; max-width: 800px;">
      <header style="margin-bottom: 2rem; text-align: center;">
        <p class="eyebrow">Legal Docs</p>
        <h1 class="page-title">Terms of Service</h1>
        <p style="color: var(--color-ink-300); font-size: 0.875rem; margin-top: 0.5rem;">Last Updated: August 9, 2026</p>
      </header>

      <div class="glass" style="padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem; line-height: 1.7; font-size: 0.9375rem; color: var(--color-ink-200);">
        <section>
          <h2 style="font-size: 1.25rem; color: var(--color-ink-50); margin-bottom: 0.5rem;">1. Acceptance of Terms</h2>
          <p>By accessing or purchasing from ShivaayXStore, you acknowledge that you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>
        </section>

        <section>
          <h2 style="font-size: 1.25rem; color: var(--color-ink-50); margin-bottom: 0.5rem;">2. Independent Marketplace</h2>
          <p>ShivaayXStore is an independent account marketplace and is not affiliated with, endorsed by, or sponsored by Garena Online, 111dots Studio, or any Free Fire rights holder. Free Fire and all related marks are the property of their respective owners.</p>
        </section>

        <section>
          <h2 style="font-size: 1.25rem; color: var(--color-ink-50); margin-bottom: 0.5rem;">3. Risk of Service Violations</h2>
          <p>Garena’s Terms of Service prohibit the sale or transfer of game accounts. Using virtual items or transferring account login credentials carries the risk of indefinite suspension by the game developer. All purchases are conducted at the buyer's sole risk.</p>
        </section>

        <section>
          <h2 style="font-size: 1.25rem; color: var(--color-ink-50); margin-bottom: 0.5rem;">4. Ticketing and Payments</h2>
          <p>Every transaction, negotiation, and handover must occur inside the official ShivaayXStore ticket panel system. ShivaayXStore is not responsible for any financial loss, credential theft, or scam resulting from communication outside the ticket threads.</p>
        </section>

        <section>
          <h2 style="font-size: 1.25rem; color: var(--color-ink-50); margin-bottom: 0.5rem;">5. Governing Law</h2>
          <p>These terms shall be governed by and construed in accordance with the laws of India, without regard to conflict of law principles.</p>
        </section>
      </div>
    </div>
  `;
  lucide.createIcons();
}

// 12. PRIVACY POLICY
function renderPrivacy() {
  appRoot.innerHTML = `
    <div class="shell section-py" style="padding-top: 2rem; max-width: 800px;">
      <header style="margin-bottom: 2rem; text-align: center;">
        <p class="eyebrow">Legal Docs</p>
        <h1 class="page-title">Privacy Policy</h1>
        <p style="color: var(--color-ink-300); font-size: 0.875rem; margin-top: 0.5rem;">Last Updated: August 9, 2026</p>
      </header>

      <div class="glass" style="padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem; line-height: 1.7; font-size: 0.9375rem; color: var(--color-ink-200);">
        <section>
          <h2 style="font-size: 1.25rem; color: var(--color-ink-50); margin-bottom: 0.5rem;">1. Information We Collect</h2>
          <p>We collect essential information to secure your account and handle support tickets. This includes:</p>
          <ul style="padding-left: 1.25rem; margin-top: 0.5rem; display: flex; flex-direction: column; gap: 0.375rem;">
            <li>Account details (Username, Email address).</li>
            <li>Ticket conversation logs and chat details.</li>
            <li>Browser metadata (IP address, session tracking) to prevent fraudulent account creations.</li>
          </ul>
        </section>

        <section>
          <h2 style="font-size: 1.25rem; color: var(--color-ink-50); margin-bottom: 0.5rem;">2. How We Use Information</h2>
          <p>Your details are used solely to provide services, verify transaction ledgers, prevent spam, and deliver secure game accounts credentials. We do not sell or lease user information to third-party marketing services.</p>
        </section>

        <section>
          <h2 style="font-size: 1.25rem; color: var(--color-ink-50); margin-bottom: 0.5rem;">3. Data Retention</h2>
          <p>Ticket logs and credentials generated under your transactions are archived securely to act as evidence of successful handovers and protect both parties in the event of dispute audits.</p>
        </section>

        <section>
          <h2 style="font-size: 1.25rem; color: var(--color-ink-50); margin-bottom: 0.5rem;">4. Cookie Policies</h2>
          <p>We use local storage keys (localStorage) to store active dashboard sessions, listing catalogs, and chat messages in your browser so you do not have to log in repeatedly.</p>
        </section>
      </div>
    </div>
  `;
  lucide.createIcons();
}

// 13. REFUND POLICY
function renderRefundPolicy() {
  appRoot.innerHTML = `
    <div class="shell section-py" style="padding-top: 2rem; max-width: 800px;">
      <header style="margin-bottom: 2rem; text-align: center;">
        <p class="eyebrow">Legal Docs</p>
        <h1 class="page-title">Refund Policy</h1>
        <p style="color: var(--color-ink-300); font-size: 0.875rem; margin-top: 0.5rem;">Last Updated: August 9, 2026</p>
      </header>

      <div class="glass" style="padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem; line-height: 1.7; font-size: 0.9375rem; color: var(--color-ink-200);">
        <section>
          <h2 style="font-size: 1.25rem; color: var(--color-ink-50); margin-bottom: 0.5rem;">1. Eligibility for Refunds</h2>
          <p>Refunds are strictly governed by the state of account handover. You are eligible for a full refund ONLY if:</p>
          <ul style="padding-left: 1.25rem; margin-top: 0.5rem; display: flex; flex-direction: column; gap: 0.375rem;">
            <li>The provided login credentials do not work upon initial delivery.</li>
            <li>Our support team cannot replace or fix the credentials within 2 hours of payment confirmation.</li>
          </ul>
        </section>

        <section>
          <h2 style="font-size: 1.25rem; color: var(--color-ink-50); margin-bottom: 0.5rem;">2. Non-Refundable Circumstances</h2>
          <p>We cannot offer a refund under any of the following circumstances:</p>
          <ul style="padding-left: 1.25rem; margin-top: 0.5rem; display: flex; flex-direction: column; gap: 0.375rem;">
            <li>The user has successfully logged in and replaced security configurations (e.g. recovery phone, backup email, added 2FA).</li>
            <li>Buyer's remorse or change of mind after the account has been reserved and payment details shared.</li>
            <li>Account suspension, ban, or locking by Garena that occurs after a successful verified handover.</li>
          </ul>
        </section>

        <section>
          <h2 style="font-size: 1.25rem; color: var(--color-ink-50); margin-bottom: 0.5rem;">3. Disputing Transactions</h2>
          <p>If you face any issues, keep the purchase ticket thread open. Do not close the ticket until you verify complete account access. Once a ticket is closed by user consent, the transaction is considered finalized.</p>
        </section>
      </div>
    </div>
  `;
  lucide.createIcons();
}


