import express from "express";
import {User} from "../models/userModel.js";
import {isAuthenticated, isEmployee} from '../middlewares/authMiddleware.js';
import cloudinary from '../config/cloudinary.js';
import {CloudinaryStorage} from 'multer-storage-cloudinary';
import multer from "multer";

const router = express.Router();

// Configure multer-storage-cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary, params: {
        folder: 'uploads', allowed_formats: ['jpg', 'jpeg', 'png']
    }
});

const upload = multer({storage: storage});


// Routes
router.post('/login', login)
router.get('/logout', logout)
router.get('/getAll', isAuthenticated, getAllUsers);
router.post("/create", createUser);
router.post("/reducePuzzles", reducePuzzles);
router.get("/get/:id", findByID);
router.get("/getMe", isAuthenticated, getCurrentUser,);
router.put("/update/:id", upload.single('image'), updateUser);
router.delete("/delete/:id", deleteUser);
router.get('/authenticated', isAuthenticated, (req, res) => {
    res.send({success: true, message: 'You are authenticated.'});
});
router.put('/:userId/role', isAuthenticated, updateUserRole);


// Methods

// Get all users
async function getAllUsers(req, res) {
    let users = await User.find()
    return res.status(200).send(users);
}

// Create a new user
async function createUser(req, res) {
    let newUser = new User(req.body);

    try {
        let result = await newUser.save();
        return res.status(201).send({success: true, user: result});
    } catch (error) {
        if (error.code === 11000) {
            if ('username' in error.keyPattern) { // Duplicate key error for username
                return res.status(409).send({success: false, message: 'Username already taken.'});
            } else if ('email' in error.keyPattern) { // Duplicate key error for email
                return res.status(409).send({success: false, message: 'Email already taken.'});
            }
        } else {
            console.error('Failed to create user:', error.message);
            return res.status(500).send({success: false, message: 'Error wile creating user.'});
        }
    }
}

// Log in user
async function login(req, res) {

    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return res.status(400).send({success: false, message: 'E-mail and password are required'});
        }

        // check user e-mail
        const user = await User.findOne({$or: [{email: email}, {username: email}]});
        if (!user) {
            return res.status(404).send({success: false, message: 'User not found.'});
        }

        // verify user password
        const isMatched = await user.isCorrectPassword(password);
        if (!isMatched) {
            return res.status(401).send({success: false, message: 'Invalid credentials.'});
        }

        await generateToken(user, 200, res);
        console.error('User logged in:', user.username);

    } catch (error) {
        console.error(error);

        return res.status(500).send({success: false, message: 'An error occurred while trying to login.'});
    }
}

// Log out user
function logout(req, res) {
    res.clearCookie('token')
    console.error('User logged out.');

    res.status(200).json({
        success: true, message: "Logged out"
    })
}

// Get a user by ID
async function findByID(req, res) {
    let user = await User.findById(req.params.id);
    return res.status(200).send(user);
}

// Update a user
async function updateUser(req, res) {
    try {
        // Extract user data
        const {username, email, ...otherFields} = req.body;
        const updatedData = {username, email, ...otherFields};

        // Check if image was uploaded and include in updated data
        const imageUrl = req.file ? req.file.path : '';

        if (imageUrl) {
            updatedData.imageLink = imageUrl;
        }

        // Update user in the database
        const user = await User.findByIdAndUpdate(req.params.id, updatedData, {new: true, runValidators: true});
        if (!user) {
            return res.status(404).send({message: 'User not found'});
        }

        return res.status(200).send({success: true, user});
    } catch (error) {
        console.error(error);

        return res.status(500).send({success: false, message: 'error updating user'});
    }
}

// Delete a user
async function deleteUser(req, res) {
    let user = await User.findByIdAndDelete(req.params.id);
    return res.status(200).send(user);
}

// Returns user of the requesting user
async function getCurrentUser(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({success: false, message: 'Unauthorized access.'});
        }

        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({success: false, message: 'User not found.'});
        }

        return res.status(200).json({success: true, user});
    } catch (error) {
        return res.status(500).json({success: false, message: 'Failed to get current user.'});
    }
}

// Reduce puzzles of a user
async function reducePuzzles(req, res) {
    try {
        const user = await User.findById(req.body.userId);
        user.puzzles -= Number(req.body.puzzles);
        await user.save();

        return res.status(200).json({success: true});
    } catch (error) {
        return res.status(500).json({success: false, message: 'Failed to reduce puzzles.'});
    }
}

// Function to update a user's role
async function updateUserRole(req, res) {
    const {userId} = req.params;
    const {role} = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(userId, {role}, {new: true});
        if (!updatedUser) {
            return res.status(404).send({success: false, message: 'User not found.'});
        }
        return res.status(200).send({success: true, message: 'User role updated successfully.', user: updatedUser});
    } catch (error) {
        console.error('Failed to update user role:', error);
        return res.status(500).send({success: false, message: 'An error occurred while updating the user role.'});
    }
}


// Helper methods

// Generate session token
const generateToken = async (user, statusCode, res) => {

    const token = await user.jwtGenerateToken();

    res
        .status(statusCode)
        .cookie('token', token, {httpOnly: true})
        .json({success: true, user})
}


export default router;
