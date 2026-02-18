const express = require('express');
const router = express.Router();
const Member = require('../models/Member');

// @desc    Login user & get token
// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
    const { fullName, pin } = req.body;

    try {
        // 1. Find the member by Name
        const member = await Member.findOne({ fullName });

        // 2. If no member found
        if (!member) {
            return res.status(400).json({ message: 'Izina ntiribonetse (Name not found)' });
        }

        // 3. Check if PIN matches
        if (member.pin !== pin) {
            return res.status(400).json({ message: 'PIN sibyo (Invalid PIN)' });
        }

        // 4. Success! Return the user data
        res.json({
            _id: member._id,
            fullName: member.fullName,
            hasVoted: member.hasVoted,
            role: member.role
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get all members (for the dropdown)
// @route   GET /api/auth/members
router.get('/members', async (req, res) => {
    try {
        // Fetch all members but ONLY return their ID and Name (Hide the PIN!)
        const members = await Member.find({}, 'fullName'); 
        res.json(members);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;