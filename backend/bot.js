const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const cloudinary = require('cloudinary').v2;
const Database = require('better-sqlite3');
const { google } = require('googleapis');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { GoogleAIFileManager } = require('@google/generative-ai/files');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Verify credentials
const token = process.env.TELEGRAM_BOT_TOKEN;
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!token || !cloudName || !apiKey || !apiSecret) {
  console.error("FATAL ERROR: Environment credentials missing!");
  process.exit(1);
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret
});

const BotConstructor = typeof TelegramBot === 'function' ? TelegramBot : TelegramBot.default;
const bot = new BotConstructor(token, { polling: true });
const PORT = process.env.PORT || 5000;
const BACKEND_URL = `http://localhost:${PORT}/api/listings`;

// In-memory state tracking
const userStates = {};

console.log("ShivaayXStore Telegram Bot active...");

// Log polling errors explicitly
bot.on('polling_error', (error) => {
  console.error("TELEGRAM POLLING ERROR:", error.code, error.message);
});

// Helper to query YouTube/Gemini credentials from auto-shorts-uploader database
function getYoutubeCredentials() {
  const dbPath = 'C:\\Users\\immad\\.gemini\\antigravity\\scratch\\auto-shorts-uploader\\database.sqlite';
  if (!fs.existsSync(dbPath)) {
    throw new Error("Shorts Uploader database missing!");
  }

  const db = new Database(dbPath);
  const rows = db.prepare('SELECT * FROM settings').all();
  const settings = {};
  rows.forEach(r => settings[r.key] = r.value);
  db.close();

  return settings;
}

// Scrape YouTube Autocomplete for actual trending search terms based on tags (India Server optimized)
async function fetchTrendingTagsFromYouTube(keywords) {
  try {
    console.log(`[BOT] Fetching live tags for: ${keywords.join(', ')}`);
    const tags = new Set(['Shorts', 'FreeFire', 'GarenaFreeFire', 'FFShorts', 'Trending', 'FreeFireShorts', 'FFID', 'FreeFireIndia', 'FFIndia', 'IndiaServer']);
    
    const itemsToQuery = keywords && keywords.length > 0 ? keywords.slice(0, 3) : ['Account Sale', 'Evo Guns'];

    for (const kw of itemsToQuery) {
      const query = `free fire ${kw} india`.toLowerCase();
      const res = await axios.get(`http://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=${encodeURIComponent(query)}`);
      
      if (res.data && Array.isArray(res.data[1])) {
        res.data[1].forEach(suggestion => {
          const cleanTag = suggestion.replace(/[^a-zA-Z0-9\s]/g, '').trim();
          if (cleanTag && cleanTag.length < 30) {
            tags.add(cleanTag);
          }
        });
      }
    }
    
    return Array.from(tags).slice(0, 15);
  } catch (err) {
    return ['Shorts', 'FreeFire', 'FFShorts', 'GarenaFreeFire', 'Trending', 'FreeFireIndia'];
  }
}

// Helper to upload video to YouTube Shorts using OAuth credentials
async function uploadTelegramVideoToYoutube(filePath, title, description, tags) {
  const settings = getYoutubeCredentials();
  const clientId = settings.youtube_client_id;
  const clientSecret = settings.youtube_client_secret;
  const refreshToken = settings.youtube_refresh_token;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("OAuth tokens missing in settings!");
  }

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    settings.youtube_redirect_uri || 'http://localhost:3000/oauth2callback'
  );

  oauth2Client.setCredentials({
    refresh_token: refreshToken
  });

  const youtube = google.youtube({
    version: 'v3',
    auth: oauth2Client
  });

  console.log(`[BOT] Uploading ${filePath} to YouTube...`);

  const tagsList = tags && tags.length > 0 ? tags : ['Shorts', 'FreeFire', 'ShivaayXStore'];
  if (!tagsList.some(t => t.toLowerCase() === 'shorts')) {
    tagsList.push('Shorts');
  }

  let finalDescription = description || '';
  if (!finalDescription.toLowerCase().includes('#shorts')) {
    finalDescription += '\n\n#Shorts';
  }

  const response = await youtube.videos.insert({
    part: 'id,snippet,status',
    notifySubscribers: true,
    requestBody: {
      snippet: {
        title: title.substring(0, 100),
        description: finalDescription,
        tags: tagsList,
        categoryId: '20'
      },
      status: {
        privacyStatus: settings.youtube_default_visibility || 'public',
        selfDeclaredMadeForKids: false
      }
    },
    media: {
      body: fs.createReadStream(filePath)
    }
  });

  return response.data.id;
}

