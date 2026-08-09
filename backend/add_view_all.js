const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'app.js');
let appContent = fs.readFileSync(appPath, 'utf8');

const oldHeader = `          <div style="margin-bottom: 1.5rem;">
            <p class="eyebrow" style="color: var(--color-blood); font-weight: bold; text-transform: uppercase;">Similar Tier</p>
            <h2 class="section-title" style="margin-top: 0.125rem;">You may also like</h2>
          </div>`;

const newHeader = `          <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
            <div>
              <p class="eyebrow" style="color: var(--color-blood); font-weight: bold; text-transform: uppercase;">Similar Tier</p>
              <h2 class="section-title" style="margin-top: 0.125rem;">You may also like</h2>
            </div>
            <a href="#/accounts" class="btn btn-ghost btn-sm" style="border: 1px solid var(--color-surface-line); padding: 0.5rem 1rem; border-radius: 0.5rem; font-size: 0.8125rem; display: inline-flex; align-items: center; gap: 0.25rem;">
              View All <i data-lucide="arrow-right" style="width: 14px; height: 14px;"></i>
            </a>
          </div>`;

if (appContent.includes(oldHeader)) {
  appContent = appContent.replace(oldHeader, newHeader);
  console.log("Successfully added View All button to Similar Tier header in app.js!");
} else {
  console.log("WARNING: Similar Tier header block not matched!");
}

fs.writeFileSync(appPath, appContent, 'utf8');
