import ConditionalNavigationComponent from '../UI-NavigationComponents/ConditionalNavigationComponent';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { 
	Box, 
	Typography,
	Container,
	Divider,
	List,
	ListItem,
} from '@mui/material';

function SuccPaymentView() {
	const [cartWithNames, setCartWithNames] = useState({});
	const [shoppingCart, setShoppingCart] = useState(() => {
		// Load the shopping cart from cookies if it exists
		const savedCart = Cookies.get('shoppingCart');
		return savedCart ? JSON.parse(savedCart) : {};
	});

	useEffect(() => {
		// Retrieve stripe session and order from cookies
		const orderId = Cookies.get('orderId');
		const stripeSessionId = Cookies.get('stripeSessionId');

		// Make sure to not spam the server in StrictMode
		if (!orderId || !stripeSessionId) {
			return;
		}

		// Verify succesful payment 
		const getConfirmation = async () => {
			try {
				const { data } = await axios.get(`/payments/checkout-session/${stripeSessionId}`);

				return data.confirmation;
			} catch (error) {
				console.error('Error confirming stripe payment', error);
			}
		};

		// Update order status
		const confirmOrder = async () => {
			try {
				await axios.put('/orders/confirm', { orderId });
			} catch (error) {
				console.error('Error confirming order after payment', error);
			}
		};

		// Statement makes sure that the order is confirmed only if the payment was successful
		getConfirmation().then(res => { if (res === 'True') { confirmOrder() } });

		updateCartWithNames(shoppingCart);

		// Delete Cookies
		Cookies.remove('orderId');
		Cookies.remove('stripeSessionId');
		Cookies.remove('shoppingCart');
	}, []);

	// Transform the cart to include item names
    const updateCartWithNames = async (cart) => {
        try {
            const itemIds = Object.keys(cart);
            const response = await axios.post('/items/getMultiple', { ids: itemIds });

            const cartWithNames = {};
            response.data.forEach(item => {
                cartWithNames[item._id] = {
                    name: item.name,
                    quantity: cart[item._id]
                };
            });

            setCartWithNames(cartWithNames);
        } catch (error) {
            console.error('Error fetching item names', error);
        }
    };

	// Render success view
	return (
		<div>
			<ConditionalNavigationComponent />

			<Container maxWidth="sm" style={{ marginTop: '40px' }}>
				<Box textAlign="center" mb={4}>
					<Typography variant="h4" gutterBottom>We received your order!</Typography>
					<Typography variant="subtitle1">An overview of your order: </Typography>

					<Divider variant="middle" style={{ background: 'black' }} />

					<List sx={{ alignItems: 'flex-start', justifyContent: 'flex-start' }} >
						{Object.values(cartWithNames).map((item, index) => (
							<ListItem key={index} alignItems='flex-start'  >
								{item.quantity}x {item.name} 
							</ListItem>
						))}
					</List>

					<Divider variant="middle" style={{ background: 'black' }} />

					<Typography variant="subtitle1">We will try to deliver ASAP! </Typography>
				</Box>

				<Box display="flex" justifyContent="center" marginTop="40px">
					<DoneAllIcon sx={{ fontSize: 80 }} color='warning' />
				</Box>
			</Container>
		</div>
	);
}

export default SuccPaymentView;