// SignUpPage.js
import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import './css/bootstrap.css';
import {AiOutlineClose} from 'react-icons/ai';
import axios from 'axios';

function SignUpPage() {
    const navigate = useNavigate();
    const [newUser, setNewUser] = useState({
        firstname: '', lastname: '', username: '', email: '', password: '',
    });
    const [fieldValidity, setFieldValidity] = useState({
        firstname: true, lastname: true, username: true, email: true, password: true, confirmPassword: true,
    });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Handle input change
    const handleChange = (e) => {
        const {name, value} = e.target;
        //populate the newUser object
        if (name === 'confirmPassword') {
            setConfirmPassword(value);
            document.getElementsByName('confirmPassword')[0].setCustomValidity('');
            //console.log(' handleChange triggered')
        } else {
            setNewUser((prevUser) => ({
                ...prevUser, [name]: value
            }));
        }

        // Reset field validity if user starts typing again
        if (name === 'email' || name === 'username') {
            document.getElementsByName(name)[0].setCustomValidity('');
            setFieldValidity(prevState => ({...prevState, [name]: true}));
        }

    };

    // Validate input from form
    const validateForm = () => {
        let isValid = true;
        // Used to change the validity of each field (used for red color)
        let newFieldValidity = {
            firstname: true, lastname: true, username: true, email: true, password: true, confirmPassword: true,
        };

        // Check if any field in newUser is empty
        for (let field in newUser) {
            if (!newUser[field]) {
                newFieldValidity[field] = false;
                isValid = false;
            }
        }

        // Check if confirmPassword field is empty
        if (!confirmPassword) {
            newFieldValidity.confirmPassword = false;
            isValid = false;
        }

        // Check if password and confirm password fields match
        if (newUser.password !== confirmPassword) {
            document.getElementsByName('confirmPassword')[0].setCustomValidity('Passwords do not match');
            newFieldValidity.password = false;
            newFieldValidity.confirmPassword = false;
            isValid = false;
        } else {
            document.getElementsByName('confirmPassword')[0].setCustomValidity('');
        }


        // Update fieldValidity state
        setFieldValidity(prevState => ({...prevState, ...newFieldValidity}));

        return isValid;
    };

    // Handle sign up is triggered once the form is submitted
    const handleSignUp = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            // Manually trigger the HTML5 validation UI.
            event.target.reportValidity()
            return;
        }


        try {
            const response = await axios.post('/user/create', newUser);

            if (response.data.success) {
                navigate('/login'); // Navigate to home page
            } else {
                // Signup failed, show error message
                alert(response.data.message);
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                if (error.response.data.message === 'Username already taken.') {
                    // Set username field validity to false
                    setFieldValidity(prevState => ({...prevState, username: false}));
                    // Set custom validation message
                    document.getElementsByName('username')[0].setCustomValidity('Username is already in use.');
                    // Manually trigger the HTML5 validation UI.
                    document.getElementsByName('username')[0].reportValidity();
                } else if (error.response.data.message === 'Email already taken.') {
                    // Set email field validity to false
                    setFieldValidity(prevState => ({...prevState, email: false}));
                    // Set custom validation message
                    document.getElementsByName('email')[0].setCustomValidity('Email is already in use.');
                    // Manually trigger the HTML5 validation UI.
                    document.getElementsByName('email')[0].reportValidity();
                }
            } else {
                console.error('Failed to signup:', error);
                alert(`Failed to signup: ${error.message}`);
            }
        }
    };

    return (<div className="d-flex flex-column vh-100 justify-content-between">
            {/* Top container */}
            <div
                className="d-flex justify-content-between align-items-center position-fixed w-100 p-2"
                style={{zIndex: 2000}}>
                <Link to="/" style={{width: '57px', color: 'gray'}}
                      className="custom-link"><AiOutlineClose/></Link>
                <h2 className="m-0">Sign Up</h2>
                <Link to="/login" style={{width: '57px'}}
                      className="custom-link">Login</Link>
            </div>

            {/* Middle container */}
            <div style={{height: '100vh', transform: 'translateY(-5%)'}}
                 className="d-flex flex-column justify-content-center align-items-center vh-100 position-fixed w-100 p-2">
                {/*Logo*/}

                <form onSubmit={handleSignUp}
                      className="d-flex flex-column align-items-center"
                      style={{
                          backgroundColor: 'transparent', border: 'none', boxShadow: 'none', outline: 'none'
                      }}>
                    <input
                        type="text"
                        name="firstname"
                        value={newUser.firstname}
                        onChange={handleChange}
                        placeholder="First Name"
                        className={`form-control m-2 ${!fieldValidity.firstname ? 'invalid' : ''}`}
                        pattern="[A-Za-z ]+"
                        title="Please enter a valid name. Use only alphabets and spaces."
                    />

                    <input
                        type="text"
                        name="lastname"
                        value={newUser.lastname}
                        onChange={handleChange}
                        placeholder="Last Name"
                        className={`form-control m-2 ${!fieldValidity.lastname ? 'invalid' : ''}`}
                        pattern="[A-Za-z ]+"
                        title="Please enter a valid name. Use only alphabets and spaces."
                    />

                    <input
                        type="text"
                        name="username"
                        value={newUser.username}
                        onChange={handleChange}
                        placeholder="Username"
                        className={`form-control m-2 ${!fieldValidity.username ? 'invalid' : ''}`}
                        pattern="[A-Za-z0-9_.]+"
                        title="Please enter a valid username. Use only alphanumeric characters and underscores."
                    />


                    <input
                        type="email"
                        name="email"
                        value={newUser.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className={`form-control m-2 ${!fieldValidity.email ? 'invalid' : ''}`}
                    />

                    <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={newUser.password}
                        onChange={handleChange}
                        placeholder="Password"
                        className={`form-control m-2 ${!fieldValidity.password ? 'invalid' : ''}`}
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                        title="Must contain at least one number, one uppercase and one lowercase letter, and at least 8 or more characters long"
                    />

                    <input
                        type={showPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm Password"
                        className={`form-control m-2 ${!fieldValidity.confirmPassword ? 'invalid' : ''}`}
                        title="Please enter the same Password as above"
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

                    <button type="submit"
                            className="btn btn-primary m-2 login-button rounded-pill ">Sign
                        Up
                    </button>
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

export default SignUpPage;