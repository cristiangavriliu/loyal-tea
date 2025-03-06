import React, {useEffect, useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {Box, Button, IconButton, Menu, MenuItem} from '@mui/material';
import {BiMenu} from 'react-icons/bi';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';


function EmployeeTopBarComponent() {
    const location = useLocation();
    const [anchorleft, setAnchorLeft] = useState(null);
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
    }, []);

    //for pop up menu
    const handleClick = (event) => {
        setAnchorLeft(event.currentTarget);
    };

    //for pop up menu
    const handleClose = () => {
        setAnchorLeft(null);
    };

    const handleProfileClick = () => {
        navigate('/profile');
    };

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
        handleClose();
    };

    const getButtonStyle = (path) => ({
        fontWeight: location.pathname === path ? 'bold' : 'normal',
        color: 'inherit', // Somehow this is required to make the color work
        textDecoration: 'none',
    });

    return (
        <div>
            <nav className='navbar navbar-top'>
                <form className='container-fluid'>
                    <Link to="/home">
                        <img src={"Logo1.png"} alt="Logo" style={{width: '50px', height: '50px', marginRight: '10px'}}/>
                    </Link>

                    { /* Applies margin to all direct children except for 'style' elements */}
                    <Box sx={{'& > :not(style)': {m: 1}}}>
                        <Button
                            color="inherit"
                            disableElevation
                            onClick={() => navigate('/orderList')}
                            style={getButtonStyle('/orderList')}
                        >
                            Orders
                        </Button>

                        <Button
                            color="inherit"
                            disableElevation
                            onClick={() => navigate('/ChallengesList')}
                            style={getButtonStyle('/ChallengesList')}
                        >
                            Challenges
                        </Button>

                        <Button
                            color="inherit"
                            disableElevation
                            onClick={() => navigate('/gamesList')}
                            style={getButtonStyle('/gamesList')}
                        >
                            Games
                        </Button>

                    </Box>

                    <Box sx={{flexGrow: 1}}/>
                    <IconButton edge="end" color="inherit" onClick={handleClick}>
                        <BiMenu/>
                    </IconButton>
                    <Menu
                        anchorEl={anchorleft}
                        open={Boolean(anchorleft)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                </form>
            </nav>
            <div style={{height: '70px'}}></div>
        </div>

    );
}

export default EmployeeTopBarComponent;