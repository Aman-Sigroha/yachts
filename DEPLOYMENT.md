# 🚀 Manual SSH Deployment Guide

## 📋 Prerequisites

1. **Download the PEM file** (`nautio.pem`) from your chat and place it in the project root
2. **Ensure your project is built** (`npm run build` completed successfully)
3. **Have your environment variables ready** (MongoDB URI, Nausys credentials)

## 🔑 Server Information

- **Domain**: yatch.nautio.net
- **IP Address**: 3.69.225.186
- **SSH User**: ubuntu (typical for AWS EC2)
- **PEM File**: nautio.pem

## 📱 Step-by-Step Manual Deployment

### Step 1: Test SSH Connection

```bash
# Test if you can connect to the server
ssh -i nautio.pem ubuntu@3.69.225.186
```

If successful, you should see the server prompt. Type `exit` to return to your local machine.

### Step 2: Create Remote Directory

```bash
ssh -i nautio.pem ubuntu@3.69.225.186 "mkdir -p /home/ubuntu/yacht-api"
```

### Step 3: Copy Package Files

```bash
scp -i nautio.pem package.json package-lock.json ubuntu@3.69.225.186:/home/ubuntu/yacht-api/
```

### Step 4: Copy Built Application

```bash
scp -i nautio.pem -r dist/ ubuntu@3.69.225.186:/home/ubuntu/yacht-api/
```

### Step 5: Copy Environment Template

```bash
scp -i nautio.pem env.template ubuntu@3.69.225.186:/home/ubuntu/yacht-api/.env
```

### Step 6: SSH into Server and Install Dependencies

```bash
ssh -i nautio.pem ubuntu@3.69.225.186
cd /home/ubuntu/yacht-api
npm install --production
```

### Step 7: Configure Environment Variables

```bash
nano .env
```

Set the following variables:
```bash
PORT=3000
NODE_ENV=production
MONGO_URI=mongodb://localhost:27017/yaacht
NAUSYS_USERNAME=your-actual-username
NAUSYS_PASSWORD=your-actual-password
LOG_LEVEL=info
```

Save and exit (Ctrl+X, Y, Enter)

### Step 8: Create Systemd Service

```bash
sudo nano /etc/systemd/system/yacht-api.service
```

Add this content:
```ini
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
```

Save and exit (Ctrl+X, Y, Enter)

### Step 9: Enable and Start Service

```bash
sudo systemctl daemon-reload
sudo systemctl enable yacht-api
sudo systemctl start yacht-api
```

### Step 10: Check Service Status

```bash
sudo systemctl status yacht-api
```

### Step 11: Check Logs (if needed)

```bash
sudo journalctl -u yacht-api -f
```

## 🌐 Access Your API

- **API Base URL**: http://yatch.nautio.net:3000
- **API Documentation**: http://yatch.nautio.net:3000/api-docs
- **Alternative IP Access**: http://3.69.225.186:3000

## 🔧 Useful Commands

### Restart Service
```bash
sudo systemctl restart yacht-api
```

### Stop Service
```bash
sudo systemctl stop yacht-api
```

### View Real-time Logs
```bash
sudo journalctl -u yacht-api -f
```

### Check Service Status
```bash
sudo systemctl status yacht-api
```

## 🚨 Troubleshooting

### If service fails to start:
1. Check logs: `sudo journalctl -u yacht-api -e`
2. Verify environment file: `cat /home/ubuntu/yacht-api/.env`
3. Check file permissions: `ls -la /home/ubuntu/yacht-api/`
4. Test manual start: `cd /home/ubuntu/yacht-api && node dist/server.js`

### If SSH connection fails:
1. Verify PEM file permissions: `chmod 400 nautio.pem`
2. Check if server is running
3. Verify IP address and username

### If MongoDB connection fails:
1. Ensure MongoDB is running on the server
2. Check MONGO_URI in .env file
3. Verify network connectivity

### If Yacht API returns empty data:
1. **Check if data exists**: `curl http://localhost:3000/api/yachts/debug/collection-info`
2. **Search for actual yacht names**: Use names that exist in your database
3. **Test without filters**: `curl http://localhost:3000/api/yachts`
4. **Check sync status**: Ensure data has been synchronized from Nausys API

## 📊 Monitoring

- **Service Status**: `sudo systemctl status yacht-api`
- **Real-time Logs**: `sudo journalctl -u yacht-api -f`
- **API Health**: `curl http://localhost:3000/api/yachts`
- **Data Status**: `curl http://localhost:3000/api/yachts/debug/collection-info`

## 🔄 Updating the Application

To deploy updates:

1. Build locally: `npm run build`
2. Copy new dist folder: `scp -i nautio.pem -r dist/ ubuntu@3.69.225.186:/home/ubuntu/yacht-api/`
3. Restart service: `ssh -i nautio.pem ubuntu@3.69.225.186 "sudo systemctl restart yacht-api"`

