import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Typography
} from '@mui/material';
import Slide from '@mui/material/Slide';
import ConditionalNavigationComponent from '../UI-NavigationComponents/ConditionalNavigationComponent';
import {useChallenges} from '../ChallengesContext';
import CloseIcon from '@mui/icons-material/Close';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function ChallengesComponent() {
    const [selectedChallenge, setSelectedChallenge] = useState(null);
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState(null);
    const {challenges, fetchChallenges} = useChallenges();

    useEffect(() => {
        // Fetch challenges initially
        fetchChallenges();

        // Fetch the user data when the component mounts
        fetchUser();
    }, []);

    // Formats the date string to a readable format
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit', month: '2-digit', year: 'numeric',
        });
    };

    // Fetches the current user
    const fetchUser = async () => {
        const response = await axios.get('/user/getMe');
        if (response.status === 200) {
            setUser(response.data);
        } else {
            console.log('Failed to get current user:', response.data.message);
        }
    };

    // Joins a challenge
    const joinChallenge = async (challengeId) => {
        const responseGetMe = await axios.get('/user/getMe');
        if (responseGetMe.status === 200) {
            const user = responseGetMe.data;
            const responseAddParticipant = await axios.put(`/challenges/addParticipant/${challengeId}`, {user});
            if (responseAddParticipant.status === 200) {
                fetchChallenges();
                fetchUser();
            }
        } else {
            console.log('Failed to get current user:', responseGetMe.data.message);
        }
    };

    // Leaves a challenge
    const handleLeaveChallenge = async (challengeId) => {
        const responseGetMe = await axios.get('/user/getMe');
        if (responseGetMe.status === 200) {
            const user = responseGetMe.data;
            // Find the participant object for the current user
            const participant = challenges.find(challenge => challenge._id === challengeId)
                .participants.find(participant => participant.user._id === user.user._id);
            if (!participant) {
                console.log('Failed to find participant for current user');
                return;
            }
            const responseDeleteParticipant = await axios.delete(`/challenges/deleteParticipant/${challengeId}/${participant._id}`);
            if (responseDeleteParticipant.status === 200) {
                fetchChallenges();
            }
        } else {
            console.log('Failed to get current user:', responseGetMe.data.message);
        }
    };

    const openDetails = (challenge) => {
        setSelectedChallenge(challenge);
        setOpen(true);
    };

    const closeDetails = () => {
        setOpen(false);
    };


    return (<div>
        <ConditionalNavigationComponent/>
        <Container maxWidth="sm" style={{marginTop: '40px', marginBottom: '100px'}}>
            {challenges.length === 0 ? (
                <Typography variant="h6" color="text.secondary" align="center" style={{marginTop: '20px'}}>
                    No challenges available at the moment.
                </Typography>) : (challenges.map((challenge, index) => {
                const currentUserParticipant = challenge.participants.find(participant => participant.user._id === user?.user._id);
                const hasCompleted = currentUserParticipant ? currentUserParticipant.hasCompleted : false;
                const isJoinable = index === 0;

                return (<Card key={challenge._id} style={{
                    backgroundColor: '#f1f1f1', marginBottom: '20px', opacity: isJoinable ? '1' : '0.5',
                }} elevation={0}>
                    <Box sx={{
                        position: 'relative', '&::before': {
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
                            image={challenge.game.imagePath ? challenge.game.imagePath : "StockChallangesIMG.jpg"}
                            alt={challenge.game.name}
                            sx={{position: 'relative', zIndex: 0}}
                        />
                    </Box>
                    <Box sx={{position: 'relative', top: '-100px', pl: 2, zIndex: 2}}>
                        <Typography gutterBottom variant="h5" component="div"
                                    sx={{color: 'white', fontWeight: 'bold'}}>
                            {challenge.game.name}
                        </Typography>
                    </Box>
                    <CardContent>
                        <Typography variant="body2"
                                    color="text.secondary">Date: {formatDate(challenge.date)}</Typography>
                        <Typography variant="body2"
                                    color="text.secondary">Time: {challenge.time}</Typography>
                        <Typography variant="body2"
                                    color="text.secondary">Payout: {challenge.maxPayout}</Typography>
                        {user && currentUserParticipant ? (hasCompleted ? (
                            <Typography variant="body2" color="text.secondary" sx={{mt: 2}}>You have
                                already
                                completed this Challenge.</Typography>) : (
                            <Button variant="outlined" color="ColorDelete"
                                    onClick={() => handleLeaveChallenge(challenge._id)}
                                    sx={{mt: 2}}>Leave</Button>)) : (
                            <Button variant="contained" color="primary"
                                    onClick={() => isJoinable ? joinChallenge(challenge._id) : null}
                                    sx={{mt: 2}} disableElevation={true}>Join</Button>)}
                        <Button variant="text" onClick={() => openDetails(challenge)}
                                sx={{ml: 2, mt: 2}}>Details</Button>
                    </CardContent>
                </Card>);
            }))}
            <Dialog open={open}
                    TransitionComponent={Transition}
                    onClose={closeDetails}
                    maxWidth={'xs'}
                    fullWidth={true}
            >
                <DialogTitle id="challenge-dialog-title">{selectedChallenge?.name}</DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={closeDetails}
                    sx={{
                        position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon/>
                </IconButton>
                <DialogContent>
                    <DialogContentText>
                        {selectedChallenge?.game.description}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDetails} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    </div>);
}

export default ChallengesComponent;