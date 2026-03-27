const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    email: String,
    city: String,
    serviceNeeded: String,
    areaSqFt: String,
    message: String,
    budgetRange: String,
    status: {
        type: String,
        enum: ['New', 'Contacted', 'Quoted', 'Won', 'Lost'],
        default: 'New',
    },
    score: {
        type: Number,
        default: 0,
    },
    source: String,
    notes: String,
    attachments: {
        type: Array,
        default: [],
    },
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);
