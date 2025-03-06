import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {
    IconButton,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import ConditionalNavigationComponent from '../UI-NavigationComponents/ConditionalNavigationComponent';
import DeleteIcon from '@mui/icons-material/Delete';

function UserList() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    // Fetches all users
    const fetchUsers = async () => {
        try {
            const response = await axios.get('/user/getAll');
            setUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    };

    // Updates the role of a user
    const handleChangeRole = async (userId, newRole) => {
        try {
            await axios.put(`/user/${userId}/role`, {role: newRole});
            fetchUsers();
        } catch (error) {
            console.error('Failed to update user role:', error);
        }
    };

    // Deletes a user
    const handleDeleteUser = async (userId) => {
        try {
            await axios.delete(`/user/delete/${userId}`);
            fetchUsers();
        } catch (error) {
            console.error('Failed to delete user:', error);
        }
    };

    return (
        <div>
            <ConditionalNavigationComponent/>
            <div className="container">
                <Typography variant="h4" gutterBottom sx={{mt: 2}}>
                    User Management
                </Typography>
                <TableContainer sx={{maxHeight: 600}} style={{backgroundColor: '#f1f1f1'}} elevation={0}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{backgroundColor: '#E7E7E7'}}>Username</TableCell>
                                <TableCell sx={{backgroundColor: '#E7E7E7'}} align="center">Name</TableCell>
                                <TableCell sx={{backgroundColor: '#E7E7E7'}} align="center">Role</TableCell>
                                <TableCell sx={{backgroundColor: '#E7E7E7'}} align="center">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user._id}>
                                    <TableCell component="th" scope="row">
                                        {user.username}
                                    </TableCell>
                                    <TableCell align="center">{user.firstname + ' ' + user.lastname}</TableCell>
                                    <TableCell align="center">
                                        <Select
                                            value={user.role}
                                            onChange={(event) => handleChangeRole(user._id, event.target.value)}
                                            displayEmpty
                                        >
                                            <MenuItem value="user">User</MenuItem>
                                            <MenuItem value="employee">Employee</MenuItem>
                                            <MenuItem value="admin">Admin</MenuItem>
                                        </Select>
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton onClick={() => handleDeleteUser(user._id)} color="ColorDelete">
                                            <DeleteIcon/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    )
        ;
}

export default UserList;