import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Alert, Form, Modal} from 'react-bootstrap';
import {Button} from '@mui/material';
import '../css/bootstrap.css';

function AddChallengeDialog({open, handleClose}) {
    const [newChallenge, setNewChallenge] = useState({
        name: '',
        date: '',
        time: '',
        maxPayout: '',
        maxScore: '',
        game: '',
        isActive: true,
    });

    const [games, setGames] = useState([]);
    const [error, setError] = useState('');

    // Fetch all games to populate the game dropdown
    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await axios.get('/games/getAll');
                setGames(response.data);
                // Set the default game as the first game fetched
                if (response.data.length > 0) {
                    setNewChallenge(prevState => ({
                        ...prevState,
                        game: response.data[0]._id
                    }));
                }
            } catch (error) {
                console.error('Error fetching games: ', error);
            }
        };

        fetchGames();
    }, []);

    // Update the newChallenge state when the user types in the form fields
    const handleChange = (event) => {
        setNewChallenge({
            ...newChallenge,
            [event.target.name]: event.target.value
        });
    };

    // Handle the form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        // Combine date and time input to a single date object
        const selectedDateTime = new Date(`${newChallenge.date}T${newChallenge.time}`);
        const currentDateTime = new Date();

        // Check if the selected date and time are in the past
        if (selectedDateTime <= currentDateTime) {
            setError('The selected date and time must be in the future.');
            return;
        }

        // Check if any fields are empty
        if (!newChallenge.name || !newChallenge.maxPayout || !newChallenge.date || !newChallenge.time || !newChallenge.game || !newChallenge.maxScore) {
            setError('Please fill in all fields');
            return;
        }

        const dateForStorage = `${newChallenge.date}T00:00:00.000Z`;

        try {
            const response = await axios.post('/challenges/create', {
                ...newChallenge,
                date: dateForStorage,
                maxPayout: Number(newChallenge.maxPayout),
                maxScore: Number(newChallenge.maxScore),
            });
            if (response.status === 201) {
                handleClose();
            }
        } catch (error) {
            console.error('Error adding challenge: ', error);
            setError('Failed to add challenge. Please try again.');
        }
    };

    const onShow = () => {
      if (games.length === 0) {
        alert('First add a Game then start a Challenge!');
        handleClose();
      }
    }

    return (
        <Modal show={open} onHide={handleClose} onShow={onShow}>
            <Modal.Header closeButton>
                <Modal.Title>Add New Challenge</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form.Group className="mb-3">
                        <Form.Label>Challenge Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="e.g. Tonight's Dart Challenge"
                            value={newChallenge.name}
                            onChange={handleChange}
                            name="name"/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Payout</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter maximum payout"
                            value={newChallenge.maxPayout}
                            onChange={handleChange}
                            name="maxPayout"
                            min="0"/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Score</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter maximum score"
                            value={newChallenge.maxScore}
                            onChange={handleChange}
                            name="maxScore"
                            min="0"/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Date</Form.Label>
                        <Form.Control
                            type="date"
                            value={newChallenge.date}
                            onChange={handleChange}
                            name="date"/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Time</Form.Label>
                        <Form.Control
                            type="time"
                            value={newChallenge.time}
                            onChange={handleChange}
                            name="time"/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Game</Form.Label>
                        <Form.Select
                            value={newChallenge.game}
                            onChange={handleChange}
                            name="game">
                            {games.map((game) => (
                                <option key={game._id} value={game._id}>{game.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outlined" color="ColorDelete" onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" disableElevation={true} color="primary" type="submit">Add</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default AddChallengeDialog;