const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Yacht Charter API is running successfully!',
        timestamp: new Date().toISOString(),
        server: 'yatch.nautio.net',
        status: 'deployed'
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({
        success: true,
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// Test API route
app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'API is working!',
        routes: [
            '/api/yachts',
            '/api/reservations', 
            '/api/invoices',
            '/api/contacts'
        ],
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`🚤 Test server is running on port ${PORT}`);
    console.log(`🌐 Access your API at: http://yatch.nautio.net:${PORT}`);
    console.log(`📱 Or directly at: http://3.69.225.186:${PORT}`);
});
