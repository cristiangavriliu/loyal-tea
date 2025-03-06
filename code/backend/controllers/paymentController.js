import Stripe from 'stripe';
import express from 'express';
import bodyParser from 'body-parser';

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);const router = express.Router();
router.use(bodyParser.json());

router.post('/create-checkout-session', async (req, res) => {
    const { shoppingCart, puzzles } = req.body;

    try {

        // Create item array for stripe
        const lineItems = Object.keys(shoppingCart).map(itemId => ({
            price_data: {
                currency: 'eur',
                product_data: {
                    name: shoppingCart[itemId].name,
                },
                unit_amount: shoppingCart[itemId].price * 100,
            },
            quantity: shoppingCart[itemId].quantity,
        }));

        // Create stripe session
        let stripeSession = {
            payment_method_types: ['card'],
            line_items: lineItems,

            mode: 'payment',
            success_url: 'http://localhost:3000/payment/success',
            cancel_url: 'http://localhost:3000/payment/failure',
        }

        // If puzzles are used, add create discount and add it to the stripe session
        if (puzzles > 0) {

            // Configure discount coupon
            const coupon = await stripe.coupons.create({
                amount_off: 50 * puzzles,
                currency: 'eur',
                duration: 'once'
            });

            stripeSession.discounts = [{ coupon: coupon.id }];
        }

        const session = await stripe.checkout.sessions.create(stripeSession);


        // Retrun stripe session and redirection URL
        res.json({ url: session.url, stripeSessionId: session.id });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Returns if the payment was successful
router.get('/checkout-session/:sessionId', async (req, res) => {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);

    if(session.payment_status == 'paid') {
        res.json({confirmation: 'True'});
    } else {
        res.json({confirmation: 'False'});
    }
  });

export default router;
