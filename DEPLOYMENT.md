# 🚢 Yacht Charter API - Deployment Guide

Complete deployment guide for the Yacht Charter API with automated data synchronization, advanced filtering, and yacht availability management.

## 🎯 **Current Status: PRODUCTION READY** ✅

- **🌐 Production Server**: `http://3.69.225.186:3000`
- **📚 API Documentation**: `http://3.69.225.186:3000/api-docs`
- **🚀 All Features Working**: Search, filtering, catalogue, automated sync, availability
- **🔧 Swagger Fixed**: No more YAML syntax errors
- **🧹 Production Cleaned**: Optimized production environment

## 🏗️ **Architecture Overview**

- **Backend**: Node.js 18+ with TypeScript
- **Framework**: Express.js with middleware
- **Database**: MongoDB 5+ with Mongoose ODM
- **API Documentation**: Swagger/OpenAPI 3.0
- **Data Sync**: Nausys API v6 integration
- **Deployment**: AWS EC2 with systemd service
- **Automation**: Cron jobs for daily sync
- **Features**: Advanced filtering, search, catalogue system, yacht availability, location-based filtering with multi-language support, journey-based filtering, free yachts filtering, comprehensive yacht specification filtering (toilets, length, year, berths, beam, premium status, sale status, fuel type), cabin charter API, and free cabin charter API

## 🚀 **Server Setup**

### **1. System Requirements**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB 5+
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### **2. Firewall Configuration**
```bash
# Allow SSH, HTTP, and API port
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 3000
sudo ufw enable
```

## 📦 **Application Deployment**

### **1. Clone Repository**
```bash
# Create application directory
mkdir -p /home/ubuntu/yacht-api
cd /home/ubuntu/yacht-api

# Clone repository (replace with your repo URL)
git clone <your-repository-url> .
```

### **2. Install Dependencies**
```bash
# Install Node.js dependencies
npm install

# Install PM2 globally (optional, for process management)
sudo npm install -g pm2
```

### **3. Environment Configuration**
```bash
# Create environment file
cp env.template .env

# Edit environment variables
nano .env
```

**Required Environment Variables:**
```bash
# Database
MONGODB_URI=mongodb://localhost:27017/yacht-api

# Nausys API
NAUSYS_API_URL=https://api.nausys.com/v6
NAUSYS_API_KEY=your_api_key

# Server
PORT=3000
NODE_ENV=production
```

### **4. Build Application**
```bash
# Build TypeScript to JavaScript
npm run build

# Verify build output
ls -la dist/
```

## 🔧 **Service Configuration**

### **1. Create Systemd Service**
```bash
sudo nano /etc/systemd/system/yacht-api.service
```

**Service Configuration:**
```ini
[Unit]
Description=Yacht Charter API
After=network.target mongod.service

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
```

### **2. Enable and Start Service**
```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable service
sudo systemctl enable yacht-api

# Start service
sudo systemctl start yacht-api

# Check status
sudo systemctl status yacht-api
```

## 🔄 **Automated Data Synchronization**

### **1. Create Sync Script**
```bash
# Create sync script
cat > /home/ubuntu/yacht-api/scripts/sync.sh << 'EOF'
#!/bin/bash
cd /home/ubuntu/yacht-api
export NODE_ENV=production
node dist/scripts/sync.js >> logs/cron-sync.log 2>&1
EOF

# Make executable
chmod +x /home/ubuntu/yacht-api/scripts/sync.sh
```

### **2. Setup Cron Job**
```bash
# Edit crontab
crontab -e

# Add this line for daily sync at 2:00 AM UTC
0 2 * * * /home/ubuntu/yacht-api/scripts/sync.sh
```

### **3. Verify Sync Setup**
```bash
# Check cron jobs
crontab -l

# Test sync manually
/home/ubuntu/yacht-api/scripts/sync.sh

# Check sync logs
tail -f /home/ubuntu/yacht-api/logs/cron-sync.log
```

