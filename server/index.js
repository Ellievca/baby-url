require('dotenv/config');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const urlRoutes = require('./routes/urls');
const redirectRoutes = require('./routes/redirect');

const app = express();

// middleware
app.use(cors({
    origin: process.env.CLIENT_URL, credentials:true
}));
app.use(express.json());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/urls', urlRoutes);
app.use('/', redirectRoutes);

// connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB:', err));

// test route
app.get('/api/ping', (req, res) => {
    res.json({
        message: 'pong'
    });
});

const PORT = (process.env.PORT || 5000); // sets port to env variable or default to 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));