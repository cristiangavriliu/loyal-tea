import React, {useState} from 'react';
import {Form, Modal} from 'react-bootstrap';
import {Button} from '@mui/material';

import axios from 'axios';

function AddGameDialog({open, handleClose, onGameAdded}) {
    const [newGame, setNewGame] = useState({
        name: '',
        description: '',
        participantsRequired: '',
        imageFile: null,
        imagePath: '',
    });

    // Update the newGame state when the user types in the form fields
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setNewGame((prevGame) => ({
            ...prevGame,
            [name]: value
        }));
    };

    // Update the newGame state when the user selects an image file
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setNewGame((prevGame) => ({
            ...prevGame,
            imageFile: file
        }));
    };

    // Handle the form submission
    const addGame = async (e) => {
        e.preventDefault();

        // Create a FormData object to send the form data
        const formData = new FormData();
        formData.append('name', newGame.name);
        formData.append('description', newGame.description);
        formData.append('participantsRequired', newGame.participantsRequired);
        formData.append('image', newGame.imageFile);

        try {
            const response = await axios.post('/games/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.status === 201) {
                onGameAdded(response.data);
                handleClose();
            }
        } catch (error) {
            console.error('Error adding game: ', error);
        }
    };

    return (
        <Modal show={open} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add a new game</Modal.Title>
            </Modal.Header>
            <Form onSubmit={addGame}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Game Name</Form.Label>
                        <Form.Control type="text" placeholder="e.g.: Chess, Darts, Ping-Pong" name="name" required
                                      onChange={handleInputChange}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows={3} placeholder="Give short description of the game and explain the basic rules." name="description" required
                                      onChange={handleInputChange}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Participants Required</Form.Label>
                        <Form.Control type="number" placeholder="Enter number of participants that are required" required
                                      name="participantsRequired" onChange={handleInputChange} min="0"/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Game Image</Form.Label>
                        <Form.Control type="file" accept=".jpg,.jpeg,.png"
                                      name="gameImage" onChange={handleFileChange} required/>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outlined" color="ColorDelete" onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" disableElevation={true}
                            color="primary" type="submit">Add</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default AddGameDialog;