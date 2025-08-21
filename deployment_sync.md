# 🔄 Yacht Charter API - Data Synchronization Guide

Complete guide for MongoDB data synchronization from Nausys API v6, including automated sync, conflict resolution, and new availability features.

## 📋 **Overview**

This guide covers the data synchronization process for the Yacht Charter API, which automatically pulls yacht charter data from Nausys API v6 into a local MongoDB database. The system includes automated daily synchronization, smart conflict resolution, and comprehensive yacht availability management.

## 🎯 **Current Status: PRODUCTION READY** ✅

- **🌐 Production Server**: `http://3.69.225.186:3000`
- **📚 API Documentation**: `http://3.69.225.186:3000/api-docs`
- **🚀 All Features Working**: Search, filtering, catalogue, automated sync, availability
- **🔧 Swagger Fixed**: No more YAML syntax errors
- **🧹 Production Cleaned**: Optimized production environment

## 🔄 **Data Synchronization Overview**

### **What Gets Synced**
- **Yachts**: Complete yacht information with multilingual support
- **Reservations**: Booking details with date ranges for availability calculation
- **Invoices**: Financial records with automatic conflict resolution
- **Contacts**: Customer and company information
- **Crew Members**: Staff details and assignments
- **Catalogue Data**: Categories, builders, bases, charter companies, equipment, services
- **Location Data**: Countries, regions, and locations with multi-language names for advanced filtering
- **Journey Data**: Charter route information with start/end destinations for journey-based filtering
- **Yacht Specifications**: Comprehensive filtering by toilets, length, year, berths, beam, premium status, sale status, and fuel type

### **Sync Benefits**
- ✅ **24/7 Data Freshness**: Automatically syncs every 24 hours
- ✅ **Server Independent**: Runs even when your laptop is off
- ✅ **Conflict Resolution**: Automatically cleans up invoice data before each sync
- ✅ **Comprehensive Logging**: All sync activity logged
- ✅ **Zero Maintenance**: Fully automated after setup
- ✅ **Availability Management**: Real-time yacht availability based on reservation data

## 🚀 **Automated Synchronization**

### **Production Setup**
```bash
# Daily sync at 2:00 AM UTC
0 2 * * * /home/ubuntu/yacht-api/scripts/sync.sh

# Sync script location
/home/ubuntu/yacht-api/scripts/sync.sh

# Log location
/home/ubuntu/yacht-api/logs/cron-sync.log
```

### **Manual Sync Commands**
```bash
# SSH to production server
ssh -i nautio.pem ubuntu@3.69.225.186

# Run manual sync
cd /home/ubuntu/yacht-api
npm run sync

# Check sync logs
tail -f logs/cron-sync.log
```

### **Conflict Resolution**
- **Invoice Collection**: Automatically dropped before each sync to prevent duplicate key errors
- **Data Integrity**: Ensures clean data synchronization
- **Error Handling**: Comprehensive logging and error recovery

## 📊 **Current Data Status**

### **Available Collections**
- **yachts**: Charter yacht information with advanced search capabilities
- **reservations**: Booking data for availability calculation
- **invoices**: Financial records (automatically cleaned before sync)
- **contacts**: Customer and company information
- **crewMembers**: Staff details
- **catalogue**: Filter options and metadata
- **journeys**: Charter route information for journey-based filtering

### **Data Statistics**
- **Total Yachts**: Available with advanced search and filtering
- **Categories**: Active categories with yacht counts
- **Builders**: Active builders with yacht counts
- **Bases**: Active bases with yacht counts
- **Charter Companies**: Active companies with yacht counts
- **Automated Sync**: Daily updates at 2:00 AM UTC

## 🔄 **New Nausys API Integration**

### **Journey Data Sync**
- **Endpoint**: `/yachtReservation/v6/options`
- **Purpose**: Fetch available charter routes for journey-based filtering
- **Frequency**: Daily sync at 2:00 AM UTC
- **Data**: Start/end destination pairs with yacht associations

### **Free Yachts Availability**
- **Endpoint**: `/yachtReservation/v6/freeYachts`
- **Purpose**: Get real-time yacht availability for specific date ranges
- **Usage**: On-demand API calls when `free=true` parameter is used
- **Fallback**: Graceful degradation when external API is unavailable

## 🌐 **API Endpoints After Sync**

### **Yachts & Search**
- `GET /api/yachts` - Advanced search with filtering, pagination, sorting, and date-based availability filtering
- `GET /api/yachts/search` - Search endpoint alias
- `GET /api/yachts/debug/collection-info` - Collection statistics and sample data
- `GET /api/yachts/debug/yacht/:id` - Debug specific yacht retrieval

### **Yacht Availability**
- `GET /api/yachts/{id}/availability` - Check yacht availability for a specific date range
- `GET /api/yachts/{id}/calendar` - Monthly calendar view with availability status
- `GET /api/yachts/{id}/availability-summary` - Availability statistics and next available periods
- `GET /api/yachts/bulk-availability` - Check availability for multiple yachts in a date range

