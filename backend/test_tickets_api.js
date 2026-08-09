const axios = require('axios');

async function run() {
  try {
    console.log("Testing Ticket Creation API on http://localhost:5000/api/tickets...");
    const res = await axios.post('http://localhost:5000/api/tickets', {
      id: 'test_ticket_' + Date.now(),
      listingId: 'sakura-evo-max',
      listingTitle: 'Sakura Evo Max Account',
      price: 9999,
      userEmail: 'buyer@shivaayxstore.in',
      username: 'Buyer'
    });
    console.log("Success! API response:", res.data);
  } catch (err) {
    console.error("API Error:", err.response ? err.response.data : err.message);
  }
}

run();
