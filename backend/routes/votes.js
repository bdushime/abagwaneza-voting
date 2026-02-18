const express = require('express');
const router = express.Router();
const Vote = require('../models/Vote');
const Member = require('../models/Member');
const Position = require('../models/Position');
const Candidate = require('../models/Candidate');

// @desc    Cast a vote
// @route   POST /api/votes
router.post('/', async (req, res) => {
    const { voterId, position, candidateId } = req.body;

    try {
        // 1. Check if they already voted for THIS position
        const existingVote = await Vote.findOne({ voter: voterId, position: position });

        if (existingVote) {
            return res.status(400).json({ message: `wamaze gutora kuri uyu mwanya (${position})` });
        }

        // 2. Create the new vote
        const vote = new Vote({
            voter: voterId,
            position: position,
            candidateId: candidateId
        });

        await vote.save();

        // 3. (Optional) If they have voted for ALL positions, mark hasVoted = true
        // For now, we just acknowledge the vote.
        
        res.status(201).json({ message: 'Murakoze gutora! (Vote Cast Successfully)' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get Live Results (With Names!)
// @route   GET /api/votes/results
router.get('/results', async (req, res) => {
    try {
        // 1. Get all positions
        const positions = await Position.find().sort({ rank: 1 });
        
        // 2. Get all candidates
        const candidates = await Candidate.find();

        // 3. Get all votes
        const votes = await Vote.find();

        // 4. Build the result tree
        const results = positions.map(pos => {
            // Find candidates for this position
            const posCandidates = candidates.filter(c => c.positionId.toString() === pos._id.toString());
            
            // Count votes for each candidate
            const candidatesWithVotes = posCandidates.map(c => {
                const voteCount = votes.filter(v => v.candidateId.toString() === c._id.toString()).length;
                return {
                    name: c.fullName,
                    photo: c.photoUrl,
                    count: voteCount
                };
            });

            // Sort by highest votes!
            candidatesWithVotes.sort((a, b) => b.count - a.count);

            return {
                title: pos.title,
                candidates: candidatesWithVotes
            };
        });

        res.json(results);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get Dashboard Data (Positions + Status)
// @route   GET /api/votes/dashboard/:voterId
router.get('/dashboard/:voterId', async (req, res) => {
    try {
        const { voterId } = req.params;

        // 1. Get all positions sorted by rank (President first)
        const positions = await Position.find().sort({ rank: 1 });

        // 2. Get all votes cast by this user
        const myVotes = await Vote.find({ voter: voterId });

        // 3. Combine them: Mark which positions are already voted for
        const dashboardData = positions.map(pos => {
            const hasVoted = myVotes.some(vote => vote.position === pos.title);
            return {
                ...pos._doc,
                hasVoted: hasVoted
            };
        });

        res.json(dashboardData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get Candidates for a specific position
// @route   GET /api/votes/candidates/:positionId
router.get('/candidates/:positionId', async (req, res) => {
    try {
        const candidates = await Candidate.find({ positionId: req.params.positionId });
        res.json(candidates);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;