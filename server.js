const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const compression = require('compression');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const connectDB = require('./config/db');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(compression());
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "img-src": ["'self'", "data:", "https://images.unsplash.com", "https://plus.unsplash.com", "https://media.istockphoto.com", "https://th.bing.com", "https://images.adsttc.com"],
            "media-src": ["'self'", "https://player.vimeo.com", "https://*.vimeo.com"],
            "connect-src": ["'self'", "http://localhost:5000", "https://api.sendgrid.com"]
        }
    }
}));
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/leads', require('./routes/leadRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/track', require('./routes/trackRoutes'));

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Mannat Micro Concrete API (MongoDB)' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