// Helper to generate metadata for Unified Wizard Mode using Gemini
async function generateWizardSpecs(hint, targetMode) {
  const settings = getYoutubeCredentials();
  const apiKey = settings.gemini_api_key;
  if (!apiKey) {
    throw new Error("Gemini API key missing!");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-3.5-flash',
    generationConfig: { responseMimeType: 'application/json' }
  });

  const prompt = `You are a professional database parser and digital marketer for ShivaayXStore.
Analyze the admin's raw text prompt/hint describing a Free Fire account and generate structured listing data.
Note: ALL accounts belong to the India Server. You MUST explicitly mention "India Server" or "IND Server" in both the website title/description and the YouTube title/description.

Return a strictly valid JSON object. Ensure all newline characters inside string values are properly escaped as '\\n' (do not use literal unescaped newlines):
{
  "title": "A clean Website Title (under 40 chars, e.g. S10 IND Stacked ID)",
  "price": price extracted from hint (integer, or default to 3999 if not found),
  "level": level extracted from hint (integer, or default to 65 if not found),
  "rarity": "mythic" or "legendary",
  "description": "A refined, detailed catalog description in bullet points format for the website catalog page. Include a bullet point: • Server: India (IND)",
  "badges": badges count (integer, or 120 if not found),
  "evoGuns": evo guns count (integer, or 1 if not found),
  "rareItems": [list of rare bundle/weapon names],
  "youtubeTitle": "A massive, viral, engaging YouTube title under 100 characters with emojis including IND Server context. Do NOT include the price in this title.",
  "youtubeDescription": "A massive, detailed description for YouTube Shorts highlighting that it is an India Server account. Describe items, add call-to-actions to purchase on ShivaayXStore website, and standard tags."
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return cleanAndParseJson(text);
}

// JSON parsing helper
function cleanAndParseJson(text) {
  let cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
  const firstBrace = cleaned.indexOf('{');
  if (firstBrace === -1) {
    throw new Error('No JSON object found in AI response');
  }
  cleaned = cleaned.substring(firstBrace);
  return JSON.parse(cleaned);
}

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  userStates[chatId] = null;

  let settings = {};
  try {
    settings = getYoutubeCredentials();
  } catch(e) {}

  if (settings.webapp_url) {
    try {
      const cleanUrl = settings.webapp_url.split('?')[0];
      const mainWebsiteUrl = cleanUrl.replace('/tgapp.html', '') || 'https://shivaayxstore-1mkjdrpjg-immadhukarsarkar-5758s-projects.vercel.app/';
      const adminUrl = `${mainWebsiteUrl}/#/admin`;
      bot.setChatMenuButton({
        chat_id: chatId,
        menu_button: {
          type: 'web_app',
          text: 'VISIT',
          web_app: { url: adminUrl }
        }
      });
    } catch(e) {
      console.error("Failed to set chat menu button:", e.message);
    }
  }
  
  const text = `🔴 <b>SHIVAAYXSTORE ADMIN</b> 🔴\n━━━━━━━━━━━━━━━\nSelect option below:`;

  const keyboardMarkup = {
    keyboard: [
      [{ text: "🟩 Website" }, { text: "🟦 YouTube" }],
      [{ text: "🟧 Both" }, { text: "🟨 Stock" }],
      [{ text: "🟪 Stats" }, { text: "🟥 Refresh" }]
    ],
    resize_keyboard: true,
    one_time_keyboard: false
  };

  bot.sendMessage(chatId, text, { parse_mode: 'HTML', reply_markup: keyboardMarkup });
});

