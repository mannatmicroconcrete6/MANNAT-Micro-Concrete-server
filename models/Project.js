const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: [
            'Microcement Flooring',
            'Microcement Walls',
            'Countertops & Stairs',
            'Wetrooms / Bathrooms',
            'Terrazzo',
            'Epoxy',
            'Venetian Lime Plaster',
        ],
    },
    location: String,
    area: String,
    year: String,
    client: String,
    timeline: String,
    images: [
        {
            url: {
                type: String,
                required: true,
            },
            public_id: {
                type: String,
                required: true,
            },
        },
    ],
    tags: [String],
    featured: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
