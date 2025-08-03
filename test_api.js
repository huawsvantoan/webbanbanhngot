const axios = require('axios');

async function testCreateOrder() {
  try {
    // Test data
    const orderData = {
      customer_name: "Nguyễn Văn A",
      customer_phone: "0123456789",
      customer_address: "123 Đường ABC, Quận 1, TP.HCM",
      products: [
        {
          product_id: 1,
          name: "Bánh Kem Dâu",
          price: 75000,
          quantity: 2
        }
      ],
      payment_method: "cod",
      total_amount: 150000
    };

    console.log('Testing create direct order...');
    console.log('Order data:', orderData);

    const response = await axios.post('http://localhost:5000/api/admin/orders/create-direct', orderData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_TOKEN_HERE' // Cần token admin
      }
    });

    console.log('Success:', response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testCreateOrder(); 