// LoginPage.js
import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import './css/bootstrap.css';
import {AiOutlineClose} from 'react-icons/ai';
import axios from 'axios';


function LoginPage({setIsAuthenticated}) {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [fieldValidity, setFieldValidity] = useState({
        email: true, password: true,
    });
    const [errorMessage, setErrorMessage] = useState('');


    // Validate input from form
    const validateForm = () => {
        let isValid = true;
        // Used to change the validity of each field (used for red color)
        let newFieldValidity = {
            email: true, password: true,
        };

        // Check if email_user or password is empty
        if (!email) {
            newFieldValidity.email = false;
            isValid = false;
        }
        if (!password) {
            newFieldValidity.password = false;
            isValid = false;
        }

        // Update fieldValidity state
        setFieldValidity(prevState => ({...prevState, ...newFieldValidity}));

        return isValid;
    };


    const handleLogin = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            // Manually trigger the HTML5 validation UI.
            event.target.reportValidity()
            return;
        }

        try {
            const response = await axios.post('/user/login', {email, password});

            if (response.status === 200) {
                // Login successful, navigate to home page
                setIsAuthenticated(true); // Update isAuthenticated state
                navigate('/home');
            } else {
                // Login failed, show error message
                alert("an unexpected error accused while trying to login.");
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            console.error('Failed to login:', error);

            // Set field validity based on error message
            if (error.response.data.message === 'User not found.') {
                setFieldValidity(prevState => ({...prevState, email: false}));
                setErrorMessage('User not found.');

            } else if (error.response.data.message === 'Invalid credentials.') {
                setFieldValidity(prevState => ({...prevState, password: false}));
                setErrorMessage('Password is incorrect.');
            } else {
                setErrorMessage('An error occurred while trying to login.');
            }
        }
    };


    return (<div className="d-flex flex-column vh-100 justify-content-between">

        {/* Top container */}
        <div className="d-flex justify-content-between align-items-center position-fixed w-100 p-2"
             style={{zIndex: 2000}}>
            <Link to="/" style={{width: '57px', color: 'gray'}} className="custom-link"><AiOutlineClose/></Link>
            <h2 className="m-0">Login</h2>
            <Link to="/sign-up" style={{width: '57px'}} className="custom-link">Sign Up</Link>
        </div>

        {/* Middle container */}
        <div style={{height: '100vh', transform: 'translateY(-5%)'}}
             className="d-flex flex-column justify-content-center align-items-center vh-100 position-fixed w-100 p-2">
            <form onSubmit={handleLogin} className="d-flex flex-column align-items-center"
                  style={{backgroundColor: 'transparent', border: 'none', boxShadow: 'none', outline: 'none'}}>

                <input
                    type="text"
                    name="email_user"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email or Username"
                    className={`form-control m-2 ${!fieldValidity.email ? 'invalid' : ''}`}
                    pattern="[A-Za-z0-9_.@]+"
                    title="Please enter a valid email or username."
                />


                <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className={`form-control m-2 ${!fieldValidity.password ? 'invalid' : ''}`}
                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                    title="Please enter a valid Password."
                />

                <p onClick={() => setShowPassword(!showPassword)}
                   style={{
                       cursor: 'pointer',
                       width: '100%',
                       textAlign: 'right',
                       color: 'gray',
                       fontSize: '10px',
                       paddingRight: '5px',
                       marginTop: '-5px',
                       marginBottom: '10px'
                   }}>
                    {showPassword ? ' hide' : ' show'}
                </p>

                {errorMessage && (
                    <div style={{color: 'red', fontSize: '10px', alignItems: "center", textAlign: 'center'}}>
                        {errorMessage}
                        {errorMessage === 'User not found.' && <>
                            <br/>
                            <Link to="/sign-up">Go to Sign Up Page</Link>
                        </>}
                    </div>)}

                <button type="submit" className="btn btn-primary m-2 login-button rounded-pill ">Login</button>
            </form>
        </div>

        {/* Footer */}
        <div style={{
            position: 'fixed',
            bottom: 0,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '10px',
        }}>
            <p style={{fontSize: '10px'}}>powered by LoyalTea</p>
        </div>
    </div>);
}

export default LoginPage;