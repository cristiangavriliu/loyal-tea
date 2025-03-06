import React, { useEffect, useState } from 'react';
import AddItemForm from './AddItemForm';
import ItemListView from './ItemListView';
import ConditionalNavigationComponent
from '../UI-NavigationComponents/ConditionalNavigationComponent';
import axios from 'axios';
import { 
	Grid, 
	Fab, 
	Container 
} from '@mui/material';
import AddIcon from "@mui/icons-material/Add";

function ItemView() {
	const [itemList, setItemList] = useState([]);
	const [open, setOpen] = useState(false);
	const handleClickOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const fetchAllItems = async () => {
		try {
			const response = await axios.get('/items/getAll');
			setItemList(response.data.reverse());
		} catch (error) {
			console.error('Error fetching items:', error);
		}
	};

	// Function to add a new item to the list
	const addItemToList = async (newItem) => {
		setItemList([newItem, ...itemList]);
	};

	// Function to remove an item from the list
	const removeItem = (index) => {
		const updatedList = itemList.filter((item, idx) => idx !== index);
		setItemList(updatedList);
	};

	// Function to edit an item in the list
	const editItem = async (index, updatedItem, itemId) => {
		const updatedList = [...itemList];
		updatedList[index] = updatedItem;
		setItemList(updatedList);
	};

	useEffect(() => {
		fetchAllItems();
	}, []);

	return (
		<div>
			<ConditionalNavigationComponent />
			<Fab
				color={"primary"}
				onClick={() => handleClickOpen()}
				style={{
					position: "fixed",
					bottom: "2%",
					right: "2%",
					zIndex: 9998,
				}}
			>
				<AddIcon />
			</Fab>

			<Container style={{ marginTop: '40px', marginBottom: '100px' }}>
				{itemList.length === 0 ? (
					<p>Add an Item by clicking the + button in the bottom left.</p>
				) : (
					<Grid container spacing={2}>
						{itemList.map((item, index) => (
							<ItemListView
								key={index}
								item={item}
								onDelete={() => removeItem(index)}
								onEdit={(updatedItem) => editItem(index, updatedItem,
									item.id)}
							/>
						))}
					</Grid>
				)}
			</Container>

			<AddItemForm open={open} handleClose={handleClose}
				addItemToList={addItemToList} />
		</div>
	);
}

export default ItemView;