### **Catalogue & Filters**
- `GET /api/catalogue/filters` - All filter options with yacht counts
- `GET /api/catalogue/filters/active` - Only active filters (with associated yachts)
- `GET /api/catalogue/categories/active` - Active categories with yacht counts
- `GET /api/catalogue/builders/active` - Active builders with yacht counts
- `GET /api/catalogue/bases/active` - Active bases with yacht counts
- `GET /api/catalogue/charter-companies/active` - Active companies with yacht counts
- `GET /api/catalogue/countries` - All countries with multi-language names
- `GET /api/catalogue/regions` - All regions with multi-language names
- `GET /api/catalogue/locations` - All locations/marinas with multi-language names

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

### **Location-Based Filtering with Multi-Language Support**
The API now supports advanced location filtering using country, region, and location names in multiple languages:

```bash
# Filter by country (supports 20+ languages)
GET /api/yachts?country=Croatia&limit=5
GET /api/yachts?country=Hrvatska&limit=5      # Croatian
GET /api/yachts?country=Chorvatsko&limit=5    # Czech
GET /api/yachts?country=Kroatien&limit=5      # German

# Filter by region
GET /api/yachts?region=Zadar&limit=5
GET /api/yachts?region=Corse&limit=5          # French
GET /api/yachts?region=Korsika&limit=5        # Czech

# Filter by specific location/marina
GET /api/yachts?location=Zadar&limit=5
GET /api/yachts?location=Ajaccio&limit=5

# Combined location filtering
GET /api/yachts?country=Croatia&region=Zadar&limit=5
GET /api/yachts?country=Francie&region=Korsika&limit=5  # Czech names
```

**Supported Languages**: English, German, French, Italian, Spanish, Croatian, Czech, Hungarian, Lithuanian, Latvian, Dutch, Norwegian, Polish, Russian, Swedish, Slovenian, Slovak, Turkish

**Location Hierarchy**: The filtering follows the hierarchy: **Base → Location → Region → Country**, ensuring accurate results based on actual yacht base locations.

## 🧪 **API Testing After Sync**

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

# Test location-based filtering
curl "http://3.69.225.186:3000/api/yachts?country=Croatia&limit=5"
curl "http://3.69.225.186:3000/api/yachts?country=Hrvatska&limit=5"
curl "http://3.69.225.186:3000/api/yachts?region=Zadar&limit=5"
curl "http://3.69.225.186:3000/api/yachts?location=Zadar&limit=5"
curl "http://3.69.225.186:3000/api/yachts?country=Croatia&region=Zadar&limit=5"

# Test catalogue endpoints
curl "http://3.69.225.186:3000/api/catalogue/countries?limit=5"
curl "http://3.69.225.186:3000/api/catalogue/regions?limit=5"
curl "http://3.69.225.186:3000/api/catalogue/locations?limit=5"

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

## 🎯 **New Features After Sync**

### **Advanced Search & Filtering**
- ✅ **Text Search**: Search yacht names and highlights
- ✅ **Multi-parameter Filtering**: Cabins, draft, engine power, deposit
- ✅ **Pagination**: Page-based results with customizable limits
- ✅ **Sorting**: Sort by various fields with ascending/descending order

### **Smart Catalogue System**
- ✅ **Active Filters**: Only show filter options with available yachts
- ✅ **Yacht Counts**: Each filter shows how many yachts it contains
- ✅ **Range Information**: Min/max values for numeric fields
- ✅ **Frontend Optimized**: Eliminates empty filter results

### **Yacht Availability Management**
- ✅ **Individual Availability**: Check if a specific yacht is available for dates
- ✅ **Calendar Views**: Monthly calendar showing available/unavailable days
- ✅ **Availability Summary**: Statistics and next available periods
- ✅ **Bulk Operations**: Check availability for multiple yachts simultaneously
- ✅ **Date-Based Filtering**: Filter yachts by availability in main search endpoint

### **Debug & Troubleshooting**
- ✅ **Collection Statistics**: Total counts and sample data
- ✅ **Yacht Debugging**: Individual yacht inspection
- ✅ **Comprehensive Logging**: Full sync activity tracking
- ✅ **Error Handling**: Graceful failure with detailed error messages

## 🔧 **Sync Configuration**

### **Environment Variables**
```bash
# Nausys API Configuration
NAUSYS_API_URL=https://api.nausys.com/v6
NAUSYS_API_KEY=your_api_key

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/yacht-api

# Sync Settings
NODE_ENV=production
```

### **Sync Script Details**
```bash
#!/bin/bash
cd /home/ubuntu/yacht-api
export NODE_ENV=production
node dist/scripts/sync.js >> logs/cron-sync.log 2>&1
```

### **Cron Job Configuration**
```bash
# Edit crontab
crontab -e

# Add daily sync at 2:00 AM UTC
0 2 * * * /home/ubuntu/yacht-api/scripts/sync.sh
```

