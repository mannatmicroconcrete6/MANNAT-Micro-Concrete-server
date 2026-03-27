const express = require('express');
const router = express.Router();
const trackController = require('../controllers/trackController');

const auth = require('../middleware/auth');

router.post('/visit', trackController.trackVisit);
router.post('/event', trackController.trackEvent);
router.get('/analytics', auth, trackController.getAnalytics);

module.exports = router;
