const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'app.js');
let appContent = fs.readFileSync(appPath, 'utf8');

// The original renderAccounts function block to replace
const originalRenderAccounts = `// 2. ACCOUNTS CATALOG PAGE
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
  let priceMax = params.priceMax || "";

  appRoot.innerHTML = \`
    <div class="shell section-py" style="padding-top: 2rem;">
      <header style="margin-bottom: 2rem;">
        <p class="eyebrow">Marketplace</p>
        <h1 class="page-title">Browse Accounts</h1>
        <p style="color: var(--color-ink-300); font-size: 0.875rem; margin-top: 0.5rem;">
          Filter premium accounts by badges, weapon stats, evo gun levels, price, or rarity rankings.
        </p>
      </header>

      <!-- Filter Dashboard Bar -->
      <div class="glass filter-bar" style="margin-bottom: 2rem;">
        <div class="filter-row">
          <!-- Search input -->
          <div class="filter-group" style="min-width: 250px;">
            <label class="filter-label">Search items or titles</label>
            <input type="text" class="form-control" id="search-input" placeholder="e.g. S8, Top Criminal..." value="\${searchQuery}">
          </div>
          
          <!-- Rarity filter -->
          <div class="filter-group">
            <label class="filter-label">Rarity Tier</label>
            <select class="form-control" id="rarity-select">
              <option value="all" \${filterRarity === "all" ? "selected" : ""}>All Rarity</option>
              <option value="mythic" \${filterRarity === "mythic" ? "selected" : ""}>Mythic</option>
              <option value="legendary" \${filterRarity === "legendary" ? "selected" : ""}>Legendary</option>
            </select>
          </div>

          <!-- Status filter -->
          <div class="filter-group">
            <label class="filter-label">Availability</label>
            <select class="form-control" id="status-select">
              <option value="all" \${filterStatus === "all" ? "selected" : ""}>All Status</option>
              <option value="available" \${filterStatus === "available" ? "selected" : ""}>Available Now</option>
              <option value="reserved" \${filterStatus === "reserved" ? "selected" : ""}>Reserved</option>
              <option value="sold" \${filterStatus === "sold" ? "selected" : ""}>Sold</option>
            </select>
          </div>

          <!-- Sort filter -->
          <div class="filter-group">
            <label class="filter-label">Sort By</label>
            <select class="form-control" id="sort-select">
              <option value="date_desc" \${sortOption === "date_desc" ? "selected" : ""}>Newest Listings</option>
              <option value="price_asc" \${sortOption === "price_asc" ? "selected" : ""}>Price: Low to High</option>
              <option value="price_desc" \${sortOption === "price_desc" ? "selected" : ""}>Price: High to Low</option>
              <option value="level_desc" \${sortOption === "level_desc" ? "selected" : ""}>Highest Level</option>
              <option value="badges_desc" \${sortOption === "badges_desc" ? "selected" : ""}>Badge Count</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Listings Grid wrapper -->
      <div id="catalog-grid-wrapper">
        <!-- Rendered by applyFilters() -->
      </div>
    </div>
  \`;

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

    // Rarity filter
    if (filterRarity !== "all") {
      filteredListings = filteredListings.filter(l => l.rarity === filterRarity);
    }

    // Status filter
    if (filterStatus !== "all") {
      filteredListings = filteredListings.filter(l => l.status === filterStatus);
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

    const gridContainer = document.getElementById("catalog-grid-wrapper");
    if (filteredListings.length === 0) {
      gridContainer.innerHTML = \`
        <div style="text-align: center; padding: 4rem 1.5rem; color: var(--color-ink-300);">
          <i data-lucide="search-x" style="width: 3rem; height: 3rem; color: var(--color-blood); margin-bottom: 1rem;"></i>
          <h3 style="font-size: 1.25rem; color: var(--color-ink-50);">No listings match your filters</h3>
          <p style="font-size: 0.875rem; margin-top: 0.5rem;">Try clearing search fields or broadening parameters.</p>
        </div>
      \`;
    } else {
      let cardsHtml = \`<div class="listings-grid">\`;
      filteredListings.forEach(l => {
        cardsHtml += renderListingCardMarkup(l);
      });
      cardsHtml += \`</div>\`;
      gridContainer.innerHTML = cardsHtml;
    }
    lucide.createIcons();
  }

  // Setup Event Listeners
  const searchInput = document.getElementById("search-input");
  const raritySelect = document.getElementById("rarity-select");
  const statusSelect = document.getElementById("status-select");
  const sortSelect = document.getElementById("sort-select");

  const triggerFilterUpdate = () => {
    searchQuery = searchInput.value;
    filterRarity = raritySelect.value;
    filterStatus = statusSelect.value;
    sortOption = sortSelect.value;
    
    // Update hash query string silently (or via route)
    const newHash = \`#/accounts?search=\${encodeURIComponent(searchQuery)}&rarity=\${filterRarity}&status=\${filterStatus}&sort=\${sortOption}\`;
    history.replaceState(null, null, newHash);
    applyFilters();
  };

  searchInput.addEventListener("input", triggerFilterUpdate);
  raritySelect.addEventListener("change", triggerFilterUpdate);
  statusSelect.addEventListener("change", triggerFilterUpdate);
  sortSelect.addEventListener("change", triggerFilterUpdate);

  // Run initial render
  applyFilters();
}`;

