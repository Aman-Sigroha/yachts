# 🚀 **Yacht API Deployment Overview**

## 📋 **Project Summary**

A comprehensive yacht charter management API built with Node.js/TypeScript, featuring advanced search, filtering, automated data synchronization, and production-ready deployment on AWS EC2.

## ✨ **Current Status: PRODUCTION READY** ✅

- **🌐 Production Server**: `http://3.69.225.186:3000`
- **📚 API Documentation**: `http://3.69.225.186:3000/api-docs`
- **🚀 All Features Working**: Search, filtering, catalogue, automated sync
- **🔧 Swagger Fixed**: No more YAML syntax errors
- **🧹 Production Cleaned**: Optimized production environment

## 🎯 **Key Features**

- 🚢 **Advanced Yacht Search**: Multi-parameter filtering and text search
- 🎛️ **Smart Catalogue System**: Active filters with yacht counts
- 🔄 **Automated Data Sync**: Daily synchronization with Nausys API v6
- 🌍 **Multi-language Support**: Text in EN, DE, FR, IT, ES, HR
- 🛡️ **Conflict Resolution**: Prevents duplicate key errors during sync
- 📚 **Complete API Docs**: Auto-generated Swagger/OpenAPI documentation
- 🔍 **Debug Endpoints**: Built-in troubleshooting and data inspection

## 🏗️ **Architecture**

- **Backend**: Node.js 18+ with TypeScript
- **Framework**: Express.js with REST API
- **Database**: MongoDB with Mongoose ODM
- **API Documentation**: Swagger/OpenAPI 3.0
- **Deployment**: AWS EC2 Ubuntu 24.04 LTS
- **Service Management**: systemd service
- **Automation**: Cron jobs for daily sync

## 🚀 **Deployment Process**

### **1. Server Setup**
- Ubuntu 24.04 LTS on AWS EC2
- Node.js 18+ and MongoDB 6.0
- UFW firewall configuration
- SSH key-based authentication

### **2. Application Deployment**
- Git clone and dependency installation
- Environment configuration
- TypeScript compilation
- systemd service creation

### **3. Service Configuration**
- `yacht-api.service` systemd service
- Port 3000 exposure
- Automatic restart on failure
- Production environment variables

### **4. Automated Sync Setup**
- Daily cron job at 2:00 AM UTC
- Conflict resolution for invoice data
- Comprehensive logging
- Zero-maintenance operation

## 🌐 **API Endpoints**

### **Yachts**
- `GET /api/yachts` - Advanced search with filtering and pagination
- `GET /api/yachts/search` - Search endpoint alias
- `GET /api/yachts/debug/collection-info` - Collection statistics
- `GET /api/yachts/debug/yacht/:id` - Specific yacht debugging

### **Catalogue & Filters**
- `GET /api/catalogue/filters` - All filter options
- `GET /api/catalogue/filters/active` - Only filters with yachts
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

### **Sync Benefits**
- ✅ **24/7 Data Freshness**: Automatically syncs every 24 hours
- ✅ **Server Independent**: Runs even when your laptop is off
- ✅ **Conflict Resolution**: Automatically cleans up invoice data before each sync
- ✅ **Comprehensive Logging**: All sync activity logged
- ✅ **Zero Maintenance**: Fully automated after setup

## 🏗️ **Server File Structure**

```
/home/ubuntu/yacht-api/
├── .env                    # Environment variables
├── dist/                   # Compiled JavaScript (production code)
├── logs/                   # Application and sync logs
│   └── cron-sync.log      # Automated sync logs
├── node_modules/           # Dependencies
├── package.json            # Project configuration
├── scripts/                # Sync and utility scripts
│   └── sync.sh            # Automated sync script
└── test-server.js          # Test server (can be removed)
```

## 🧪 **Testing Your Deployed API**

### **Health Check**
```bash
curl http://3.69.225.186:3000/api-docs
```

### **Test Yacht Search**
```bash
# Search for catamarans
curl "http://3.69.225.186:3000/api/yachts?q=catamaran&minCabins=3"

# Get active filters
curl "http://3.69.225.186:3000/api/catalogue/filters/active"

# Test pagination
curl "http://3.69.225.186:3000/api/yachts?page=1&limit=10"
```

### **Test Catalogue Endpoints**
```bash
# All categories
curl "http://3.69.225.186:3000/api/catalogue/categories"

# Active categories only
curl "http://3.69.225.186:3000/api/catalogue/categories/active"

# All builders
curl "http://3.69.225.186:3000/api/catalogue/builders"
```

## 📊 **Data Statistics**

