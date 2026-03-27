const Lead = require('../models/Lead');
const { sendWelcomeMessage, sendCustomMessage } = require('../utils/whatsappSender');
const { sendLeadConfirmation } = require('../utils/mailer');
const { calculateLeadScore } = require('../utils/leadScorer');
const { generateQuotePDF } = require('../utils/quoteGenerator');

// Handle new lead submission
exports.createLead = async (req, res) => {
    console.log('--- Received Create Lead Request ---');
    console.log('Request Body:', req.body);

    const useMock = process.env.USE_MOCK_DB === 'true';

    try {
        const { name, mobile, email, city, serviceNeeded, areaSqFt, message, budgetRange, consentStatus, consentTimestamp } = req.body;
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        // Validation (Basic)
        if (!name || !mobile) {
            console.warn('Validation Failed: Missing Name or Mobile');
            return res.status(400).json({ success: false, message: 'Name and Mobile are required' });
        }

        const leadData = {
            name,
            mobile,
            email,
            city,
            serviceNeeded,
            areaSqFt,
            message,
            budgetRange,
            consentStatus,
            consentTimestamp,
            ip,
            status: 'New'
        };

        // 🏆 Automated Lead Scoring
        leadData.score = calculateLeadScore(leadData);

        let savedLead;

        if (useMock) {
            console.warn('⚠️ WORKING IN MOCK MODE: Data not saved to real MongoDB');
            savedLead = {
                ...leadData,
                _id: 'mock_' + Date.now(),
                createdAt: new Date(),
                toObject: () => leadData
            };
        } else {
            // Check if DB is connected
            if (require('mongoose').connection.readyState !== 1) {
                throw new Error('Database is offline. Ensure your IP is whitelisted in MongoDB Atlas.');
            }
            const lead = new Lead(leadData);
            await lead.save();
            savedLead = lead;
            console.log('✅ MongoDB Insert Success:', lead);
        }

        // Send Confirmation Email via SendGrid (Async)
        sendLeadConfirmation(savedLead).catch(err => console.error('BG Mailer Error:', err));

        // Send Welcome Message via WhatsApp (Async)
        if (mobile) {
            const formattedMobile = mobile.replace(/\D/g, '');
            const finalMobile = formattedMobile.length === 10 ? '91' + formattedMobile : formattedMobile;
            sendWelcomeMessage(finalMobile, name).catch(err => console.error('BG WhatsApp Error:', err));
        }

        const responseLead = useMock ? savedLead : savedLead.toObject();

        res.status(201).json({
            success: true,
            message: useMock ? 'MOCK submission success' : 'Lead created successfully',
            lead: {
                ...responseLead,
                _id: savedLead._id,
                createdAt: savedLead.createdAt
            }
        });

    } catch (error) {
        console.error('🔥🔥🔥 Create Lead CRITICAL Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error: ' + (error.message || 'Unknown Error')
        });
    }
};

// Admin: Get all leads
exports.getAllLeads = async (req, res) => {
    try {
        const leads = await Lead.find({}).sort({ createdAt: -1 });

        const mappedLeads = leads.map(lead => ({
            ...lead.toObject(),
            _id: lead._id,
            createdAt: lead.createdAt
        }));

        res.json(mappedLeads);
    } catch (error) {
        console.error('Get Leads Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Admin: Update lead status
exports.updateLeadStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;

        const updatedLead = await Lead.findByIdAndUpdate(
            id,
            { status, notes },
            { new: true }
        );

        if (!updatedLead) {
            return res.status(404).json({ success: false, message: 'Lead not found' });
        }

        res.json({ ...updatedLead.toObject(), _id: updatedLead._id, createdAt: updatedLead.createdAt });
    } catch (error) {
        console.error('Update Lead Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Admin: Send message to lead
exports.sendMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { message } = req.body;

        const lead = await Lead.findById(id);

        if (!lead) {
            return res.status(404).json({ success: false, message: 'Lead not found' });
        }

        if (!lead.mobile) {
            return res.status(400).json({ success: false, message: 'Lead has no mobile number' });
        }

        const formattedMobile = lead.mobile.replace(/\D/g, '');
        const finalMobile = formattedMobile.length === 10 ? '91' + formattedMobile : formattedMobile;

        await sendCustomMessage(finalMobile, message);

        res.json({ success: true, message: 'Message sent successfully' });

    } catch (error) {
        console.error('Send Message Error:', error);
        res.status(500).json({ success: false, message: 'Failed to send message: ' + error.message });
    }
};

// Admin: Download Quote PDF
exports.downloadQuote = async (req, res) => {
    try {
        const { id } = req.params;
        const lead = await Lead.findById(id);

        if (!lead) {
            return res.status(404).json({ success: false, message: 'Lead not found' });
        }

        const filename = `Mannat_Quote_${lead.name.replace(/\s+/g, '_')}.pdf`;

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

        generateQuotePDF(lead, res);

    } catch (error) {
        console.error('Download Quote Error:', error);
        res.status(500).json({ success: false, message: 'Failed to generate PDF' });
    }
};
