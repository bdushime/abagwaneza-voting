const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    positionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Position', required: true },
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
    photoUrl: { type: String }
});

module.exports = mongoose.model('Candidate', CandidateSchema);