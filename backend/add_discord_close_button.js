const fs = require('fs');
const path = require('path');

const serverPath = path.join(__dirname, '..', 'backend', 'server.js');
let serverContent = fs.readFileSync(serverPath, 'utf8');

// 1. Update imports to include ActionRowBuilder, ButtonBuilder, ButtonStyle
const oldImport = "const { Client, GatewayIntentBits, ChannelType, PermissionFlagsBits } = require('discord.js');";
const newImport = "const { Client, GatewayIntentBits, ChannelType, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');";

if (serverContent.includes(oldImport)) {
  serverContent = serverContent.replace(oldImport, newImport);
  console.log("Updated imports in server.js!");
} else {
  console.log("WARNING: imports match failed!");
}

// 2. Update welcome message to include the Close Ticket button
const oldWelcomeCode = `            // Post welcome message in Discord
            await channel.send(\`🚩 **NEW SUPPORT TICKET CREATED** 🚩\\n\\n**Buyer:** \${username} (\${userEmail})\\n**Item:** \${listingTitle}\\n**Price:** ₹\${price.toLocaleString("en-IN")}\\n**Ticket ID:** \\\`\${id}\\\`\\n\\n*Type messages in this channel to chat directly with the buyer on the website!*\`);`;

const newWelcomeCode = `            // Create Delete Button
            const deleteBtn = new ButtonBuilder()
              .setCustomId(\`delete_ticket_\${id}\`)
              .setLabel('Close / Delete Ticket')
              .setStyle(ButtonStyle.Danger)
              .setEmoji('🗑️');

            const row = new ActionRowBuilder().addComponents(deleteBtn);

            // Post welcome message in Discord with the button!
            await channel.send({
              content: \`🚩 **NEW SUPPORT TICKET CREATED** 🚩\\n\\n**Buyer:** \${username} (\${userEmail})\\n**Item:** \${listingTitle}\\n**Price:** ₹\${price.toLocaleString("en-IN")}\\n**Ticket ID:** \\\`\${id}\\\`\\n\\n*Type messages in this channel to chat directly with the buyer on the website!*\`,
              components: [row]
            });`;

if (serverContent.includes(oldWelcomeCode)) {
  serverContent = serverContent.replace(oldWelcomeCode, newWelcomeCode);
  console.log("Updated welcome message with button in server.js!");
} else {
  console.log("WARNING: welcome message match failed!");
}

// 3. Add interactionCreate event listener below channelDelete event listener
const oldChannelDeleteListener = `  // Listen to channel deletion (to delete ticket from MongoDB)
  discordClient.on('channelDelete', async (channel) => {
    try {
      const Ticket = mongoose.model('Ticket');
      const TicketMessage = mongoose.model('TicketMessage');
      
      // Find ticket with this channel ID
      const ticket = await Ticket.findOne({ discordChannelId: channel.id });
      if (ticket) {
        console.log(\`Discord channel \${channel.name} was deleted. Purging ticket \${ticket.id} from database.\`);
        await Ticket.deleteOne({ id: ticket.id });
        await TicketMessage.deleteMany({ ticketId: ticket.id });
      }
    } catch (err) {
      console.error('Error handling channelDelete event:', err);
    }
  });`;

const newListeners = `  // Listen to channel deletion (to delete ticket from MongoDB)
  discordClient.on('channelDelete', async (channel) => {
    try {
      const Ticket = mongoose.model('Ticket');
      const TicketMessage = mongoose.model('TicketMessage');
      
      // Find ticket with this channel ID
      const ticket = await Ticket.findOne({ discordChannelId: channel.id });
      if (ticket) {
        console.log(\`Discord channel \${channel.name} was deleted. Purging ticket \${ticket.id} from database.\`);
        await Ticket.deleteOne({ id: ticket.id });
        await TicketMessage.deleteMany({ ticketId: ticket.id });
      }
    } catch (err) {
      console.error('Error handling channelDelete event:', err);
    }
  });

  // Listen to Button Interactions (Close Ticket Button)
  discordClient.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;
    
    if (interaction.customId.startsWith('delete_ticket_')) {
      const ticketId = interaction.customId.replace('delete_ticket_', '');
      try {
        const Ticket = mongoose.model('Ticket');
        const TicketMessage = mongoose.model('TicketMessage');
        
        // Acknowledge interaction
        await interaction.reply({ content: '🗑️ Deleting ticket records and closing channel, please wait...', ephemeral: true });
        
        // Delete from MongoDB
        await Ticket.deleteOne({ id: ticketId });
        await TicketMessage.deleteMany({ ticketId });
        
        // Delete the channel after a short delay
        setTimeout(async () => {
          try {
            await interaction.channel.delete('Ticket closed via Discord button');
          } catch (chErr) {
            console.error('Failed to delete channel from Discord:', chErr);
          }
        }, 1500);
      } catch (err) {
        console.error('Error closing ticket via Discord button:', err);
      }
    }
  });`;

if (serverContent.includes(oldChannelDeleteListener)) {
  serverContent = serverContent.replace(oldChannelDeleteListener, newListeners);
  console.log("Added interactionCreate listener in server.js!");
} else {
  console.log("WARNING: channelDelete listener match failed!");
}

fs.writeFileSync(serverPath, serverContent, 'utf8');
