import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import logger from './utils/logger';
import { connectDB } from './db/connection';
import invoiceRoutes from './routes/invoice.routes';
import yachtRoutes from './routes/yacht.routes';
import reservationRoutes from './routes/reservation.routes';
import contactRoutes from './routes/contact.routes';
import catalogueRoutes from './routes/catalogue.routes';
import cabinCharterRoutes from './routes/cabin-charter.routes';
import yachtEquipmentRoutes from './routes/yacht-equipment.routes';
import yachtServicesRoutes from './routes/yacht-services.routes';
import yachtPricingRoutes from './routes/yacht-pricing.routes';
import yachtRatingsRoutes from './routes/yacht-ratings.routes';
import freeCabinCharterRoutes from './routes/free-cabin-charter.routes';

const app = express();
const PORT = process.env.PORT || 3000;

// Swagger/OpenAPI setup
const swaggerSpec = swaggerJsdoc({
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Yacht Charter API v4.0',
            version: '4.0.0',
            description: 'Comprehensive API for yacht charter management with advanced filtering, journey-based search, free yacht availability, detailed equipment & services, pricing, ratings, and cabin charter support',
            contact: {
                name: 'API Support'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server'
            }
        ]
    },
    apis: [
        'dist/routes/*.js'  // Use compiled JavaScript files
    ]
});

// Middleware
app.use(cors());
app.use(express.json());

// HTTP request logging (morgan -> winston)
app.use(morgan('combined', {
    stream: {
        write: (message: string) => logger.info(message.trim())
    }
}));

// Rate limiting (basic sensible defaults)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300, // max requests per IP per window
    standardHeaders: true,
    legacyHeaders: false
});
app.use('/api', limiter);

// Swagger JSON endpoint (must come before Swagger UI middleware)
app.get('/api-docs/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Connect to MongoDB
connectDB().then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB:', err);
});

// Routes
app.use('/api/invoices', invoiceRoutes);
app.use('/api/yachts', yachtRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/catalogue', catalogueRoutes);
app.use('/api/cabin-charters', cabinCharterRoutes);
app.use('/api/yacht-equipment', yachtEquipmentRoutes);
app.use('/api/yacht-services', yachtServicesRoutes);
app.use('/api/yacht-pricing', yachtPricingRoutes);
app.use('/api/yacht-ratings', yachtRatingsRoutes);
app.use('/api/free-cabin-charter', freeCabinCharterRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error(err.stack || err.message || err);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: err.message
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
