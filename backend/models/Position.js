const mongoose = require('mongoose');

const PositionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    rank: { type: Number, required: true } // 1 for President, 2 for VP...
});

module.exports = mongoose.model('Position', PositionSchema);