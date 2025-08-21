# 🚀 Manual Production Deployment Guide

## 🎯 **Current Status: READY FOR PRODUCTION** ✅

Your yacht API is fully built and ready for production deployment with all new features:
- ✅ **38 yacht filter parameters** implemented
- ✅ **Free yachts functionality** working
- ✅ **Journey-based filtering** implemented
- ✅ **Comprehensive yacht specification filtering** (toilets, length, year, berths, beam, premium, sale, fuel)
- ✅ **Location-based filtering** with multi-language support
- ✅ **Date-based availability filtering**
- ✅ **Complete API documentation** (Swagger)
- ✅ **All README files updated**

## 🌐 **Production Server Details**

- **Server IP**: `3.69.225.186`
- **Domain**: `yatch.nautio.net`
- **Port**: `3000`
- **API URL**: `http://3.69.225.186:3000`
- **API Docs**: `http://3.69.225.186:3000/api-docs`

## 📦 **Step 1: Prepare Local Build**

Your application is already built! The `dist/` folder contains the production-ready JavaScript code.

## 🔑 **Step 2: Server Access**

You need SSH access to your production server. You have two options:

### **Option A: Use PEM File (Recommended)**
1. Download your `nautio.pem` file from your AWS console
2. Place it in the project root directory
3. Run the automated deployment script:
   ```powershell
   .\deploy.ps1
   ```

### **Option B: Manual Deployment**
If you don't have the PEM file, follow the manual steps below.

## 🖥️ **Step 3: Manual Server Setup**

### **3.1 SSH to Your Server**
```bash
# If you have the PEM file:
ssh -i nautio.pem ubuntu@3.69.225.186

# If you have password access:
ssh ubuntu@3.69.225.186
```

### **3.2 Create Application Directory**
```bash
mkdir -p /home/ubuntu/yacht-api
cd /home/ubuntu/yacht-api
```

### **3.3 Upload Your Application**
From your local machine, use SCP to upload files:

```bash
# Upload package files
scp package.json package-lock.json ubuntu@3.69.225.186:/home/ubuntu/yacht-api/

# Upload built application
scp -r dist/ ubuntu@3.69.225.186:/home/ubuntu/yacht-api/

# Upload environment file
scp server.env ubuntu@3.ubuntu@3.69.225.186:/home/ubuntu/yacht-api/.env
```

### **3.4 Install Dependencies**
```bash
# On the server
cd /home/ubuntu/yacht-api
npm install --production
```

### **3.5 Create Systemd Service**
```bash
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
```

### **3.6 Enable and Start Service**
```bash
sudo systemctl daemon-reload
sudo systemctl enable yacht-api
sudo systemctl start yacht-api
```

### **3.7 Check Service Status**
```bash
sudo systemctl status yacht-api
```

## 🔧 **Step 4: Environment Configuration**

### **4.1 Edit Environment File**
```bash
nano /home/ubuntu/yacht-api/.env
```

**Required Configuration:**
```bash
# Server Configuration
PORT=3000
NODE_ENV=production

# MongoDB Connection - USE YOUR PRODUCTION MONGODB URI
MONGO_URI=mongodb://localhost:27017/yaacht
# OR MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/yaacht

# Nausys API Credentials
NAUSYS_USERNAME=rest384@TTTTT
NAUSYS_PASSWORD=1M87j14h

# Optional: Crew sync security code
NAUSYS_CREW_SECURITY_CODE=your-actual-security-code

# Optional: Logging level
LOG_LEVEL=info

# Optional: CORS settings
CORS_ORIGIN=*
```

### **4.2 Restart Service After Changes**
```bash
sudo systemctl restart yacht-api
```

## 📊 **Step 5: Verification**

### **5.1 Check Service Status**
```bash
sudo systemctl status yacht-api
```

### **5.2 Check Logs**
```bash
sudo journalctl -u yacht-api -f
```

### **5.3 Test API Endpoints**
```bash
# Test basic endpoint
curl http://localhost:3000/api/yachts?limit=1

# Test new filters
curl "http://localhost:3000/api/yachts?minLength=10&maxLength=20&minToilets=2&limit=1"

# Test free yachts
curl "http://localhost:3000/api/yachts?free=true&startDate=2025-09-20&endDate=2025-09-27&limit=1"

# Test catalogue filters
curl http://localhost:3000/api/catalogue/filters
```

### **5.4 Test API Documentation**
```bash
# Check Swagger UI
curl http://localhost:3000/api-docs
```

## 🚀 **Step 6: Production Features**

