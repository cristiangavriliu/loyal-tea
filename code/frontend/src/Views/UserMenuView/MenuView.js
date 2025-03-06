import React, { useEffect, useState } from 'react';
import ConditionalNavigationComponent from '../UI-NavigationComponents/ConditionalNavigationComponent';
import axios from 'axios';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {
	IconButton,
	Chip,
	Typography,
	Card,
	CardMedia,	
	CardContent,
	CardActions,
	Grid,
	Fab,
	Container,
	Divider,
	Drawer,
	Tooltip,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Button,
	Badge,
	Slide,
	List,
	ListItem
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import Cookies from 'js-cookie';
import CloseIcon from '@mui/icons-material/Close';
import PaymentDrawer from '../UserPaymentFlow/PaymentDrawer';


const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

function MenuView() {
	const [alcoholicItems, setAlcoholicItems] = useState([]);
	const [nonAlcoholicItems, setNonAlcoholicItems] = useState([]);
	const [foodItems, setFoodItems] = useState([]);
	const [snackItems, setSnackItems] = useState([]);
	const [cartWithDetails, setCartWithDetails] = useState({});
	const [shoppingCart, setShoppingCart] = useState(() => {
		// Load the shopping cart from cookies if it exists
		const savedCart = Cookies.get('shoppingCart');
		return savedCart ? JSON.parse(savedCart) : {};
	});
	const [open, setOpen] = useState(false);
	const [totalPrice, setTotalPrice] = useState(0);
	const [availablePuzzlePoints, setAvailablePuzzlePoints] = useState(0);
	const [maxPuzzlePoints, setMaxPuzzlePoints] = useState(0);
	const [selectedItem, setSelectedItem] = useState(null);
	const [openDraw, setOpenDraw] = useState(false);



	// Hooks

	useEffect(() => {
		// Get all items to display in menu
		fetchAllItems();
		
		// Fetch available puzzle points for passing it to the payment drawer
		fetchPuzzlePoints();

		// Fill constants, when shoppingCart exists
		if (Object.keys(shoppingCart).length > 0) {
			updateCartWithDetails(shoppingCart).then(calculateTotalPrice(cartWithDetails));
		}
	}, []);


	// Functions

	// Get available puzzle points
	const fetchPuzzlePoints = async () => {
		const currentPoints = (await axios.get('/user/getMe')).data.user.puzzles;
		setAvailablePuzzlePoints(currentPoints ? currentPoints : 0);
	};

	// Transform the cart to include full item details
    const updateCartWithDetails = async (cart) => {
        try {
            const itemIds = Object.keys(cart);
            const response = await axios.post('/items/getMultiple', { ids: itemIds });

            const cartWithDetails = {};
            response.data.forEach(item => {
                cartWithDetails[item._id] = {
                    ...item,
                    quantity: cart[item._id]
                };
            });

            setCartWithDetails(cartWithDetails);
			calculateTotalPrice(cartWithDetails);
        } catch (error) {
            console.error('Error fetching item details', error);
        }
    };

    // Calculate total price of items in shopping cart
    const calculateTotalPrice = (cart) => {
        let total = 0;
        Object.values(cart).forEach(item => {
            total += item.price * item.quantity;
        });
        setTotalPrice(total);
		setMaxPuzzlePoints(total / 0.5);
    };

	// Fetch items to display in menu
	const fetchAllItems = async () => {
		try {
			const response = await axios.get('/items/getAll');
			setAlcoholicItems(response.data.filter(item => item.category === 'Alcoholics'));
			setNonAlcoholicItems(response.data.filter(item => item.category === 'Non-Alcoholics'));
			setFoodItems(response.data.filter(item => item.category === 'Food'));
			setSnackItems(response.data.filter(item => item.category === 'Snacks'));
		} catch (error) {
			console.error('Error fetching items:', error);
		}
	};

	// Function to handle quantity change
	const handleQuantityChange = (itemId, quantity) => {
		setShoppingCart(prevCart => {
			const newCart = { ...prevCart };
			if (quantity < 0) {
				if (!newCart[itemId]) {
					newCart[itemId] = 0;
				} else if (newCart[itemId] <= 1) {
					newCart[itemId] = 0;
				} else {
					newCart[itemId] -= 1;
				}

			} else {
				if (!newCart[itemId]) {
					newCart[itemId] = 1;
				} else {
					newCart[itemId] += 1;
				}
			}

			// After exception handling in the condition before
			// Make sure no empty items are in the cart
			if (newCart[itemId] === 0) {
				delete newCart[itemId];
			}

			// Save the updated shopping cart to cookies
			Cookies.set('shoppingCart', JSON.stringify(newCart), { expires: 7 }); // Expires in 7 days
			updateCartWithDetails(newCart);
			return newCart;
		});
	};

	// Counts the items in the shopping cart for FAB
	const cartItemCount = Object.values(shoppingCart).reduce((total, quantity) => total + quantity, 0);

	// Toggles the payment screen
	const toggleDrawer = (newOpen) => () => {
		setOpen(newOpen);
	};

	// Necessary for allergene popup
	const openDetails = (item) => {
		setSelectedItem(item);
		setOpenDraw(true);
	};

	// Necessary for allergene popup
	const closeDetails = () => {
		setOpenDraw(false);
	};

	// Avoids duplicate code
	// Renders an itemgrid with the given items
	const itemGrid = (items) => {
		return (<Grid container spacing={2}>
			{items.map(item => (
				<Grid item key={item._id} xs={6} sm={3} md={2} lg={2}>
					<Card sx={{ maxWidth: 300 }} elevation={0} variant='outlined' >
						
						<CardMedia
							component="img"
							alt={item.name}
							height="300"
							image={item.imageLink}
							sx={{ objectFit: "contain" }}
						/>

						<CardContent>
							<Typography gutterBottom variant="h6" component="div">
								{item.name}
							</Typography>

							<Typography variant="subtitle1">
								{item.price}€
								<Tooltip title="Allergenes">
								<IconButton onClick={() => openDetails(item)} sx={{ml: 1}}>
									<InfoIcon />
								</IconButton>
								</Tooltip>
							</Typography>
						</CardContent>

						<CardActions>
							<IconButton
								aria-label="Remove from Cart"
								color="black"
								onClick={() => handleQuantityChange(item._id, -1)}>
								<RemoveIcon />
							</IconButton>

							<Chip 
								label={!shoppingCart[item._id] ? 0 : shoppingCart[item._id]} 
								style={{ fontSize: '1em' }}
							/>

							<IconButton
								aria-label="Add to Cart"
								color="black"
								onClick={() => handleQuantityChange(item._id, 1)}>
								<AddIcon />
							</IconButton>

						</CardActions>
					</Card>
				</Grid>
			))}
		</Grid>);
	};

	// Render menu 
	return (
		<div>
			<ConditionalNavigationComponent />

			<Container style={{ marginBottom: '100px'}}>

				<Divider sx={{ my: 2 }}>
					<Chip label="Alcoholic Drinks" size="medium" />
				</Divider>

				{itemGrid(alcoholicItems)}

				<Divider sx={{ my: 2 }}>
					<Chip label="Non-Alcoholic Drinks" size="medium" />
				</Divider>

				{itemGrid(nonAlcoholicItems)}

				<Divider sx={{ my: 2 }}>
					<Chip label="Food" size="medium" />
				</Divider>

				{itemGrid(foodItems)}

				<Divider sx={{ my: 2 }}>

					<Chip label="Snacks" size="medium" />
				</Divider>

				{itemGrid(snackItems)}

				<Fab
					aria-label={"Cart"}
					color={"primary"}
					onClick={toggleDrawer(true)}
					style={{
						position: "fixed",
						bottom: "8%",
						right: "2%",
						zIndex: 9998,
					}}
				>
					<Badge badgeContent={cartItemCount} color="secondary" showZero>
						<ShoppingCartIcon />
					</Badge>
				</Fab>

				<Drawer
					open={open}
					onClose={toggleDrawer(false)}
					anchor='bottom'
					style={{
						zIndex: 9999,
					}}
					PaperProps={{
						sx: {
							justifyContent: 'center',
							alignItems: 'center',
						}
					}}
				>
					{PaymentDrawer(cartWithDetails, totalPrice, availablePuzzlePoints, maxPuzzlePoints)}
				</Drawer>


				<Dialog open={openDraw}
						TransitionComponent={Transition}
						onClose={closeDetails}
						maxWidth={'xs'}
						fullWidth={true}
				>
					<DialogTitle id="challenge-dialog-title">{selectedItem?.name} </DialogTitle>
					<IconButton
						aria-label="close"
						onClick={closeDetails}
						sx={{
							position: 'absolute',
							right: 8,
							top: 8,
							color: (theme) => theme.palette.grey[500],
						}}
					>
						<CloseIcon />
					</IconButton>
					<DialogContent>
						<DialogContentText>
							{selectedItem?.allergens.length === 0 ? 'No allergens' : 'Allergens: '}
						</DialogContentText>
						<DialogContentText>
							<List>
								{selectedItem?.allergens.map((allergen, index) => (
									<ListItem key={index}>
										{allergen}
									</ListItem>
								))}
							</List>
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={closeDetails} color="primary">
							Close
						</Button>
					</DialogActions>
				</Dialog>

			</Container>


		</div>

	);
}

export default MenuView;
