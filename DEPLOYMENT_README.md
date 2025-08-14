# 🚤 Yacht Charter API - Deployment Guide

## 📋 **Project Overview**

**Yaacht V3** is a robust Node.js/TypeScript backend service that synchronizes yacht charter data from the **Nausys API (v6)** into **MongoDB** and exposes a comprehensive **REST API** for querying yachts, reservations, invoices, and contacts. Built with enterprise-grade features including rate limiting, centralized logging, and auto-generated API documentation.

## 🌐 **Live API Information**

### **Production Server Details**
- **Domain**: yatch.nautio.net
- **IP Address**: 3.69.225.186
- **Server Type**: AWS EC2 (Ubuntu)
- **SSH User**: ubuntu
- **PEM File**: nautio.pem

### **API Access URLs**
- **Base API**: http://yatch.nautio.net:3000
- **API Documentation**: http://yatch.nautio.net:3000/api-docs
- **Direct IP Access**: http://3.69.225.186:3000

## 🏗️ **Architecture**

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
                       │   (Any Device)  │
                       └─────────────────┘
```

## 🚀 **Deployment Status**

### **✅ Current Status: PRODUCTION READY**
- **Server**: ✅ Running 24/7
- **API**: ✅ Fully functional with working yacht search
- **MongoDB**: ✅ Connected and operational
- **Data**: ✅ 98 yachts synced from Nausys
- **External Access**: ✅ Available worldwide
- **Security**: ✅ Port 3000 open in AWS
- **Automated Sync**: ✅ Daily sync at 2 AM UTC
- **Invoice Cleanup**: ✅ Automatic conflict resolution

## 🔧 **Technical Stack**

### **Runtime & Framework**
- **Node.js**: 18.20.8
- **TypeScript**: 5.9.2
- **Express.js**: 5.1.0
- **Runtime**: Production (NODE_ENV=production)

### **Database**
- **MongoDB**: 7.0.22 (Community Edition)
- **Database Name**: yaacht
- **Connection**: Local instance on server
- **Data**: Synced from Nausys API

### **Dependencies**
- **Core**: Express, Mongoose, CORS
- **Logging**: Winston
- **Documentation**: Swagger/OpenAPI
- **Security**: Rate limiting, CORS
- **Sync**: Axios for Nausys API integration

## 📁 **Server File Structure**

```
/home/ubuntu/yacht-api/
├── dist/                    # Compiled JavaScript files
│   ├── server.js           # Main server file
│   ├── models/             # Database models
│   ├── routes/             # API endpoints
│   ├── services/           # Business logic
│   └── scripts/            # Sync scripts
├── package.json            # Dependencies
├── package-lock.json       # Locked versions
├── .env                    # Environment configuration
└── logs/                   # Sync and application logs
    └── cron-sync.log       # Automated sync logs
```

## 🔑 **Environment Configuration**

### **Server Environment Variables**
```bash
# Server Configuration
PORT=3000
NODE_ENV=production

# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/yaacht

# Nausys API Credentials
NAUSYS_USERNAME=rest384@TTTTT
NAUSYS_PASSWORD=1M87j14h

# Optional Settings
LOG_LEVEL=info
CORS_ORIGIN=*
```

## 🚀 **Deployment Process (Completed)**

### **Step 1: Server Setup**
```bash
# SSH into server
ssh -i nautio.pem ubuntu@3.69.225.186

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB 7.0
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo 'deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse' | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update && sudo apt install -y mongodb-org

# Start MongoDB service
sudo systemctl start mongod
sudo systemctl enable mongod
```

### **Step 2: Application Deployment**
```bash
# Create application directory
mkdir -p /home/ubuntu/yacht-api

# Copy application files (from local machine)
scp -i nautio.pem package.json package-lock.json ubuntu@3.69.225.186:/home/ubuntu/yacht-api/
scp -i nautio.pem -r dist/ ubuntu@3.69.225.186:/home/ubuntu/yacht-api/
scp -i nautio.pem env.template ubuntu@3.69.225.186:/home/ubuntu/yacht-api/.env

