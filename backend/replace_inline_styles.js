const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'app.js');
let appContent = fs.readFileSync(appPath, 'utf8');

// Replacements dictionary
const replacements = [
  {
    target: '<h2 style="font-size: 1.75rem; margin-top: 0.25rem;">Featured Accounts</h2>',
    replacement: '<h2 class="section-title">Featured Accounts</h2>'
  },
  {
    target: '<h2 style="font-size: 1.75rem; margin-top: 0.25rem;">How Buying Works</h2>',
    replacement: '<h2 class="section-title">How Buying Works</h2>'
  },
  {
    target: '<h1 style="font-size: 2.25rem; margin-top: 0.25rem;">Browse Accounts</h1>',
    replacement: '<h1 class="page-title">Browse Accounts</h1>'
  },
  {
    target: '<h1 style="font-size: 2.25rem; margin-top: 0.25rem;">How Buying Works</h1>',
    replacement: '<h1 class="page-title">How Buying Works</h1>'
  },
  {
    target: '<h1 style="font-size: 2.25rem; margin-top: 0.25rem;">Frequently Asked Questions</h1>',
    replacement: '<h1 class="page-title">Frequently Asked Questions</h1>'
  },
  {
    target: '<h1 style="font-size: 2.25rem; margin-top: 0.25rem;">Admin Dashboard</h1>',
    replacement: '<h1 class="page-title">Admin Dashboard</h1>'
  },
  {
    target: '<h1 style="font-size: 2.25rem; margin-top: 0.25rem;">Terms of Service</h1>',
    replacement: '<h1 class="page-title">Terms of Service</h1>'
  },
  {
    target: '<h1 style="font-size: 2.25rem; margin-top: 0.25rem;">Privacy Policy</h1>',
    replacement: '<h1 class="page-title">Privacy Policy</h1>'
  },
  {
    target: '<h1 style="font-size: 2.25rem; margin-top: 0.25rem;">Refund Policy</h1>',
    replacement: '<h1 class="page-title">Refund Policy</h1>'
  },
  {
    target: '<h2 style="font-size: 2rem;">Listing not found</h2>',
    replacement: '<h2 class="page-title" style="text-align: center;">Listing not found</h2>'
  },
  {
    target: '<div class="stat-item" style="border-left: 1px solid var(--color-surface-line); padding-left: 2rem;">',
    replacement: '<div class="stat-item">'
  }
];

// Perform replacements
let replacedCount = 0;
replacements.forEach(r => {
  if (appContent.includes(r.target)) {
    // Replace all occurrences
    appContent = appContent.split(r.target).join(r.replacement);
    console.log(`Replaced: "${r.target}"`);
    replacedCount++;
  } else {
    console.log(`WARNING: Target not found: "${r.target}"`);
  }
});

fs.writeFileSync(appPath, appContent, 'utf8');
console.log(`Replacement script complete. Made ${replacedCount} modifications.`);
