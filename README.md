# 🚢 Yacht Charter API v3.0

A comprehensive Node.js/TypeScript API for yacht charter management with advanced filtering, search capabilities, and automated data synchronization.

## ✨ **Current Status: PRODUCTION READY** ✅

- **🌐 Production Server**: `http://3.69.225.186:3000`
- **📚 API Documentation**: `http://3.69.225.186:3000/api-docs`
- **🚀 All Features Working**: Search, filtering, catalogue, automated sync
- **🔧 Swagger Fixed**: No more YAML syntax errors
- **🧹 Production Cleaned**: Optimized production environment

## 🎯 **Key Features**

- 🚢 **Comprehensive Yacht Management**: Full CRUD operations for yacht data
- 📊 **Advanced Filtering & Search**: Multi-parameter filtering, text search, and pagination
- 🔄 **Automated Data Synchronization**: Daily sync with Nausys API v6
- 🌍 **Multi-language Support**: Handle text in EN, DE, FR, IT, ES, HR
- 🎛️ **Smart Catalogue System**: Active filters with yacht counts
- 🛡️ **Smart Conflict Resolution**: Prevents duplicate key errors during sync
- 📈 **Real-time Data**: Fresh data every 24 hours via automated cron jobs
- 🔍 **Debug Endpoints**: Built-in troubleshooting and data inspection
- 📚 **Complete API Documentation**: Auto-generated Swagger/OpenAPI docs

## 🏗️ **Architecture**

- **Backend**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **API Documentation**: Swagger/OpenAPI 3.0
- **Data Sync**: Nausys API v6 integration
- **Deployment**: AWS EC2 with systemd service
- **Automation**: Cron jobs for daily sync

## 🚀 **Quick Start**

### **Local Development**
```bash
# Clone and install dependencies
git clone <repository-url>
cd yachts
npm install

# Set up environment variables
cp env.template .env
# Edit .env with your MongoDB and Nausys API credentials

# Start development server
npm run dev
```

### **Production Deployment**
```bash
# Build and deploy
npm run build
scp -i nautio.pem -r dist/ ubuntu@3.69.225.186:/home/ubuntu/yacht-api/
ssh -i nautio.pem ubuntu@3.69.225.186 "sudo systemctl restart yacht-api"
```

## 🌐 **API Endpoints**

### **Yachts**
- `GET /api/yachts` - Get all yachts with advanced filtering and search
- `GET /api/yachts/search` - Advanced search endpoint (alias)
- `GET /api/yachts/debug/collection-info` - Debug collection information
- `GET /api/yachts/debug/yacht/:id` - Debug specific yacht

### **Catalogue & Filters**
- `GET /api/catalogue/filters` - All available filter options
- `GET /api/catalogue/filters/active` - Only filters with associated yachts
- `GET /api/catalogue/categories` - All categories
- `GET /api/catalogue/categories/active` - Categories with yachts
- `GET /api/catalogue/builders` - All builders
- `GET /api/catalogue/builders/active` - Builders with yachts
- `GET /api/catalogue/bases` - All bases
- `GET /api/catalogue/bases/active` - Bases with yachts
- `GET /api/catalogue/charter-companies/active` - Charter companies with yachts

### **Other Endpoints**
- `GET /api/invoices` - Get invoices
- `GET /api/reservations` - Get reservations
- `GET /api/contacts` - Get contacts

## 🔍 **Advanced Search & Filtering**

### **Query Parameters**
- `q` - Text search in yacht names and highlights
- `category`, `builder`, `base`, `charterCompany` - ID-based filters
- `minCabins`/`maxCabins` - Cabin range filtering
- `minDraft`/`maxDraft` - Draft measurement range
- `minEnginePower`/`maxEnginePower` - Engine power range
- `minDeposit`/`maxDeposit` - Deposit amount range
- `page`, `limit` - Pagination
- `sortBy`, `sortOrder` - Sorting options

### **Example Queries**
```bash
# Search for catamarans with 3+ cabins
GET /api/yachts?q=catamaran&minCabins=3&category=2

# Luxury yachts sorted by cabins
GET /api/yachts?q=luxury&sortBy=cabins&sortOrder=desc

# Active filters only
GET /api/catalogue/filters/active
```

## 🔄 **Data Synchronization**

### **Automated Sync (Production)**
- **Frequency**: Every 24 hours at 2:00 AM UTC
- **Cron Job**: `0 2 * * * /home/ubuntu/yacht-api/scripts/sync.sh`
- **Benefits**: Fresh data, no manual intervention, conflict resolution
- **Monitoring**: Logs at `/home/ubuntu/yacht-api/logs/cron-sync.log`

### **Manual Sync**
```bash
# SSH to production server
ssh -i nautio.pem ubuntu@3.69.225.186

# Run manual sync
cd /home/ubuntu/yacht-api
npm run sync
```

