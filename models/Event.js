const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['WHATSAPP_CLICK', 'CALL_CLICK', 'EMAIL_CLICK', 'FORM_SUBMIT', 'PAGE_VIEW'],
    },
    page: String,
    metadata: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
    },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