// The new premium, expandable, screenshot-matching filter code block
const newRenderAccounts = `// 2. ACCOUNTS CATALOG PAGE
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

  appRoot.innerHTML = \`
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
            <input type="text" id="search-input" placeholder="Search bundles, ranks, items" value="\${searchQuery}">
          </div>
          
          <div class="filter-header-actions-right">
            <!-- Sort dropdown select -->
            <select class="custom-sort-select" id="sort-select">
              <option value="date_desc" \${sortOption === "date_desc" ? "selected" : ""}>Featured</option>
              <option value="price_asc" \${sortOption === "price_asc" ? "selected" : ""}>Price: Low to High</option>
              <option value="price_desc" \${sortOption === "price_desc" ? "selected" : ""}>Price: High to Low</option>
              <option value="level_desc" \${sortOption === "level_desc" ? "selected" : ""}>Highest Level</option>
              <option value="badges_desc" \${sortOption === "badges_desc" ? "selected" : ""}>Badge Count</option>
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
            <button class="rarity-pill-btn \${filterRarity === "all" ? "active" : ""}" data-rarity="all">All Tiers</button>
            <button class="rarity-pill-btn \${filterRarity === "common" ? "active" : ""}" data-rarity="common">Common</button>
            <button class="rarity-pill-btn \${filterRarity === "rare" ? "active" : ""}" data-rarity="rare">Rare</button>
            <button class="rarity-pill-btn \${filterRarity === "epic" ? "active" : ""}" data-rarity="epic">Epic</button>
            <button class="rarity-pill-btn \${filterRarity === "legendary" ? "active" : ""}" data-rarity="legendary">Legendary</button>
            <button class="rarity-pill-btn \${filterRarity === "mythic" ? "active" : ""}" data-rarity="mythic">Mythic</button>
          </div>
          <span class="catalog-count-pill" id="catalog-count-pill">0 accounts</span>
        </div>

        <!-- Collapsible Filters Drawer Panel -->
        <div class="advanced-filters-panel" id="advanced-filters-panel" style="display: none;">
          <div class="advanced-filters-grid">
            <!-- Min Price -->
            <div class="filter-group">
              <label class="filter-label">Min Price</label>
              <input type="number" class="form-control" id="min-price-input" placeholder="0" value="\${minPrice !== null ? minPrice : ''}">
            </div>
            
            <!-- Max Price -->
            <div class="filter-group">
              <label class="filter-label">Max Price</label>
              <input type="number" class="form-control" id="max-price-input" placeholder="50000" value="\${maxPrice !== null ? maxPrice : ''}">
            </div>
            
            <!-- Min Level -->
            <div class="filter-group">
              <label class="filter-label">Min Level</label>
              <input type="number" class="form-control" id="min-level-input" placeholder="50" value="\${minLevel !== null ? minLevel : ''}">
            </div>
            
            <!-- Region Select -->
            <div class="filter-group">
              <label class="filter-label">Region</label>
              <select class="form-control" id="region-select">
                <option value="all" \${regionFilter === "all" ? "selected" : ""}>Any region</option>
                <option value="India" \${regionFilter === "India" ? "selected" : ""}>India</option>
                <option value="Bangladesh" \${regionFilter === "Bangladesh" ? "selected" : ""}>Bangladesh</option>
                <option value="Pakistan" \${regionFilter === "Pakistan" ? "selected" : ""}>Pakistan</option>
                <option value="Singapore" \${regionFilter === "Singapore" ? "selected" : ""}>Singapore</option>
              </select>
            </div>
            
            <!-- Min Badges -->
            <div class="filter-group">
              <label class="filter-label">Min Badges</label>
              <input type="number" class="form-control" id="min-badges-input" placeholder="10" value="\${minBadges !== null ? minBadges : ''}">
            </div>
            
            <!-- Min Evo Guns -->
            <div class="filter-group">
              <label class="filter-label">Min Evo Guns</label>
              <input type="number" class="form-control" id="min-evo-guns-input" placeholder="3" value="\${minEvoGuns !== null ? minEvoGuns : ''}">
            </div>
            
            <!-- Availability Select -->
            <div class="filter-group">
              <label class="filter-label">Availability</label>
              <select class="form-control" id="status-select">
                <option value="all" \${filterStatus === "all" ? "selected" : ""}>Any status</option>
                <option value="available" \${filterStatus === "available" ? "selected" : ""}>Available Now</option>
                <option value="reserved" \${filterStatus === "reserved" ? "selected" : ""}>Reserved</option>
                <option value="sold" \${filterStatus === "sold" ? "selected" : ""}>Sold</option>
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
  \`;

  // Populate the rare items tags list
  function renderRareItemChips() {
    const listContainer = document.getElementById("rare-items-chips-list");
    if (!listContainer) return;
    
    let chipsHtml = "";
    allRareItems.forEach(item => {
      const isSelected = selectedRareItems.includes(item);
      chipsHtml += \`
        <button class="rare-filter-chip \${isSelected ? 'active' : ''}" data-item="\${item}">
          \${item}
        </button>
      \`;
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
      countPill.textContent = \`\${filteredListings.length} accounts\`;
    }

    const gridContainer = document.getElementById("catalog-grid-wrapper");
    if (filteredListings.length === 0) {
      gridContainer.innerHTML = \`
        <div style="text-align: center; padding: 4rem 1.5rem; color: var(--color-ink-300);">
          <i data-lucide="search-x" style="width: 3rem; height: 3rem; color: var(--color-blood); margin-bottom: 1rem;"></i>
          <h3 style="font-size: 1.25rem; color: var(--color-ink-50);">No listings match your filters</h3>
          <p style="font-size: 0.875rem; margin-top: 0.5rem;">Try clearing search fields or broadening parameters.</p>
        </div>
      \`;
    } else {
      let cardsHtml = \`<div class="listings-grid">\`;
      filteredListings.forEach(l => {
        cardsHtml += renderListingCardMarkup(l);
      });
      cardsHtml += \`</div>\`;
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
    if (searchQuery) paramsList.push(\`search=\${encodeURIComponent(searchQuery)}\`);
    if (filterRarity !== "all") paramsList.push(\`rarity=\${filterRarity}\`);
    if (filterStatus !== "available") paramsList.push(\`status=\${filterStatus}\`);
    if (sortOption !== "date_desc") paramsList.push(\`sort=\${sortOption}\`);
    if (minPrice !== null) paramsList.push(\`minPrice=\${minPrice}\`);
    if (maxPrice !== null) paramsList.push(\`maxPrice=\${maxPrice}\`);
    if (minLevel !== null) paramsList.push(\`minLevel=\${minLevel}\`);
    if (minBadges !== null) paramsList.push(\`minBadges=\${minBadges}\`);
    if (minEvoGuns !== null) paramsList.push(\`minEvoGuns=\${minEvoGuns}\`);
    if (regionFilter !== "all") paramsList.push(\`region=\${regionFilter}\`);
    if (selectedRareItems.length > 0) paramsList.push(\`rareItems=\${encodeURIComponent(selectedRareItems.join(","))}\`);
    
    const newHash = \`#/accounts\${paramsList.length > 0 ? "?" + paramsList.join("&") : ""}\`;
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
    const isHidden = advancedPanel.style.display === "none";
    advancedPanel.style.display = isHidden ? "block" : "none";
    filtersToggleBtn.classList.toggle("active", isHidden);
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
}`;

if (appContent.includes(originalRenderAccounts)) {
  appContent = appContent.replace(originalRenderAccounts, newRenderAccounts);
  console.log("Successfully overhauled Browse Accounts page filters inside app.js!");
} else {
  console.log("WARNING: originalRenderAccounts not matched! Let's do a substring scan.");
}

fs.writeFileSync(appPath, appContent, 'utf8');
