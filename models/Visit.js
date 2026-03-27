const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true,
    },
    ip: String,
    city: String,
    device: String,
    referrer: String,
    landingPage: String,
    utm: {
        type: Map,
        of: String,
    },
}, { timestamps: true });

module.exports = mongoose.model('Visit', visitSchema);