## 🏗️ **Project Structure**

```
yachts/
├── src/
│   ├── db/connection.ts          # MongoDB connection
│   ├── models/                   # Mongoose schemas
│   │   ├── yacht.ts             # Yacht data model
│   │   ├── catalogue.ts         # Catalogue data model
│   │   ├── common.ts            # Common interfaces
│   │   ├── crew.ts              # Crew data model
│   │   ├── invoice.ts           # Invoice data model
│   │   ├── reservation.ts       # Reservation data model
│   │   └── contact.ts           # Contact data model
│   ├── routes/                   # API endpoints
│   │   ├── yacht.routes.ts      # Yacht endpoints
│   │   ├── catalogue.routes.ts  # Catalogue endpoints
│   │   ├── invoice.routes.ts    # Invoice endpoints
│   │   ├── reservation.routes.ts # Reservation endpoints
│   │   └── contact.routes.ts    # Contact endpoints
│   ├── services/sync-db.ts      # Data synchronization logic
│   ├── scripts/sync.ts          # Sync scripts
│   ├── utils/                   # Utility functions
│   │   ├── date.ts             # Date utilities
│   │   └── logger.ts           # Logging (Winston)
│   └── server.ts               # Express app setup
├── dist/                        # Compiled JavaScript (production)
├── logs/                        # Application and sync logs
├── scripts/                     # Deployment and sync scripts
└── docs/                        # Documentation
```

## 🚀 **Deployment**

### **Production Environment**
- **Server**: AWS EC2 Ubuntu 24.04 LTS
- **Service**: systemd service (`yacht-api.service`)
- **Port**: 3000
- **Domain**: `yatch.nautio.net:3000`
- **Automated Sync**: Daily cron job

### **Deployment Commands**
```bash
# Deploy to production
scp -i nautio.pem -r dist/ ubuntu@3.69.225.186:/home/ubuntu/yacht-api/
ssh -i nautio.pem ubuntu@3.69.225.186 "sudo systemctl restart yacht-api"

# Check service status
ssh -i nautio.pem ubuntu@3.69.225.186 "sudo systemctl status yacht-api"
```

## 🧪 **Testing**

### **Local Testing**
```bash
# Start development server
npm run dev

# Test endpoints
curl http://localhost:3000/api/yachts?q=catamaran
curl http://localhost:3000/api/catalogue/filters/active
```

### **Production Testing**
```bash
# Test production API
curl http://3.69.225.186:3000/api/yachts?q=catamaran
curl http://3.69.225.186:3000/api/catalogue/filters/active
```

## 🔧 **Configuration**

### **Environment Variables**
```bash
# MongoDB
MONGODB_URI=mongodb://localhost:27017/yaacht

# Nausys API
NAUSYS_API_URL=https://api.nausys.com/v6
NAUSYS_API_KEY=your_api_key

# Server
PORT=3000
NODE_ENV=production
```

## 📊 **API Response Format**

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "pages": 8
  },
  "filters": {
    "category": "2",
    "minCabins": 3
  },
  "search": {
    "query": "catamaran",
    "results": 25
  }
}
```

## 🚨 **Troubleshooting**

### **Common Issues**

#### **API Returns Empty Data**
- Check if data sync has run recently
- Verify MongoDB connection
- Use debug endpoints: `/api/yachts/debug/collection-info`

#### **Swagger Documentation Issues**
- ✅ **RESOLVED**: YAML syntax errors fixed
- ✅ **RESOLVED**: Production API docs working
- ✅ **RESOLVED**: Source files cleaned up

#### **Automated Sync Issues**
- Check cron job status: `crontab -l`
- View sync logs: `tail -f /home/ubuntu/yacht-api/logs/cron-sync.log`
- Verify Nausys API credentials

### **Debug Endpoints**
- `GET /api/yachts/debug/collection-info` - Collection statistics
- `GET /api/yachts/debug/yacht/:id` - Specific yacht debugging

## 🔄 **Recent Updates**

### **v3.0.0 (Current)**
- ✅ **Swagger YAML syntax errors fixed**
- ✅ **Production API documentation working**
- ✅ **Source files cleaned up from production**
- ✅ **Advanced yacht search and filtering**
- ✅ **Active catalogue system**
- ✅ **Automated daily sync with conflict resolution**
- ✅ **Debug endpoints for troubleshooting**

## 📞 **Support**

- **Documentation**: `http://3.69.225.186:3000/api-docs`
- **Production Status**: Check service status on server
- **Sync Logs**: `/home/ubuntu/yacht-api/logs/cron-sync.log`

## 📄 **License**

This project is proprietary software for yacht charter management.

---

**Last updated**: August 14, 2025  
**Version**: API v3.0 with working yacht search, active filters, comprehensive catalogue system, and production-ready deployment  
**Status**: ✅ **PRODUCTION READY - All features working**