# Install dependencies
cd /home/ubuntu/yacht-api
npm install --production
```

### **Step 3: Service Configuration**
```bash
# Create systemd service file
sudo tee /etc/systemd/system/yacht-api.service > /dev/null << EOF
[Unit]
Description=Yacht Charter API
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/yacht-api
ExecStart=/usr/bin/node dist/server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
EOF

# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable yacht-api
sudo systemctl start yacht-api
```

### **Step 4: Data Synchronization**
```bash
# Sync data from Nausys API
cd /home/ubuntu/yacht-api
node dist/scripts/sync.js
```

### **Step 5: Automated Sync Setup**
```bash
# Create logs directory
mkdir -p logs

# Add cron job for daily sync at 2 AM UTC
(crontab -l 2>/dev/null; echo "0 2 * * * cd /home/ubuntu/yacht-api && node dist/scripts/sync.js >> logs/cron-sync.log 2>&1") | crontab -

# Verify cron job is set
crontab -l
```

## 🌐 **API Endpoints**

### **Core Endpoints**
| **Endpoint** | **Method** | **Description** | **Status** |
|--------------|------------|-----------------|------------|
| `/api/yachts` | GET | Get all yachts with advanced filtering & search | ✅ Working |
| `/api/yachts/search` | GET | Advanced search endpoint (alias) | ✅ Working |
| `/api/yachts/:id` | GET | Get yacht by ID | ✅ Working |
| `/api/reservations` | GET | Get all reservations | ✅ Working |
| `/api/invoices` | GET | Get all invoices | ✅ Working |
| `/api/contacts` | GET | Get all contacts | ✅ Working |
| `/api-docs` | GET | Swagger API documentation | ✅ Working |

### **New Catalogue & Filter Endpoints**
| **Endpoint** | **Method** | **Description** | **Status** |
|--------------|------------|-----------------|------------|
| `/api/catalogue/filters` | GET | All filter options with yacht counts | ✅ Working |
| `/api/catalogue/filters/active` | GET | Only active filters (with yachts) | ✅ Working |
| `/api/catalogue/categories/active` | GET | Active categories with yacht counts | ✅ Working |
| `/api/catalogue/builders/active` | GET | Active builders with yacht counts | ✅ Working |
| `/api/catalogue/bases/active` | GET | Active bases with yacht counts | ✅ Working |
| `/api/catalogue/charter-companies/active` | GET | Active companies with yacht counts | ✅ Working |

### **Debug Endpoints**
| **Endpoint** | **Method** | **Description** | **Status** |
|--------------|------------|-----------------|------------|
| `/api/yachts/debug/collection-info` | GET | Collection statistics and sample data | ✅ Working |
| `/api/yachts/debug/yacht/:id` | GET | Debug specific yacht retrieval | ✅ Working |

### **Query Parameters**
| **Parameter** | **Type** | **Description** | **Example** |
|---------------|----------|-----------------|-------------|
| `q` | string | Text search in yacht names and highlights | `?q=Blue` |
| `page` | number | Page number for pagination | `?page=1` |
| `limit` | number | Items per page | `?limit=10` |
| `minCabins` | number | Minimum number of cabins | `?minCabins=5` |
| `maxCabins` | number | Maximum number of cabins | `?maxCabins=8` |
| `minDraft` | number | Minimum draft measurement | `?minDraft=1.0` |
| `maxDraft` | number | Maximum draft measurement | `?maxDraft=2.0` |
| `minEnginePower` | number | Minimum engine power | `?minEnginePower=100` |
| `maxEnginePower` | number | Maximum engine power | `?maxEnginePower=500` |
| `minDeposit` | number | Minimum deposit amount | `?minDeposit=1000` |
| `maxDeposit` | number | Maximum deposit amount | `?maxDeposit=5000` |
| `category` | number | Yacht category ID | `?category=101` |
| `builder` | number | Yacht builder ID | `?builder=100241` |
| `base` | number | Charter base ID | `?base=102751` |
| `charterCompany` | number | Charter company ID | `?charterCompany=102701` |
| `sortBy` | string | Sort field (name, cabins, draft, enginePower, deposit) | `?sortBy=cabins` |
| `sortOrder` | string | Sort order (asc, desc) | `?sortOrder=desc` |

## 📊 **Data Statistics**

### **Current Database Status**
- **Total Yachts**: 98
- **Total Reservations**: Available
- **Total Invoices**: Available
- **Total Contacts**: Available
- **Last Sync**: 2025-08-11 14:27:59 UTC
- **Automated Sync**: ✅ Daily at 2 AM UTC

### **Sample Yacht Data**
```json
{
  "success": true,
  "data": [
    {
      "id": 479287,
      "name": {
        "textEN": "Maria's Pleasure",
        "textDE": "Maria's Pleasure",
        "textFR": "Maria's Pleasure",
        "textIT": "Maria's Pleasure",
        "textES": "Maria's Pleasure",
        "textHR": "Maria's Pleasure"
      },
      "cabins": 6,
      "wc": 2,
      "draft": 0.95,
      "enginePower": 18,
      "deposit": 1825,
      "baseId": 102751,
      "charterCompanyId": 102701,
      "highlights": {
        "textEN": "ana banana test evo baby blue boja",
        "textDE": "ana banana test evo baby blue boja"
      }
    }
  ],
  "pagination": {
    "total": 98,
    "page": 1,
    "pages": 5
  },
  "filters": {},
  "search": null
}
```

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
  },
  "summary": {
    "totalCategories": 15,
    "totalYachts": 98
  }
}
```

