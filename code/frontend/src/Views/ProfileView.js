import React, {useRef, useEffect, useState} from 'react';
import axios from 'axios';
import ConditionalNavigationComponent from './UI-NavigationComponents/ConditionalNavigationComponent';
import {
    Container,
    Box,
    Typography,
    Card,
    CardContent,
    TextField,
    Avatar,
    IconButton,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    CircularProgress
} from '@mui/material';
import {IoPencil, IoSave, IoClose} from 'react-icons/io5';
import {useNavigate} from 'react-router-dom';


const ProfileView = () => {
    const [user, setUser] = useState({
        firstname: '', lastname: '', username: '', email: '', imageFile: null, imageLink: ''
    });
    const [originalUser, setOriginalUser] = useState(null);
    const [editing, setEditing] = useState(false);
    const [message, setMessage] = useState('');
    const [orders, setOrders] = useState([]);
    const [sortOrder, setSortOrder] = useState('desc');
    const navigate = useNavigate();
    const [fieldValidity, setFieldValidity] = useState({
        firstname: true, lastname: true, username: true, email: true,
    });
    const fileInputRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('/user/getMe');
                setUser(response.data.user);
                setOriginalUser(response.data.user);
                await fetchOrders(response.data.user._id); // Fetch orders for the logged-in user
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };
        fetchProfile();
    }, []);

    const fetchOrders = async (userId) => {
        try {
            const response = await axios.get(`/orders/getByUser/${userId}`);
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setUser({...user, [name]: value});

        //code fragment from sign up logic (to reset field validity)
        if (name === 'email' || name === 'username') {
            setFieldValidity(prevState => ({...prevState, [name]: true})); // Reset field validity
        }

    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setUser((prevItem) => ({
            ...prevItem, imageFile: file
        }));
    };

    const handleAvatarClick = () => {
        if (editing) {
            fileInputRef.current.click();
        }
    };

    const validateForm = () => {
        let isValid = true;
        // Used to change the validity of each field (used for red color)
        let newFieldValidity = {
            firstname: /^[A-Za-z\s]+$/.test(user.firstname),
            lastname: /^[A-Za-z\s]+$/.test(user.lastname),
            username: /^[A-Za-z0-9_.]+$/.test(user.username),
            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email),
        };

        // Check if any field in user is empty and if any fields is already false
        for (let field in newFieldValidity) {
            if (!user[field] || newFieldValidity[field] === false) {
                newFieldValidity[field] = false;
                isValid = false;
            }
        }

        // Update fieldValidity state
        setFieldValidity(prevState => ({...prevState, ...newFieldValidity}));

        return isValid;
    };

    const handleSave = async () => {
        if (!validateForm()) {
            setMessage('Please fill out all fields correctly');
            return;
        }

        setIsLoading(true);

        try {
            const userId = user._id;
            const formData = new FormData();
            formData.append('firstname', user.firstname);
            formData.append('lastname', user.lastname);
            formData.append('username', user.username);
            formData.append('email', user.email);
            if (user.imageFile) {
                formData.append('image', user.imageFile);
            }

            const response = await axios.put(`/user/update/${userId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                setUser(response.data.user);
                setOriginalUser(response.data.user);
                setEditing(false);
                setMessage('Profile updated successfully.');
            } else {
                setMessage('Failed to update profile.');
            }

            setMessage('Profile updated successfully.');
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage('Failed to update profile.');
        }
        setEditing(false);
        setIsLoading(false);

    };

    const handleCancel = () => {
        setUser(originalUser);
        setEditing(false);
        setFieldValidity({
            firstname: true, lastname: true, username: true, email: true,
        });
    };

    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
    };

    const sortedOrders = orders.sort((a, b) => {
        if (sortOrder === 'asc') {
            return new Date(a.time) - new Date(b.time);
        } else {
            return new Date(b.time) - new Date(a.time);
        }
    });

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

    return (<div>
            <ConditionalNavigationComponent/>

            <Container maxWidth="sm" style={{marginTop: '40px'}}>

                {/* Profile container */}
                <Card style={{backgroundColor: '#f1f1f1', marginBottom: '20px'}} elevation={0}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Avatar
                                src={user.imageLink}
                                alt={user.username}
                                style={{
                                    width: 80,
                                    height: 80,
                                    cursor: editing ? 'pointer' : 'default',
                                    filter: editing ? 'grayscale(100%)' : 'none'
                                }}
                                onClick={handleAvatarClick}

                            />


                            <input
                                type="file"
                                accept=".jpg,.jpeg,.png"
                                ref={fileInputRef}
                                style={{display: 'none'}}
                                onChange={handleFileChange}
                            /> {editing ? (<>
                                {isLoading ? (

                                    <>
                                        <IconButton color="primary">
                                            <CircularProgress color="primary"/>
                                        </IconButton>
                                        <IconButton color="secondary">
                                            <IoClose/>
                                        </IconButton>
                                    </>


                                ) : (<>
                                        <IconButton color="primary" onClick={handleSave}>
                                            <IoSave/>
                                        </IconButton>
                                        <IconButton color="secondary" onClick={handleCancel}>
                                            <IoClose/>
                                        </IconButton>
                                    </>)}
                            </>) : (<IconButton color="primary" onClick={() => setEditing(true)}>
                                <IoPencil/>
                            </IconButton>)}
                        </Box>
                        <Box mb={2}>
                            <TextField
                                label="First Name"
                                name="firstname"
                                value={user.firstname}
                                onChange={handleChange}
                                fullWidth
                                disabled={!editing}
                                variant="outlined"
                                margin="normal"
                                style={{
                                    border: !fieldValidity.firstname ? '1px solid red' : '', borderRadius: '4px'
                                }}
                            />
                            <TextField
                                label="Last Name"
                                name="lastname"
                                value={user.lastname}
                                onChange={handleChange}
                                fullWidth
                                disabled={!editing}
                                variant="outlined"
                                margin="normal"
                                style={{
                                    border: !fieldValidity.lastname ? '1px solid red' : '', borderRadius: '4px'
                                }}
                            />
                            <TextField
                                label="Username"
                                name="username"
                                value={user.username}
                                onChange={handleChange}
                                fullWidth
                                disabled={!editing}
                                variant="outlined"
                                margin="normal"
                                style={{
                                    border: !fieldValidity.username ? '1px solid red' : '', borderRadius: '4px'
                                }}
                            />
                            <TextField
                                label="Email"
                                name="email"
                                value={user.email}
                                onChange={handleChange}
                                fullWidth
                                disabled={!editing}
                                variant="outlined"
                                margin="normal"
                                style={{
                                    border: !fieldValidity.email ? '1px solid red' : '', borderRadius: '4px'
                                }}
                            />


                        </Box>
                    </CardContent>

                    {message && <Typography variant="body1" color="textSecondary" align="center"
                                            sx={{mb: 2}}>{message}</Typography>}

                </Card>


                {/* Order container */}
                <Card style={{backgroundColor: '#f1f1f1', marginBottom: '20px'}} elevation={0}>
                    <CardContent>
                        <Typography variant="h5" component="h2" gutterBottom align="center">
                            Orders
                        </Typography>
                        <Box mb={2} display="flex" justifyContent="space-between">
                            <FormControl variant="outlined" fullWidth>
                                <InputLabel>Sort By</InputLabel>
                                <Select value={sortOrder} onChange={handleSortChange} label="Sort By">
                                    <MenuItem value="asc">Ascending</MenuItem>
                                    <MenuItem value="desc">Descending</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        <ul className="list-unstyled">
                            {sortedOrders.map(order => (<li key={order._id} className="mb-3">
                                    <div className="p-3 bg-light rounded">
                                        <strong>Order: </strong> #{order.id} <br/>
                                        <strong>Status:</strong> {order.status} <br/>

                                        <strong>Time:</strong> {new Date(order.time).toLocaleString()} <br/>
                                        <strong>Table:</strong> {order.table} <br/>
                                        <div>
                                            <strong>Items:</strong>
                                            <div style={{marginLeft: '20px'}}>
                                                {order.items.map((item, index) => (<div key={index}>
                                                        {item.quantity} x {item.item ? item.item.name : "n.a."}
                                                    </div>))}
                                            </div>
                                        </div>
                                        <br/>

                                    </div>
                                </li>))}
                        </ul>
                    </CardContent>
                </Card>

                <Typography
                    sx={{
                        color: 'red',
                        textAlign: 'center',
                        mt: 2,
                        fontSize: '20px',
                        cursor: 'pointer',
                        marginBottom: '100px'
                    }} onClick={handleLogout}>
                    Logout
                </Typography>

            </Container>
        </div>);
};

export default ProfileView;