// Command to save custom Web App URL in settings SQLite database
bot.onText(/\/setapp (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const url = match[1].trim();

  try {
    const dbPath = 'C:\\Users\\immad\\.gemini\\antigravity\\scratch\\auto-shorts-uploader\\database.sqlite';
    const db = new Database(dbPath);
    db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run('webapp_url', url);
    db.close();

    bot.sendMessage(chatId, `✅ <b>Web App URL Saved!</b>\n\nUrl: <code>${url}</code>\n\nType /start to load custom colored buttons panel.`, { parse_mode: 'HTML' });
  } catch(e) {
    bot.sendMessage(chatId, "❌ Failed to save URL: " + e.message);
  }
});

// Listener for Web App callback data (resolves color background clicks)
bot.on('web_app_data', async (msg) => {
  const chatId = msg.chat.id;
  const data = msg.web_app_data.data;
  console.log(`[BOT] Received Web App data: "${data}"`);

  // Forward the selected category text to the message handler
  msg.text = data;
  bot.emit('message', msg);
});

// New listing start command (Default hybrid mode)
bot.onText(/\/new/, (msg) => {
  const chatId = msg.chat.id;
  startWizardFlow(chatId, 'both');
});

function startWizardFlow(chatId, targetMode) {
  userStates[chatId] = {
    step: 'WIZARD_IMAGE',
    target: targetMode,
    data: {}
  };
  
  bot.sendMessage(chatId, `🟢 <b>STEP 1/3: PHOTO</b> 🟢\n━━━━━━━━━━━━━━━\nPhoto send/upload karein:`, { parse_mode: 'HTML' });
}

// Fetch stock and display with inline control buttons
async function handleViewStock(chatId) {
  try {
    bot.sendMessage(chatId, "⏳ <code>Fetching stock...</code>", { parse_mode: 'HTML' });
    const res = await axios.get(BACKEND_URL);
    const listings = res.data;

    if (!listings || listings.length === 0) {
      bot.sendMessage(chatId, "📭 <code>Stock empty.</code>", { parse_mode: 'HTML' });
      return;
    }

    for (let l of listings) {
      const text = `
📦 <b>Product</b>: <code>${l.title}</code>
💵 <b>Price</b>: <code>₹${l.price.toLocaleString("en-IN")}</code>
⚡ <b>Level</b>: <code>${l.level}</code>
🏷️ <b>Status</b>: ${l.status === 'available' ? '🟢 Available' : l.status === 'reserved' ? '🟡 Reserved' : '🔴 Sold'}
      `;

      const inlineKeyboard = {
        inline_keyboard: [
          [
            { text: l.status === 'sold' ? "🟢 Make Available" : "🔴 Mark Sold", callback_data: `toggle_${l._id}` }
          ],
          [
            { text: "✏️ Edit Price", callback_data: `editprice_${l._id}` },
            { text: "❌ Delete", callback_data: `del_${l._id}` }
          ]
        ]
      };

      bot.sendMessage(chatId, text, { parse_mode: 'HTML', reply_markup: inlineKeyboard });
    }
  } catch (err) {
    bot.sendMessage(chatId, "❌ <code>Failed: " + err.message + "</code>", { parse_mode: 'HTML' });
  }
}