## 📊 **Data Models & Structure**

### **Yacht Schema**
```typescript
{
  id: Number,           // Unique yacht identifier
  name: String,         // Yacht name
  cabins: Number,       // Number of cabins
  draft: Number,        // Draft measurement
  enginePower: Number,  // Engine power
  deposit: Number,      // Deposit amount
  highlights: {         // Multilingual highlights
    textEN: String,
    textDE: String,
    textFR: String,
    textIT: String,
    textES: String,
    textHR: String
  },
  categoryId: Number,   // Yacht category
  builderId: Number,    // Yacht builder
  baseId: Number,       // Charter base
  charterCompanyId: Number // Charter company
}
```

### **Reservation Schema**
```typescript
{
  id: Number,           // Unique reservation identifier
  yachtId: Number,      // Associated yacht ID
  periodFrom: Date,     // Start date
  periodTo: Date,       // End date
  // ... other reservation details
}
```

### **Catalogue Schema**
```typescript
{
  id: Number,           // Unique identifier
  name: {               // Multilingual name
    textEN: String,
    textDE: String,
    textFR: String,
    textIT: String,
    textES: String,
    textHR: String
  },
  yachtCount: Number    // Number of associated yachts
}
```

## 🚨 **Troubleshooting Sync Issues**

### **Common Problems**

#### **Empty Data After Sync**
```bash
# Check sync logs
tail -f /home/ubuntu/yacht-api/logs/cron-sync.log

# Verify MongoDB connection
mongosh --eval "db.yachts.countDocuments()"

# Check API credentials
cat /home/ubuntu/yacht-api/.env | grep NAUSYS
```

#### **Duplicate Key Errors**
- ✅ **RESOLVED**: Invoice collection automatically dropped before sync
- ✅ **RESOLVED**: Unique ID generation for all entities
- ✅ **RESOLVED**: Conflict resolution implemented

#### **API Connection Issues**
```bash
# Test Nausys API connectivity
curl -H "Authorization: Bearer YOUR_API_KEY" https://api.nausys.com/v6/yachts

# Check network connectivity
ping api.nausys.com

# Verify firewall settings
sudo ufw status
```

### **Debug Commands**
```bash
# Check sync script permissions
ls -la /home/ubuntu/yacht-api/scripts/sync.sh

# Verify cron job
crontab -l

# Test manual sync
cd /home/ubuntu/yacht-api && npm run sync

# Check service status
sudo systemctl status yacht-api
```

## 📈 **Performance & Optimization**

### **Database Indexes**
```bash
# Connect to MongoDB
mongosh

# Create indexes for common queries
db.yachts.createIndex({ "id": 1 })
db.yachts.createIndex({ "cabins": 1 })
db.yachts.createIndex({ "deposit": 1 })
db.reservations.createIndex({ "yachtId": 1, "periodFrom": 1, "periodTo": 1 })
```

### **Sync Performance**
- **Parallel Processing**: Multiple entities synced simultaneously
- **Batch Operations**: Efficient database operations
- **Memory Management**: Optimized for production environment
- **Error Recovery**: Continues sync even if individual entities fail

## 🔮 **Future Sync Enhancements**

### **Planned Features**
- **Real-time Updates**: WebSocket notifications for data changes
- **Incremental Sync**: Only sync changed data
- **Data Validation**: Enhanced data quality checks
- **Backup & Recovery**: Automated backup before sync
- **Performance Monitoring**: Sync metrics and alerting

### **Scaling Considerations**
- **Multiple API Sources**: Support for additional data providers
- **Distributed Sync**: Multiple sync processes
- **Data Partitioning**: Shard data across multiple databases
- **Cache Integration**: Redis caching for frequently accessed data

## 📞 **Support & Maintenance**

### **Regular Maintenance Tasks**
```bash
# Daily: Check sync logs
tail -f /home/ubuntu/yacht-api/logs/cron-sync.log

# Weekly: Verify data integrity
curl http://3.69.225.186:3000/api/yachts/debug/collection-info

# Monthly: Review sync performance
# Check cron job status and logs

# Quarterly: Rotate API keys
# Update Nausys API credentials
```

### **Monitoring & Alerting**
- **Sync Success**: Monitor successful sync operations
- **Error Tracking**: Log and alert on sync failures
- **Performance Metrics**: Track sync duration and data volume
- **Data Quality**: Monitor data completeness and accuracy

---

**Last Updated**: August 20, 2025  
**Sync Guide Version**: 3.0.0  
**Status**: ✅ **PRODUCTION READY - All features working including date filtering and location-based filtering**

---

**Remember**: Regular data synchronization ensures your yacht charter API always provides the most current and accurate information to your clients! The new automated sync system with conflict resolution and availability management makes this process seamless and reliable. 🚤✨

---

*This synchronization guide covers the complete data synchronization process for the Yacht Charter API, including automated sync, conflict resolution, and new availability features.*
