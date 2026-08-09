const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'app.js');
let appContent = fs.readFileSync(appPath, 'utf8');

// 1. Update Welcome Message in createTicketFlow
const oldWelcome = "text: `Hello ${currentUser.username}! Welcome to ShivaayXStore. I've initiated this purchase thread for **${listing.title}** (Price: ₹${listing.price.toLocaleString(\"en-IN\")}).\\n\\nWould you like to lock this account and request secure payment details?`,";
const newWelcome = "text: `Yo ${currentUser.username}! ShivaayXStore me aapka welcome hai. Aapne **${listing.title}** (Price: ₹${listing.price.toLocaleString(\"en-IN\")}) ke liye ticket open kiya hai.\\n\\nKya aap is ID ko lock karke payment details lena chahte hain?`,";

if (appContent.includes(oldWelcome)) {
  appContent = appContent.replace(oldWelcome, newWelcome);
  console.log("Updated Welcome message to Hinglish!");
} else {
  console.log("WARNING: Welcome message match failed!");
}

// 2. Update shortcut button texts
const oldAgreeBtn = 'shortcutHtml = `<button type="button" class="btn btn-ghost btn-sm" id="btn-agree-buy">I agree, lock the account</button>`;';
const newAgreeBtn = 'shortcutHtml = `<button type="button" class="btn btn-ghost btn-sm" id="btn-agree-buy">Ha bhai, ID lock karke payment details do</button>`;';

if (appContent.includes(oldAgreeBtn)) {
  appContent = appContent.replace(oldAgreeBtn, newAgreeBtn);
  console.log("Updated Lock button shortcut text!");
} else {
  console.log("WARNING: Lock button match failed!");
}

const oldRequestBtn = 'shortcutHtml = `<button type="button" class="btn btn-ghost btn-sm" id="btn-request-logins">Request handover details</button>`;';
const newRequestBtn = 'shortcutHtml = `<button type="button" class="btn btn-ghost btn-sm" id="btn-request-logins">Handover login details de do</button>`;';

if (appContent.includes(oldRequestBtn)) {
  appContent = appContent.replace(oldRequestBtn, newRequestBtn);
  console.log("Updated Handover button shortcut text!");
} else {
  console.log("WARNING: Handover button match failed!");
}

// 3. Update simulateBotReply text segments
const oldStage1Text = "botReply = `Excellent decision! I have successfully reserved the account for you. It is locked and marked as **Reserved** in the catalog.\\n\\nHere are the payment details for your purchase of **₹${currentTicket.listingPrice.toLocaleString(\"en-IN\")}**:\\n- **UPI ID**: \\`ShivaayXStore@upi\\`\\n- **Scanner**: (UPI Code validated)\\n\\nOnce payment is complete, type 'PAID' or press the simulated payment button below to complete validation.`;";
const newStage1Text = "botReply = `Bhai, aapki ID reserve ho chuki hai! Catalog me isko **Reserved** mark kar diya hai.\\n\\n**Payment Details (₹${currentTicket.listingPrice.toLocaleString(\"en-IN\")}):**\\n- **UPI ID**: \\`ShivaayXStore@upi\\`\\n\\nPayment complete hone ke baad yaha screenshot bhej dijiye ya niche simulated payment button par click karein!`;";

if (appContent.includes(oldStage1Text)) {
  appContent = appContent.replace(oldStage1Text, newStage1Text);
  console.log("Updated Stage 1 reply to Hinglish!");
} else {
  console.log("WARNING: Stage 1 reply match failed!");
}

const oldStage1Fallback = 'botReply = "I understand. If you have any questions about the badges, Evo weapons, or logins of this ID, let me know! Ready to proceed when you are.";';
const newStage1Fallback = 'botReply = "Thik hai bhai. Agar badges, Evo guns ya kisi chiz ka doubt ho toh pooch lena. Jab ready ho toh bata dena!";';

if (appContent.includes(oldStage1Fallback)) {
  appContent = appContent.replace(oldStage1Fallback, newStage1Fallback);
  console.log("Updated Stage 1 fallback to Hinglish!");
} else {
  console.log("WARNING: Stage 1 fallback match failed!");
}

