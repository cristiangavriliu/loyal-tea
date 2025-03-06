import React, {useState, useEffect} from 'react';
import axios from 'axios';
import ReactSelect from 'react-select';
import {Modal, Form} from 'react-bootstrap';
import {Button} from '@mui/material';


const OrderForm = ({onClose, onAddOrder}) => {
    const [tableNumber, setTableNumber] = useState('');
    const [time, setTime] = useState(() => {
        const now = new Date();
        const berlinTime = new Intl.DateTimeFormat('en-GB', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Europe/Berlin',
            hour12: false
        }).format(now);

        return berlinTime.replace(/(\d{2})\/(\d{2})\/(\d{4}), (\d{2}:\d{2})/, '$3-$2-$1T$4');
    });
    const [items, setItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        // Fetch items from the server
        const fetchItems = async () => {
            try {
                const res = await axios.get('/items/getAll'); // Adjust the endpoint as needed
                setItems(res.data);
            } catch (error) {
                console.error('Error fetching items', error);
            }
        };

        // Fetch users from the server
        const fetchUsers = async () => {
            try {
                const res = await axios.get('/user/getAll'); // Adjust the endpoint as needed
                setUsers(res.data);
            } catch (error) {
                console.error('Error fetching users', error);
            }
        };

        fetchItems();
        fetchUsers();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const itemsWithQuantities = selectedItems.map(item => ({
            item: item.value,
            quantity: item.quantity
        }));
        console.log(time)
        const newOrder = {
            items: itemsWithQuantities,
            table: Number(tableNumber),
            time,
            user: selectedUser ? selectedUser.value : null,
            status: 'Ordered'
        };
        try {
            const res = await axios.post('/orders/create', newOrder);
            onAddOrder(res.data);
            onClose();
        } catch (error) {
            console.error('Error creating order', error);
        }
    };

    const itemOptions = items.map(item => ({
        value: item._id,
        label: item.name,
    }));

    const userOptions = users.map(user => ({
        value: user._id,
        label: `${user.firstname} ${user.lastname}`,
    }));

    const handleItemChange = (selectedItems) => {
        setSelectedItems(selectedItems.map(item => ({
            ...item,
            quantity: 1
        })));
    };

    const handleQuantityChange = (index, quantity) => {
        const updatedItems = [...selectedItems];
        updatedItems[index].quantity = quantity;
        setSelectedItems(updatedItems);
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Modal.Body>
                <Form.Group className="mb-3">
                    <Form.Label>Items</Form.Label>
                    <ReactSelect
                        isMulti
                        options={itemOptions}
                        value={selectedItems}
                        onChange={handleItemChange}
                        classNamePrefix="select"
                        required
                    />
                </Form.Group>

                {selectedItems.map((item, index) => (
                    <Form.Group className="mb-3" key={item.value}>
                        <Form.Label>{item.label} Quantity</Form.Label>
                        <Form.Control
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(index, Number(e.target.value))}
                            required
                        />
                    </Form.Group>
                ))}

                <Form.Group className="mb-3">
                    <Form.Label>Customer</Form.Label>
                    <ReactSelect
                        options={userOptions}
                        value={selectedUser}
                        onChange={setSelectedUser}
                        className="basic-single-select"
                        classNamePrefix="select"
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Table Number</Form.Label>
                    <Form.Control
                        type="number"
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        required
                        min="1"
                    />
                </Form.Group>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="outlined" color="ColorDelete" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="contained" disableElevation={true} color="primary" type="submit">
                    Add
                </Button>
            </Modal.Footer>
        </Form>
    );
};

export default OrderForm;