const fs = require('fs');
const path = require('path');

const serverPath = path.join(__dirname, '..', 'backend', 'server.js');
let serverContent = fs.readFileSync(serverPath, 'utf8');

// The replacement target block at the end of server.js
const targetCode = `// 4. Delete listing
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
  console.log(\`ShivaayXStore API Server running on port \${PORT}\`);
});`;

const replacementCode = `// 4. Delete listing
app.delete('/api/listings/:id', async (req, res) => {
  try {
    const listing = await Listing.findByIdAndDelete(req.params.id);
    if (!listing) return res.status(404).json({ success: false, error: 'Listing not found.' });
    res.json({ success: true, message: 'Listing deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- TICKETS AND CHAT SCHEMAS & DATABASE ---
const TicketSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // ticket_123456
  listingId: { type: String },
  listingTitle: { type: String },
  price: { type: Number },
  userEmail: { type: String },
  username: { type: String },
  status: { type: String, default: 'open' },
  discordChannelId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const TicketMessageSchema = new mongoose.Schema({
  ticketId: { type: String, required: true },
  sender: { type: String, required: true }, // buyer, admin
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Ticket = mongoose.model('Ticket', TicketSchema);
const TicketMessage = mongoose.model('TicketMessage', TicketMessageSchema);

// --- DISCORD CLIENT INTEGRATION ---
const { Client, GatewayIntentBits, ChannelType } = require('discord.js');

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID;
const DISCORD_CATEGORY_ID = process.env.DISCORD_CATEGORY_ID;

let discordClient = null;

if (DISCORD_BOT_TOKEN && DISCORD_GUILD_ID) {
  discordClient = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent
    ]
  });

  discordClient.on('ready', () => {
    console.log(\`Discord Support Bot logged in as \${discordClient.user.tag}\`);
  });

  discordClient.on('messageCreate', async (message) => {
    // Ignore bot messages
    if (message.author.bot) return;

    try {
      // Find if this channel is mapped to a ticket
      const ticket = await Ticket.findOne({ discordChannelId: message.channel.id });
      if (ticket) {
        const ticketMessage = new TicketMessage({
          ticketId: ticket.id,
          sender: 'admin',
          text: message.content
        });
        await ticketMessage.save();
        console.log(\`Synced admin message from Discord channel \${message.channel.name}: \${message.content}\`);
      }
    } catch (err) {
      console.error('Error syncing message from Discord:', err);
    }
  });

  discordClient.login(DISCORD_BOT_TOKEN).catch(err => {
    console.error('Discord support bot login failure:', err);
  });
} else {
  console.warn("WARNING: Discord Bot configuration is incomplete. DISCORD_BOT_TOKEN or DISCORD_GUILD_ID is missing.");
}

// --- TICKETS API ROUTES ---

// 1. Fetch user tickets
app.get('/api/tickets/user/:email', async (req, res) => {
  try {
    const userTickets = await Ticket.find({ userEmail: req.params.email }).sort({ createdAt: -1 });
    res.json({ success: true, tickets: userTickets });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Fetch all messages for a ticket
app.get('/api/tickets/:id/messages', async (req, res) => {
  try {
    const messages = await TicketMessage.find({ ticketId: req.params.id }).sort({ createdAt: 1 });
    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Create a new support ticket (and create a channel on Discord)
app.post('/api/tickets', async (req, res) => {
  try {
    const { id, listingId, listingTitle, price, userEmail, username } = req.body;
    
    let ticket = await Ticket.findOne({ id });
    if (!ticket) {
      ticket = new Ticket({ id, listingId, listingTitle, price, userEmail, username });
      await ticket.save();
      
      // If Discord Client is active, create channel in Guild!
      if (discordClient && discordClient.readyAt) {
        try {
          const guild = await discordClient.guilds.fetch(DISCORD_GUILD_ID);
          if (guild) {
            const channelName = \`ticket-\${username.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}-\${listingId.substring(0, 10)}\`;
            const createOptions = {
              name: channelName,
              type: ChannelType.GuildText
            };
            if (DISCORD_CATEGORY_ID) {
              createOptions.parent = DISCORD_CATEGORY_ID;
            }
            
            const channel = await guild.channels.create(createOptions);
            ticket.discordChannelId = channel.id;
            await ticket.save();
            
            // Post welcome message in Discord
            await channel.send(\`🚩 **NEW SUPPORT TICKET CREATED** 🚩\\n\\n**Buyer:** \${username} (\${userEmail})\\n**Item:** \${listingTitle}\\n**Price:** ₹\${price.toLocaleString("en-IN")}\\n**Ticket ID:** \\\`\${id}\\\`\\n\\n*Type messages in this channel to chat directly with the buyer on the website!*\`);
          }
        } catch (discordErr) {
          console.error('Failed to create Discord channel for ticket:', discordErr);
        }
      }
    }
    res.status(201).json({ success: true, ticket });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Send a new message inside a ticket (and forward to Discord)
app.post('/api/tickets/:id/messages', async (req, res) => {
  try {
    const { sender, text } = req.body;
    const ticketId = req.params.id;
    
    const message = new TicketMessage({ ticketId, sender, text });
    await message.save();
    
    if (sender === 'buyer') {
      const ticket = await Ticket.findOne({ id: ticketId });
      if (ticket && ticket.discordChannelId && discordClient && discordClient.readyAt) {
        try {
          const channel = await discordClient.channels.fetch(ticket.discordChannelId);
          if (channel) {
            await channel.send(\`💬 **Buyer (\${ticket.username}):** \${text}\`);
          }
        } catch (discordErr) {
          console.error('Failed to forward message to Discord:', discordErr);
        }
      }
    }
    
    res.status(201).json({ success: true, message });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(\`ShivaayXStore API Server running on port \${PORT}\`);
});`;

if (serverContent.includes(targetCode)) {
  serverContent = serverContent.replace(targetCode, replacementCode);
  console.log("Successfully overhauled backend/server.js with Discord support!");
} else {
  console.log("WARNING: Target code block not matched inside server.js!");
}

fs.writeFileSync(serverPath, serverContent, 'utf8');