## 🔒 **Security & Access**

### **AWS Security Group Configuration**
- **Port 3000**: Open for HTTP API access
- **Port 22**: Open for SSH access
- **Port 27017**: MongoDB (internal only)

### **Access Control**
- **API**: Public access (no authentication required)
- **SSH**: Restricted to PEM key holders
- **Database**: Local access only

## 📱 **Testing & Usage**

### **Testing Tools**
1. **Web Browser**: Visit API endpoints directly
2. **Postman**: Import collection for API testing
3. **cURL**: Command-line testing
4. **Mobile Apps**: HTTP client apps

### **Sample Test Requests**
```bash
# Get all yachts
curl http://yatch.nautio.net:3000/api/yachts

# Search by yacht name
curl "http://yatch.nautio.net:3000/api/yachts?q=Blue"

# Filter by cabins and sort
curl "http://yatch.nautio.net:3000/api/yachts?minCabins=4&maxCabins=8&sortBy=cabins&sortOrder=desc"

# Get active filters
curl http://yatch.nautio.net:3000/api/catalogue/filters/active

# Get specific catalogue data
curl http://yatch.nautio.net:3000/api/catalogue/categories/active

# Debug collection info
curl http://yatch.nautio.net:3000/api/yachts/debug/collection-info
```

### **Working Search Examples**
```bash
# ✅ These searches work (actual yacht names)
curl "http://yatch.nautio.net:3000/api/yachts?q=Blue"      # Returns 2 yachts
curl "http://yatch.nautio.net:3000/api/yachts?q=Maria"     # Returns 1 yacht
curl "http://yatch.nautio.net:3000/api/yachts?q=Dream"     # Returns 1 yacht

# ❌ These searches return empty (generic terms not in yacht names)
curl "http://yatch.nautio.net:3000/api/yachts?q=yacht"     # Returns empty
curl "http://yatch.nautio.net:3000/api/yachts?q=catamaran" # Returns empty
```

## 🚨 **Monitoring & Maintenance**

### **Service Management**
```bash
# Check service status
sudo systemctl status yacht-api

# View logs
sudo journalctl -u yacht-api -f

# Restart service
sudo systemctl restart yacht-api

# Stop service
sudo systemctl stop yacht-api
```

### **Database Management**
```bash
# Connect to MongoDB
mongosh yaacht

# Check collections
show collections

# Count documents
db.yachts.countDocuments()
db.reservations.countDocuments()
db.invoices.countDocuments()
db.contacts.countDocuments()
```

### **Log Files**
- **Service Logs**: `sudo journalctl -u yacht-api`
- **Application Logs**: `/home/ubuntu/yacht-api/logs/`
- **Sync Logs**: `/home/ubuntu/yacht-api/logs/cron-sync.log`
- **MongoDB Logs**: `/var/log/mongodb/`

## 🔄 **Data Synchronization**

