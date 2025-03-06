import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Fab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from '@mui/material';
import ChallengeTable from './ChallengeTable';
import ConditionalNavigationComponent from '../UI-NavigationComponents/ConditionalNavigationComponent';
import AddChallengeDialog from './AddChallengeDialog';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {useChallenges} from '../ChallengesContext';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function ChallengesView() {
    const {challenges, pastChallenges, fetchChallenges} = useChallenges();
    const [selectedChallenge, setSelectedChallenge] = useState(null);
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        fetchChallenges();
    }, []);

    //Toggles the ChallengeTable for the selected challenge
    const handleOpenTable = (challenge) => {
        setSelectedChallenge((prevSelectedChallenge) => {
            if (prevSelectedChallenge && prevSelectedChallenge._id === challenge._id) {
                return null;
            } else {
                return challenge;
            }
        });
    };

    //Delete challenge functionality
    const handleDelete = async (challenge) => {
        try {
            const response = await axios.delete(`/challenges/delete/${challenge._id}`);
            if (response.status === 200) {
                await fetchChallenges();
                setSelectedChallenge(null);
            } else {
                throw new Error('Error deleting challenge');
            }
        } catch (error) {
            console.error('Error deleting challenge: ', error);
        }
    };

    //Marks the challenge as complete and moves it to the past challenges list
    const handleCompleteChallenge = async (challenge) => {
        try {
            const response = await axios.put(`/challenges/complete/${challenge._id}`);
            if (response.status === 200) {
                await fetchChallenges();
                setSelectedChallenge(null);
            } else {
                throw new Error('Error completing challenge');
            }
        } catch (error) {
            console.error('Error completing challenge: ', error);
        }
    };

    return (
        <div>
            <ConditionalNavigationComponent/>

            <div className="container">
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
                    <AddIcon/>
                </Fab>
                <Typography variant="h4" gutterBottom sx={{mt: 2}}>
                    Upcoming Challenges:
                </Typography>
                <TableContainer sx={{maxHeight: 600}} style={{backgroundColor: '#f1f1f1'}} elevation={0}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{backgroundColor: '#E7E7E7', width: '122px'}}/>
                                <TableCell sx={{backgroundColor: '#E7E7E7'}} align="center">Challenge Name</TableCell>
                                <TableCell sx={{backgroundColor: '#E7E7E7'}} align="center">Date</TableCell>
                                <TableCell sx={{backgroundColor: '#E7E7E7'}} align="center">Time</TableCell>
                                <TableCell sx={{backgroundColor: '#E7E7E7'}} align="center">Game</TableCell>
                                <TableCell sx={{backgroundColor: '#E7E7E7'}} align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {challenges.map((challenge, index) => (
                                <Row challenge={challenge} handleOpenTable={handleOpenTable}
                                     selectedChallenge={selectedChallenge} isPastChallenge={false}
                                     handleCompleteChallenge={() => handleCompleteChallenge(challenge)}
                                     handleDelete={() => handleDelete(challenge)}
                                     isCurrentChallenge={index === 0}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Typography variant="h4" gutterBottom sx={{mt: 4}}>
                    Past Challenges:
                </Typography>
                <TableContainer sx={{maxHeight: 600}} style={{backgroundColor: '#f1f1f1'}} elevation={0}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{backgroundColor: '#E7E7E7', width: '122px'}}/>
                                <TableCell sx={{backgroundColor: '#E7E7E7'}} align="center">Challenge Name</TableCell>
                                <TableCell sx={{backgroundColor: '#E7E7E7'}} align="center">Date</TableCell>
                                <TableCell sx={{backgroundColor: '#E7E7E7'}} align="center">Time</TableCell>
                                <TableCell sx={{backgroundColor: '#E7E7E7'}} align="center">Game</TableCell>
                                <TableCell sx={{backgroundColor: '#E7E7E7'}} align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pastChallenges.map((challenge) => (
                                <Row challenge={challenge} handleOpenTable={handleOpenTable}
                                     selectedChallenge={selectedChallenge} isPastChallenge={true}
                                     handleCompleteChallenge={() => handleCompleteChallenge(challenge)}
                                     handleDelete={() => handleDelete(challenge)}/>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <AddChallengeDialog open={open} handleClose={handleClose}/>
            </div>
        </div>
    )
        ;
}

function Row({
                 challenge,
                 handleOpenTable,
                 selectedChallenge,
                 isPastChallenge,
                 handleCompleteChallenge,
                 handleDelete,
                 isCurrentChallenge
             }) {
    const [open, setOpen] = useState(false);

    // Effect hook to open ChallengeTable when selectedChallenge changes
    useEffect(() => {
        if (selectedChallenge && selectedChallenge._id === challenge._id) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [selectedChallenge, challenge._id]);

    return (
        <>
            <TableRow sx={{'& > *': {borderBottom: 'unset'}}}>
                <TableCell>
                    <IconButton
                        size="small"
                        onClick={() => {
                            setOpen(!open);
                            handleOpenTable(challenge);
                        }}
                    >
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                    {isCurrentChallenge &&
                        <span style={{color: '#4CAF50', fontWeight: 'bold', marginLeft: '4px'}}>Current</span>}
                </TableCell>
                <TableCell align="center">{challenge.name}</TableCell>
                <TableCell align="center">{new Date(challenge.date).toLocaleDateString()}</TableCell>
                <TableCell align="center">{challenge.time}</TableCell>
                <TableCell
                    align="center">{challenge.game && challenge.game.name ? challenge.game.name : 'No game'}</TableCell>
                <TableCell align="center">
                    {isPastChallenge ? (
                        <IconButton onClick={() => handleDelete(challenge)} color="ColorDelete">
                            <DeleteIcon/>
                        </IconButton>
                    ) : (
                        <IconButton onClick={() => handleCompleteChallenge(challenge)} color="primary">
                            <CheckCircleIcon/>
                        </IconButton>
                    )}
                </TableCell>
            </TableRow>
            {open && selectedChallenge && (
                <TableRow>
                    <TableCell colSpan={6}>
                        <ChallengeTable challenge={selectedChallenge}/>
                    </TableCell>
                </TableRow>
            )}
        </>
    );
}

export default ChallengesView;