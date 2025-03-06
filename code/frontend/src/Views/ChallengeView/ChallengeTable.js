import React, {useEffect, useState} from 'react';
import {
    Button,
    Card,
    CardContent,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import axios from 'axios';
import {io} from 'socket.io-client';
import CloseIcon from '@mui/icons-material/Close';


function ChallengeTable({challenge}) {
    const [participants, setParticipants] = useState(challenge ? challenge.participants : []);

    // Connect to the WebSocket server
    useEffect(() => {
        const socket = io('http://localhost:8080');

        socket.on('connect', () => {
            console.log('Connected to server');
        });

        // Listen for changes to the participants of the current challenge and update the state
        socket.on('challengeParticipantsChange', async () => {
            try {
                const response = await axios.get(`/challenges/get/${challenge._id}`);
                const updatedChallenge = response.data;
                setParticipants(updatedChallenge.participants);
            } catch (error) {
                console.error('Error fetching updated challenge data:', error);
            }
        });

        socket.on('error', (error) => {
            console.error('WebSocket error:', error);
        });

        return () => {
            socket.disconnect();
            console.log('Disconnected from server');
        };
    }, [challenge._id]);

    const currentParticipants = participants.filter(participant => !participant.hasCompleted);
    const pastParticipants = participants.filter(participant => participant.hasCompleted);

    // Calculate the payout based on the score
    function calculatePayoff(score, maxScore, maxPayout) {
        let payoff = (score / maxScore) * maxPayout;

        // Round down to the next lower number
        return Math.floor(payoff);
    }

    // Handle the change of the score input
    const handleInputChange = async (event, participantId) => {
        const {name, value} = event.target;
        if (name !== "score") return;

        const list = [...participants];
        const participantIndex = list.findIndex(participant => participant._id === participantId);
        if (participantIndex === -1) return;

        let score = Number(value);
        if (score < 0) score = 0;
        if (score > challenge.maxScore) score = challenge.maxScore;

        const payout = calculatePayoff(score, challenge.maxScore, challenge.maxPayout);

        // Update the score and payout in the local state
        list[participantIndex].score = score;
        list[participantIndex].payout = payout;
        setParticipants(list);

        try {
            await axios.put(`/challenges/updateParticipant/${challenge._id}`, {
                participantId: list[participantIndex]._id,
                score: score,
                payout: payout
            });
        } catch (error) {
            console.error('Error updating participant: ', error);
        }
    };

    // Handle the removal of a participant
    const handleRemoveParticipant = async (participantId, index) => {
        try {
            const response = await axios.delete(`/challenges/deleteParticipant/${challenge._id}/${participantId}`);

            if (response.status !== 200) {
                throw new Error('Error removing participant');
            }
            // Remove the participant from the local state
            const list = [...participants];
            list.splice(index, 1);
            setParticipants(list);
        } catch (error) {
            console.error('Error removing participant: ', error);
        }
    };

    // Handle the confirmation of a participants completion
    const handleConfirmCompletion = async (participantId) => {
        try {
            // Find the participant in the local state
            const participant = participants.find(participant => participant._id === participantId);
            if (!participant) {
                console.error('Participant not found: ', participantId);
                return;
            }

            // Toggle the hasCompleted status of the participant
            const newStatus = !participant.hasCompleted;

            // Send a request to the backend to update the hasCompleted status
            const response = await axios.put(`/challenges/confirmParticipant/${challenge._id}/${participantId}`, {
                hasCompleted: newStatus
            });

            if (response.status === 200) {
                // Update the state to reflect the change in the backend
                const updatedParticipants = participants.map(participant =>
                    participant._id === participantId ? {...participant, hasCompleted: newStatus} : participant
                );
                setParticipants(updatedParticipants);
            }
        } catch (error) {
            console.error('Error confirming completion: ', error);
        }
    };

    return (
        <Card className="centered-framed-table" elevation={0}>
            <CardContent>
                <Typography variant="h6" component="div" style={{margin: '20px 0'}}>
                    Current Participants
                </Typography>
                <TableContainer>
                    <Table striped bordered hover className="mb-3">
                        <TableHead>
                            <TableRow>
                                <TableCell className="usernameCell">Username</TableCell>
                                <TableCell className="nameCell">Name</TableCell>
                                <TableCell className="scoreCell">Score</TableCell>
                                <TableCell className="payoutCell">Payout</TableCell>
                                <TableCell className="actionsCell" align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {renderParticipants(currentParticipants, handleInputChange, handleConfirmCompletion, handleRemoveParticipant, challenge)}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Typography variant="h6" component="div" style={{margin: '20px 0'}}>
                    Past Participants
                </Typography>
                <TableContainer>
                    <Table striped bordered hover>
                        <TableHead>
                            <TableRow>
                                <TableCell className="usernameCell">Username</TableCell>
                                <TableCell className="nameCell">Name</TableCell>
                                <TableCell className="scoreCell">Score</TableCell>
                                <TableCell className="payoutCell">Payout</TableCell>
                                <TableCell className="actionsCell" align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {renderParticipants(pastParticipants, handleInputChange, handleConfirmCompletion, handleRemoveParticipant, challenge)}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    );


    function renderParticipants(participants, handleInputChange, handleConfirmCompletion, handleRemoveParticipant, challenge) {
        return (!participants || participants.length === 0) ? (
            <TableRow>
                <TableCell colSpan={6} align="center">
                    No participants yet
                </TableCell>
            </TableRow>
        ) : (
            participants.map((item, index) => (
                <TableRow key={item._id}>
                    <TableCell className="usernameCell">{item.user.username}</TableCell>
                    <TableCell className="nameCell">{item.user.firstname + ' ' + item.user.lastname}</TableCell>
                    <TableCell className="scoreCell">
                        <input
                            type="number"
                            className="form-control"
                            name="score"
                            value={item.score}
                            onChange={(event) => handleInputChange(event, item._id)}
                            disabled={item.hasCompleted}
                            max={challenge.maxScore}
                            min="0"
                        />
                    </TableCell>
                    <TableCell className="payoutCell" align="center">
                        <input
                            type="text"
                            className="form-control"
                            name="payout"
                            value={item.payout || 0}
                            readOnly
                            disabled={true}
                            max={challenge.maxPayout}
                        />
                    </TableCell>
                    <TableCell className="actionsCell" align="center">
                        {!item.hasCompleted ? (
                            <Button variant="contained" disableElevation={true} color="primary" sx={{mr: 1}}
                                    onClick={() => handleConfirmCompletion(item._id)}>
                                Confirm
                            </Button>
                        ) : (
                            <Button variant="contained" disableElevation={true} color="primary" sx={{mr: 1}}
                                    disabled={true}>
                                Confirm
                            </Button>
                        )}
                        <IconButton onClick={() => handleRemoveParticipant(item._id, index)} color="ColorDelete">
                            <CloseIcon/>
                        </IconButton>
                    </TableCell>
                </TableRow>
            ))
        );
    }
}

export default ChallengeTable;