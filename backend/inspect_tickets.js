const mongoose = require('mongoose');
require('dotenv').config();

const TicketSchema = new mongoose.Schema({
  id: String,
  listingId: String,
  listingTitle: String,
  price: Number,
  userEmail: String,
  username: String,
  status: String,
  discordChannelId: String,
  createdAt: Date
});

const Ticket = mongoose.model('Ticket', TicketSchema);

async function inspect() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to DB!");
  const tickets = await Ticket.find().sort({ createdAt: -1 });
  console.log("Found tickets count:", tickets.length);
  tickets.forEach(t => {
    console.log(`Ticket ID: ${t.id} | User: ${t.username} | Title: ${t.listingTitle} | Channel: ${t.discordChannelId} | Created: ${t.createdAt}`);
  });
  process.exit(0);
}

inspect();
