const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        const existingAdmin = await Admin.findOne({ username: 'admin' });
        if (existingAdmin) {
            console.log('Admin user already exists. Updating details...');
            existingAdmin.password = 'password123';
            existingAdmin.email = process.env.EMAIL_FROM || 'mannatmicroconcrete6@gmail.com';
            await existingAdmin.save();
        } else {
            const newAdmin = new Admin({
                username: 'admin',
                password: 'password123',
                email: process.env.EMAIL_FROM || 'mannatmicroconcrete6@gmail.com',
                role: 'admin'
            });
            await newAdmin.save();
            console.log('Admin user created successfully.');
        }

        mongoose.connection.close();
        process.exit(0);
    } catch (err) {
        console.error('Seeding Error:', err.message);
        process.exit(1);
    }
};

seedAdmin();
