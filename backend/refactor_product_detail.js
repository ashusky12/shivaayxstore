const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'app.js');
let appContent = fs.readFileSync(appPath, 'utf8');

// The original detail page innerHTML markup
const originalMarkup = `  appRoot.innerHTML = \`
    <div class="shell section-py" style="padding-top: 2rem;">
      <!-- Breadcrumbs -->
      <nav style="display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; font-size: 0.875rem; color: var(--color-ink-300); margin-bottom: 1.5rem;">
        <a href="#/" style="color: var(--color-blood);">Home</a>
        <i data-lucide="chevron-right" style="width: 14px; height: 14px;"></i>
        <a href="#/accounts" style="color: var(--color-blood);">Accounts</a>
        <i data-lucide="chevron-right" style="width: 14px; height: 14px;"></i>
        <span style="color: var(--color-ink-50); text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">\${listing.title}</span>
      </nav>

      <div class="detail-layout">
        <!-- Main details -->
        <div>
          <!-- Title details -->
          <div style="margin-bottom: 1.5rem;">
            <div style="display: flex; gap: 0.5rem;">
              \${rarityChip}
            </div>
            <h1 class="detail-title">\${listing.title}</h1>
            <div style="display: flex; flex-wrap: wrap; gap: 1rem; font-size: 0.8125rem; color: var(--color-ink-300); margin-top: 0.5rem;">
              <span><i data-lucide="eye" style="width: 12px; height: 12px; vertical-align: middle;"></i> \${listing.views} views</span>
              <span><i data-lucide="clock" style="width: 12px; height: 12px; vertical-align: middle;"></i> Listed recently</span>
            </div>
          </div>

          <!-- Swipeable Gallery -->
          <div class="gallery-container">
            <div class="gallery-main">
              \${mainSlides}
              <button class="gallery-nav-btn gallery-prev" id="gallery-prev-btn"><i data-lucide="chevron-left"></i></button>
              <button class="gallery-nav-btn gallery-next" id="gallery-next-btn"><i data-lucide="chevron-right"></i></button>
              <div class="gallery-counter"><span id="gallery-current-slide">1</span> / \${listing.images.length}</div>
              <button class="gallery-zoom" id="gallery-zoom-btn"><i data-lucide="expand"></i></button>
            </div>
            <div class="gallery-thumbs">
              \${thumbSlides}
            </div>
          </div>

          <!-- Description Section -->
          <section style="margin-top: 2rem;">
            <h2 class="detail-section-title">Overview Description</h2>
            <p style="color: var(--color-ink-200); margin-top: 0.5rem; line-height: 1.7; font-size: 0.9375rem; white-space: pre-line;">
              \${listing.description}
            </p>
          </section>

          <!-- Video Walkthrough -->
          <section style="margin-top: 2.5rem;">
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
          <section style="margin-top: 2.5rem;">
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
                <span class="specs-detail-val">\${listing.level}</span>
              </div>
              <div class="specs-detail-item">
                <span class="specs-detail-label"><i data-lucide="calendar-days"></i> Account Age</span>
                <span class="specs-detail-val">\${listing.accountAgeYears} years</span>
              </div>
              <div class="specs-detail-item">
                <span class="specs-detail-label"><i data-lucide="crown"></i> VIP Prime Level</span>
                <span class="specs-detail-val">Prime \${listing.primeLevel || "N/A"}</span>
              </div>
              <div class="specs-detail-item">
                <span class="specs-detail-label"><i data-lucide="award"></i> Badges count</span>
                <span class="specs-detail-val">\${listing.badges}</span>
              </div>
              <div class="specs-detail-item">
                <span class="specs-detail-label"><i data-lucide="crosshair"></i> Evo Weapons</span>
                <span class="specs-detail-val">\${listing.evoGuns} Weapons</span>
              </div>
              <div class="specs-detail-item">
                <span class="specs-detail-label"><i data-lucide="ticket"></i> Elite Passes</span>
                <span class="specs-detail-val">\${listing.elitePasses} passes</span>
              </div>
              <div class="specs-detail-item">
                <span class="specs-detail-label"><i data-lucide="map-pin"></i> Region Server</span>
                <span class="specs-detail-val">\${listing.region}</span>
              </div>
              <div class="specs-detail-item">
                <span class="specs-detail-label"><i data-lucide="link"></i> Bound Type</span>
                <span class="specs-detail-val" style="text-transform: uppercase;">\${listing.boundType}</span>
              </div>
            </div>
          </section>

          <!-- Rare items tags list -->
          <section style="margin-top: 2.5rem;">
            <h3 style="font-size: 1rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-ink-300); margin-bottom: 0.75rem;">Rare items included</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
              \${rareItemsHtml}
            </div>
          </section>
        </div>

        <!-- Sidebar inquiry panel -->
        <aside>
          <div class="sidebar-sticky">
            \${buyActionsHtml}
          </div>
        </aside>
      </div>
    </div>
  \`;`;

