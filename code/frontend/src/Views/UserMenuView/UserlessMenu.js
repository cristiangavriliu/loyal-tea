import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
	IconButton,
	Chip,
	Typography,
	Card,
	CardMedia,	
	CardContent,
	Grid,
	Fab,
	Container,
	Divider,
	Tooltip,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Button,
	Slide,
	List,
	ListItem
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import UndoIcon from '@mui/icons-material/Undo';


const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

function UserlessMenuView() {
	const [alcoholicItems, setAlcoholicItems] = useState([]);
	const [nonAlcoholicItems, setNonAlcoholicItems] = useState([]);
	const [foodItems, setFoodItems] = useState([]);
	const [snackItems, setSnackItems] = useState([]);
	const [selectedItem, setSelectedItem] = useState(null);
	const [openDraw, setOpenDraw] = useState(false);

	// Hooks

	useEffect(() => {
		// Get all items to display in menu
		fetchAllItems();
	}, []);


	// Functions

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

    // Necessary for allergene popup
	const openDetails = (item) => {
		setSelectedItem(item);
		setOpenDraw(true);
	};

    // Necessary for allergene popup
	const closeDetails = () => {
		setOpenDraw(false);
	};

    // Brings user back to landing page
    const moveToStart = () => {
        window.location.href = '/';
    };

    // Renders item grid for given set of items
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
					</Card>
				</Grid>
			))}
		</Grid>);
	};


    // Render menu
	return (
		<div>
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
					aria-label={"Move"}
					color={"primary"}
					onClick={() => moveToStart()}
					style={{
						position: "fixed",
						bottom: "8%",
						right: "2%",
						zIndex: 9998,
					}}
				>
					<UndoIcon />
				</Fab>

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

export default UserlessMenuView;
