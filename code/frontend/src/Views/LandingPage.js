// LandingPage.js
import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import './css/bootstrap.css';

function LandingPage() {
    const navigate = useNavigate();

    return (<div>

        {/* Centered logo and buttons */}
        <div style={{
            height: '100vh', transform: 'translateY(-15%)',
        }} className="d-flex flex-column justify-content-center align-items-center vh-100 position-fixed w-100 p-2">

            {/* Logo */}
            <div className="logo-image-container">
                <img src={"Logo1.png"} alt="Logo" className="logo-image"/>
            </div>

            {/* sign-up */}
            <button
                className="btn btn-primary m-2 login-button rounded-pill "
                onClick={() => navigate('/sign-up')}
            >
                Sign Up
            </button>

            {/* login */}
            <Link to="/login" className="custom-link">Login</Link>
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
            <Link to="/userlessmenu" style={{fontSize: '14px'}} className="custom-link">to menu</Link>
            <p style={{fontSize: '10px'}}>powered by LoyalTea</p>
        </div>
    </div>);
}

export default LandingPage;