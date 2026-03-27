const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');
const auth = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes' }
});

// Public route for submitting enquiries
router.post('/', apiLimiter, leadController.createLead);

// Admin routes (Protected by auth middleware)
router.get('/', auth, leadController.getAllLeads);
router.patch('/:id', auth, leadController.updateLeadStatus);
// Admin: Download Quote PDF
router.get('/:id/quote', auth, leadController.downloadQuote);

module.exports = router;