// Callback Query listener (Handles inline button clicks)
bot.on('callback_query', async (callbackQuery) => {
  const message = callbackQuery.message;
  const chatId = message.chat.id;
  const data = callbackQuery.data;

  try {
    bot.answerCallbackQuery(callbackQuery.id);
  } catch (e) {}

  try {
    if (data === "view_stock") {
      await handleViewStock(chatId);
    } 
    else if (data === "add_new") {
      startWizardFlow(chatId, 'both');
    } 
    else if (data.startsWith("toggle_")) {
      const id = data.split("toggle_")[1];
      const res = await axios.get(BACKEND_URL);
      const item = res.data.find(l => l._id === id);

      if (!item) {
        bot.sendMessage(chatId, "❌ <code>Not found.</code>", { parse_mode: 'HTML' });
        return;
      }

      const newStatus = item.status === 'sold' ? 'available' : 'sold';
      
      await axios.patch(`${BACKEND_URL}/${id}`, { status: newStatus });
      bot.sendMessage(chatId, `✅ Updated: <code>${item.title}</code> -> <code>${newStatus.toUpperCase()}</code>`, { parse_mode: 'HTML' });
    } 
    else if (data.startsWith("editprice_")) {
      const id = data.split("editprice_")[1];
      
      userStates[chatId] = {
        step: 'AWAITING_NEW_PRICE',
        targetId: id
      };
      
      bot.sendMessage(chatId, "✏️ Enter <b>New Price (₹)</b>:", { parse_mode: 'HTML' });
    }
    else if (data.startsWith("del_")) {
      const id = data.split("del_")[1];
      await axios.delete(`${BACKEND_URL}/${id}`);
      bot.sendMessage(chatId, "🗑️ <code>Deleted.</code>", { parse_mode: 'HTML' });
    }
  } catch (err) {
    bot.sendMessage(chatId, "❌ <code>Failed: " + err.message + "</code>", { parse_mode: 'HTML' });
  }
});

// Process Unified Wizard logic after hint text is received
async function processUnifiedWizard(chatId, state, hintText) {
  try {
    bot.sendMessage(chatId, "🤖 <code>AI Processing...</code>", { parse_mode: 'HTML' });
    const aiData = await generateWizardSpecs(hintText, state.target);

    let ytId = null;

    if ((state.target === 'youtube' || state.target === 'both') && state.tempPath) {
      const trendingTags = await fetchTrendingTagsFromYouTube(aiData.rareItems || []);

      let finalYtDesc = aiData.youtubeDescription;
      finalYtDesc += `\n\n🔍 Queries Solved:\n` + trendingTags.map((t, idx) => `${idx + 1}. ${t}`).join('\n');
      finalYtDesc += `\n\n` + trendingTags.slice(0, 8).map(t => `#${t.replace(/\s+/g, '')}`).join(' ');

      bot.sendMessage(chatId, "🚀 <code>Uploading to YouTube...</code>", { parse_mode: 'HTML' });
      ytId = await uploadTelegramVideoToYoutube(state.tempPath, aiData.youtubeTitle, finalYtDesc, trendingTags);

      try {
        fs.unlinkSync(state.tempPath);
      } catch(e) {}
    }

    if (state.target === 'web' || state.target === 'both') {
      bot.sendMessage(chatId, "💾 <code>Saving to Database...</code>", { parse_mode: 'HTML' });

      const videoUrl = ytId 
        ? `https://www.youtube.com/embed/${ytId}` 
        : 'https://www.youtube.com/embed/dQw4w9WgXcQ';

      const payload = {
        title: aiData.title,
        slug: aiData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""),
        description: aiData.description,
        price: aiData.price,
        level: aiData.level,
        rarity: aiData.rarity,
        status: 'available',
        boundType: 'google',
        badges: aiData.badges || 120,
        evoGuns: aiData.evoGuns || 1,
        rareItems: aiData.rareItems,
        videoUrl: videoUrl,
        images: [state.data.imageUrl, "/uploads/screenshot_butcher.jpg", "/uploads/screenshot_nox.jpg"],
        createdAt: new Date().toISOString()
      };

      await axios.post(BACKEND_URL, payload);
      state.data.slug = payload.slug;
      state.data.title = payload.title;
      state.data.price = payload.price;
    }

    let successMsg = `🎉 <b>PUBLISHED!</b> 🎉\n━━━━━━━━━━━━━━━\n`;
    
    if (state.target === 'web' || state.target === 'both') {
      successMsg += `\n🌐 <b>Web Link</b>: <code>http://localhost:3000/#/accounts/${state.data.slug}</code>`;
    }

    if (ytId) {
      successMsg += `\n📹 <b>YouTube Link</b>: <code>https://youtu.be/${ytId}</code>`;
    }

    userStates[chatId] = null;
    bot.sendMessage(chatId, successMsg, { parse_mode: 'HTML' });

  } catch(err) {
    bot.sendMessage(chatId, "❌ <code>Failed: " + err.message + "</code>", { parse_mode: 'HTML' });
    if (state.tempPath && fs.existsSync(state.tempPath)) {
      try { fs.unlinkSync(state.tempPath); } catch(e) {}
    }
    userStates[chatId] = null;
  }
}

