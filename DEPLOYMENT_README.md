# 🚤 Yacht Charter API - Deployment Guide

## 📋 **Project Overview**

**Yaacht V3** is a robust Node.js/TypeScript backend service that synchronizes yacht charter data from the **Nausys API (v6)** into **MongoDB** and exposes a comprehensive **REST API** for querying yachts, reservations, invoices, and contacts.

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
- **API**: ✅ Fully functional
- **MongoDB**: ✅ Connected and operational
- **Data**: ✅ 98 yachts synced from Nausys
- **External Access**: ✅ Available worldwide
- **Security**: ✅ Port 3000 open in AWS

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
└── .env                    # Environment configuration
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

## 🌐 **API Endpoints**

### **Core Endpoints**
| **Endpoint** | **Method** | **Description** | **Status** |
|--------------|------------|-----------------|------------|
| `/api/yachts` | GET | Get all yachts with pagination | ✅ Working |
| `/api/reservations` | GET | Get all reservations | ✅ Working |
| `/api/invoices` | GET | Get all invoices | ✅ Working |
| `/api/contacts` | GET | Get all contacts | ✅ Working |
| `/api-docs` | GET | Swagger API documentation | ✅ Working |

### **Query Parameters**
| **Parameter** | **Type** | **Description** | **Example** |
|---------------|----------|-----------------|-------------|
| `page` | number | Page number for pagination | `?page=1` |
| `limit` | number | Items per page | `?limit=10` |
| `minCabins` | number | Minimum number of cabins | `?minCabins=5` |
| `maxCabins` | number | Maximum number of cabins | `?maxCabins=8` |
| `category` | number | Yacht category ID | `?category=101` |
| `builder` | number | Yacht builder ID | `?builder=100241` |

## 📊 **Data Statistics**

### **Current Database Status**
- **Total Yachts**: 98
- **Total Reservations**: Available
- **Total Invoices**: Available
- **Total Contacts**: Available
- **Last Sync**: 2025-08-11 14:27:59 UTC

### **Sample Yacht Data**
```json
{
  "success": true,
  "data": [
    {
      "id": 3355085,
      "name": {
        "textEN": "Kaja",
        "textDE": "Kaja",
        "textFR": "Kaja",
        "textIT": "Kaja",
        "textES": "Kaja",
        "textHR": "Kaja"
      },
      "cabins": 4,
      "wc": 4,
      "draft": 1.95,
      "enginePower": 1850,
      "fuelType": "DIESEL",
      "deposit": 1820,
      "crewCount": 2
    }
  ],
  "pagination": {
    "total": 98,
    "page": 1,
    "pages": 10
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

# Get yachts with pagination
curl "http://yatch.nautio.net:3000/api/yachts?page=1&limit=5"

# Filter by cabins
curl "http://yatch.nautio.net:3000/api/yachts?minCabins=5"

# Get API documentation
curl http://yatch.nautio.net:3000/api-docs
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
- **MongoDB Logs**: `/var/log/mongodb/`

## 🔄 **Data Synchronization**

### **Manual Sync**
```bash
# SSH into server
ssh -i nautio.pem ubuntu@3.69.225.186

# Run sync script
cd /home/ubuntu/yacht-api
node dist/scripts/sync.js
```

### **Sync Process**
1. **Fetch data** from Nausys API
2. **Transform data** to local format
3. **Update MongoDB** collections
4. **Log sync results**

## 🎯 **Next Steps & Enhancements**

### **Immediate Improvements**
- [ ] Set up automated daily sync
- [ ] Configure MongoDB backups
- [ ] Add API authentication
- [ ] Set up monitoring alerts

### **Future Features**
- [ ] HTTPS/SSL certificate
- [ ] Load balancing
- [ ] Database clustering
- [ ] API rate limiting per user

## 📞 **Support & Contact**

### **Server Access**
- **SSH**: `ssh -i nautio.pem ubuntu@3.69.225.186`
- **Server Owner**: Contact for AWS console access

### **API Support**
- **Documentation**: http://yatch.nautio.net:3000/api-docs
- **Health Check**: http://yatch.nautio.net:3000/api/yachts

## 🎉 **Deployment Complete!**

Your yacht charter API is now:
- ✅ **Running 24/7** on production server
- ✅ **Accessible worldwide** from any device
- ✅ **Fully functional** with real data
- ✅ **Production-ready** for client applications

**The API is ready for production use and can handle real yacht charter operations!** 🚤✨

---

*Last Updated: 2025-08-11*
*Deployment Version: 1.0.0*
*Status: PRODUCTION READY*
