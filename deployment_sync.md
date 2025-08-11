# 🔄 MongoDB Data Synchronization Guide

## 📋 **Overview**

This guide explains how to synchronize yacht charter data from the **Nausys API (v6)** into your **MongoDB database** on the production server. The sync process fetches fresh data for yachts, reservations, invoices, contacts, and other related entities.

## 🌐 **Current Data Status**

### **Database Information**
- **Server**: yatch.nautio.net (3.69.225.186)
- **Database**: MongoDB 7.0.22 (Community Edition)
- **Database Name**: yaacht
- **Collections**: yachts, reservations, invoices, contacts, bases, countries, equipment

### **Last Known Sync Status**
- **Total Yachts**: 98
- **Last Sync**: 2025-08-11 14:27:59 UTC
- **Data Source**: Nausys API v6
- **Sync Status**: ✅ Successful

## 🚀 **Quick Sync Commands**

### **1. SSH into Server**
```bash
ssh -i nautio.pem ubuntu@3.69.225.186
```

### **2. Navigate to Application Directory**
```bash
cd /home/ubuntu/yacht-api
```

### **3. Run Sync Script**
```bash
node dist/scripts/sync.js
```

### **4. Monitor Sync Progress**
```bash
# Watch sync logs in real-time
tail -f logs/combined.log

# Check MongoDB collections after sync
mongosh yaacht --eval "db.yachts.countDocuments()"
```

---

## 🔧 **Detailed Sync Process**

### **Step 1: Server Access**
```bash
# Connect to production server
ssh -i nautio.pem ubuntu@3.69.225.186

# Verify you're in the right directory
pwd
# Should show: /home/ubuntu/yacht-api

# List files to confirm
ls -la
```

### **Step 2: Check Current Data**
```bash
# Connect to MongoDB
mongosh yaacht

# Check current data counts
db.yachts.countDocuments()
db.reservations.countDocuments()
db.invoices.countDocuments()
db.contacts.countDocuments()

# Exit MongoDB
exit
```

### **Step 3: Run Synchronization**
```bash
# Ensure you're in the application directory
cd /home/ubuntu/yacht-api

# Check if sync script exists
ls -la dist/scripts/

# Run the sync script
node dist/scripts/sync.js
```

### **Step 4: Monitor Sync Progress**
```bash
# Watch application logs
tail -f logs/combined.log

# Check system service logs
sudo journalctl -u yacht-api -f

# Monitor MongoDB in real-time
mongosh yaacht --eval "
  print('Yachts: ' + db.yachts.countDocuments());
  print('Reservations: ' + db.reservations.countDocuments());
  print('Invoices: ' + db.invoices.countDocuments());
  print('Contacts: ' + db.contacts.countDocuments());
"
```

---

## 📊 **What Gets Synced**

### **Primary Data Entities**
1. **Yachts** - Charter vessels with specifications
2. **Reservations** - Booking information
3. **Invoices** - Billing details
4. **Contacts** - Customer information

### **Supporting Data**
1. **Bases** - Charter locations
2. **Countries** - Geographic data
3. **Equipment** - Yacht amenities
4. **Categories** - Yacht classifications
5. **Builders** - Yacht manufacturers

### **Data Transformation**
- **Nausys Format** → **MongoDB Schema**
- **Multi-language support** (EN, DE, FR, IT, ES, HR)
- **Data validation** and error handling
- **Duplicate prevention** and updates

---

## 🔍 **Troubleshooting Sync Issues**

### **Common Problems & Solutions**

#### **1. Authentication Errors**
```bash
# Check environment variables
cat .env | grep NAUSYS

# Verify credentials are correct
# NAUSYS_USERNAME=rest384@TTTTT
# NAUSYS_PASSWORD=1M87j14h
```

#### **2. MongoDB Connection Issues**
```bash
# Check MongoDB service status
sudo systemctl status mongod

# Restart MongoDB if needed
sudo systemctl restart mongod

# Verify connection string
echo $MONGO_URI
# Should show: mongodb://localhost:27017/yaacht
```

#### **3. Network/API Issues**
```bash
# Test Nausys API connectivity
curl -u "rest384@TTTTT:1M87j14h" \
  "https://api.nausys.com/v6/yachts?limit=1"

# Check server internet connectivity
ping google.com
```

#### **4. Memory/Resource Issues**
```bash
# Check server resources
free -h
df -h

# Monitor Node.js process
ps aux | grep node
top -p $(pgrep node)
```

### **Sync Script Errors**

#### **Permission Denied**
```bash
# Fix file permissions
chmod +x dist/scripts/sync.js

# Check file ownership
ls -la dist/scripts/
```

#### **Module Not Found**
```bash
# Reinstall dependencies
npm install --production

# Verify node_modules exists
ls -la node_modules/
```

---

## 📈 **Monitoring & Validation**

### **Pre-Sync Checklist**
- [ ] MongoDB service is running
- [ ] Environment variables are set
- [ ] Nausys API credentials are valid
- [ ] Server has internet access
- [ ] Application service is running