const oldStage2Text = 'botReply = "Checking transaction ledger... Payment verified successfully! The fund transfer of ₹" + currentTicket.listingPrice.toLocaleString("en-IN") + " has been logged.\\n\\nPress the request logins button or type \'Logins\' to receive access codes.";';
const newStage2Text = 'botReply = "Ledger check kar liya hai... Payment receive ho gayi hai bhai! Handover credentials ready ho rahi hain. Login details lene ke liye niche button par click karein ya \'Logins\' type karein.";';

if (appContent.includes(oldStage2Text)) {
  appContent = appContent.replace(oldStage2Text, newStage2Text);
  console.log("Updated Stage 2 reply to Hinglish!");
} else {
  console.log("WARNING: Stage 2 reply match failed!");
}

const oldStage2Fallback = 'botReply = "Awaiting verification. Please transfer the balance to UPI: `ShivaayXStore@upi` and message back. We lock listings for up to 2 hours only.";';
const newStage2Fallback = 'botReply = "Awaiting verification. Payment complete karke message kijiye. ID bas 2 ghante tak reserved rahegi.";';

if (appContent.includes(oldStage2Fallback)) {
  appContent = appContent.replace(oldStage2Fallback, newStage2Fallback);
  console.log("Updated Stage 2 fallback to Hinglish!");
} else {
  console.log("WARNING: Stage 2 fallback match failed!");
}

const oldStage3Text = "botReply = `Here are your secure handover credentials. Please secure them immediately:\\n\\n- **Login Email (Google Bound)**: \\`ShivaayX_player_\${Math.floor(1000 + Math.random() * 9000)}@gmail.com\\`\\n- **Password**: \\`bx_pass_\${Math.floor(100000 + Math.random() * 900000)}\\`\\n- **Linked Recovery Mail**: \\`ShivaayX_backup@gmail.com\\`\\n\\n**Security instructions**:\\n1. Log in on your device.\\n2. Navigate to security settings and replace the recovery number with yours.\\n3. Turn on two-factor authentication.\\n\\nThank you for shopping at ShivaayXStore! This ticket is now closed.`;";
const newStage3Text = "botReply = `Ye lijiye aapki secure login details:\\n\\n- **Google Login**: \\`ShivaayX_player_\${Math.floor(1000 + Math.random() * 9000)}@gmail.com\\`\\n- **Password**: \\`bx_pass_\${Math.floor(100000 + Math.random() * 900000)}\\`\\n- **Recovery Email**: \\`ShivaayX_backup@gmail.com\\`\\n\\n**Bohut important instructions**:\\n1. ID ko device me login karein.\\n2. Google security settings me recovery details ko change kar lein.\\n3. Two-factor authentication (2FA) ON kar lein.\\n\\nShivaayXStore se shopping karne ke liye thank you! Ye ticket ab close ho gayi hai.`;";

if (appContent.includes(oldStage3Text)) {
  appContent = appContent.replace(oldStage3Text, newStage3Text);
  console.log("Updated Stage 3 reply to Hinglish!");
} else {
  console.log("WARNING: Stage 3 reply match failed!");
}

const oldStage3Fallback = 'botReply = "Your account is secured. Ready to hand over credentials. Type \'logins\' to request them.";';
const newStage3Fallback = 'botReply = "Account ready hai handover ke liye. Credentials lene ke liye \'logins\' type kijiye.";';

if (appContent.includes(oldStage3Fallback)) {
  appContent = appContent.replace(oldStage3Fallback, newStage3Fallback);
  console.log("Updated Stage 3 fallback to Hinglish!");
} else {
  console.log("WARNING: Stage 3 fallback match failed!");
}

const oldStage4Text = 'botReply = "This transaction has been completed. If you need support with another account, please browse catalog and start a new ticket thread.";';
const newStage4Text = 'botReply = "Ye deal complete ho chuki hai bhai! Agar koi doosri ID pasand aaye toh naya ticket open kar lena.";';

if (appContent.includes(oldStage4Text)) {
  appContent = appContent.replace(oldStage4Text, newStage4Text);
  console.log("Updated Stage 4 reply to Hinglish!");
} else {
  console.log("WARNING: Stage 4 reply match failed!");
}

fs.writeFileSync(appPath, appContent, 'utf8');