## 🌐 **Nginx Configuration (Optional)**

### **1. Install Nginx**
```bash
sudo apt install nginx
```

### **2. Configure Reverse Proxy**
```bash
sudo nano /etc/nginx/sites-available/yacht-api
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### **3. Enable Site**
```bash
# Create symlink
sudo ln -s /etc/nginx/sites-available/yacht-api /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

## 🧪 **Testing & Verification**

### **1. Test Basic Endpoints**
```bash
# Test server health
curl http://localhost:3000/api/yachts?limit=1

# Test catalogue endpoints
curl http://localhost:3000/api/catalogue/filters/active

# Test debug endpoints
curl http://localhost:3000/api/yachts/debug/collection-info
```

### **2. Test Advanced Features**
```bash
# Test search with filters
curl "http://localhost:3000/api/yachts?q=Blue&minCabins=5&maxCabins=8&limit=5"

# Test date-based availability filtering
curl "http://localhost:3000/api/yachts?minCabins=5&maxCabins=8&startDate=2025-01-15&endDate=2025-01-25&limit=5"

# Test location-based filtering
curl "http://localhost:3000/api/yachts?country=Croatia&limit=5"
curl "http://localhost:3000/api/yachts?country=Hrvatska&limit=5"
curl "http://localhost:3000/api/yachts?region=Zadar&limit=5"
curl "http://localhost:3000/api/yachts?location=Zadar&limit=5"
curl "http://localhost:3000/api/yachts?country=Croatia&region=Zadar&limit=5"

# Test catalogue endpoints
curl "http://localhost:3000/api/catalogue/countries?limit=5"
curl "http://localhost:3000/api/catalogue/regions?limit=5"
curl "http://localhost:3000/api/catalogue/locations?limit=5"

# Test individual yacht availability
curl "http://localhost:3000/api/yachts/479287/availability?startDate=2025-01-15&endDate=2025-01-25"

# Test calendar view
curl "http://localhost:3000/api/yachts/479287/calendar?year=2025&month=1"

# Test bulk availability
curl "http://localhost:3000/api/yachts/bulk-availability?yachtIds=479287,479288&startDate=2025-01-15&endDate=2025-01-25"

# Test cabin charter endpoints
curl "http://localhost:3000/api/cabin-charters/bases?limit=5"
curl "http://localhost:3000/api/cabin-charters/companies?limit=5"
curl "http://localhost:3000/api/cabin-charters/filters"
curl "http://localhost:3000/api/cabin-charters/bases/102755"
curl "http://localhost:3000/api/cabin-charters/companies/102701"
curl "http://localhost:3000/api/cabin-charters/bases?companyId=102701&limit=3"
curl "http://localhost:3000/api/cabin-charters/companies?countryId=1&limit=3"

# Test free cabin charter endpoints
curl "http://localhost:3000/api/free-cabin-charter/packages?limit=5"
curl "http://localhost:3000/api/free-cabin-charter/comprehensive?limit=5"
curl "http://localhost:3000/api/free-cabin-charter/search-criteria"
curl "http://localhost:3000/api/free-cabin-charter/current-week"
curl "http://localhost:3000/api/free-cabin-charter/packages/46663196"
```

### **3. Test Swagger Documentation**
```bash
# Open in browser
http://localhost:3000/api-docs
```

## 📊 **Monitoring & Maintenance**

### **1. Service Management**
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

### **2. Database Management**
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

### **3. Sync Monitoring**
```bash
# Check cron job status
crontab -l

# View sync logs
tail -f /home/ubuntu/yacht-api/logs/cron-sync.log

# Manual sync
cd /home/ubuntu/yacht-api
npm run sync
```

## 🚨 **Troubleshooting**

### **Common Issues**

#### **Service Won't Start**
```bash
# Check service logs
sudo journalctl -u yacht-api -n 50

# Check application logs
tail -f /home/ubuntu/yacht-api/logs/app.log

# Verify environment variables
cat /home/ubuntu/yacht-api/.env
```

