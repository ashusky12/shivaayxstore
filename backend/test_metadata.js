const Database = require('better-sqlite3');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

function getYoutubeCredentials() {
  const dbPath = 'C:\\Users\\immad\\.gemini\\antigravity\\scratch\\auto-shorts-uploader\\database.sqlite';
  const db = new Database(dbPath);
  const rows = db.prepare('SELECT * FROM settings').all();
  const settings = {};
  rows.forEach(r => settings[r.key] = r.value);
  db.close();
  return settings;
}

function cleanAndParseJson(text) {
  let cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
  const firstBrace = cleaned.indexOf('{');
  if (firstBrace === -1) {
    throw new Error('No JSON object found in AI response');
  }
  cleaned = cleaned.substring(firstBrace);
  return JSON.parse(cleaned);
}

async function fetchTrendingTagsFromYouTube(keywords) {
  try {
    const tags = new Set(['Shorts', 'FreeFire', 'GarenaFreeFire', 'FFShorts', 'Trending', 'FreeFireShorts', 'FFID']);
    const itemsToQuery = keywords && keywords.length > 0 ? keywords.slice(0, 3) : ['Account Sale', 'Evo Guns'];

    for (const kw of itemsToQuery) {
      const query = `free fire ${kw}`.toLowerCase();
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
    return ['Shorts', 'FreeFire', 'FFShorts', 'GarenaFreeFire', 'Trending'];
  }
}

async function testMetadata() {
  const data = {
    title: "Free fire id sell level 77",
    price: 6500,
    level: 77,
    rarity: "legendary",
    description: "Rare old id for sale level 77 cobra max hiphop",
    badges: 450,
    evoGuns: 7,
    rareItems: ["Cobra MP40", "Hip Hop Bundle", "Sakura Mask"]
  };

  console.log("Mock Input Data:", data);

  const settings = getYoutubeCredentials();
  const apiKey = settings.gemini_api_key;
  if (!apiKey) {
    console.error("Gemini API key is not configured.");
    return;
  }

  console.log("Gemini API Key Found. Starting autocomplete scraping...");
  const trendingTags = await fetchTrendingTagsFromYouTube(data.rareItems);
  console.log("Scraped YouTube Trending Tags:", trendingTags);

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-3.5-flash',
    generationConfig: { responseMimeType: 'application/json' }
  });

  const prompt = `You are a professional gaming store marketing manager. Review these specifications for a Free Fire account listing:
  - Title: ${data.title}
  - Price: INR ${data.price}
  - Level: ${data.level}
  - Rarity Tier: ${data.rarity}
  - Description: ${data.description}
  - Badges: ${data.badges}
  - Evo Guns Count: ${data.evoGuns}
  - Rare Items: ${data.rareItems.join(', ')}

  Generate the optimized metadata for two different platforms separately:
  1. For YouTube Shorts (video upload):
     - Generate a viral, highly click-worthy YouTube Title (under 100 characters, include emojis, no hashtags in title). Do NOT include the price in the YouTube title to create curiosity and drive traffic to the website!
     - Generate a massive, engaging YouTube Description. Emphasize the Evo Guns and Rare Items. Add call-to-actions to subscribe, visit the shop website ShivaayXStore, and contact details. Exclude technical terms like database boundTypes. Include trending hashtags.
  2. For our Website listing:
     - Generate a refined, clean Website Title (under 40 characters for UI styling).
     - Generate a refined, professional Website Description (bullet points format detailing the bundle skins, stats, and rarity for buyers).

  Return a JSON object:
  {
    "youtubeTitle": "...",
    "youtubeDescription": "...",
    "websiteTitle": "...",
    "websiteDescription": "..."
  }`;

  console.log("Calling Gemini API to expand details...");
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const parsed = cleanAndParseJson(text);

  let finalYtDesc = parsed.youtubeDescription;
  finalYtDesc += `\n\n🔍 Queries Solved / Trending Search Terms:\n` + trendingTags.map((t, idx) => `${idx + 1}. ${t}`).join('\n');
  finalYtDesc += `\n\n` + trendingTags.slice(0, 8).map(t => `#${t.replace(/\s+/g, '')}`).join(' ');

  console.log("\n=================== RESULT FOR WEBSITE ===================");
  console.log("Website Title:", parsed.websiteTitle);
  console.log("Website Description:\n", parsed.websiteDescription);

  console.log("\n=================== RESULT FOR YOUTUBE SHORTS ===================");
  console.log("YouTube Title:", parsed.youtubeTitle);
  console.log("YouTube Tags:", trendingTags);
  console.log("YouTube Description:\n", finalYtDesc);
}

testMetadata();
