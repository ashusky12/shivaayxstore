const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'app.js');
let appContent = fs.readFileSync(appPath, 'utf8');

const oldSection = `      <!-- Similar Tier Recommendations -->
      <section style="margin-top: 3.5rem; border-top: 1px solid var(--color-surface-line); padding-top: 2.5rem; margin-bottom: 2rem;">
        <div style="margin-bottom: 1.5rem;">
          <p class="eyebrow" style="color: var(--color-blood); font-weight: bold; text-transform: uppercase;">Similar Tier</p>
          <h2 class="section-title" style="margin-top: 0.125rem;">You may also like</h2>
        </div>
        <div class="listings-grid">
          \${similarListingsHtml}
        </div>
      </section>`;

const newSection = `      <!-- Similar Tier Recommendations -->
      <section style="margin-top: 3.5rem; border-top: 1px solid var(--color-surface-line); padding-top: 2.5rem; margin-bottom: 2rem;">
        <div class="shell">
          <div style="margin-bottom: 1.5rem;">
            <p class="eyebrow" style="color: var(--color-blood); font-weight: bold; text-transform: uppercase;">Similar Tier</p>
            <h2 class="section-title" style="margin-top: 0.125rem;">You may also like</h2>
          </div>
          <div class="listings-grid">
            \${similarListingsHtml}
          </div>
        </div>
      </section>`;

if (appContent.includes(oldSection)) {
  appContent = appContent.replace(oldSection, newSection);
  console.log("Successfully wrapped Similar Tier inside a shell container!");
} else {
  console.log("WARNING: Target Similar Tier section not matched!");
}

fs.writeFileSync(appPath, appContent, 'utf8');