### **6.1 Automated Data Sync**
Set up daily synchronization:
```bash
# Create sync script
sudo tee /home/ubuntu/yacht-api/scripts/sync.sh > /dev/null << EOF
#!/bin/bash
cd /home/ubuntu/yacht-api
npm run sync >> logs/cron-sync.log 2>&1
EOF

# Make executable
chmod +x /home/ubuntu/yacht-api/scripts/sync.sh

# Create logs directory
mkdir -p /home/ubuntu/yacht-api/logs

# Add to crontab (daily at 2:00 AM UTC)
(crontab -l 2>/dev/null; echo "0 2 * * * /home/ubuntu/yacht-api/scripts/sync.sh") | crontab -
```

### **6.2 Firewall Configuration**
```bash
# Allow API port
sudo ufw allow 3000

# Check firewall status
sudo ufw status
```

## 🔍 **Step 7: Troubleshooting**

### **7.1 Common Issues**

**Service won't start:**
```bash
# Check logs
sudo journalctl -u yacht-api -n 50

# Check environment file
cat /home/ubuntu/yacht-api/.env

# Check file permissions
ls -la /home/ubuntu/yacht-api/
```

**Port already in use:**
```bash
# Check what's using port 3000
sudo netstat -tlnp | grep :3000

# Kill existing process if needed
sudo pkill -f "node dist/server.js"
```

**MongoDB connection issues:**
```bash
# Test MongoDB connection
mongosh "mongodb://localhost:27017/yaacht"

# Check MongoDB service
sudo systemctl status mongod
```

### **7.2 Useful Commands**
```bash
# Restart service
sudo systemctl restart yacht-api

# View real-time logs
sudo journalctl -u yacht-api -f

# Check service status
sudo systemctl status yacht-api

# View recent logs
sudo journalctl -u yacht-api -n 100
```

## 🌐 **Step 8: External Access**

### **8.1 Test External Access**
```bash
# From your local machine
curl http://3.69.225.186:3000/api/yachts?limit=1

# Test API documentation
curl http://3.69.225.186:3000/api-docs
```

### **8.2 Domain Configuration**
If you want to use the domain `yatch.nautio.net`:
1. Configure your DNS to point to `3.69.225.186`
2. Update the service to listen on all interfaces
3. Consider adding SSL/TLS with Let's Encrypt

## 📈 **Step 9: Monitoring & Maintenance**

### **9.1 Health Checks**
```bash
# Create health check script
sudo tee /home/ubuntu/yacht-api/scripts/health-check.sh > /dev/null << EOF
#!/bin/bash
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/yachts?limit=1)
if [ $response -eq 200 ]; then
    echo "$(date): API is healthy (HTTP $response)"
else
    echo "$(date): API health check failed (HTTP $response)"
    sudo systemctl restart yacht-api
fi
EOF

chmod +x /home/ubuntu/yacht-api/scripts/health-check.sh

# Add to crontab (every 5 minutes)
(crontab -l 2>/dev/null; echo "*/5 * * * * /home/ubuntu/yacht-api/scripts/health-check.sh") | crontab -
```

### **9.2 Log Rotation**
```bash
# Configure log rotation
sudo tee /etc/logrotate.d/yacht-api > /dev/null << EOF
/home/ubuntu/yacht-api/logs/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 644 ubuntu ubuntu
}
EOF
```

## 🎉 **Step 10: Success Verification**

### **10.1 All Features Working**
- ✅ **Basic yacht search**: `GET /api/yachts?limit=1`
- ✅ **Advanced filtering**: `GET /api/yachts?minLength=10&maxLength=20&minToilets=2&limit=1`
- ✅ **Free yachts**: `GET /api/yachts?free=true&startDate=2025-09-20&endDate=2025-09-27&limit=1`
- ✅ **Catalogue filters**: `GET /api/catalogue/filters`
- ✅ **API documentation**: `GET /api-docs`

### **10.2 Performance Check**
```bash
# Test response times
time curl http://localhost:3000/api/yachts?limit=10

# Check memory usage
ps aux | grep "node dist/server.js"
```

## 🚀 **Next Steps After Deployment**

1. **Set up monitoring** (optional)
2. **Configure SSL/TLS** (recommended)
3. **Set up backup strategy** (recommended)
4. **Configure load balancing** (if needed)
5. **Set up CI/CD pipeline** (optional)

## 📞 **Support**

If you encounter issues:
1. Check the service logs: `sudo journalctl -u yacht-api -f`
2. Verify environment configuration
3. Test individual components
4. Check firewall and network settings

---

**Your yacht API is now ready for production with enterprise-grade features!** 🎉

*Last Updated: August 21, 2025*
