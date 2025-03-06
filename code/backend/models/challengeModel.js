import mongoose from 'mongoose';

const participantSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    score: Number,
    payout: Number,
    hasCompleted: {type: Boolean, default: false}
});


const challengeSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    maxPayout: {
        type: Number,
        required: true
    },
    maxScore: {
        type: Number,
        required: true
    },
    participants: [participantSchema],
    isActive: {
        type: Boolean,
        required: true,
        default: true
    },
    game: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
        required: true
    },
    participantsCount: {
        type: Number,
        required: true,
        default: 0
    }

});

export const Challenge = mongoose.model('Challenge', challengeSchema);