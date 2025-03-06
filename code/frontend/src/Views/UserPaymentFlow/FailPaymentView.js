import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ConditionalNavigationComponent from '../UI-NavigationComponents/ConditionalNavigationComponent';
import Cookies from 'js-cookie';
import axios from 'axios';
import React, { useEffect } from 'react';
import { 
	Box, 
	Typography, 
	Container 
} from '@mui/material';

function FailPaymentView() {

	useEffect(() => {
		// Delete order from database
		const orderId = Cookies.get('orderId');

		// Make sure to not spam the server in StrictMode
		if (!orderId) {
			return;
		}

		const deleteOrder = async () => {
			try {
				const res = await axios.delete(`/orders/delete/${orderId}`);
			} catch (error) {
				console.error('Error deleting order', error);
			}
		};

		deleteOrder();

		// Delete Cookies
		Cookies.remove('orderId');
		Cookies.remove('stripeSessionId');
	}, []);

	// Remder view
	return (
		<div>
			<ConditionalNavigationComponent />

			<Container maxWidth="sm" style={{ marginTop: '40px' }}>
				<Box textAlign="center" mb={4}>
					<Typography variant="h4" gutterBottom>Your payment went wrong</Typography>
					<Typography variant="subtitle1">Unfortunetaly something went wrong during your payment. </Typography>
					<Typography variant="subtitle1">Your cart still contains your items. </Typography>
					<Typography variant="subtitle1">Please try again. </Typography>
				</Box>

				<Box display="flex" justifyContent="center" marginTop="40px">
					<ErrorOutlineIcon style={{ fontSize: 80 }} color='ColorDelete' />
				</Box>
			</Container>

		</div>
	);
}

export default FailPaymentView;