import jwt from 'jsonwebtoken';
import {User} from "../models/userModel.js";


// Check for authentification
function isAuthenticated(req, res, next) {

    const token = req.cookies.token;

    // Make sure that token exists
    if (!token){
        return res.status(401).send('You are not authenticated!');
    }

    // TODO replace jwt key
    jwt.verify(token, 'ABCDEFG', (err, user) => {
        if (err) return res.status(403).send('Something is wrong with your cookies"');
        req.user = user
        return next();
      })
}

// Check if user is admin
async function isAdmin(req, res, next) {
    let user = await User.findById(req.user.id);

    if (user.role === 'admin'){
        return next();
    }

    return res.status(403).send('You are not an administrator!');
}

// Check if user is employee
async function isEmployee(req, res, next) {

    let user = await User.findById(req.user.id);

    if (user.role == 'employee' || user.role == 'admin'){
        return next();
    }

    return res.status(403).send('You are not an employee!');
}

export {isAuthenticated, isAdmin, isEmployee};