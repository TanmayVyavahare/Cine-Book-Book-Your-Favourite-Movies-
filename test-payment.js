const axios = require('axios');

async function testOrder() {
  try {
    const res = await axios.post('http://localhost:5000/api/payments/create-order', {
      amount: 250
    }, {
      headers: {
        'Content-Type': 'application/json'
        // Need to add Authorization header if we test this protected route... Let me just test hitting the server.
      }
    });
    console.log(res.data);
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
  }
}
testOrder();
