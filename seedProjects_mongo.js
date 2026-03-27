const mongoose = require('mongoose');
const Project = require('./models/Project');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const sampleProjects = [
    {
        title: "Minimalist Infinity Villa",
        description: "Full-floor microcement application in a modern New Delhi villa. Features a seamless, jointless bone-white finish for an expansive feeling of space.",
        category: "Microcement Flooring",
        location: "Chanakyapuri, New Delhi",
        area: "4,500 sq ft",
        year: "2023",
        client: "P. Sharma Residences",
        images: [
            { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", public_id: "demo_1" },
            { url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80", public_id: "demo_1_alt" }
        ],
        tags: ["Minimalist", "High-End", "Seamless"],
        featured: true
    },
    {
        title: "Luxury Spa Retreat Walls",
        description: "Atmospheric textured microcement walls for a premium wellness center. Applied with deep grey tones to create a calming, natural stone aesthetic.",
        category: "Microcement Walls",
        location: "Gurgaon, Sector 42",
        area: "1,200 sq ft",
        year: "2023",
        client: "Serenity Spa",
        images: [
            { url: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=1200&q=80", public_id: "demo_2" }
        ],
        tags: ["Textured", "Waterproof", "Stone Finish"],
        featured: true
    },
    {
        title: "Monolithic Kitchen Island",
        description: "Custom-built kitchen countertop and integrated sink finished with high-performance microcement. Heat and stain resistant with a satin seal.",
        category: "Countertops & Stairs",
        location: "Mumbai, Bandra West",
        area: "150 sq ft",
        year: "2024",
        client: "K. Johar Apartment",
        images: [
            { url: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80", public_id: "demo_3" }
        ],
        tags: ["Custom", "Modern", "Kitchen"],
        featured: false
    },
    {
        title: "Master Suite Wetroom",
        description: "Continuous microcement application from floor to ceiling, including a built-in shower bench. Eliminates grout lines for hygiene and a sleek visual.",
        category: "Wetrooms / Bathrooms",
        location: "Bangalore, Indiranagar",
        area: "350 sq ft",
        year: "2023",
        client: "Dr. Reddy",
        images: [
            { url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80", public_id: "demo_4" }
        ],
        tags: ["Waterproof", "Hygienic", "Seamless"],
        featured: true
    },
    {
        title: "Industrial Chic Stairs",
        description: "Steel-blue microcement application over existing concrete stairs. Creates a floating effect with precise edge detailing and anti-slip finish.",
        category: "Countertops & Stairs",
        location: "New Delhi, GK 2",
        area: "24 steps",
        year: "2024",
        client: "Design Studio X",
        images: [
            { url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80", public_id: "demo_5" }
        ],
        tags: ["Industrial", "Renovation", "Steps"],
        featured: false
    },
    {
        title: "Modern Terrazzo Terrace",
        description: "Large format white-base terrazzo with mother-of-pearl aggregate. Polished to a high shine for a luxurious outdoor entertaining area.",
        category: "Terrazzo",
        location: "Hyderabad, Jubilee Hills",
        area: "2,000 sq ft",
        year: "2022",
        client: "The Grand Villa",
        images: [
            { url: "https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&w=1200&q=80", public_id: "demo_6" }
        ],
        tags: ["Terrazzo", "Luxury", "Outdoor"],
        featured: true
    },
    {
        title: "Onyx Venetian Plaster Lobby",
        description: "Traditional Venetian Lime Plaster applied in 7 layers for a glass-like finish. Features complex marbling and deep reflective properties.",
        category: "Venetian Lime Plaster",
        location: "Dubai, Marina",
        area: "600 sq ft (Wall)",
        year: "2023",
        client: "Royal Plaza Tower",
        images: [
            { url: "https://images.unsplash.com/photo-1600566752355-3979ff139cb4?auto=format&fit=crop&w=1200&q=80", public_id: "demo_7" }
        ],
        tags: ["High Gloss", "Classic", "Reflective"],
        featured: true
    },
    {
        title: "Sleek Epoxy Garage",
        description: "Professional-grade metallic epoxy coating with a high-build polyaspartic topcoat. Extremely durable and chemical resistant for a luxury car collection.",
        category: "Epoxy",
        location: "Gurgaon, Golf Course Road",
        area: "1,500 sq ft",
        year: "2024",
        client: "Automotive Enthusiast",
        images: [
            { url: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80", public_id: "demo_8" }
        ],
        tags: ["Durable", "Metallic", "Garage"],
        featured: false
    }
];

const seedProjects = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding projects...');

        // Clear existing projects
        await Project.deleteMany({});
        console.log('Cleared existing projects.');

        // Insert sample projects
        await Project.insertMany(sampleProjects);
        console.log('Inserted 8 luxury projects successfully.');

        mongoose.connection.close();
        process.exit(0);
    } catch (err) {
        console.error('Seeding Error:', err.message);
        process.exit(1);
    }
};

seedProjects();