## 🎯 Next Steps After Deployment

1. **Test API endpoints** using the Swagger documentation
2. **Set up MongoDB** (if not already configured)
3. **Configure Nginx** for domain routing (optional)
4. **Set up SSL certificate** for HTTPS (recommended)
5. **Configure firewall** to allow port 3000
6. **Set up monitoring** and alerting
7. **Configure automated data sync** (see Automated Sync section below)
8. **Test yacht search and filtering** with real data
9. **Verify catalogue endpoints** for frontend integration

## 🔄 Automated Data Synchronization

### Setup Automated Sync

After deployment, set up automatic data synchronization:

```bash
# SSH into your server
ssh -i nautio.pem ubuntu@3.69.225.186

# Navigate to application directory
cd /home/ubuntu/yacht-api

# Create logs directory
mkdir -p logs

# Add cron job for daily sync at 2 AM UTC
(crontab -l 2>/dev/null; echo "0 2 * * * cd /home/ubuntu/yacht-api && node dist/scripts/sync.js >> logs/cron-sync.log 2>&1") | crontab -

# Verify cron job is set
crontab -l
```

### Automated Sync Benefits

- ✅ **24/7 Data Freshness**: Automatically syncs every 24 hours
- ✅ **Server Independent**: Runs even when your laptop is off
- ✅ **Conflict Resolution**: Automatically cleans up invoice data before each sync
- ✅ **Comprehensive Logging**: All sync activity logged to `logs/cron-sync.log`
- ✅ **Zero Maintenance**: Fully automated after setup
- ✅ **Invoice Cleanup**: Prevents duplicate key errors by dropping collection before sync

### Monitor Automated Sync

```bash
# Check sync logs
tail -f logs/cron-sync.log

# View cron job status
crontab -l

# Manual sync test
node dist/scripts/sync.js

# Check data after sync
curl http://localhost:3000/api/yachts/debug/collection-info
```

## 🚤 Testing Your Deployed API

### 1. Test Basic Connectivity
```bash
# Check if service is running
curl http://localhost:3000/api/yachts

# Check data status
curl http://localhost:3000/api/yachts/debug/collection-info
```

### 2. Test Yacht Search
```bash
# Search by yacht name (use actual names from your data)
curl "http://localhost:3000/api/yachts?q=Blue"

# Filter by cabins
curl "http://localhost:3000/api/yachts?minCabins=4&maxCabins=8"

# Combined search and filter
curl "http://localhost:3000/api/yachts?q=Maria&minCabins=4&sortBy=cabins&sortOrder=desc"
```

### 3. Test Catalogue Endpoints
```bash
# Get all filter options
curl http://localhost:3000/api/catalogue/filters

# Get active filters only
curl http://localhost:3000/api/catalogue/filters/active

# Get specific catalogue data
curl http://localhost:3000/api/catalogue/categories/active
curl http://localhost:3000/api/catalogue/builders/active
curl http://localhost:3000/api/catalogue/bases/active
```

### 4. Test Other Endpoints
```bash
# Reservations
curl http://localhost:3000/api/reservations

# Invoices
curl http://localhost:3000/api/invoices

# Contacts
curl http://localhost:3000/api/contacts
```

## 🔍 Debugging Deployed API

### Check Service Status
```bash
sudo systemctl status yacht-api
sudo journalctl -u yacht-api -f
```

### Check Data Synchronization
```bash
# View sync logs
tail -f logs/cron-sync.log

# Check if data exists
curl http://localhost:3000/api/yachts/debug/collection-info

# Test specific yacht retrieval
curl http://localhost:3000/api/yachts/debug/yacht/1
```

### Common Deployment Issues

1. **Port Already in Use**
   ```bash
   # Check what's using port 3000
   sudo lsof -i :3000
   
   # Kill the process if needed
   sudo kill -9 <PID>
   ```

2. **Permission Issues**
   ```bash
   # Fix file permissions
   sudo chown -R ubuntu:ubuntu /home/ubuntu/yacht-api
   chmod 755 /home/ubuntu/yacht-api
   ```

3. **MongoDB Connection Issues**
   ```bash
   # Check MongoDB status
   sudo systemctl status mongod
   
   # Start MongoDB if not running
   sudo systemctl start mongod
   ```

## 📈 Performance Monitoring

### Check API Response Times
```bash
# Test response time
time curl http://localhost:3000/api/yachts

# Check with filters
time curl "http://localhost:3000/api/yachts?minCabins=4"
```

### Monitor Resource Usage
```bash
# Check memory usage
ps aux | grep node

# Check disk usage
df -h

# Check log file sizes
ls -lh logs/
```

---

**Last updated: August 2025 - Deployment guide for API v3.0 with working yacht search, active filters, and comprehensive catalogue system**
