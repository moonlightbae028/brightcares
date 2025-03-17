const stripe = require('stripe')('sk_test_51R3A1qQxEdvDqh9wwXmfPt0J5jrITesUap9AkrGOQkHHofv3zPtRZ6Fy684cih1211nFLmeZDmu7aiIQvxnjh0pZ00m48jqqHF');

const createCheckoutSession = async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Auto Part Product',
                        },
                        unit_amount: 2000, // Price in cents (e.g., $20.00)
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${req.protocol}://${req.get('host')}/payment-success`,
            cancel_url: `${req.protocol}://${req.get('host')}/payment-failed`,
        });

        res.json({ id: session.id }); // Send JSON response
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: error.message }); // Ensure the response is JSON
    }
};

module.exports = { createCheckoutSession };
