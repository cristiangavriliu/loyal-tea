import React, {createContext, useContext, useEffect, useState} from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const ChallengesContext = createContext();

export const useChallenges = () => useContext(ChallengesContext);

export const ChallengesProvider = ({children}) => {
    const [challenges, setChallenges] = useState([]);
    const [pastChallenges, setPastChallenges] = useState([]);

    let socket;

    // Fetches all challenges
    const fetchChallenges = async () => {
        const response = await axios.get('/challenges/getUpcoming');
        const sortedChallenges = response.data.sort((a, b) => new Date(a.date) - new Date(b.date));
        setChallenges(sortedChallenges);

        const pastResponse = await axios.get('/challenges/getPast');
        const sortedPastChallenges = pastResponse.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setPastChallenges(sortedPastChallenges);
    };

    const initializeSocketConnection = () => {
        if (socket) {
            socket.disconnect();
        }

        socket = io('http://localhost:8080');

        // Listen for 'challengeChange' event from the server
        socket.on('challengeChange', () => {

            // Fetch challenges when a challenge is added or updated
            fetchChallenges();
        });

        // Handle connection error
        socket.on('connect_error', (error) => {
            console.error("Socket.IO connection error:", error);
        });
    };

    useEffect(() => {
        fetchChallenges();
        initializeSocketConnection();

        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, []);

    return (
        <ChallengesContext.Provider value={{challenges, pastChallenges, fetchChallenges}}>
            {children}
        </ChallengesContext.Provider>
    );
};