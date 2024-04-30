const express = require('express');
const Razorpay = require('razorpay');
const bodyParser = require('body-parser');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));
app.use(bodyParser.json());

// Initialize Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Endpoint to handle payment requests
// Endpoint to handle payment requests
// Endpoint to handle payment requests
app.post('/payment', async (req, res) => {
    try {
        const amount = req.body.amount; // Extract amount from request body

        // Log the received amount
        console.log('Received payment request with amount:', amount);

        // Create Razorpay order
        const order = await razorpay.orders.create({
            amount: amount * 100, // Amount in smallest currency unit (in paisa)
            currency: 'INR',
            receipt: 'order_receipt' // Unique receipt id
        });

        // Log the created order details
        const amountInRupees = (order.amount / 100).toFixed(2);
        console.log('Created Razorpay order:', {
            id: order.id,
            amount: amountInRupees + ' INR',
            currency: order.currency
        });

        // Log success message
        console.log('Razorpay order creation successful');

        res.json({
            orderId: order.id,
            amount: amountInRupees, // Send amount in rupees
            currency: order.currency
        });
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        // Log error message
        console.log('Razorpay order creation failed');
        res.status(500).json({ error: 'Failed to create order' });
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