// Handle incoming video files from Telegram inside Wizard Mode
async function handleIncomingVideoFile(msg, fileObj) {
  const chatId = msg.chat.id;
  const state = userStates[chatId];

  if (!state || state.step !== 'WIZARD_VIDEO') {
    bot.sendMessage(chatId, "⚠️ <code>Send Photo first.</code>", { parse_mode: 'HTML' });
    return;
  }

  try {
    bot.sendMessage(chatId, "📹 <code>Downloading video...</code>", { parse_mode: 'HTML' });
    
    const fileId = fileObj.file_id;
    const fileUrl = await bot.getFileLink(fileId);
    
    const tempPath = path.join(__dirname, `temp_${Date.now()}.mp4`);
    
    const response = await axios({
      method: 'GET',
      url: fileUrl,
      responseType: 'stream'
    });
    
    const writer = fs.createWriteStream(tempPath);
    response.data.pipe(writer);
    
    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    state.tempPath = tempPath;
    state.fileName = fileObj.file_name || 'walkthrough.mp4';

    state.step = 'WIZARD_HINT';
    bot.sendMessage(chatId, `🟡 <b>STEP 3/3: SPECS</b> 🟡\n━━━━━━━━━━━━━━━\nSpecs type/write karein (e.g. *level 70 s2 hiphop price 1000*):`, { parse_mode: 'HTML' });

  } catch (err) {
    bot.sendMessage(chatId, "⚠️ <code>Failed: " + err.message + "</code>", { parse_mode: 'HTML' });
    userStates[chatId] = null;
  }
}

// Video attachment listener
bot.on('video', async (msg) => {
  await handleIncomingVideoFile(msg, msg.video);
});

// Document attachment listener
bot.on('document', async (msg) => {
  const doc = msg.document;
  if (doc && doc.mime_type && doc.mime_type.startsWith('video/')) {
    await handleIncomingVideoFile(msg, doc);
  }
});

// Photo listener (Handles initial Step 1 upload step for all Wizard modes)
bot.on('photo', async (msg) => {
  const chatId = msg.chat.id;
  const state = userStates[chatId];

  if (!state || state.step !== 'WIZARD_IMAGE') {
    bot.sendMessage(chatId, "⚠️ <code>Type a command or /start first.</code>", { parse_mode: 'HTML' });
    return;
  }

  try {
    bot.sendMessage(chatId, "📸 <code>Uploading photo...</code>", { parse_mode: 'HTML' });

    const fileId = msg.photo[msg.photo.length - 1].file_id;
    const fileUrl = await bot.getFileLink(fileId);

    const uploadRes = await cloudinary.uploader.upload(fileUrl, { folder: 'shivaayxstore_uploads' });
    state.data.imageUrl = uploadRes.secure_url;

    state.step = 'WIZARD_VIDEO';
    
    if (state.target === 'web') {
      bot.sendMessage(chatId, `🔵 <b>STEP 2/3: VIDEO</b> 🔵\n━━━━━━━━━━━━━━━\nVideo send karein (Skip ke liye send /skip):`, { parse_mode: 'HTML' });
    } else {
      bot.sendMessage(chatId, `🔵 <b>STEP 2/3: VIDEO</b> 🔵\n━━━━━━━━━━━━━━━\nVideo send/upload karein:`, { parse_mode: 'HTML' });
    }
  } catch (err) {
    bot.sendMessage(chatId, "❌ <code>Failed: " + err.message + "</code>", { parse_mode: 'HTML' });
  }
});

