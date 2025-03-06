import React, { useState } from 'react';
import axios from 'axios';
import {
	Card,
	CardContent,
	Grid,
	TextField,
	Button,
	Typography
} from '@mui/material';

const ItemListView = ({ item, onDelete, onEdit }) => {
	const [name, setName] = useState(item.name);
	const [price, setPrice] = useState(item.price);
	const [allergens, setAllergens] = useState(item.allergens);
	const [isEditing, setIsEditing] = useState(false);

	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleSave = async () => {
		const updatedItem = {
			...item,
			name: name,
			price: price,
			allergens: allergens
		};
		try {
			let res = await axios.put(`/items/update/${item._id}`, updatedItem);
			onEdit(res.data);
			setIsEditing(false);
		} catch (error) {
			console.error("Error updating item:", error);
		}
	};

	const handleCancel = () => {
		setName(item.name);
		setPrice(item.price);
		setAllergens(item.allergens);
		setIsEditing(false);
	};

	const handleDelete = async () => {
		try {
			await axios.delete(`/items/delete/${item._id}`);
			onDelete();
		} catch (error) {
			console.error("Error deleting item:", error);
		}
	};

	return (
		<Grid item xs={12} sm={6} md={4} lg={3}>
			<Card style={{ backgroundColor: '#f1f1f1', height: '100%' }} elevation={0}>
				<CardContent>
					{isEditing ? (
						<Grid container spacing={2} alignItems="center">
							{item.imageLink && (
								<Grid item>
									<img src={item.imageLink} alt={name} style={{ width: '100px', height: '150px', objectFit: 'cover' }} className="img-thumbnail" />
								</Grid>
							)}
							<Grid item xs={12}>
								<Typography sx={{ fontWeight: 800, fontSize: 20 }}>{name}</Typography>
								<Typography sx={{ fontWeight: 600, fontSize: 14, color: "grey" }}>{item.category}</Typography>
							</Grid>
							<Grid item xs={12}>
								<TextField
									label="Price"
									type="number"
									value={price}
									onChange={(e) => setPrice(e.target.value)}
									fullWidth
								/>
							</Grid>
							<Grid item xs={12}>
								{allergens.map((allergen, index) => (
									<Typography key={index} sx={{ zIndex: 1050 }}>
										{allergen}
									</Typography>
								))}
							</Grid>
							<Grid item xs={6}>
								<Button onClick={handleCancel} variant="outlined" color="ColorDelete">Cancel</Button>
							</Grid>
							<Grid item xs={6}>
								<Button onClick={handleSave} variant="contained" disableElevation={true} color="primary">Save</Button>
							</Grid>
						</Grid>
					) : (
						<Grid container spacing={2} alignItems="center">
							{item.imageLink && (
								<Grid item>
									<img src={item.imageLink} alt={name}
										style={{ width: '100px', height: '150px', objectFit: 'cover' }} className="img-thumbnail" />
								</Grid>
							)}
							<Grid item xs={12}>
								<Typography sx={{ fontWeight: 800, fontSize: 20 }}>{name}</Typography>
								<Typography sx={{ fontWeight: 600, fontSize: 14, color: "grey" }}>{item.category}</Typography>
							</Grid>
							<Grid item xs={12}>
								<Typography sx={{ fontWeight: 100, fontSize: 24 }}>{price}€</Typography>
							</Grid>
							<Grid item xs={12}>
								{allergens.map((allergen, index) => (
									<Typography key={index} sx={{ zIndex: 1050 }}>
										{allergen}
									</Typography>
								))}
							</Grid>
							<Grid item xs={6}>
								<Button onClick={handleDelete} variant="outlined" color="ColorDelete">Delete</Button>
							</Grid>
							<Grid item xs={6}>
								<Button onClick={handleEdit} variant="contained" disableElevation={true} color="primary">Update</Button>
							</Grid>
						</Grid>
					)}
				</CardContent>
			</Card>
		</Grid>
	);
}

export default ItemListView;