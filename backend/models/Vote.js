const mongoose = require('mongoose');

const VoteSchema = new mongoose.Schema({
    voter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
        required: true
    },
    position: {
        type: String, // e.g., "President", "Vice President"
        required: true
    },
    candidateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate', // We will build this next
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// THE MAGIC RULE:
// This ensures a unique combination of "voter" + "position".
// If 'NYIRABUDIGIRI' tries to vote for 'President' twice, MongoDB will reject it.
VoteSchema.index({ voter: 1, position: 1 }, { unique: true });

module.exports = mongoose.model('Vote', VoteSchema);