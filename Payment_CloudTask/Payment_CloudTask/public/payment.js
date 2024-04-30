let ticketCount = 0;
const ticketPrice = 100;
const totalAmountElement = document.getElementById('totalAmount');
const totalAmountElement2 = document.getElementById('totalAmount2');
const totalAmountElement3 = document.getElementById('totalAmount3');
const totalAmountElement4 = document.getElementById('charges1');
const ticketCountElement = document.getElementById('ticketCount');

function updateTotalAmount() {
    const totalAmount = ticketCount * ticketPrice;
    totalAmountElement.textContent = `₹${totalAmount}`;
    totalAmountElement2.textContent = `₹${totalAmount}`;
    totalAmountElement3.textContent = `₹${totalAmount}`;
    totalAmountElement4.textContent = `₹${totalAmount + 25}`;
}

document.getElementById('addTicket').addEventListener('click', function () {
    ticketCount++;
    ticketCountElement.textContent = ticketCount;
    updateTotalAmount();
});

document.getElementById('subtractTicket').addEventListener('click', function () {
    if (ticketCount > 0) {
        ticketCount--;
        ticketCountElement.textContent = ticketCount;
        updateTotalAmount();
    }
});

updateTotalAmount(); // Initialize total amount


document.getElementById('payNowBtn').addEventListener('click', async function(event) {
    event.preventDefault(); // Prevent the default form submission

    console.log('Pay Now button clicked!'); // Log to check if the event listener is triggered

    try {
        // Extract amount from Total amt
        const amountText = document.getElementById('charges1').textContent;
        const amount = parseFloat(amountText.replace('₹', ''));

        console.log('Amount sent to server:', amount);

        // Make AJAX request to server to create order
        const response = await fetch('/payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ amount }) // Pass the extracted amount
        });

        if (!response.ok) {
            throw new Error('Failed to create order');
        }

        const orderData = await response.json();

        // Initialize Razorpay checkout
        const options = {
            key: 'rzp_test_959lqA3KnZSuSV', // Replace with your Razorpay Test/Live Key
            amount: orderData.amount, // Amount in paise
            currency: 'INR',
            order_id: orderData.orderId, // ID of the order created on the server
            handler: function(response) {
                // Handle payment success
                alert('Payment successful!');
                console.log('Payment response:', response);
            },
            prefill: {
                // Add pre-filled customer details if needed
            }
        };

        const rzp = new Razorpay(options);
        rzp.open();
    } catch (error) {
        console.error('Error:', error.message);
        // Handle error, display error message to the user, etc.
    }
});