#### **API Returns Empty Data**
```bash
# Check if data sync has run
tail -f /home/ubuntu/yacht-api/logs/cron-sync.log

# Verify MongoDB connection
curl http://localhost:3000/api/yachts/debug/collection-info

# Check database collections
mongosh --eval "db.yachts.countDocuments()"
```

#### **Swagger Documentation Issues**
```bash
# Check if source files exist (they shouldn't in production)
ls -la /home/ubuntu/yacht-api/src/

# Restart service after removing source files
sudo systemctl restart yacht-api

# Verify API docs
curl http://localhost:3000/api-docs
```

#### **Sync Errors**
```bash
# Check Nausys API credentials
cat /home/ubuntu/yacht-api/.env | grep NAUSYS

# Test API connectivity
curl -H "Authorization: Bearer YOUR_API_KEY" https://api.nausys.com/v6/yachts

# Check sync logs
tail -f /home/ubuntu/yacht-api/logs/cron-sync.log
```

### **Performance Issues**
```bash
# Check system resources
htop

# Check MongoDB performance
mongosh --eval "db.currentOp()"

# Check application memory usage
ps aux | grep node
```

## 🔒 **Security Considerations**

### **1. Firewall Configuration**
```bash
# Only allow necessary ports
sudo ufw status

# Restrict SSH access to specific IPs
sudo ufw allow from YOUR_IP to any port ssh
```

### **2. Environment Security**
```bash
# Secure environment file
chmod 600 /home/ubuntu/yacht-api/.env

# Use strong API keys
# Rotate credentials regularly
```

### **3. Database Security**
```bash
# Enable MongoDB authentication
# Use strong passwords
# Restrict network access
```

## 📈 **Performance Optimization**

### **1. Database Indexing**
```bash
# Connect to MongoDB
mongosh

# Create indexes for common queries
db.yachts.createIndex({ "id": 1 })
db.yachts.createIndex({ "cabins": 1 })
db.yachts.createIndex({ "deposit": 1 })
db.reservations.createIndex({ "yachtId": 1, "periodFrom": 1, "periodTo": 1 })
```

### **2. Application Optimization**
```bash
# Use PM2 for process management
pm2 start dist/server.js --name yacht-api

# Enable clustering
pm2 start dist/server.js -i max --name yacht-api
```

## 🔮 **Future Enhancements**

### **Planned Features**
- **Real-time Updates**: WebSocket support
- **Advanced Analytics**: Business intelligence
- **Multi-tenant Support**: Organization separation
- **API Versioning**: Backward compatibility
- **Enhanced Security**: JWT authentication

### **Scaling Considerations**
- **Load Balancing**: Multiple instances
- **Database Sharding**: Horizontal scaling
- **Redis Caching**: Performance improvement
- **CDN Integration**: Static asset optimization

## 📞 **Support & Maintenance**

### **Regular Maintenance Tasks**
```bash
# Daily: Check sync logs
tail -f /home/ubuntu/yacht-api/logs/cron-sync.log

# Weekly: Check service status
sudo systemctl status yacht-api

# Monthly: Update system packages
sudo apt update && sudo apt upgrade -y

# Quarterly: Review and rotate API keys
```

### **Backup Strategy**
```bash
# Database backup
mongodump --db yacht-api --out /backup/$(date +%Y%m%d)

# Application backup
tar -czf /backup/yacht-api-$(date +%Y%m%d).tar.gz /home/ubuntu/yacht-api/
```

---

**Last Updated**: September 4, 2025  
**Deployment Guide Version**: 4.0.0  
**Status**: ✅ **PRODUCTION READY - All features working including date filtering, location-based filtering, cabin charter API, and free cabin charter API**

---

*This deployment guide covers the complete setup of the Yacht Charter API with automated data synchronization, advanced filtering, yacht availability management, and free cabin charter functionality.*
