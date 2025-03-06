import React, {useState} from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import TableBarIcon from '@mui/icons-material/TableBar';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {IoExtensionPuzzle} from "react-icons/io5";
import {
    Button,
    Divider,
    TextField,
    Typography,
    Box,
    Chip,
    IconButton,
    Card,
    CardContent,
    List,
    ListItem,
    InputAdornment
} from '@mui/material';

function PaymentDrawer(cartWithDetails, totalPrice, availablePuzzlePoints, maxPuzzlePoints) {
    const [tableNumber, setTableNumber] = useState('');
    const [tableError, setTableError] = useState(false);
    const [puzzlePointReduction, setPuzzlePointReduction] = useState(0);
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

    // Functions

    // Process placed order and redirect to Stripe
    const handleCheckout = async () => {
        try {
            // Create necessary variables for order
            const itemsWithQuantities = Object.values(cartWithDetails).map(item => ({
                item: item._id,
                quantity: item.quantity
            }));

            const currentUser = (await axios.get('/user/getMe')).data.user._id;

            const newOrder = {
                items: itemsWithQuantities,
                table: Number(tableNumber),
                time: time,
                user: currentUser
            };

            // Create order
            const order = await axios.post('/orders/create', newOrder);

            // Create stripe session and save session and order ID to cookies
            const response = await axios.post('/payments/create-checkout-session', {
                shoppingCart: cartWithDetails,
                puzzles: puzzlePointReduction
            });

            // Reduce users puzzle points
            await axios.post('/user/reducePuzzles', {puzzles: puzzlePointReduction, userId: currentUser});

            // Set cookies
            Cookies.set('stripeSessionId', response.data.stripeSessionId)
            Cookies.set('orderId', order.data._id)

            // Redirect to Stripe checkout page
            window.location.href = response.data.url;
        } catch (error) {
            console.error('Error creating checkout session', error);
        }
    };

    // Handle table number change
    const handleTableChange = input => {
        if (input.target.validity.valid) {
            if (input.target.value > 0) {
                setTableNumber(input.target.value);
            }

            setTableError(false);
        } else {
            setTableError(true);
        }
    };

    // Handle puzzle reduction change
    const handlePuzzlePointChange = (quantity) => {

        if (totalPrice === 0) {
            return;
        }

        if (quantity < 0) {
            if (puzzlePointReduction <= 1) {
                setPuzzlePointReduction(0);
            } else {
                setPuzzlePointReduction(puzzlePointReduction + quantity);
            }
        } else {
            if (puzzlePointReduction >= availablePuzzlePoints) {
                setPuzzlePointReduction(availablePuzzlePoints);
            } else if (puzzlePointReduction >= maxPuzzlePoints) {
                setPuzzlePointReduction(maxPuzzlePoints);
            } else {
                setPuzzlePointReduction(puzzlePointReduction + quantity);
            }
        }
    };


    // Render drawer
    return (
        <Box
            sx={{
                width: '80%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 2,
                marginBottom: 2,
                marginTop: 2,
            }}
        >

            <Card
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                }}
                elevation={0}
                variant='outlined'
            >

                <CardContent>

                    <Typography variant="h5" fontWeight={'bold'} marginBottom={1}>
                        Your cart
                    </Typography>


                    <Divider variant="middle" style={{background: 'black'}}/>

                    {totalPrice === 0 ?
                        <Typography variant="subtitle1" margin="normal">
                            No items in cart
                        </Typography>
                        : null}

                    <List sx={{alignItems: 'flex-start', justifyContent: 'flex-start'}}>
                        {Object.values(cartWithDetails).map(item => (
                            <ListItem key={item._id} alignItems='flex-start'>
                                {item.name} {item.price}€ x{item.quantity}: {item.price * item.quantity}€
                            </ListItem>
                        ))}
                    </List>

                    <Divider variant="middle" style={{background: 'black'}}/>

                    <TextField
                        id="input-table-number"
                        label="Table Number"
                        variant="outlined"
                        size='small'
                        margin='normal'
                        type='number'
                        fullWidth={true}
                        value={tableNumber}
                        onChange={handleTableChange}
                        error={tableError}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="end">
                                    <TableBarIcon color='black'/>
                                </InputAdornment>
                            )
                        }}
                        required
                    />


                    <Typography variant="button" margin="normal">
                        Subtotal: {totalPrice}€
                    </Typography>


                    <Box sx={{display: 'flex', alignItems: 'center'}} margin="normal">
                        <IoExtensionPuzzle sx={{color: 'action.active', mr: 1, my: 0.5}}/>
                        <IconButton
                            aria-label="Reduce puzzle points"
                            color="black"
                            onClick={() => handlePuzzlePointChange(-1)}>
                            <RemoveIcon/>
                        </IconButton>

                        <Chip
                            label={puzzlePointReduction}
                            style={{fontSize: '1em'}}
                        />

                        <IconButton
                            aria-label="Increase puzzle points"
                            color="black"
                            onClick={() => handlePuzzlePointChange(1)}>
                            <AddIcon/>
                        </IconButton>
                    </Box>


                    <Typography variant="button" margin="normal">
                        Total: {totalPrice - puzzlePointReduction * 0.5}€
                    </Typography>


                    <Button
                        color="primary"
                        aria-label="check out"
                        variant="contained"
                        onClick={handleCheckout}
                        margin="normal"
                        disabled={tableNumber === '' || totalPrice === 0}
                        sx={{marginTop: 1, width: 1}}
                    >
                        Order now
                    </Button>

                </CardContent>

            </Card>


        </Box>
    );
}

export default PaymentDrawer;