// Message listener (Handles text inputs and menu buttons)
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  
  if (msg.photo || msg.video || msg.document) return;

  const text = msg.text ? msg.text.trim() : '';
  console.log(`[BOT] Incoming text: "${text}"`);

  if (text === "🟨 Stock") {
    await handleViewStock(chatId);
    return;
  }
  if (text === "🟩 Website") {
    startWizardFlow(chatId, 'web');
    return;
  }
  if (text === "🟦 YouTube") {
    startWizardFlow(chatId, 'youtube');
    return;
  }
  if (text === "🟧 Both") {
    startWizardFlow(chatId, 'both');
    return;
  }
  if (text === "➕ Add New Account") {
    startWizardFlow(chatId, 'both');
    return;
  }
  if (text === "🟪 Stats") {
    try {
      bot.sendMessage(chatId, "⏳ <code>Calculating...</code>", { parse_mode: 'HTML' });
      const res = await axios.get(BACKEND_URL);
      const listings = res.data;

      const total = listings.length;
      const available = listings.filter(l => l.status === 'available').length;
      const sold = listings.filter(l => l.status === 'sold').length;

      const revenue = listings.filter(l => l.status === 'sold').reduce((sum, l) => sum + (l.price || 0), 0);
      const stockVal = listings.filter(l => l.status === 'available').reduce((sum, l) => sum + (l.price || 0), 0);

      const statsText = `
📊 <b>Stock Statistics</b>
• Total: <code>${total}</code>
• Available: <code>${available}</code> 🟢
• Sold: <code>${sold}</code> 🔴
• Sales: <code>₹${revenue.toLocaleString("en-IN")}</code>
• Stock Value: <code>₹${stockVal.toLocaleString("en-IN")}</code>
      `;
      bot.sendMessage(chatId, statsText, { parse_mode: 'HTML' });
    } catch (err) {
      bot.sendMessage(chatId, "❌ <code>Failed: " + err.message + "</code>", { parse_mode: 'HTML' });
    }
    return;
  }
  if (text === "🟥 Refresh") {
    try {
      await axios.get(BACKEND_URL);
      bot.sendMessage(chatId, "⚡ Status: <b>Connected 🟢</b>", { parse_mode: 'HTML' });
    } catch(e) {
      bot.sendMessage(chatId, "⚡ Status: <b>Disconnected 🔴</b>", { parse_mode: 'HTML' });
    }
    return;
  }

  if (text === '/start' || text === '/new') return;

  const state = userStates[chatId];
  if (!state) return;

  const currentStep = state.step;

  try {
    if (currentStep === 'AWAITING_NEW_PRICE') {
      const newPrice = parseInt(text);
      if (isNaN(newPrice)) {
        bot.sendMessage(chatId, "⚠️ <code>Enter numbers only:</code>", { parse_mode: 'HTML' });
        return;
      }
      
      const id = state.targetId;
      await axios.patch(`${BACKEND_URL}/${id}`, { price: newPrice });
      
      userStates[chatId] = null;
      bot.sendMessage(chatId, `✅ Updated: <code>₹${newPrice.toLocaleString("en-IN")}</code>`, { parse_mode: 'HTML' });
      return;
    }

    if (currentStep === 'WIZARD_VIDEO') {
      const lowerText = text.toLowerCase();
      if (lowerText === '/skip' || lowerText === 'skip' || lowerText === 'next' || lowerText === '/next') {
        if (state.target === 'web') {
          state.tempPath = null;
          state.step = 'WIZARD_HINT';
          bot.sendMessage(chatId, `🟡 <b>STEP 3/3: SPECS</b> 🟡\n━━━━━━━━━━━━━━━\nSpecs type/write karein (e.g. *level 70 s2 hiphop price 1000*):`, { parse_mode: 'HTML' });
        } else {
          bot.sendMessage(chatId, "⚠️ <code>Video required. Send video:</code>", { parse_mode: 'HTML' });
        }
      } else {
        bot.sendMessage(chatId, "⚠️ <code>Send video file, or /skip:</code>", { parse_mode: 'HTML' });
      }
      return;
    }

    if (currentStep === 'WIZARD_HINT') {
      await processUnifiedWizard(chatId, state, text);
      return;
    }
  } catch (err) {
    bot.sendMessage(chatId, "❌ <code>Error: " + err.message + "</code>", { parse_mode: 'HTML' });
  }
});
