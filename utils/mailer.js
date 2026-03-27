const sgMail = require('@sendgrid/mail');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const sendLeadConfirmation = async (leadData) => {
    if (!process.env.SENDGRID_API_KEY) {
        console.warn('⚠️ SendGrid API Key missing. Skipping email.');
        return;
    }

    const { name, email, mobile, serviceNeeded, message } = leadData;

    try {
        // 1. Email to the Client (Acknowledgment)
        if (email) {
            const clientMsg = {
                to: email,
                from: process.env.EMAIL_FROM,
                subject: 'Thank you for contacting Mannat Micro Concrete',
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;">
                        <h2 style="color: #d4af37; text-transform: uppercase;">Hello ${name},</h2>
                        <p>Thank you for your interest in <strong>Mannat Micro Concrete</strong>. We have received your request for <strong>${serviceNeeded}</strong>.</p>
                        <p>Our surface consultants will review your site requirements and get back to you within 24-48 hours.</p>
                        <hr />
                        <p style="font-size: 12px; color: #666;">This is an automated confirmation. Please do not reply directly to this email.</p>
                    </div>
                `,
            };
            await sgMail.send(clientMsg);
            console.log(`✉️ Confirmation email sent to ${email}`);
        }

        // 2. Alert Email to Admin
        const adminMsg = {
            to: process.env.EMAIL_FROM, // Send alert to admin
            from: process.env.EMAIL_FROM,
            subject: `🚀 NEW LEAD: ${name} [Score: ${leadData.score || 0}]`,
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f0f0; padding: 40px; color: #1a1a1a;">
                    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                        <div style="background: #1a1a1a; padding: 30px; text-align: center;">
                            <h1 style="color: #d4af37; margin: 0; font-size: 22px; text-transform: uppercase; letter-spacing: 2px;">New CRM Inquiry</h1>
                        </div>
                        <div style="padding: 30px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 1px solid #eee;">
                                <span style="font-size: 12px; color: #888; text-transform: uppercase; font-weight: bold;">Lead Score</span>
                                <span style="background: #d4af37; color: #000; padding: 4px 12px; border-radius: 20px; font-weight: 900; font-size: 13px;">${leadData.score || 0} PTS</span>
                            </div>
                            
                            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                                <tr style="border-bottom: 1px solid #f9f9f9;">
                                    <td style="padding: 12px 0; color: #888; font-size: 14px; width: 35%;">Customer Name</td>
                                    <td style="padding: 12px 0; font-weight: bold; font-size: 15px;">${name}</td>
                                </tr>
                                <tr style="border-bottom: 1px solid #f9f9f9;">
                                    <td style="padding: 12px 0; color: #888; font-size: 14px;">Contact Number</td>
                                    <td style="padding: 12px 0; font-weight: bold; font-size: 15px;">
                                        <a href="tel:${mobile}" style="color: #1a1a1a; text-decoration: none;">${mobile}</a>
                                    </td>
                                </tr>
                                <tr style="border-bottom: 1px solid #f9f9f9;">
                                    <td style="padding: 12px 0; color: #888; font-size: 14px;">Service Needed</td>
                                    <td style="padding: 12px 0; font-weight: bold; font-size: 15px; color: #d4af37;">${serviceNeeded}</td>
                                </tr>
                                <tr style="border-bottom: 1px solid #f9f9f9;">
                                    <td style="padding: 12px 0; color: #888; font-size: 14px;">Project City</td>
                                    <td style="padding: 12px 0; font-weight: bold; font-size: 15px;">${leadData.city || 'N/A'}</td>
                                </tr>
                                <tr style="border-bottom: 1px solid #f9f9f9;">
                                    <td style="padding: 12px 0; color: #888; font-size: 14px;">Estimated Area</td>
                                    <td style="padding: 12px 0; font-weight: bold; font-size: 15px;">${leadData.areaSqFt ? leadData.areaSqFt + ' sq.ft' : 'N/A'}</td>
                                </tr>
                            </table>

                            <div style="margin-top: 25px; background: #fdfaf0; padding: 20px; border-radius: 12px; border: 1px solid #d4af3733;">
                                <h4 style="margin: 0 0 10px 0; font-size: 12px; color: #d4af37; text-transform: uppercase;">Customer Message:</h4>
                                <p style="margin: 0; font-size: 14px; line-height: 1.6; font-style: italic;">"${message || 'No specific message provided'}"</p>
                            </div>

                            <div style="margin-top: 35px; text-align: center;">
                                <a href="https://wa.me/91${mobile.replace(/\D/g, '')}" 
                                   style="display: inline-block; background: #25D366; color: #ffffff; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; text-transform: uppercase; font-size: 13px; letter-spacing: 1px; box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);">
                                   Reply on WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>
                    <p style="text-align: center; font-size: 11px; color: #999; margin-top: 30px;">
                        Mannat Micro Concrete - Admin Automation System
                    </p>
                </div>
            `,
        };
        await sgMail.send(adminMsg);
        console.log('✉️ Admin alert email sent.');

    } catch (error) {
        console.error('❌ SendGrid Error:', error.response ? error.response.body : error.message);
    }
};

const sendOTPEmail = async (email, otp) => {
    if (!process.env.SENDGRID_API_KEY) {
        console.warn('⚠️ SendGrid API Key missing. Skipping OTP email.');
        return;
    }

    const msg = {
        to: email,
        from: process.env.EMAIL_FROM,
        subject: '🔒 Password Reset OTP - Mannat Admin',
        html: `
            <div style="font-family: 'Segoe UI', sans-serif; max-width: 500px; margin: auto; padding: 40px; background: #000; border: 1px solid #d4af37; border-radius: 20px; color: #fff; text-align: center;">
                <h2 style="color: #d4af37; text-transform: uppercase; letter-spacing: 2px;">Verification Code</h2>
                <p style="color: #888; font-size: 14px; margin-bottom: 30px;">Use the following OTP to reset your administrative password. This code is valid for 10 minutes.</p>
                <div style="background: rgba(212,175,55,0.1); border: 1px dashed #d4af37; padding: 20px; border-radius: 12px; margin: 20px 0;">
                    <span style="font-size: 32px; font-weight: 900; letter-spacing: 15px; color: #d4af37; margin-left: 15px;">${otp}</span>
                </div>
                <p style="color: #444; font-size: 10px; margin-top: 30px; text-transform: uppercase;">If you did not request this, please ignore this email.</p>
            </div>
        `,
    };

    try {
        await sgMail.send(msg);
        console.log(`✉️ OTP email sent to ${email}`);
    } catch (error) {
        console.error('❌ OTP Email Error:', error);
    }
};

module.exports = { sendLeadConfirmation, sendOTPEmail };
