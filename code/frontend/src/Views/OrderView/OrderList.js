import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OrderForm from './OrderForm';
import ConditionalNavigationComponent from '../UI-NavigationComponents/ConditionalNavigationComponent';
import { 
	Fab, 
	Table, 
	TableBody, 
	TableCell, 
	TableContainer, 
	TableHead, 
	TableRow, 
	Button, 
	IconButton, 
	Box, 
	Collapse, 
	Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Modal } from 'react-bootstrap';
import { io } from 'socket.io-client';

const getStatusColor = (status) => {
	switch (status) {
		case 'Ordered':
			return '#cf0021';
		case 'In Progress':
			return '#FC7A1E';
		case 'Completed':
			return '#355E3B';
		default:
			return 'grey';
	}
};

const Row = ({ order, handleProcess }) => {
	const [open, setOpen] = useState(false);

	const getTotal = (items) => items.reduce((total, item) => total + (item.item ? item.item.price : 0) * item.quantity, 0);
	const getTotalQuantity = (items) => items.reduce((total, item) => total + item.quantity, 0);

	return (
		<>
			<TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
				<TableCell>
					<IconButton
						size="small"
						onClick={() => setOpen(!open)}
					>
						{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>
				<TableCell align="center">{new Date(order.time).toLocaleString()}</TableCell>
				<TableCell align="center">{order.id}</TableCell>
				<TableCell align="center">{order.user ? `${order.user.firstname} ${order.user.lastname}` : 'N/A'}</TableCell>
				<TableCell align="center">{order.table}</TableCell>
				<TableCell align="center">
					<Button
						onClick={() => handleProcess(order)}
						size="small"
						disabled={order.status === 'Completed'}
						variant="contained"
						disableElevation={true}
						style={{ backgroundColor: getStatusColor(order.status), color: 'white', textTransform: 'none' }}
					>
						{order.status}
					</Button>
				</TableCell>
			</TableRow>

			<TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<Box sx={{ margin: 1 }}>
							<Typography variant="h6" gutterBottom component="div">
								Items
							</Typography>
							<Table size="small">
								<TableHead>
									<TableRow>
										<TableCell align="center">Item</TableCell>
										<TableCell align="center">Quantity</TableCell>
										<TableCell align="center">Price</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{order.items.map((item) => (
										<TableRow key={item._id}>
											<TableCell align="center">{(item.item ? item.item.name : "n.a.")}</TableCell>
											<TableCell align="center">{item.quantity}</TableCell>
											<TableCell align="center">{(item.item ? item.item.price : '-')}€</TableCell>
										</TableRow>
									))}
									<TableRow>
										<TableCell align="center">Total:</TableCell>
										<TableCell align="center">{getTotalQuantity(order.items)}</TableCell>
										<TableCell align="center">{getTotal(order.items)}€</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</>
	);
};

const OrderList = () => {
	const [orders, setOrders] = useState([]);
	const [open, setOpen] = useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	useEffect(() => {
		fetchOrders()

		const socket = io('http://localhost:8080');

		socket.on('connect', () => {
			console.log('Connected to server');
		});

		socket.on('orderChange', async () => {
			await fetchOrders();
		});
		socket.on('error', (error) => {
			console.error('WebSocket error:', error);
		});
	}, []);


	const fetchOrders = async () => {
		try {
			const res = await axios.get('/orders/getAll');
			const sortedOrders = res.data.sort((a, b) => new Date(b.time) - new Date(a.time));
			setOrders(sortedOrders);
		} catch (error) {
			console.error("Error fetching orders", error);
		}
	};

	const handleAddOrder = (newOrder) => {
		setOrders(prevOrders => {
			const updatedOrders = [...prevOrders, newOrder];
			return updatedOrders.sort((a, b) => new Date(b.time) - new Date(a.time));
		});
	};

	const handleProcess = async (order) => {
		var newStatus = order.status;
		try {
			if (order.status === 'Ordered') {
				newStatus = 'In Progress';
			} else if (order.status === 'In Progress') {
				newStatus = 'Completed';
			}
			const updatedOrder = { ...order, status: newStatus };
			const res = await axios.put(`/orders/update/${order._id}`, updatedOrder);
			setOrders(prevOrders => prevOrders.map(o => (o._id === order._id ? res.data : o)));
		} catch (error) {
			console.error("Error processing the order", error);
		}
	};

	const nonCompletedOrders = orders.filter(order => order.status !== 'Completed');
	const completedOrders = orders.filter(order => order.status === 'Completed');

	return (
		<div>
			<ConditionalNavigationComponent />
			<Fab
				color="primary"
				onClick={handleClickOpen}
				style={{
					position: "fixed",
					bottom: "2%",
					right: "2%",
					zIndex: 9998,
				}}
			>
				<AddIcon />
			</Fab>

			<Modal show={open} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Create Order</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<OrderForm onClose={handleClose} onAddOrder={handleAddOrder} />
				</Modal.Body>
			</Modal>

			<div className="container">
				<Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
					Current Orders:
				</Typography>
				<TableContainer sx={{ maxHeight: 600 }} style={{ backgroundColor: '#f1f1f1' }} elevation={0}>
					<Table stickyHeader>
						<TableHead>
							<TableRow>
								<TableCell sx={{ backgroundColor: '#E7E7E7' }} />
								<TableCell sx={{ backgroundColor: '#E7E7E7' }} align="center">Date/Time</TableCell>
								<TableCell sx={{ backgroundColor: '#E7E7E7' }} align="center">Order #</TableCell>
								<TableCell sx={{ backgroundColor: '#E7E7E7' }} align="center">Username</TableCell>
								<TableCell sx={{ backgroundColor: '#E7E7E7' }} align="center">Table Number</TableCell>
								<TableCell sx={{ backgroundColor: '#E7E7E7' }} align="center">Status</TableCell>
							</TableRow>
						</TableHead>

						<TableBody>
							{nonCompletedOrders.map(order => (
								<Row
									key={order._id}
									order={order}
									handleProcess={handleProcess}
								/>
							))}
						</TableBody>
					</Table>
				</TableContainer>


				<Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
					Completed Orders:
				</Typography>

				<TableContainer sx={{ maxHeight: 600 }} style={{ backgroundColor: '#f1f1f1' }} elevation={0}>
					<Table stickyHeader>
						<TableHead>
							<TableRow>
								<TableCell sx={{ backgroundColor: '#E7E7E7' }} />
								<TableCell sx={{ backgroundColor: '#E7E7E7' }} align="center">Date/Time</TableCell>
								<TableCell sx={{ backgroundColor: '#E7E7E7' }} align="center">Order #</TableCell>
								<TableCell sx={{ backgroundColor: '#E7E7E7' }} align="center">Username</TableCell>
								<TableCell sx={{ backgroundColor: '#E7E7E7' }} align="center">Table Number</TableCell>
								<TableCell sx={{ backgroundColor: '#E7E7E7' }} align="center">Status</TableCell>
							</TableRow>
						</TableHead>

						<TableBody>
							{completedOrders.map(order => (
								<Row
									key={order._id}
									order={order}
									handleProcess={handleProcess}
								/>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</div>
		</div>
	);
};

export default OrderList;