### **Current Data Status**
- **Yachts**: Available with advanced search and filtering
- **Categories**: Active categories with yacht counts
- **Builders**: Active builders with yacht counts
- **Bases**: Active bases with yacht counts
- **Charter Companies**: Active companies with yacht counts
- **Automated Sync**: Daily updates at 2:00 AM UTC

### **Sample Yacht Data**
- **Total Yachts**: Available in database
- **Categories**: Sailing yachts, motor yachts, catamarans
- **Cabins Range**: 2-8 cabins
- **Draft Range**: Various measurements
- **Engine Power**: Different power ranges
- **Deposit Range**: Various deposit amounts

### **Active Filter Response Example**
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
  }
}
```

## 🔧 **Maintenance Commands**

### **Service Management**
```bash
# Check service status
sudo systemctl status yacht-api

# Restart service
sudo systemctl restart yacht-api

# View logs
sudo journalctl -u yacht-api -f
```

### **Sync Monitoring**
```bash
# Check cron job status
crontab -l

# View sync logs
tail -f /home/ubuntu/yacht-api/logs/cron-sync.log

# Manual sync
cd /home/ubuntu/yacht-api && npm run sync
```

### **Deploy Updates**
```bash
# From your local machine
npm run build
scp -i nautio.pem -r dist/ ubuntu@3.69.225.186:/home/ubuntu/yacht-api/
ssh -i nautio.pem ubuntu@3.69.225.186 "sudo systemctl restart yacht-api"
```

## 🚨 **Troubleshooting**

### **Common Issues**

#### **Service Won't Start**
```bash
# Check service status
sudo systemctl status yacht-api

# Check logs
sudo journalctl -u yacht-api -n 50

# Verify environment variables
cat /home/ubuntu/yacht-api/.env
```

#### **API Returns Empty Data**
```bash
# Check if data sync has run
tail -f /home/ubuntu/yacht-api/logs/cron-sync.log

# Use debug endpoints
curl "http://3.69.225.186:3000/api/yachts/debug/collection-info"
```

#### **Swagger Documentation Issues**
- ✅ **RESOLVED**: YAML syntax errors fixed
- ✅ **RESOLVED**: Production API docs working
- ✅ **RESOLVED**: Source files cleaned up

### **Debug Endpoints**
- `GET /api/yachts/debug/collection-info` - Collection statistics
- `GET /api/yachts/debug/yacht/:id` - Specific yacht debugging

## 📈 **Performance & Monitoring**

### **System Resources**
```bash
# CPU and memory usage
htop

# Disk usage
df -h

# Process status
ps aux | grep node
```

### **API Performance**
```bash
# Response times
curl -w "@curl-format.txt" -o /dev/null -s "http://3.69.225.186:3000/api/yachts"

# Load testing
ab -n 100 -c 10 http://3.69.225.186:3000/api/yachts
```

## 🔒 **Security Features**

- **Firewall**: UFW with only necessary ports (22, 3000)
- **SSH**: Key-based authentication only
- **Environment Variables**: Sensitive data in `.env` file
- **Service Isolation**: systemd service with proper user permissions
- **Log Monitoring**: Comprehensive logging for security events

## 🎯 **Immediate Improvements**

- ✅ **Swagger YAML syntax errors fixed**
- ✅ **Production API documentation working**
- ✅ **Source files cleaned up from production**
- ✅ **Advanced yacht search and filtering implemented**
- ✅ **Active catalogue system with yacht counts**
- ✅ **Automated daily sync with conflict resolution**
- ✅ **Debug endpoints for troubleshooting**
- ✅ **Production environment optimized**

## 🚀 **Future Enhancements**

- **Load Balancing**: Multiple instances behind ALB/ELB
- **Database Scaling**: MongoDB Atlas for managed database
- **Caching**: Redis for API response caching
- **CDN**: CloudFront for static assets
- **Monitoring**: CloudWatch for metrics and alerts
- **SSL/TLS**: HTTPS encryption
- **API Rate Limiting**: Enhanced request throttling

## 📞 **Support & Documentation**

- **API Documentation**: `http://3.69.225.186:3000/api-docs`
- **Service Status**: Check with `sudo systemctl status yacht-api`
- **Sync Logs**: `/home/ubuntu/yacht-api/logs/cron-sync.log`
- **System Logs**: `sudo journalctl -u yacht-api`

---

**Deployment Complete!** 🎉

Your Yacht Charter API is now running in production with:
- ✅ **Advanced search and filtering**
- ✅ **Automated data synchronization**
- ✅ **Complete API documentation**
- ✅ **Production-optimized environment**
- ✅ **24/7 availability**

**Last updated**: August 14, 2025  
**Deployment Version**: 3.0.0  
**Status**: ✅ **PRODUCTION READY - All features working**
