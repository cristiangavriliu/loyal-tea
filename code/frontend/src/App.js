import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './Views/Home';
import ItemView from './Views/MenuView/ItemView';
import LoginPage from './Views/LoginPage';
import SignUpPage from './Views/SignUpPage';
import './App.css';
import LandingPage from './Views/LandingPage';
import axios from 'axios';
import OrderList from './Views/OrderView/OrderList';
import GamesList from './Views/GameView/GamesList';
import MenuView from './Views/UserMenuView/MenuView';
import ProfileView from './Views/ProfileView';
import CustomerChallengesList from './Views/UserChallengeView/UserChallengesList';
import { ChallengesProvider } from './Views/ChallengesContext';
import SuccPaymentView from './Views/UserPaymentFlow/SuccPaymentView';
import FailPaymentView from './Views/UserPaymentFlow/FailPaymentView';
import ChallengesList from './Views/ChallengeView/ChallengesList';
import PageNotFound from './Views/PageNotFound';
import UserList from './Views/UserAdminView/UserList';
import UserlessMenuView from './Views/UserMenuView/UserlessMenu';

function App() {
    axios.defaults.baseURL = "http://localhost:8080";
    axios.defaults.withCredentials = true;

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const response = await axios.get('/user/authenticated');
                setIsAuthenticated(response.data.success);
            } catch (error) {
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        const checkUserRole = async () => {
            try {
                const response = await axios.get('/user/getMe');
                setUserRole(response.data.user.role);
            } catch (error) {
                setUserRole('');
            }
        }

        checkAuthentication();
        checkUserRole();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <ChallengesProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<LandingPage />} />

                    <Route path="/home" element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <Home />
                        </ProtectedRoute>
                    } />

                    <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />

                    <Route path="/sign-up" element={<SignUpPage />} />

                    <Route path="/orderList" element={
                        <ProtectedRoute isAuthenticated={isAuthenticated} hasToBe='employee' userRole={userRole} >
                            <OrderList />
                        </ProtectedRoute>
                    } />

                    <Route path="/itemView" element={
                        <ProtectedRoute isAuthenticated={isAuthenticated} hasToBe='admin' userRole={userRole} >
                            <ItemView />
                        </ProtectedRoute>
                    } />

                    <Route path="/challengesList" element={
                        <ProtectedRoute isAuthenticated={isAuthenticated} hasToBe='employee' userRole={userRole} >
                            <ChallengesList />
                        </ProtectedRoute>
                    } />

                    <Route path="/gamesList" element={
                        <ProtectedRoute isAuthenticated={isAuthenticated} hasToBe='employee' userRole={userRole} >
                            <GamesList />
                        </ProtectedRoute>
                    } />

                    <Route path="/userList" element={
                        <ProtectedRoute isAuthenticated={isAuthenticated} hasToBe='admin' userRole={userRole} >
                            <UserList />
                        </ProtectedRoute>
                    } />

                    <Route path="/menu" element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <MenuView />
                        </ProtectedRoute>
                    } />

                    <Route path="/profile" element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <ProfileView />
                        </ProtectedRoute>
                    } />

                    <Route path="/customerChallengesList" element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <CustomerChallengesList />
                        </ProtectedRoute>
                    } />

                    <Route path="/payment/success" element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <SuccPaymentView />
                        </ProtectedRoute>
                    } />

                    <Route path="/payment/failure" element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <FailPaymentView />
                        </ProtectedRoute>
                    } />

                    <Route path="/userlessmenu" element={
                        <UserlessMenuView />
                    } />

                    <Route
                        path="*"
                        element={<PageNotFound />}
                    />
                </Routes>
            </Router>
        </ChallengesProvider>
    );
}

function ProtectedRoute({ isAuthenticated, hasToBe, userRole, children }) {

    if (!isAuthenticated) {
        return <Navigate to="/" />;
    } else if (hasToBe === 'admin') {
        if (userRole !== 'admin') {
            return <Navigate to="/home" />;
        } else {
            return children;
        }
    } else if (hasToBe === 'employee') {
        if (userRole !== 'employee' && userRole !== 'admin') {
            return <Navigate to="/home" />;
        }
        else {
            return children;
        }
    } else {
        return children
    }
}

export default App;
