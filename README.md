# 🚤 Yaacht V3 - Yacht Charter Management API

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-green.svg)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-4.18+-black.svg)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

A robust **Node.js/TypeScript** backend service that synchronizes yacht charter data from the **Nausys API (v6)** into **MongoDB** and exposes a comprehensive **REST API** for querying yachts, reservations, invoices, and contacts. Built with enterprise-grade features including rate limiting, centralized logging, and auto-generated API documentation.

## ✨ Features

- 🔄 **Automated Data Synchronization**: 24-hour automated sync from Nausys API to local MongoDB
- 🚀 **REST API**: Complete CRUD operations for all yacht charter entities
- 📊 **Advanced Filtering & Search**: Multi-parameter filtering, text search, and pagination
- 🎯 **Smart Catalogue System**: Active filters that only show options with available yachts
- 📈 **Statistics & Analytics**: Built-in aggregation endpoints for business insights
- 🔒 **Rate Limiting**: API protection with configurable request limits
- 📝 **Auto Documentation**: Swagger/OpenAPI documentation with JSDoc
- 📋 **Centralized Logging**: Winston-based logging with file and console output
- 🛡️ **Error Handling**: Comprehensive error handling and validation
- 🔧 **TypeScript**: Full type safety and modern development experience
- ⚡ **Smart Conflict Resolution**: Automatic invoice collection cleanup before each sync
- 🌍 **Multi-language Support**: Text fields in EN, DE, FR, IT, ES, HR languages

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Nausys API    │───▶│   Sync Service  │───▶│    MongoDB      │
│   (External)    │    │   (Node.js)     │    │   (Local)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   REST API      │
                       │   (Express)     │
                       └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Client Apps   │
                       │   (Frontend)    │
                       └─────────────────┘
```

## 📋 Prerequisites

- **Node.js** 18.0.0 or higher
- **MongoDB** 6.0 or higher (local or cloud instance)
- **Nausys API** credentials (username, password)
- **npm** or **yarn** package manager

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone <repository-url>
cd yaacht-v3
npm install
```

### 2. Environment Configuration

Create a `.env` file in the project root:

```bash
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/yaacht

# Nausys API Credentials (Required)
NAUSYS_USERNAME=your-nausys-username
NAUSYS_PASSWORD=your-nausys-password

# Optional: Crew sync security code
NAUSYS_CREW_SECURITY_CODE=your-security-code

# Optional: Logging level
LOG_LEVEL=info
```

### 3. Build & Run

```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm run build
npm start
```

### 4. Data Synchronization

#### Manual Sync
Sync all data from Nausys API to MongoDB:

```bash
npm run sync
```

This will sequentially sync:
- 📚 **Catalogue Data**: Bases, countries, equipment, categories, services, builders
- 🚤 **Yachts & Models**: Complete yacht information and specifications
- 📅 **Reservations**: Booking data and occupancy information
- 👥 **Crew**: Staff information (requires security code)
- 💰 **Invoices**: Base, agency, and owner invoices (with automatic conflict resolution)
- 👤 **Contacts**: Customer and partner information

#### Automated Sync (Production)
The system automatically syncs data every 24 hours at 2 AM UTC using cron jobs:

```bash
# Cron job runs automatically
0 2 * * * cd /home/ubuntu/yacht-api && node dist/scripts/sync.js >> logs/cron-sync.log 2>&1
```

**Benefits:**
- ✅ **Always Fresh Data**: Your API stays updated 24/7
- ✅ **Server Independent**: Runs even when your laptop is off
- ✅ **Conflict Free**: Automatically cleans up invoice data before each sync
- ✅ **Logging**: All sync activity logged to `logs/cron-sync.log`
- ✅ **Zero Maintenance**: Fully automated after initial setup

## 📚 API Documentation

### Interactive Documentation

Visit the **Swagger UI** at: `http://localhost:3000/api-docs`

### Base URL

```
http://localhost:3000/api
```

## 🔌 API Endpoints

### 🚤 Yachts

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/yachts` | List yachts with advanced filtering & search |
| `GET` | `/yachts/search` | Advanced search endpoint (alias) |
| `GET` | `/yachts/:id` | Get yacht by ID |
| `GET` | `/yachts/debug/collection-info` | Debug: Get collection statistics |
| `GET` | `/yachts/debug/yacht/:id` | Debug: Check specific yacht retrieval |

**Available Filters:**
- **Text Search**: `q` - Search in yacht names and highlights
- **Category Filters**: `category`, `builder`, `base`, `charterCompany`
- **Numeric Ranges**: `minCabins`/`maxCabins`, `minDraft`/`maxDraft`, `minEnginePower`/`maxEnginePower`, `minDeposit`/`maxDeposit`
- **Sorting**: `sortBy` (name, cabins, draft, enginePower, deposit), `sortOrder` (asc, desc)
- **Pagination**: `page`, `limit`

**Example Queries:**
```bash
# Search by yacht name
GET /api/yachts?q=Blue

