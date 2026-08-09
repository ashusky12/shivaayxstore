const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'app.js');
let appContent = fs.readFileSync(appPath, 'utf8');

// 1. Refactor Process List in renderHowItWorks to use standard CSS classes instead of inline styles
const originalProcessList = `<ol class="process-list" style="display: flex; flex-direction: column; gap: 1rem; max-width: 768px; margin-inline: auto;">
        <li class="glass" style="display: flex; padding: 1.5rem; gap: 1.25rem; flex-wrap: wrap;">
          <span class="process-icon" style="margin-bottom: 0; width: 3rem; height: 3rem;"><i data-lucide="search"></i></span>
          <div style="flex: 1; min-width: 250px;">
            <p style="font-family: var(--font-display); font-size: 0.75rem; font-weight: 700; color: var(--color-blood);">STEP 1</p>
            <h3 style="font-size: 1.125rem; margin-top: 0.125rem;">Explore our catalog</h3>
            <p style="font-size: 0.875rem; color: var(--color-ink-300); margin-top: 0.375rem; line-height: 1.6;">
              Browse all listed Free Fire IDs. Filters allow matching price budgets, level parameters, region servers, and specific rare items easily. Every account carries direct spec list proof.
            </p>
          </div>
        </li>
        <li class="glass" style="display: flex; padding: 1.5rem; gap: 1.25rem; flex-wrap: wrap;">
          <span class="process-icon" style="margin-bottom: 0; width: 3rem; height: 3rem;"><i data-lucide="message-square"></i></span>
          <div style="flex: 1; min-width: 250px;">
            <p style="font-family: var(--font-display); font-size: 0.75rem; font-weight: 700; color: var(--color-blood);">STEP 2</p>
            <h3 style="font-size: 1.125rem; margin-top: 0.125rem;">Register and open a ticket</h3>
            <p style="font-size: 0.875rem; color: var(--color-ink-300); margin-top: 0.375rem; line-height: 1.6;">
              Sign up with email to activate secure dashboard tickets. Raise a purchase ticket directly against the desired account slug. Our live support team will connect with you immediately in a private chat thread.
            </p>
          </div>
        </li>
        <li class="glass" style="display: flex; padding: 1.5rem; gap: 1.25rem; flex-wrap: wrap;">
          <span class="process-icon" style="margin-bottom: 0; width: 3rem; height: 3rem;"><i data-lucide="credit-card"></i></span>
          <div style="flex: 1; min-width: 250px;">
            <p style="font-family: var(--font-display); font-size: 0.75rem; font-weight: 700; color: var(--color-blood);">STEP 3</p>
            <h3 style="font-size: 1.125rem; margin-top: 0.125rem;">Finalize deal terms and pay</h3>
            <p style="font-size: 0.875rem; color: var(--color-ink-300); margin-top: 0.375rem; line-height: 1.6;">
              We reserve the selected account exclusively for you. All secure payment information, UPI details, and QR codes are shared only inside the official ticket channel for ultimate security.
            </p>
          </div>
        </li>
        <li class="glass" style="display: flex; padding: 1.5rem; gap: 1.25rem; flex-wrap: wrap;">
          <span class="process-icon" style="margin-bottom: 0; width: 3rem; height: 3rem;"><i data-lucide="shield-check"></i></span>
          <div style="flex: 1; min-width: 250px;">
            <p style="font-family: var(--font-display); font-size: 0.75rem; font-weight: 700; color: var(--color-blood);">STEP 4</p>
            <h3 style="font-size: 1.125rem; margin-top: 0.125rem;">Receive logins & recovery access</h3>
            <p style="font-size: 0.875rem; color: var(--color-ink-300); margin-top: 0.375rem; line-height: 1.6;">
              Get instant password handover, linked recovery email control guides, and verification keys inside your ticket details. The ticket stays active until you log in and confirm all details work perfectly.
            </p>
          </div>
        </li>
      </ol>`;

const newProcessList = `<ol class="process-list">
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
      </ol>`;

if (appContent.includes(originalProcessList)) {
  appContent = appContent.split(originalProcessList).join(newProcessList);
  console.log("Replaced Process List inside renderHowItWorks");
} else {
  console.log("WARNING: Process List target pattern not matched!");
}

// 2. Refactor Security Guarantee Block inside renderHowItWorks
const originalGuarantee = `<section class="glass" style="max-width: 768px; margin-inline: auto; margin-top: 3.5rem; padding: 2rem;">
        <h2 style="font-size: 1.25rem; margin-bottom: 1.25rem; text-align: center;">Our Security Guarantee</h2>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 1rem;">
          <li style="display: flex; gap: 0.75rem; align-items: flex-start; font-size: 0.875rem; color: var(--color-ink-200);">
            <i data-lucide="circle-check" style="color: var(--color-blood); flex-shrink: 0;"></i>
            <span>Screenshots are verified against active game lobbies before any listing is placed online.</span>
          </li>
          <li style="display: flex; gap: 0.75rem; align-items: flex-start; font-size: 0.875rem; color: var(--color-ink-200);">
            <i data-lucide="circle-check" style="color: var(--color-blood); flex-shrink: 0;"></i>
            <span>No external trades. We never ask for payments on discord direct messages, telegram channels, or group chats.</span>
          </li>
          <li style="display: flex; gap: 0.75rem; align-items: flex-start; font-size: 0.875rem; color: var(--color-ink-200);">
            <i data-lucide="circle-check" style="color: var(--color-blood); flex-shrink: 0;"></i>
            <span>Every single support ticket chat log is saved to your account permanently for record validation.</span>
          </li>
        </ul>
      </section>`;

const newGuarantee = `<section class="glass guarantee-box">
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
      </section>`;

if (appContent.includes(originalGuarantee)) {
  appContent = appContent.split(originalGuarantee).join(newGuarantee);
  console.log("Replaced Guarantee Box inside renderHowItWorks");
} else {
  console.log("WARNING: Guarantee Box target pattern not matched!");
}

// 3. Write clean HTML breadcrumb wrapping markup in renderAccountDetails
// Replace detail layout headers to use clean classes
appContent = appContent.split('<h2 style="font-size: 1.25rem;">Overview Description</h2>').join('<h2 class="detail-section-title">Overview Description</h2>');
appContent = appContent.split('<h2 style="font-size: 1.125rem;">Collection Walkthrough</h2>').join('<h2 class="detail-section-title">Collection Walkthrough</h2>');
appContent = appContent.split('<h2 style="font-size: 1.125rem;">Account Specifications</h2>').join('<h2 class="detail-section-title">Account Specifications</h2>');

fs.writeFileSync(appPath, appContent, 'utf8');
console.log("Refactoring operations done!");
