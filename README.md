# 🚤 Yaacht V3 - Yacht Charter Management API

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-green.svg)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-4.18+-black.svg)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

A robust **Node.js/TypeScript** backend service that synchronizes yacht charter data from the **Nausys API (v6)** into **MongoDB** and exposes a comprehensive **REST API** for querying yachts, reservations, invoices, and contacts. Built with enterprise-grade features including rate limiting, centralized logging, and auto-generated API documentation.

## ✨ Features

- 🔄 **Data Synchronization**: Automated sync from Nausys API to local MongoDB
- 🚀 **REST API**: Complete CRUD operations for all yacht charter entities
- 📊 **Advanced Filtering**: Multi-parameter filtering and search capabilities
- 📈 **Statistics & Analytics**: Built-in aggregation endpoints for business insights
- 🔒 **Rate Limiting**: API protection with configurable request limits
- 📝 **Auto Documentation**: Swagger/OpenAPI documentation with JSDoc
- 📋 **Centralized Logging**: Winston-based logging with file and console output
- 🛡️ **Error Handling**: Comprehensive error handling and validation
- 🔧 **TypeScript**: Full type safety and modern development experience

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

Sync all data from Nausys API to MongoDB:

```bash
npm run sync
```

This will sequentially sync:
- 📚 **Catalogue Data**: Bases, countries, equipment, categories, services, builders
- 🚤 **Yachts & Models**: Complete yacht information and specifications
- 📅 **Reservations**: Booking data and occupancy information
- 👥 **Crew**: Staff information (requires security code)
- 💰 **Invoices**: Base, agency, and owner invoices
- 👤 **Contacts**: Customer and partner information

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
| `GET` | `/yachts` | List yachts with filtering & pagination |
| `GET` | `/yachts/:id` | Get yacht by ID |
| `GET` | `/yachts/search/query` | Search yachts by text |
| `GET` | `/yachts/stats/summary` | Yacht statistics |

**Example Queries:**
```bash
# List yachts with filters
GET /api/yachts?category=1&builder=1&minLength=30&maxLength=50&minCabins=2&maxCabins=4&year=2023&page=1&limit=10

# Search yachts
GET /api/yachts/search/query?q=luxury

# Get specific yacht
GET /api/yachts/12345
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
│   ├── catalogue.ts
│   ├── contact.ts
│   ├── invoice.ts
│   ├── reservation.ts
│   └── yacht.ts
├── routes/                    # Express route handlers
│   ├── contact.routes.ts
│   ├── invoice.routes.ts
│   ├── reservation.routes.ts
│   └── yacht.routes.ts
├── services/
│   └── sync-db.ts            # Data synchronization workflows
├── utils/
│   └── logger.ts             # Centralized logging (Winston)
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

4. **TypeScript Compilation Errors**
   ```bash
   # Clean and rebuild
   rm -rf dist/
   npm run build
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

---

**Built with ❤️ for the yacht charter industry**
