const mongoose = require('mongoose');
require('dotenv').config();

const TicketSchema = new mongoose.Schema({ id: String });
const TicketMessageSchema = new mongoose.Schema({ ticketId: String });

const Ticket = mongoose.model('Ticket', TicketSchema);
const TicketMessage = mongoose.model('TicketMessage', TicketMessageSchema);

async function clean() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to DB!");
  
  const d1 = await Ticket.deleteMany({});
  const d2 = await TicketMessage.deleteMany({});
  
  console.log(`Deleted ${d1.deletedCount} tickets and ${d2.deletedCount} messages from MongoDB!`);
  process.exit(0);
}

clean();
