const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("FATAL ERROR: MONGODB_URI is not defined in environment variables!");
  process.exit(1);
}

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Successfully connected to MongoDB Central Database.'))
  .catch(err => console.error('MongoDB connection failure:', err));

// Listings Schema
const ListingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  level: { type: Number, required: true },
  rarity: { type: String, default: 'mythic' },
  status: { type: String, default: 'available' }, // available, reserved, sold
  boundType: { type: String, default: 'google' },
  badges: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  elitePasses: { type: Number, default: 0 },
  evoGuns: { type: Number, default: 0 },
  accountAgeYears: { type: Number, default: 4 },
  primeLevel: { type: Number, default: 5 },
  videoUrl: { type: String, default: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  rareItems: [String],
  images: [String],
  views: { type: Number, default: 10 },
  createdAt: { type: Date, default: Date.now }
});

const Listing = mongoose.model('Listing', ListingSchema);

// REST API Routes
// 1. Fetch all listings
app.get('/api/listings', async (req, res) => {
  try {
    const listings = await Listing.find().sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Add a new listing (used by the Telegram Bot)
app.post('/api/listings', async (req, res) => {
  try {
    const { title, slug } = req.body;
    const existing = await Listing.findOne({ slug });
    if (existing) {
      return res.status(400).json({ success: false, error: 'Listing slug conflict: Title already exists.' });
    }

    const listing = new Listing(req.body);
    await listing.save();
    res.status(201).json({ success: true, listing });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Update status or price
app.patch('/api/listings/:id', async (req, res) => {
  try {
    const listing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!listing) return res.status(404).json({ success: false, error: 'Listing not found.' });
    res.json({ success: true, listing });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Delete listing
app.delete('/api/listings/:id', async (req, res) => {
  try {
    const listing = await Listing.findByIdAndDelete(req.params.id);
    if (!listing) return res.status(404).json({ success: false, error: 'Listing not found.' });
    res.json({ success: true, message: 'Listing deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`ShivaayXStore API Server running on port ${PORT}`);
});
