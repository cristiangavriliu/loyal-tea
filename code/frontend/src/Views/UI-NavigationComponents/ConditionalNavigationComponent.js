import React, { useEffect, useState} from 'react';
import AdminTopBarComponent from './AdminTopBarComponent';
import UserTopBarComponent from './UserTopBarComponent';
import EmployeeTopBarComponent from './EmployeeTopBarComponent';
import axios from "axios";

function ConditionalNavigationComponent() {
    const [user, setUser] = useState(null);

    // Hook to fetch user data
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


    // Return the correct top bar based on the user role
    return (
        <>
            {user ? (
                user.user.role === 'admin' ? (
                    <AdminTopBarComponent />
                ) : user.user.role === 'employee' ? (
                    <EmployeeTopBarComponent />
                ) : (
                    <UserTopBarComponent />
                )
            ) : (
                <div style={{ height: '70px' }}></div>
            )}
        </>

    );
}

export default ConditionalNavigationComponent;