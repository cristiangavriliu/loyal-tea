import React from 'react';
import ConditionalNavigationComponent from './UI-NavigationComponents/ConditionalNavigationComponent'
import {Container, Box, Typography, Card, CardContent} from '@mui/material';


// Der text auf dieser seite wurde mit hilfe von ChatGPT erstellt
function Home() {
    return (<div>
        <ConditionalNavigationComponent/>
        <Container maxWidth="sm" style={{marginTop: '40px'}}>
            <Box textAlign="center" mb={4}>
                <Typography variant="h4" gutterBottom>Welcome to Puzzles Bar</Typography>
                <Typography variant="subtitle1">Your favorite place to unwind, connect, and enjoy the best drinks in
                    town.</Typography>
            </Box>

            <Card sx={{backgroundColor: '#f1f1f1', mb: 2}} elevation={0}>
                <CardContent>
                    <Typography variant="h5" textAlign="center" gutterBottom>About Puzzles Bar</Typography>
                    <Typography variant="body1" textAlign="center">
                        At Puzzles Bar, we believe that every visit should be an experience. Whether you're here to
                        solve the world's problems over a cold beer or to enjoy a cozy evening with friends, we have
                        something for everyone. Our unique ambiance and carefully crafted menu are designed to keep
                        you coming back for more.
                    </Typography>
                </CardContent>
            </Card>

            <Card sx={{backgroundColor: '#f1f1f1', mb: 2}} elevation={0}>
                <CardContent>
                    <Typography variant="h5" component="h2" textAlign="center" gutterBottom>
                        What Our App Does
                    </Typography>
                    <Typography variant="body1" textAlign="center" sx={{mb: 2}}>
                        The Puzzles Bar app is your personal companion for an enhanced bar experience. With our app,
                        you can:
                    </Typography>
                    <Typography variant="body1" textAlign="center">
                        Browse our latest menu and special offerings.
                    </Typography>
                    <Typography variant="body1" textAlign="center">
                        Make reservations with ease.
                    </Typography>
                    <Typography variant="body1" textAlign="center">
                        Join our loyalty program and earn rewards.
                    </Typography>
                    <Typography variant="body1" textAlign="center">
                        Stay updated on upcoming events and promotions.
                    </Typography>
                </CardContent>
            </Card>

            <Card style={{backgroundColor: '#f1f1f1', marginBottom: '20px'}} elevation={0}>
                <CardContent>
                    <Typography variant="h5" textAlign="center" gutterBottom>Upcoming Events</Typography>
                    <Typography variant="body1" textAlign="center">
                        We host a variety of events every week. From live music and quiz
                        nights to exclusive tastings and themed parties, there's always
                        something happening at Puzzles Bar. Check our event calendar
                        regularly so you don't miss out!
                    </Typography>
                </CardContent>

            </Card>

            <Card style={{backgroundColor: '#f1f1f1', marginBottom: '100px'}} elevation={0}>
                <CardContent>
                    <Typography variant="h5" textAlign="center" gutterBottom>Contact Us</Typography>
                    <Typography variant="body1" textAlign="center">
                        Have questions or want to make a reservation?
                    </Typography>
                    <Typography variant="body1" textAlign="center" gutterBottom>
                        Feel free to reach out to us:
                    </Typography>

                    <Box textAlign="center">
                        <Typography variant="h7" component="p">
                            <strong>Puzzles Bar</strong>
                        </Typography>
                        <Typography variant="body1" component="p">
                            Frausi Str. 55b<br/>
                            München, 80336
                        </Typography>
                        <Typography variant="body1" component="p">
                            <abbr title="Phone">Phone: (162) 0000-0000000</abbr>
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    </div>);
}


export default Home;