# Filter by cabins and sort
GET /api/yachts?minCabins=4&maxCabins=8&sortBy=cabins&sortOrder=desc

# Get all yachts (no filters)
GET /api/yachts

# Search with multiple filters
GET /api/yachts?q=Maria&minCabins=4&base=102751&sortBy=name&sortOrder=asc
```

### 📚 Catalogue & Filters

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/catalogue/filters` | Get all filter options with yacht counts |
| `GET` | `/catalogue/filters/active` | Get only active filters (with yachts) |
| `GET` | `/catalogue/categories` | Get all yacht categories |
| `GET` | `/catalogue/categories/active` | Get active categories (with yachts) |
| `GET` | `/catalogue/builders` | Get all yacht builders |
| `GET` | `/catalogue/builders/active` | Get active builders (with yachts) |
| `GET` | `/catalogue/bases` | Get all charter bases |
| `GET` | `/catalogue/bases/active` | Get active bases (with yachts) |
| `GET` | `/catalogue/charter-companies` | Get all charter companies |
| `GET` | `/catalogue/charter-companies/active` | Get active companies (with yachts) |
| `GET` | `/catalogue/countries` | Get all countries |
| `GET` | `/catalogue/equipment` | Get all equipment options |

**Active Filters Benefits:**
- ✅ **Frontend Ready**: Only show filter options that have yachts
- ✅ **Yacht Counts**: Each filter option shows how many yachts it contains
- ✅ **Performance**: Smaller response size for better frontend performance
- ✅ **User Experience**: Users only see relevant filter options

**Example Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": 1,
        "name": { "textEN": "Sailing Yacht", "textDE": "Segelyacht" },
        "yachtCount": 25
      }
    ],
    "ranges": {
      "cabins": { "min": 2, "max": 8 },
      "deposit": { "min": 500, "max": 10000 }
    }
  },
  "summary": {
    "totalCategories": 15,
    "totalYachts": 98
  }
}
```

### 📅 Reservations

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/reservations` | List reservations with filtering |
| `GET` | `/reservations/:id` | Get reservation by ID |
| `GET` | `/reservations/availability/:yachtId` | Check yacht availability |
| `GET` | `/reservations/stats/summary` | Reservation statistics |

**Example Queries:**
```bash
# List reservations
GET /api/reservations?yachtId=123&startDate=2024-01-01&endDate=2024-12-31&status=RESERVATION&page=1&limit=10

# Check availability
GET /api/reservations/availability/12345?startDate=2024-01-01&endDate=2024-12-31
```

### 💰 Invoices

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/invoices` | List invoices with filtering |
| `GET` | `/invoices/:id` | Get invoice by ID |
| `GET` | `/invoices/stats/summary` | Invoice statistics |

**Example Queries:**
```bash
# List invoices by type
GET /api/invoices?type=agency&startDate=2024-01-01&endDate=2024-12-31&page=1&limit=10

# Get invoice details
GET /api/invoices/67890
```

### 👤 Contacts

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/contacts` | List contacts with filtering |
| `GET` | `/contacts/:id` | Get contact by ID |
| `GET` | `/contacts/search/query` | Search contacts by text |
| `GET` | `/contacts/stats/summary` | Contact statistics |

**Example Queries:**
```bash
# List contacts
GET /api/contacts?name=John&email=john@example.com&company=true&page=1&limit=10

# Search contacts
GET /api/contacts/search/query?q=John
```

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Compile TypeScript to JavaScript
npm start           # Build and start production server

# Data Management
npm run sync        # Sync all data from Nausys API

