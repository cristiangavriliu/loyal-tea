import express from "express";
import { Game } from "../models/gameModel.js";
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const router = express.Router();

// Set up storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads',
        allowed_formats: ['jpg', 'jpeg', 'png']
    }
});

const upload = multer({ storage: storage });

// Routes
router.post("/create", upload.single('image'), createGame);
router.get("/getAll", getAllGames);
router.get("/get/:id", getGameByID);
router.put("/update/:id", updateGame);
router.delete("/delete/:id", deleteGame);

// Methods

async function createGame(req, res) {
    try {
        const { name, description, participantsRequired } = req.body;
        const imageUrl = req.file ? req.file.path : '';
        const newGame = new Game({
            name,
            description,
            participantsRequired,
            imagePath: imageUrl // Use the Cloudinary URL or empty if not uploaded
        });

        const result = await newGame.save();
        return res.status(201).send(result);
    } catch (error) {
        console.error('Error creating game: ', error);
        return res.status(500).send({ message: 'Error creating game', error });
    }
}

// Get all games
async function getAllGames(req, res) {
    let games = await Game.find();
    return res.status(200).send(games);
}

// Get a game by ID
async function getGameByID(req, res) {
    let game = await Game.findById(req.params.id);
    return res.status(200).send(game);
}

// Update a game
async function updateGame(req, res) {
    let game = await Game.findByIdAndUpdate(req.params.id, req.body);
    return res.status(200).send(game);
}

// Delete a game
async function deleteGame(req, res) {
    let game = await Game.findByIdAndDelete(req.params.id);
    return res.status(200).send(game);
}

export default router;