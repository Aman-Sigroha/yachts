# 🚢 Yacht Charter API - Deployment Overview

High-level deployment guide and current status for the Yacht Charter API with advanced search, filtering, catalogue system, and yacht availability management.

## 🎯 **Current Status: PRODUCTION READY** ✅

- **🌐 Production Server**: `http://3.69.225.186:3000`
- **📚 API Documentation**: `http://3.69.225.186:3000/api-docs`
- **🚀 All Features Working**: Search, filtering, catalogue, automated sync, availability
- **🔧 Swagger Fixed**: No more YAML syntax errors
- **🧹 Production Cleaned**: Optimized production environment

## 📋 **Project Summary**

The Yacht Charter API is a comprehensive Node.js/TypeScript backend service that provides:

- **Advanced Yacht Search & Filtering**: Multi-parameter filtering with text search and pagination
- **Smart Catalogue System**: Active filters that only show options with available yachts
- **Yacht Availability Management**: Check availability, calendar views, and bulk operations
- **Automated Data Synchronization**: Daily sync with Nausys API v6 with conflict resolution
- **Multi-language Support**: Handle text in EN, DE, FR, IT, ES, HR languages
- **Complete API Documentation**: Auto-generated Swagger/OpenAPI docs

## 🏗️ **Architecture**

- **Backend**: Node.js 18+ with TypeScript
- **Framework**: Express.js with comprehensive middleware
- **Database**: MongoDB 5+ with Mongoose ODM
- **API Documentation**: Swagger/OpenAPI 3.0
- **Data Sync**: Nausys API v6 integration
- **Deployment**: AWS EC2 with systemd service
- **Automation**: Cron jobs for daily sync

## 🌐 **API Endpoints**

### **Yachts & Search**
- `GET /api/yachts` - Advanced search with filtering, pagination, sorting, and date-based availability filtering
- `GET /api/yachts/search` - Search endpoint alias
- `GET /api/yachts/debug/collection-info` - Collection statistics
- `GET /api/yachts/debug/yacht/:id` - Specific yacht debugging

### **Yacht Availability**
- `GET /api/yachts/{id}/availability` - Check yacht availability for a specific date range
- `GET /api/yachts/{id}/calendar` - Monthly calendar view with availability status
- `GET /api/yachts/{id}/availability-summary` - Availability statistics and next available periods
- `GET /api/yachts/bulk-availability` - Check availability for multiple yachts in a date range

### **Catalogue & Filters**
- `GET /api/catalogue/filters` - All filter options
- `GET /api/catalogue/filters/active` - Only filters with associated yachts
- `GET /api/catalogue/categories/active` - Active categories
- `GET /api/catalogue/builders/active` - Active builders
- `GET /api/catalogue/bases/active` - Active bases
- `GET /api/catalogue/charter-companies/active` - Active companies

### **Other Endpoints**
- `GET /api/invoices` - Invoice management
- `GET /api/reservations` - Reservation data
- `GET /api/contacts` - Contact information

## 🔍 **Advanced Search & Filtering**

### **Query Parameters**
- `q` - Text search in yacht names and highlights
- `category`, `builder`, `base`, `charterCompany` - ID-based filters
- `minCabins`/`maxCabins` - Cabin range filtering
- `minDraft`/`maxDraft` - Draft measurement range
- `minEnginePower`/`maxEnginePower` - Engine power range
- `minDeposit`/`maxDeposit` - Deposit amount range
- `startDate`/`endDate` - Date range filtering for yacht availability (YYYY-MM-DD format)
- `page`, `limit` - Pagination
- `sortBy`, `sortOrder` - Sorting options

### **Date-Based Availability Filtering**
The main `/api/yachts` endpoint now supports date filtering to return only yachts available within the specified date range:

```bash
# Example: Get yachts with 5-8 cabins available from Jan 15-25, 2025
GET /api/yachts?minCabins=5&maxCabins=8&startDate=2025-01-15&endDate=2025-01-25

# Example: Search for "Blue" yachts available in March 2025
GET /api/yachts?q=Blue&startDate=2025-03-01&endDate=2025-03-31
```

This feature automatically excludes yachts with conflicting reservations in the specified date range.

## 🚀 **Deployment Process**

### **1. Server Setup**
- Install Node.js 18+ and MongoDB 5+
- Configure firewall (SSH, HTTP, port 3000)
- Set up system user and directories

### **2. Application Deployment**
- Clone repository and install dependencies
- Configure environment variables
- Build TypeScript application
- Set up systemd service

### **3. Service Configuration**
- Create and enable systemd service
- Configure auto-restart and environment
- Test service functionality

### **4. Automated Data Sync**
- Create sync script with proper permissions
- Set up cron job for daily sync at 2:00 AM UTC
- Configure logging and monitoring

### **5. Testing & Verification**
- Test all API endpoints
- Verify Swagger documentation
- Check automated sync functionality

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

