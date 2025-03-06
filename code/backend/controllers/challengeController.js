import express from "express";
import {Challenge} from "../models/challengeModel.js";
import {User} from "../models/userModel.js";

const router = express.Router();

// Routes

router.post("/create", createChallenge);
router.get("/getAll", getAllChallenges);
router.get("/get/:id", getByID);
router.put("/update/:id", updateChallenge);
router.put("/updateParticipant/:id", updateParticipant);
router.delete("/delete/:id", deleteChallenge);
router.get("/getNext", getNextChallenge);
router.delete("/deleteParticipant/:challengeId/:participantId", deleteParticipant);
router.put("/complete/:id", completeChallenge);
router.put("/confirmParticipant/:challengeId/:participantId", confirmParticipant);
router.get("/getUpcoming", getUpcomingChallenges);
router.get("/getPast", getPastChallenges);
router.put("/addParticipant/:id", addParticipant);

// Methods

// Create a new challenge
async function createChallenge(req, res) {
    let newChallenge = new Challenge(req.body);
    let result = await newChallenge.save();
    return res.status(201).send(result);
}

// Get all challenges
async function getAllChallenges(req, res) {
    let challenges = await Challenge.find();
    return res.status(200).send(challenges);
}

// Get a challenge by ID
async function getByID(req, res) {
    let challenge = await Challenge.findById(req.params.id).populate('participants.user');
    return res.status(200).send(challenge);
}

// Update a challenge
async function updateChallenge(req, res) {
    let challenge = await Challenge.findByIdAndUpdate(req.params.id, req.body);
    return res.status(200).send(challenge);
}

// Delete a challenge
async function deleteChallenge(req, res) {
    let challenge = await Challenge.findByIdAndDelete(req.params.id);
    return res.status(200).send(challenge);
}

// Update participant
async function updateParticipant(req, res) {
    try {
        let challenge = await Challenge.findById(req.params.id);
        let participant = challenge.participants.id(req.body.participantId);
        participant.score = req.body.score;
        participant.payout = req.body.payout;
        let result = await challenge.save();
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send(error);
    }
}

// Get the next upcoming challenge
async function getNextChallenge(req, res) {
    let challenge = await Challenge.find({isActive: true}).sort({
        date: 1,
        time: 1
    }).limit(1).populate('game').populate('participants.user');
    return res.status(200).send(challenge[0]);
}

// Delete Participant
async function deleteParticipant(req, res) {
    try {
        let challenge = await Challenge.findById(req.params.challengeId);
        let participantId = req.params.participantId;
        let participantIndex = challenge.participants.findIndex(participant => participant._id.toString() === participantId);
        if (participantIndex === -1) {
            return res.status(404).send({message: 'Participant not found'});
        }
        challenge.participants.splice(participantIndex, 1);
        challenge.participantsCount -= 1;

        let result = await challenge.save();
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send(error);
    }
}

// Set a challenge as complete
async function completeChallenge(req, res) {
    try {
        let challenge = await Challenge.findById(req.params.id);
        challenge.isActive = false;
        let result = await challenge.save();
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send(error);
    }
}

// Get all upcoming challenges
async function getUpcomingChallenges(req, res) {
    let challenges = await Challenge.find({isActive: true}).populate('game').populate('participants.user');
    return res.status(200).send(challenges);
}

// Get all past challenges
async function getPastChallenges(req, res) {
    let challenges = await Challenge.find({isActive: false}).populate('game').populate('participants.user');
    return res.status(200).send(challenges);
}

// Confirm participants challenge completion
async function confirmParticipant(req, res) {
    const {challengeId, participantId} = req.params;

    try {
        // Find the challenge
        const challenge = await Challenge.findById(challengeId);
        if (!challenge) {
            return res.status(404).json({message: 'Challenge not found'});
        }

        // Find the participant in the challenge
        const participant = challenge.participants.id(participantId);
        if (!participant) {
            return res.status(404).json({message: 'Participant not found'});
        }

        // Update the hasCompleted field of the participant
        participant.hasCompleted = true;

        // Save the challenge
        await challenge.save();
        // Find the user associated with the participant
        const user = await User.findById(participant.user);
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }

        // Increment the puzzles field of the user by the payout of the participant
        user.puzzles += Number(participant.payout);

        // Save the user
        await user.save();

        res.json({message: 'Participant completion confirmed and puzzle point added'});
    } catch (error) {
        res.status(500).json({message: 'Server error', error});
    }
}

async function addParticipant(req, res) {
    try {
        let challenge = await Challenge.findById(req.params.id);
        if (!challenge) {
            return res.status(404).send({message: 'Challenge not found'});
        }

        // Check if the user is already a participant
        const existingParticipant = challenge.participants.find(participant => participant.user.equals(req.body.user.user._id));

        if (existingParticipant) {
            return res.status(400).send({message: 'User is already a participant'});
        }

        // Create the participant object
        const participant = {
            user: req.body.user.user._id,
            score: 0,
            payout: '0',
            hasCompleted: false
        };

        challenge.participants.push(participant);
        challenge.participantsCount += 1;
        let result = await challenge.save();
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send(error);
    }
}

export default router;