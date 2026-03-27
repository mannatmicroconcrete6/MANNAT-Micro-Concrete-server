const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const sendWelcomeMessage = async (to, name) => {
    try {
        const token = process.env.WHATSAPP_API_TOKEN;
        const phoneId = process.env.WHATSAPP_PHONE_ID;

        if (!token || !phoneId || token === 'your_whatsapp_token') {
            console.log('⚠️ WhatsApp API credentials not configured. Skipping welcome message.');
            return;
        }

        const url = `https://graph.facebook.com/v17.0/${phoneId}/messages`;

        // WhatsApp Business API payload
        const data = {
            messaging_product: "whatsapp",
            to: to,
            type: "text",
            text: {
                body: `Hello ${name}! 👋\n\nWelcome to Mannat Micro Concrete. Thank you for your interest in our premium surfacing solutions.\n\nOur team has received your enquiry and will connect with you shortly.\n\nMeanwhile, feel free to visit our website for more inspiration!`
            }
        };

        const response = await axios.post(url, data, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log(`✅ WhatsApp Welcome Message sent to ${to}`);
        return response.data;
    } catch (error) {
        console.error('❌ Failed to send WhatsApp Welcome Message:', error.response ? error.response.data : error.message);
        // Don't throw, just log
    }
};

const sendCustomMessage = async (to, message) => {
    try {
        const token = process.env.WHATSAPP_API_TOKEN;
        const phoneId = process.env.WHATSAPP_PHONE_ID;

        if (!token || !phoneId || token === 'your_whatsapp_token') {
            const errorMsg = 'WhatsApp API credentials not configured properly in .env';
            console.error('❌ ' + errorMsg);
            throw new Error(errorMsg);
        }

        const url = `https://graph.facebook.com/v17.0/${phoneId}/messages`;

        const data = {
            messaging_product: "whatsapp",
            to: to,
            type: "text",
            text: {
                body: message
            }
        };

        const response = await axios.post(url, data, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log(`✅ WhatsApp Custom Message sent to ${to}`);
        return response.data;
    } catch (error) {
        console.error('❌ Failed to send WhatsApp Custom Message:', error.response ? error.response.data : error.message);
        throw error;
    }
};

module.exports = { sendWelcomeMessage, sendCustomMessage };