### **Automated Sync (Production)**
```bash
# Check cron job status
crontab -l

# View sync logs
tail -f logs/cron-sync.log

# Manual sync test
node dist/scripts/sync.js
```

### **Sync Process**
1. **Clean invoice collection** to prevent conflicts
2. **Fetch data** from Nausys API
3. **Transform data** to local format
4. **Update MongoDB** collections
5. **Log sync results** to `logs/cron-sync.log`

### **Sync Benefits**
- ✅ **24/7 Data Freshness**: Automatically syncs every 24 hours
- ✅ **Server Independent**: Runs even when your laptop is off
- ✅ **Conflict Resolution**: Automatically cleans up invoice data before each sync
- ✅ **Comprehensive Logging**: All sync activity logged
- ✅ **Zero Maintenance**: Fully automated after setup

## 🎯 **Key Features**

### **Smart Yacht Search**
- **Text Search**: Searches yacht names and highlights in multiple languages
- **Field Validation**: Only uses fields that actually exist in your database
- **Performance**: Optimized queries with proper indexing

### **Active Filter System**
- **Frontend Optimized**: Only shows filter options with available yachts
- **Real-time Counts**: Each filter shows how many yachts it contains
- **Eliminates Empty Results**: Users never see filter options that return no yachts

### **Multi-language Support**
- **6 Languages**: English, German, French, Italian, Spanish, Croatian
- **Consistent Structure**: All text fields follow the same multilingual pattern
- **Search Ready**: Text search works across all language variants

## 🎯 **Next Steps & Enhancements**

### **Immediate Improvements**
- [x] Set up automated daily sync ✅
- [x] Working yacht search and filtering ✅
- [x] Active catalogue filters ✅
- [x] Invoice conflict resolution ✅
- [ ] Configure MongoDB backups
- [ ] Add API authentication
- [ ] Set up monitoring alerts

### **Future Features**
- [ ] HTTPS/SSL certificate
- [ ] Load balancing
- [ ] Database clustering
- [ ] API rate limiting per user
- [ ] Advanced analytics dashboard
- [ ] Real-time notifications

## 📞 **Support & Contact**

### **Server Access**
- **SSH**: `ssh -i nautio.pem ubuntu@3.69.225.186`
- **Server Owner**: Contact for AWS console access

### **API Support**
- **Documentation**: http://yatch.nautio.net:3000/api-docs
- **Health Check**: http://yatch.nautio.net:3000/api/yachts
- **Debug Info**: http://yatch.nautio.net:3000/api/yachts/debug/collection-info

## 🚨 **Troubleshooting**

### **Common Issues**

1. **Yacht API Returns Empty Data**
   ```bash
   # Check if data exists
   curl http://localhost:3000/api/yachts/debug/collection-info
   
   # Search for actual yacht names (not generic terms)
   curl "http://localhost:3000/api/yachts?q=Blue"      # ✅ Works
   curl "http://localhost:3000/api/yachts?q=yacht"     # ❌ No yachts named "yacht"
   
   # Get all yachts without filters
   curl http://localhost:3000/api/yachts
   ```

2. **Automated Sync Issues**
   ```bash
   # Check cron job status
   crontab -l
   
   # Check sync logs
   tail -f logs/cron-sync.log
   
   # Manual sync test
   node dist/scripts/sync.js
   ```

3. **Service Issues**
   ```bash
   # Check service status
   sudo systemctl status yacht-api
   
   # View service logs
   sudo journalctl -u yacht-api -f
   
   # Restart service
   sudo systemctl restart yacht-api
   ```

## 🎉 **Deployment Complete!**

Your yacht charter API is now:
- ✅ **Running 24/7** on production server
- ✅ **Accessible worldwide** from any device
- ✅ **Fully functional** with working yacht search and filtering
- ✅ **Production-ready** for client applications
- ✅ **Automated sync** running daily
- ✅ **Smart filters** that only show relevant options
- ✅ **Multi-language support** for international clients

**The API is ready for production use and can handle real yacht charter operations with advanced search, filtering, and catalogue management!** 🚤✨

---

*Last Updated: August 2025*
*Deployment Version: 3.0.0*
*Status: PRODUCTION READY with Advanced Features*
