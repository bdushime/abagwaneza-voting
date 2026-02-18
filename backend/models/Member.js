const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    phone: { type: String, required: false }, 
    pin: { type: String, required: true },
    hasVoted: { type: Boolean, default: false },
    role: { type: String, enum: ['member', 'admin'], default: 'member' }
});

module.exports = mongoose.model('Member', MemberSchema);