### **Conflict Resolution**
- **Invoice Collection**: Automatically dropped before each sync to prevent duplicate key errors
- **Data Integrity**: Ensures clean data synchronization
- **Error Handling**: Comprehensive logging and error recovery

## 🧪 **Testing After Deployment**

### **Basic Endpoint Testing**
```bash
# Test server health
curl http://3.69.225.186:3000/api/yachts?limit=1

# Test catalogue endpoints
curl http://3.69.225.186:3000/api/catalogue/filters/active

# Test debug endpoints
curl http://3.69.225.186:3000/api/yachts/debug/collection-info
```

### **Advanced Feature Testing**
```bash
# Test search with filters
curl "http://3.69.225.186:3000/api/yachts?q=Blue&minCabins=5&maxCabins=8&limit=5"

# Test date-based availability filtering
curl "http://3.69.225.186:3000/api/yachts?minCabins=5&maxCabins=8&startDate=2025-01-15&endDate=2025-01-25&limit=5"

# Test individual yacht availability
curl "http://3.69.225.186:3000/api/yachts/479287/availability?startDate=2025-01-15&endDate=2025-01-25"

# Test calendar view
curl "http://3.69.225.186:3000/api/yachts/479287/calendar?year=2025&month=1"

# Test bulk availability
curl "http://3.69.225.186:3000/api/yachts/bulk-availability?yachtIds=479287,479288&startDate=2025-01-15&endDate=2025-01-25"
```

### **Swagger Documentation**
- **URL**: `http://3.69.225.186:3000/api-docs`
- **Status**: ✅ Working with all endpoints documented
- **Features**: Interactive testing, comprehensive schemas

## 📊 **Server File Structure**

```
/home/ubuntu/yacht-api/
├── dist/                    # Compiled JavaScript (production)
│   ├── server.js           # Main application
│   ├── routes/             # API route handlers
│   ├── models/             # Database models
│   ├── services/           # Business logic
│   └── scripts/            # Sync and utility scripts
├── logs/                   # Application and sync logs
│   ├── app.log            # Application logs
│   └── cron-sync.log      # Sync operation logs
├── scripts/                # Shell scripts
│   └── sync.sh            # Automated sync script
├── .env                    # Environment configuration
└── package.json            # Dependencies and scripts
```

## 🔧 **Maintenance & Monitoring**

### **Service Management**
```bash
# Check service status
sudo systemctl status yacht-api

# View logs
sudo journalctl -u yacht-api -f

# Restart service
sudo systemctl restart yacht-api
```

### **Sync Monitoring**
```bash
# Check cron job status
crontab -l

# View sync logs
tail -f /home/ubuntu/yacht-api/logs/cron-sync.log

# Manual sync
cd /home/ubuntu/yacht-api
npm run sync
```

### **Database Management**
```bash
# Connect to MongoDB
mongosh

# Check collections
show collections

# Check yacht data
db.yachts.countDocuments()

# Check reservations
db.reservations.countDocuments()
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

## 📈 **Performance & Security**

### **Performance Optimizations**
- **Database Indexing**: Optimized queries with proper indexes
- **Pagination**: Efficient data retrieval for large datasets
- **Connection Pooling**: Optimized database connections

### **Security Features**
- **Rate Limiting**: API protection with configurable limits
- **CORS**: Cross-origin resource sharing configuration
- **Input Validation**: Query parameter validation and sanitization
- **Error Handling**: Graceful error responses without information leakage

## 🔮 **Future Enhancements**

### **Planned Features**
- **Real-time Updates**: WebSocket support for live data
- **Advanced Analytics**: Business intelligence and reporting
- **Multi-tenant Support**: Separate data for different organizations
- **API Versioning**: Backward compatibility management
- **Enhanced Security**: JWT authentication and role-based access

### **Scaling Considerations**
- **Load Balancing**: Multiple server instances
- **Database Sharding**: Horizontal scaling for large datasets
- **Redis Caching**: Advanced caching layer
- **CDN Integration**: Static asset optimization

## 📞 **Support & Documentation**

### **Available Resources**
- **API Documentation**: `http://3.69.225.186:3000/api-docs`
- **Production Status**: Check service status on server
- **Sync Logs**: `/home/ubuntu/yacht-api/logs/cron-sync.log`
- **Service Logs**: `sudo journalctl -u yacht-api`

### **Quick Commands**
```bash
# Check production status
curl http://3.69.225.186:3000/api/yachts?limit=1

# Check service status
ssh -i nautio.pem ubuntu@3.69.225.186 "sudo systemctl status yacht-api"

# View recent logs
ssh -i nautio.pem ubuntu@3.69.225.186 "sudo journalctl -u yacht-api -n 20"
```

---

**Last Updated**: August 18, 2025  
**Deployment Guide Version**: 3.0.0  
**Status**: ✅ **PRODUCTION READY - All features working including date filtering**

---

*This deployment overview covers the current status and key information for the Yacht Charter API with advanced search, filtering, catalogue system, and yacht availability management.*