// The new flat structured, highly optimized responsive detail page markup
const newMarkup = `  appRoot.innerHTML = \`
    <div class="shell section-py" style="padding-top: 2rem;">
      <!-- Breadcrumbs -->
      <nav style="display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; font-size: 0.875rem; color: var(--color-ink-300); margin-bottom: 1.5rem;">
        <a href="#/" style="color: var(--color-blood);">Home</a>
        <i data-lucide="chevron-right" style="width: 14px; height: 14px;"></i>
        <a href="#/accounts" style="color: var(--color-blood);">Accounts</a>
        <i data-lucide="chevron-right" style="width: 14px; height: 14px;"></i>
        <span style="color: var(--color-ink-50); text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">\${listing.title}</span>
      </nav>

      <!-- Title details (Full-Width Top Header) -->
      <div style="margin-bottom: 1.5rem;">
        <div style="display: flex; gap: 0.5rem;">
          \${rarityChip}
        </div>
        <h1 class="detail-title">\${listing.title}</h1>
        <div style="display: flex; flex-wrap: wrap; gap: 1rem; font-size: 0.8125rem; color: var(--color-ink-300); margin-top: 0.5rem;">
          <span><i data-lucide="eye" style="width: 12px; height: 12px; vertical-align: middle;"></i> \${listing.views} views</span>
          <span><i data-lucide="clock" style="width: 12px; height: 12px; vertical-align: middle;"></i> Listed recently</span>
        </div>
      </div>

      <div class="detail-layout">
        <!-- Item 1: Swipeable Gallery -->
        <div class="detail-gallery-section">
          <div class="gallery-container">
            <div class="gallery-main">
              \${mainSlides}
              <button class="gallery-nav-btn gallery-prev" id="gallery-prev-btn"><i data-lucide="chevron-left"></i></button>
              <button class="gallery-nav-btn gallery-next" id="gallery-next-btn"><i data-lucide="chevron-right"></i></button>
              <div class="gallery-counter"><span id="gallery-current-slide">1</span> / \${listing.images.length}</div>
              <button class="gallery-zoom" id="gallery-zoom-btn"><i data-lucide="expand"></i></button>
            </div>
            <div class="gallery-thumbs">
              \${thumbSlides}
            </div>
          </div>
        </div>

        <!-- Item 2: Sidebar Purchase Panel -->
        <aside class="detail-price-section">
          <div class="sidebar-sticky">
            \${buyActionsHtml}
          </div>
        </aside>

        <!-- Item 3: Info & Specifications Section -->
        <div class="detail-info-section">
          <!-- Description Section -->
          <section>
            <h2 class="detail-section-title">Overview Description</h2>
            <p style="color: var(--color-ink-200); margin-top: 0.5rem; line-height: 1.6; font-size: 0.875rem; white-space: pre-line;">
              \${listing.description}
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
                <span class="specs-detail-val">\${listing.level}</span>
              </div>
              <div class="specs-detail-item">
                <span class="specs-detail-label"><i data-lucide="calendar-days"></i> Account Age</span>
                <span class="specs-detail-val">\${listing.accountAgeYears} years</span>
              </div>
              <div class="specs-detail-item">
                <span class="specs-detail-label"><i data-lucide="crown"></i> VIP Prime Level</span>
                <span class="specs-detail-val">Prime \${listing.primeLevel || "N/A"}</span>
              </div>
              <div class="specs-detail-item">
                <span class="specs-detail-label"><i data-lucide="award"></i> Badges count</span>
                <span class="specs-detail-val">\${listing.badges}</span>
              </div>
              <div class="specs-detail-item">
                <span class="specs-detail-label"><i data-lucide="crosshair"></i> Evo Weapons</span>
                <span class="specs-detail-val">\${listing.evoGuns} Weapons</span>
              </div>
              <div class="specs-detail-item">
                <span class="specs-detail-label"><i data-lucide="ticket"></i> Elite Passes</span>
                <span class="specs-detail-val">\${listing.elitePasses} passes</span>
              </div>
              <div class="specs-detail-item">
                <span class="specs-detail-label"><i data-lucide="map-pin"></i> Region Server</span>
                <span class="specs-detail-val">\${listing.region}</span>
              </div>
              <div class="specs-detail-item">
                <span class="specs-detail-label"><i data-lucide="link"></i> Bound Type</span>
                <span class="specs-detail-val" style="text-transform: uppercase;">\${listing.boundType}</span>
              </div>
            </div>
          </section>

          <!-- Rare items tags list -->
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

if (appContent.includes(originalMarkup)) {
  appContent = appContent.replace(originalMarkup, newMarkup);
  console.log("Successfully restructured product details layout inside app.js!");
} else {
  console.log("WARNING: Target markup not matched! Let's check string matching details.");
}

fs.writeFileSync(appPath, appContent, 'utf8');