### **During Sync Monitoring**
```bash
# Watch sync progress
tail -f logs/combined.log | grep -i sync

# Monitor MongoDB collections
watch -n 5 'mongosh yaacht --eval "print(\"Yachts: \" + db.yachts.countDocuments())"'
```

### **Post-Sync Validation**
```bash
# Verify data counts increased
mongosh yaacht --eval "
  print('=== POST-SYNC DATA COUNTS ===');
  print('Yachts: ' + db.yachts.countDocuments());
  print('Reservations: ' + db.reservations.countDocuments());
  print('Invoices: ' + db.invoices.countDocuments());
  print('Contacts: ' + db.contacts.countDocuments());
  print('Bases: ' + db.bases.countDocuments());
  print('Countries: ' + db.countries.countDocuments());
"

# Check latest sync timestamp
mongosh yaacht --eval "
  db.yachts.find().sort({_id: -1}).limit(1).forEach(printjson)
"
```

---

## ⚡ **Automated Sync Options**

### **Option 1: Cron Job (Recommended)**
```bash
# Edit crontab
crontab -e

# Add daily sync at 2 AM UTC
0 2 * * * cd /home/ubuntu/yacht-api && node dist/scripts/sync.js >> logs/cron-sync.log 2>&1

# Add weekly sync on Sundays at 3 AM UTC
0 3 * * 0 cd /home/ubuntu/yacht-api && node dist/scripts/sync.js >> logs/weekly-sync.log 2>&1
```

### **Option 2: systemd Timer**
```bash
# Create timer service
sudo tee /etc/systemd/system/yacht-sync.timer > /dev/null << EOF
[Unit]
Description=Yacht API Data Sync Timer
Requires=yacht-sync.service

[Timer]
OnCalendar=*-*-* 02:00:00
Persistent=true

[Install]
WantedBy=timers.target
EOF

# Create sync service
sudo tee /etc/systemd/system/yacht-sync.service > /dev/null << EOF
[Unit]
Description=Yacht API Data Sync Service
After=network.target

[Service]
Type=oneshot
User=ubuntu
WorkingDirectory=/home/ubuntu/yacht-api
ExecStart=/usr/bin/node dist/scripts/sync.js
StandardOutput=append:/home/ubuntu/yacht-api/logs/sync.log
StandardError=append:/home/ubuntu/yacht-api/logs/sync-error.log

[Install]
WantedBy=multi-user.target
EOF

# Enable and start timer
sudo systemctl daemon-reload
sudo systemctl enable yacht-sync.timer
sudo systemctl start yacht-sync.timer
```

---

## 🎯 **Best Practices**

### **When to Sync**
- **Daily**: For active charter seasons
- **Weekly**: For off-season periods
- **Before deployments**: Ensure fresh data
- **After API changes**: Test new endpoints

### **Sync Timing**
- **Off-peak hours**: 2-4 AM UTC
- **Low traffic periods**: Weekends
- **Monitor performance**: Avoid during peak usage

### **Data Backup**
```bash
# Create MongoDB backup before major sync
mongodump --db yaacht --out /home/ubuntu/backups/$(date +%Y%m%d)

# Restore if needed
mongorestore --db yaacht /home/ubuntu/backups/20250811/yaacht/
```

---

## 📞 **Support & Troubleshooting**

### **If Sync Fails**
1. **Check logs**: `tail -f logs/error.log`
2. **Verify credentials**: Check `.env` file
3. **Test connectivity**: Ping external APIs
4. **Restart services**: MongoDB and Node.js
5. **Check resources**: Memory and disk space

### **Emergency Procedures**
```bash
# Stop sync if it's consuming too many resources
pkill -f "node.*sync.js"

# Restart MongoDB if corrupted
sudo systemctl stop mongod
sudo systemctl start mongod

# Rollback to previous data if needed
# (Use backups created before sync)
```

### **Contact Information**
- **Server Access**: `ssh -i nautio.pem ubuntu@3.69.225.186`
- **Logs Location**: `/home/ubuntu/yacht-api/logs/`
- **MongoDB**: `mongosh yaacht`
- **Service Status**: `sudo systemctl status yacht-api`

---

## 🎉 **Sync Success Indicators**

### **✅ Successful Sync**
- Data counts increase
- No error messages in logs
- API responses include fresh data
- MongoDB collections updated

### **❌ Failed Sync**
- Error messages in logs
- Data counts unchanged
- API responses show old data
- MongoDB collections not updated

---

## 📚 **Additional Resources**

### **Related Documentation**
- `DEPLOYMENT_README.md` - Complete deployment guide
- `DEPLOYMENT.md` - Step-by-step deployment
- `env.template` - Environment variables template

### **Useful Commands Reference**
```bash
# Quick status check
sudo systemctl status yacht-api mongod

# View recent logs
tail -n 100 logs/combined.log

# Check disk space
df -h

# Monitor system resources
htop
```

---

**Remember**: Regular data synchronization ensures your yacht charter API always provides the most current and accurate information to your clients! 🚤✨

---

*Last Updated: 2025-08-11*
*Sync Guide Version: 1.0.0*
*Status: PRODUCTION READY*
