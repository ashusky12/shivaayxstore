const axios = require('axios');

async function test() {
  try {
    const ticketId = 'test_ticket_sim_' + Date.now();
    console.log("1. Creating ticket via POST http://localhost:5000/api/tickets...");
    const ticketRes = await axios.post('http://localhost:5000/api/tickets', {
      id: ticketId,
      listingId: 'sakura-evo-max',
      listingTitle: 'Sakura Evo Max Account',
      price: 9999,
      userEmail: 'buyer@shivaayxstore.in',
      username: 'Buyer'
    });
    console.log("Ticket created! Channel ID:", ticketRes.data.ticket.discordChannelId);
    
    console.log("2. Sending buyer message via POST http://localhost:5000/api/tickets/" + ticketId + "/messages...");
    const msgRes = await axios.post('http://localhost:5000/api/tickets/' + ticketId + '/messages', {
      sender: 'buyer',
      text: 'Hello from Backend Test Script! Is this showing on Discord?'
    });
    console.log("Message sent! Success:", msgRes.data.success);
  } catch (err) {
    console.error("Test failed:", err.response ? err.response.data : err.message);
  }
}

test();
