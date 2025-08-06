import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import Yacht from './models/Yacht.js';
import CharterCompany from './models/CharterCompany.js';
import Category from './models/Category.js';

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || '';

// Middleware
app.use(express.json());
app.use(express.static('public'));

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Successfully connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Yacht API is running' });
});

// Get all yachts with filtering
app.get('/api/yachts', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      minPrice,
      maxPrice,
      category,
      company,
      minLength,
      maxLength,
      minCabins,
      maxCabins,
      sortBy = 'name',
      sortOrder = 'asc'
    } = req.query;

    // Build filter object
    const filter: any = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { yachtModel: { $regex: search, $options: 'i' } }
      ];
    }

    if (minPrice || maxPrice) {
      filter['price.from'] = {};
      if (minPrice) filter['price.from'].$gte = Number(minPrice);
      if (maxPrice) filter['price.from'].$lte = Number(maxPrice);
    }

    if (category) {
      filter.category = category;
    }

    if (company) {
      filter['charterCompany.id'] = company;
    }

    if (minLength || maxLength) {
      filter.length = {};
      if (minLength) filter.length.$gte = Number(minLength);
      if (maxLength) filter.length.$lte = Number(maxLength);
    }

    if (minCabins || maxCabins) {
      filter.cabins = {};
      if (minCabins) filter.cabins.$gte = Number(minCabins);
      if (maxCabins) filter.cabins.$lte = Number(maxCabins);
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute query
    const yachts = await Yacht.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    // Get total count for pagination
    const total = await Yacht.countDocuments(filter);

    res.json({
      yachts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching yachts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get yacht by ID
app.get('/api/yachts/:id', async (req, res) => {
  try {
    const yacht = await Yacht.findById(req.params.id).lean();
    
    if (!yacht) {
      return res.status(404).json({ error: 'Yacht not found' });
    }
    
    res.json(yacht);
  } catch (error) {
    console.error('Error fetching yacht:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get charter companies
app.get('/api/companies', async (req, res) => {
  try {
    const companies = await CharterCompany.find().sort({ name: 1 }).lean();
    res.json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get yacht categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 }).lean();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get yacht statistics
app.get('/api/stats', async (req, res) => {
  try {
    const totalYachts = await Yacht.countDocuments();
    const totalCompanies = await CharterCompany.countDocuments();
    const totalCategories = await Category.countDocuments();
    
    // Price range
    const priceStats = await Yacht.aggregate([
      {
        $group: {
          _id: null,
          minPrice: { $min: '$price.from' },
          maxPrice: { $max: '$price.from' },
          avgPrice: { $avg: '$price.from' }
        }
      }
    ]);

    // Length range
    const lengthStats = await Yacht.aggregate([
      {
        $group: {
          _id: null,
          minLength: { $min: '$length' },
          maxLength: { $max: '$length' },
          avgLength: { $avg: '$length' }
        }
      }
    ]);

    res.json({
      totalYachts,
      totalCompanies,
      totalCategories,
      priceRange: priceStats[0] || { minPrice: 0, maxPrice: 0, avgPrice: 0 },
      lengthRange: lengthStats[0] || { minLength: 0, maxLength: 0, avgLength: 0 }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
async function startServer() {
  await connectToMongoDB();
  
  app.listen(PORT, () => {
    console.log(`🚢 Yacht API server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🛥️  Yachts API: http://localhost:${PORT}/api/yachts`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
}); 