import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Button, Card, CardActions, CardContent, CardMedia, Container, Grid, Typography } from '@mui/material';
import { Form, Modal } from 'react-bootstrap';
import AddGameDialog from './AddGameDialog';
import AdminTopBarComponent from '../UI-NavigationComponents/AdminTopBarComponent';
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";

function GamesList() {
    const [games, setGames] = useState([]);
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editedGame, setEditedGame] = useState(null);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleEditOpen = (game) => {
        setEditedGame(game);
        setEditOpen(true);
    };

    const handleEditClose = () => {
        setEditOpen(false);
    };

    // Update the games state when a new game is added
    const handleGameAdded = (newGame) => {
        setGames(prevGames => [...prevGames, newGame]);
    };

    // Update the editedGame state when the user types in the form fields
    const handleInputChange = (event) => {
        setEditedGame({
            ...editedGame,
            [event.target.name]: event.target.value
        });
    };

    // Handle the form submission to update the game
    const handleUpdateGame = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.put(`/games/update/${editedGame._id}`, editedGame);

            // If the request is successful, update the game in the state
            if (response.status === 200) {
                setGames(games.map(game => game._id === editedGame._id ? editedGame : game));
                handleEditClose();
            }
        } catch (error) {
            console.error('Error updating game: ', error);
        }
    };


    // Function to fetch upcoming challenges
    const fetchChallenges = async () => {
        try {
            const response = await axios.get('/challenges/getUpcoming');
            return response.data;
        } catch (error) {
            console.error('Error fetching active challenges:', error);
            return [];
        }
    };


    // Delete a game
    const deleteGame = async (gameId) => {
        try {
            const challenges = await fetchChallenges();

            // Check if there are any upcoming challenges with the game about to be deleted
            const hasUpcomingChallenges = challenges.some(challenge => challenge.game && challenge.game._id === gameId);

            if (hasUpcomingChallenges) {
                alert('There are upcoming challenges associated with this game. End these challenges before deleting the game.');
                return;
            }

            const { status } = await axios.delete(`/games/delete/${gameId}`);

            if (status === 200) {
                alert('Game successfully deleted.');
                fetchGames();
            }
        } catch (error) {
            console.error('Error deleting game: ', error);
            alert('Failed to delete the game.');
        }
    };

    // Fetch all games
    const fetchGames = async () => {
        try {
            const response = await axios.get('/games/getAll');
            setGames(response.data);
        } catch (error) {
            console.error('Error fetching games: ', error);
        }
    };

    useEffect(() => {
        fetchGames();
    }, []);

    return (
        <div className="main-layout">
            <AdminTopBarComponent />

            <Fab
                color={"primary"}
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
            <Container style={{ marginTop: '40px', marginBottom: '100px' }}>
                {games.length === 0 ? (
                    <p>Add an Item by clicking the + button in the bottom
                        left.</p>
                ) : (
                    <Grid container spacing={2}>
                        {games.map(game => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={game._id}>
                                <Card style={{ backgroundColor: '#f1f1f1' }} elevation={0}>
                                    <Box sx={{
                                        position: 'relative',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                            zIndex: 1,
                                        }
                                    }}>
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            image={game.imagePath ? game.imagePath : "StockChallangesIMG.jpg"}
                                            alt={game.name}
                                            sx={{ position: 'relative', zIndex: 0 }}
                                        />
                                    </Box>
                                    <Box sx={{ position: 'relative', top: '-100px', pl: 2, zIndex: 2 }}>
                                        <Typography gutterBottom variant="h5" component="div"
                                            sx={{ color: 'white', fontWeight: 'bold' }}>
                                            {game.name}
                                        </Typography>
                                    </Box>

                                    <CardContent>
                                        <Typography variant="body2"
                                            color="text.secondary">Description: {game.description}</Typography>
                                        <Typography variant="body2" color="text.secondary">Participants
                                            required: {game.participantsRequired}</Typography>

                                    </CardContent>

                                    <CardActions>
                                        <Button variant="contained" color="primary" onClick={() => handleEditOpen(game)}
                                            sx={{ mt: 2 }} disableElevation={true}>
                                            Update
                                        </Button>
                                        <Button variant="outlined" color="ColorDelete"
                                            onClick={() => deleteGame(game._id)} sx={{ mt: 2 }}
                                            disableElevation={true}>
                                            Delete
                                        </Button>
                                    </CardActions>

                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>

            <AddGameDialog open={open} handleClose={handleClose} onGameAdded={handleGameAdded} />

            <Modal show={editOpen} onHide={handleEditClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Game</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleUpdateGame}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter game name"
                                name="name"
                                value={editedGame?.name || ''}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter game description"
                                name="description"
                                value={editedGame?.description || ''}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Participants Required</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter number of participants required"
                                name="participantsRequired"
                                value={editedGame?.participantsRequired || ''}
                                onChange={handleInputChange}
                                min="0"
                                required
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outlined" color="ColorDelete" onClick={handleEditClose}>Cancel</Button>
                        <Button variant="contained" disableElevation={true} color="primary" type="submit">Save</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
}

export default GamesList;