const express = require('express');
const router = express.Router();
const Project = require('../models/Project'); // MongoDB Project Model
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const cloudinary = require('../utils/cloudinary');
const fs = require('fs');

// Public: Get all projects
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find({}).sort({ createdAt: -1 });

        const mappedProjects = projects.map(p => ({
            ...p.toObject(),
            _id: p._id,
            createdAt: p.createdAt
        }));

        res.json(mappedProjects);
    } catch (err) {
        console.error('Get Projects Error:', err);
        res.status(500).send('Server Error');
    }
});

// Admin: Create project
router.post('/', [auth, upload.array('images', 5)], async (req, res) => {
    try {
        console.log('--- Create Project Request (MongoDB) ---');
        const { title, description, category, client, location, year, area, tags, featured } = req.body;
        const files = req.files;

        // Validation
        if (!title || !category || !files || files.length === 0) {
            return res.status(400).json({ msg: 'Please include title, category, and at least one image' });
        }

        // Upload images to Cloudinary
        const imageUrls = [];
        for (const file of files) {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: 'mannat_projects',
                use_filename: true
            });
            imageUrls.push({
                url: result.secure_url,
                public_id: result.public_id
            });
            // Cleanup local file
            fs.unlinkSync(file.path);
        }

        const project = new Project({
            title,
            description,
            category,
            client,
            location,
            year,
            area,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            images: imageUrls,
            featured: featured === 'true' || featured === true
        });

        await project.save();

        res.json({ ...project.toObject(), _id: project._id, createdAt: project.createdAt });
    } catch (err) {
        console.error('Create Project Error:', err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
