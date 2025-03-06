import React, {useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';
import {Box, IconButton} from '@mui/material';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import io from 'socket.io-client';
//Import Icons
import { FaHome, FaUser } from 'react-icons/fa';
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { RiGameFill } from "react-icons/ri";
import { IoExtensionPuzzle, IoLogOut } from "react-icons/io5";

function UserTopBarComponent() {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('/user/getMe');
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user data: ', error);
            }
        };
        fetchUserData();

        // Initialize Socket.IO client
        const socket = io('http://localhost:8080');

        // Listen for puzzlesChange event
        socket.on('puzzlesChange', (data) => {
            // Check if the change is for the current user
            if (data.userId === user?.user._id) {
                fetchUserData(); // Fetch user data again to update puzzles
            }
        });

        // Cleanup function to disconnect Socket.IO connection on component unmount
        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, [user?.user._id]); // Dependency array includes user ID to re-run effect if user changes

    const handleLogout = async () => {
        try {
            const response = await axios.get('/user/logout');

            if (response.data.success) {
                navigate('/');
            } else {
                alert('Logout was not successful, please try again.');
            }
        } catch (error) {
            alert('Logout was not successful, please try again.');
        }
    };

    const getButtonStyle = (path) => ({
        backgroundColor: location.pathname === path ? '#F9C784' : '#E7E7E7',
        color: 'black',
        padding: '10px',
    });

    const getPageTitle = (pathname) => {
        switch (pathname) {
            case '/home':
                return 'Home';
            case '/customerChallengesList':
                return 'Challenges';
            case '/menu':
                return 'Menu';
            case '/profile':
                return 'Profile';
            default:
                return '...';
        }
    };


    return (
        <div>

            <div className="d-flex justify-content-between align-items-center w-100 p-2 navbar navbar-top " style={{zIndex: 2000}}>
                <IconButton onClick={handleLogout} sx={{color: 'black'}}>  <IoLogOut /> </IconButton>
                <h2 className="m-0">{getPageTitle(location.pathname)}</h2>

                {user && user.user.role === 'user' && (
                    <div className="puzzle-points-container" style={{ fontSize: '20px' }}>
                        {user.user.puzzles}  <IoExtensionPuzzle />
                    </div>
                )}
            </div>

            <div style={{height: '56px'}}></div>

            <Box sx={{
                position: 'fixed',
                bottom: -1,
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'space-around',
                backgroundColor: '#fff',
                padding: '10px 0',
                zIndex: 1000,
                borderTop: '1px solid lightgray'
            }}>
                <IconButton onClick={() => navigate('/customerChallengesList')}
                            sx={{...getButtonStyle('/customerChallengesList')}}
                            className="button-navbar">
                    <RiGameFill/>
                </IconButton>

                <IconButton
                    onClick={() => navigate('/menu')}
                    sx={{...getButtonStyle('/menu')}}
                    className="button-navbar">
                    <MdOutlineRestaurantMenu/>
                </IconButton>

                <IconButton
                    onClick={() => navigate('/home')}
                    sx={{...getButtonStyle('/home')}}
                    className="button-navbar">
                    <FaHome/>
                </IconButton>

                <IconButton
                    onClick={() => navigate('/profile')}
                    sx={{...getButtonStyle('/profile')}}
                    className="button-navbar">
                    <FaUser/>
                </IconButton>
            </Box>

        </div>

    );
}

export default UserTopBarComponent;