const axios = require('axios');

async function run() {
  try {
    const ticketId = 'test_' + Date.now();
    console.log("Creating ticket:", ticketId);
    await axios.post('http://localhost:5000/api/tickets', {
      id: ticketId,
      listingId: 'sakura-evo-max',
      listingTitle: 'Sakura Evo Max Account',
      price: 9999,
      userEmail: 'buyer@shivaayxstore.in',
      username: 'Buyer'
    });
    
    console.log("Querying messages endpoint for new ticket...");
    const res = await axios.get(`http://localhost:5000/api/tickets/${ticketId}/messages`);
    console.log("Status:", res.status);
    console.log("Data:", res.data);
  } catch (err) {
    console.error("Error:", err.response ? err.response.status : err.message, err.response ? err.response.data : '');
  }
}

run();