# Testing
npm test           # Run test suite (when implemented)
```

### Project Structure

```
src/
├── db/
│   └── connection.ts          # MongoDB connection setup
├── models/                    # Mongoose schemas & models
│   ├── catalogue.ts          # Catalogue entities (Base, Country, Equipment, etc.)
│   ├── common.ts             # Common interfaces (IMultilingualText)
│   ├── contact.ts            # Contact management
│   ├── crew.ts               # Crew member data
│   ├── invoice.ts            # Invoice management
│   ├── reservation.ts        # Reservation data
│   └── yacht.ts             # Yacht specifications
├── routes/                    # Express route handlers
│   ├── catalogue.routes.ts   # Catalogue and filter endpoints
│   ├── contact.routes.ts     # Contact management
│   ├── invoice.routes.ts     # Invoice operations
│   ├── reservation.routes.ts # Reservation handling
│   └── yacht.routes.ts      # Yacht search and filtering
├── services/
│   └── sync-db.ts            # Data synchronization workflows
├── utils/
│   ├── date.ts               # Date utility functions
│   └── logger.ts             # Centralized logging (Winston)
├── scripts/
│   └── sync.ts               # Automated sync script
├── sync.ts                   # Nausys API client
└── server.ts                 # Express application setup
```

### Key Dependencies

- **Express.js**: Web framework for REST API
- **Mongoose**: MongoDB ODM for data modeling
- **Axios**: HTTP client for Nausys API calls
- **Winston**: Logging library
- **Morgan**: HTTP request logger
- **Swagger**: API documentation
- **Rate Limiting**: API protection middleware

## 🔧 Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `3000` | Server port |
| `NODE_ENV` | No | `development` | Environment mode |
| `MONGO_URI` | Yes | - | MongoDB connection string |
| `NAUSYS_USERNAME` | Yes | - | Nausys API username |
| `NAUSYS_PASSWORD` | Yes | - | Nausys API password |
| `NAUSYS_CREW_SECURITY_CODE` | No | - | Crew sync security code |
| `LOG_LEVEL` | No | `info` | Logging level |

### Rate Limiting

- **Default**: 300 requests per 15 minutes per IP
- **Configurable**: Modify in `src/server.ts`

### Logging

- **Console**: Colored output for development
- **Files**: `logs/combined.log` and `logs/error.log`
- **Levels**: `error`, `warn`, `info`, `debug`

## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   ```bash
   # Check if MongoDB is running
   mongod --version
   
   # Verify connection string in .env
   MONGO_URI=mongodb://localhost:27017/yaacht
   ```

2. **Nausys API Authentication Error**
   ```bash
   # Verify credentials in .env
   NAUSYS_USERNAME=your-username
   NAUSYS_PASSWORD=your-password
   
   # Check if IP is whitelisted with Nausys
   ```

3. **Port Already in Use**
   ```bash
   # Change port in .env
   PORT=3001
   
   # Or kill existing process
   lsof -ti:3000 | xargs kill -9
   ```

4. **Automated Sync Issues**
   ```bash
   # Check cron job status
   crontab -l
   
   # Check sync logs
   tail -f logs/cron-sync.log
   
   # Manually trigger sync
   node dist/scripts/sync.js
   
   # Restart cron service if needed
   sudo service cron restart
   ```

5. **TypeScript Compilation Errors**
   ```bash
   # Clean and rebuild
   rm -rf dist/
   npm run build
   ```

6. **Yacht API Returns Empty Data**
   ```bash
   # Check if data exists
   GET /api/yachts/debug/collection-info
   
   # Search for actual yacht names (not generic terms)
   GET /api/yachts?q=Blue          # ✅ Works
   GET /api/yachts?q=yacht         # ❌ No yachts named "yacht"
   
   # Get all yachts without filters
   GET /api/yachts
   ```

### Debug Mode

Enable debug logging:

```bash
# Set in .env
LOG_LEVEL=debug

# Or run with debug flag
DEBUG=* npm run dev
```

## 📊 API Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "data": {
    // Response data
  },
  "pagination": {
    "total": 100,
    "page": 1,
    "pages": 10,
    "limit": 10
  },
  "filters": {
    // Applied filters summary
  },
  "search": {
    "query": "search term",
    "results": 25
  },
  "message": "Operation successful"
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

## 🌟 Key Features Explained

### Smart Yacht Search
- **Text Search**: Searches yacht names and highlights in multiple languages
- **Field Validation**: Only uses fields that actually exist in your database
- **Performance**: Optimized queries with proper indexing

### Active Filter System
- **Frontend Optimized**: Only shows filter options with available yachts
- **Real-time Counts**: Each filter shows how many yachts it contains
- **Eliminates Empty Results**: Users never see filter options that return no yachts

### Multi-language Support
- **6 Languages**: English, German, French, Italian, Spanish, Croatian
- **Consistent Structure**: All text fields follow the same multilingual pattern
- **Search Ready**: Text search works across all language variants

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the **ISC License** - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- 📧 Create an issue in the repository
- 📚 Check the [API Documentation](http://localhost:3000/api-docs)
- 🔍 Review the troubleshooting section above
- 🐛 Use debug endpoints for troubleshooting

---

**Built with ❤️ for the yacht charter industry**

*Last updated: August 2025 - API v3.0 with working yacht search, active filters, and comprehensive catalogue system*
