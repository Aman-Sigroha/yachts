# 🚀 **Yacht API Deployment Guide**

## 📋 **Overview**

This guide covers the complete deployment process for the Yacht Charter API to AWS EC2, including automated data synchronization and production optimization.

## ✨ **Current Status: PRODUCTION READY** ✅

- **🌐 Production Server**: `http://3.69.225.186:3000`
- **📚 API Documentation**: `http://3.69.225.186:3000/api-docs`
- **🚀 All Features Working**: Search, filtering, catalogue, automated sync
- **🔧 Swagger Fixed**: No more YAML syntax errors
- **🧹 Production Cleaned**: Optimized production environment

## 🏗️ **Prerequisites**

- **AWS EC2 Instance**: Ubuntu 24.04 LTS (t3.micro or higher)
- **SSH Key Pair**: `.pem` file for server access
- **Domain Name**: Optional (e.g., `yatch.nautio.net`)
- **MongoDB**: Local or cloud instance
- **Nausys API**: Credentials for data synchronization

## 🚀 **Deployment Process**

### **Step 1: Server Setup**

#### **1.1 Connect to Server**
```bash
ssh -i nautio.pem ubuntu@3.69.225.186
```

#### **1.2 Update System**
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git build-essential
```

#### **1.3 Install Node.js 18+**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should show v18.x.x
npm --version   # Should show 9.x.x
```

#### **1.4 Install MongoDB**
```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install MongoDB
sudo apt update
sudo apt install -y mongodb-org

# Start and enable MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify MongoDB is running
sudo systemctl status mongod
```

### **Step 2: Application Deployment**

#### **2.1 Clone Repository**
```bash
cd /home/ubuntu
git clone <your-repository-url> yacht-api
cd yacht-api
```

#### **2.2 Install Dependencies**
```bash
npm install --production
```

#### **2.3 Environment Configuration**
```bash
# Create .env file
cp env.template .env
nano .env

# Required variables:
MONGODB_URI=mongodb://localhost:27017/yaacht
NAUSYS_USERNAME=your_username
NAUSYS_PASSWORD=your_password
PORT=3000
NODE_ENV=production
```

#### **2.4 Build Application**
```bash
npm run build
```

### **Step 3: Service Configuration**

#### **3.1 Create Systemd Service**
```bash
sudo tee /etc/systemd/system/yacht-api.service > /dev/null << 'EOF'
[Unit]
Description=Yacht Charter API
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/yacht-api
ExecStart=/usr/bin/node dist/server.js
Restart=on-failure
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF
```

#### **3.2 Enable and Start Service**
```bash
sudo systemctl daemon-reload
sudo systemctl enable yacht-api
sudo systemctl start yacht-api

# Check status
sudo systemctl status yacht-api
```

### **Step 4: Configure Automated Data Sync**

#### **4.1 Create Sync Script**
```bash
# Create sync directory
mkdir -p /home/ubuntu/yacht-api/scripts

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

#### **4.2 Setup Cron Job**
```bash
# Edit crontab
crontab -e

# Add this line for daily sync at 2:00 AM UTC
0 2 * * * /home/ubuntu/yacht-api/scripts/sync.sh
```

#### **4.3 Create Log Directory**
```bash
mkdir -p /home/ubuntu/yacht-api/logs
touch /home/ubuntu/yacht-api/logs/cron-sync.log
```

### **Step 5: Firewall and Security**

#### **5.1 Configure UFW Firewall**
```bash
sudo ufw allow ssh
sudo ufw allow 3000
sudo ufw enable

# Check status
sudo ufw status
```

#### **5.2 Optional: Nginx Reverse Proxy**
```bash
sudo apt install -y nginx

# Create nginx configuration
sudo tee /etc/nginx/sites-available/yacht-api << 'EOF'
server {
    listen 80;
    server_name yatch.nautio.net;

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
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/yacht-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
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

### **Sync Monitoring**
```bash
# Check cron job status
crontab -l

# View sync logs
tail -f /home/ubuntu/yacht-api/logs/cron-sync.log

# Check service status
sudo systemctl status yacht-api
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

## 🔧 **Maintenance and Updates**

### **Deploy Updates**
```bash
# From your local machine
npm run build
scp -i nautio.pem -r dist/ ubuntu@3.69.225.186:/home/ubuntu/yacht-api/
ssh -i nautio.pem ubuntu@3.69.225.186 "sudo systemctl restart yacht-api"
```

### **Check Service Status**
```bash
ssh -i nautio.pem ubuntu@3.69.225.186 "sudo systemctl status yacht-api"
```

### **View Logs**
```bash
# Application logs
ssh -i nautio.pem ubuntu@3.69.225.186 "sudo journalctl -u yacht-api -f"

# Sync logs
ssh -i nautio.pem ubuntu@3.69.225.186 "tail -f /home/ubuntu/yacht-api/logs/cron-sync.log"
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

#### **MongoDB Connection Issues**
```bash
# Check MongoDB status
sudo systemctl status mongod

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# Test connection
mongo --eval "db.runCommand('ping')"
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

## 📊 **Performance Monitoring**

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

# Load testing (install apache2-utils first)
ab -n 100 -c 10 http://3.69.225.186:3000/api/yachts
```

## 🔒 **Security Considerations**

- **Firewall**: Only necessary ports open (22, 3000)
- **SSH**: Key-based authentication only
- **Environment Variables**: Sensitive data in `.env` file
- **Updates**: Regular system and package updates
- **Monitoring**: Log monitoring for suspicious activity

## 📈 **Scaling Considerations**

- **Load Balancer**: Multiple instances behind ALB/ELB
- **Database**: MongoDB Atlas for managed database
- **Caching**: Redis for API response caching
- **CDN**: CloudFront for static assets
- **Monitoring**: CloudWatch for metrics and alerts

## 🎯 **Next Steps After Deployment**

1. ✅ **Configure automated data sync** - Cron job for daily updates
2. ✅ **Test all API endpoints** - Verify functionality
3. ✅ **Monitor performance** - Check response times and resource usage
4. ✅ **Set up monitoring** - Log monitoring and alerting
5. ✅ **Document procedures** - Update team documentation
6. ✅ **Plan scaling** - Consider future growth requirements

## 📞 **Support and Maintenance**

- **Documentation**: `http://3.69.225.186:3000/api-docs`
- **Service Status**: `sudo systemctl status yacht-api`
- **Sync Logs**: `/home/ubuntu/yacht-api/logs/cron-sync.log`
- **System Logs**: `sudo journalctl -u yacht-api`

---

**Last updated**: August 14, 2025  
**Deployment Version**: 3.0.0  
**Status**: ✅ **PRODUCTION READY - All features working**
