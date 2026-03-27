const Visit = require('../models/Visit');
const Event = require('../models/Event');

exports.trackVisit = async (req, res) => {
    try {
        const { sessionId, ip, city, device, referrer, landingPage, utm } = req.body;

        const visit = new Visit({
            sessionId,
            ip,
            city,
            device,
            referrer,
            landingPage,
            utm
        });

        await visit.save();

        res.status(201).json({ success: true });
    } catch (error) {
        console.error('Track Visit Error:', error.message);
        res.status(500).json({ success: false, message: 'Tracking failed' });
    }
};

exports.trackEvent = async (req, res) => {
    try {
        const { sessionId, type, page, metadata } = req.body;

        const event = new Event({
            sessionId,
            type,
            page,
            metadata
        });

        await event.save();

        res.status(201).json({ success: true });
    } catch (error) {
        console.error('Track Event Error:', error.message);
        res.status(500).json({ success: false, message: 'Event tracking failed' });
    }
};
exports.getAnalytics = async (req, res) => {
    try {
        const totalVisits = await Visit.countDocuments();

        // Group events by type
        const eventCounts = await Event.aggregate([
            { $group: { _id: "$type", count: { $sum: 1 } } }
        ]);

        // Group visits by city (basic geo analytics)
        const cityStats = await Visit.aggregate([
            { $match: { city: { $exists: true, $ne: null } } },
            { $group: { _id: "$city", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        // Group events by page
        const pageViews = await Event.aggregate([
            { $match: { type: 'PAGE_VIEW' } },
            { $group: { _id: "$page", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        // Format event counts for easier consumption
        const stats = {
            totalVisits,
            events: eventCounts.reduce((acc, curr) => {
                acc[curr._id] = curr.count;
                return acc;
            }, {}),
            cityStats,
            pageViews
        };

        res.json(stats);
    } catch (error) {
        console.error('Get Analytics Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch analytics' });
    }
};
