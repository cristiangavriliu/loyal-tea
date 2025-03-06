import mongoose from 'mongoose';

const gameSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    participantsRequired: {
        type: Number,
        required: true
    },
    imagePath: {
        type: String
    }
});

export const Game = mongoose.model('Game', gameSchema);