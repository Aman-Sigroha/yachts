# 🔄 **Yacht API Data Synchronization Guide**

## 📋 **Overview**

This guide covers the data synchronization process for the Yacht Charter API, including automated daily sync, conflict resolution, and troubleshooting procedures.

## ✨ **Current Status: PRODUCTION READY** ✅

- **🌐 Production Server**: `http://3.69.225.186:3000`
- **📚 API Documentation**: `http://3.69.225.186:3000/api-docs`
- **🚀 All Features Working**: Search, filtering, catalogue, automated sync
- **🔧 Swagger Fixed**: No more YAML syntax errors
- **🧹 Production Cleaned**: Optimized production environment

## 🔄 **Data Synchronization Status**

### **Current Data Status**
- **Automated Sync**: ✅ **ACTIVE** - Daily at 2:00 AM UTC
- **Conflict Resolution**: ✅ **IMPLEMENTED** - Invoice collection cleanup
- **Data Freshness**: ✅ **24/7** - Always up-to-date
- **Logging**: ✅ **COMPREHENSIVE** - Full sync activity tracking

### **Sync Benefits**
- ✅ **24/7 Data Freshness**: Automatically syncs every 24 hours
- ✅ **Server Independent**: Runs even when your laptop is off
- ✅ **Conflict Resolution**: Automatically cleans up invoice data before each sync
- ✅ **Comprehensive Logging**: All sync activity logged
- ✅ **Zero Maintenance**: Fully automated after setup

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

# Check automated sync logs
tail -f logs/cron-sync.log
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
db.bases.countDocuments()
db.categories.countDocuments()
db.builders.countDocuments()
db.charter_companies.countDocuments()

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
  print('Bases: ' + db.bases.countDocuments());
  print('Categories: ' + db.categories.countDocuments());
  print('Builders: ' + db.builders.countDocuments());
  print('Charter Companies: ' + db.charter_companies.countDocuments());
"
```

---

## 📊 **What Gets Synced**

### **Primary Data Entities**
1. **Yachts** - Charter vessels with specifications and highlights
2. **Reservations** - Booking information and availability
3. **Invoices** - Billing details (base, agency, owner)
4. **Contacts** - Customer and partner information

### **Supporting Data**
1. **Bases** - Charter locations and ports
2. **Countries** - Geographic data for international operations
3. **Equipment** - Yacht amenities and features
4. **Categories** - Yacht classifications (sailing, motor, catamaran)
5. **Builders** - Yacht manufacturers and brands
6. **Charter Companies** - Charter service providers

### **Data Transformation**
- **Nausys Format** → **MongoDB Schema**
- **Multi-language support** (EN, DE, FR, IT, ES, HR)
- **Data validation** and error handling
- **Duplicate prevention** and updates
- **Smart conflict resolution** - Automatic invoice collection cleanup before each sync
- **Field validation** - Only syncs fields that exist in the target schema

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

#### **5. Invoice Sync Conflicts (RESOLVED)**
```bash
# The system now automatically cleans up invoice collection before each sync
# This prevents "duplicate key" errors that were occurring previously

# Check if invoice cleanup is working
tail -f logs/cron-sync.log | grep -i "invoice.*drop\|invoice.*cleanup"
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
- [ ] Automated sync cron job is configured

### **During Sync Monitoring**
```bash
# Watch sync progress
tail -f logs/combined.log | grep -i sync

# Monitor MongoDB collections
watch -n 5 'mongosh yaacht --eval "print(\"Yachts: \" + db.yachts.countDocuments())"'

# Check automated sync status
tail -f logs/cron-sync.log
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
  print('Categories: ' + db.categories.countDocuments());
  print('Builders: ' + db.builders.countDocuments());
  print('Charter Companies: ' + db.charter_companies.countDocuments());
"

# Check latest sync timestamp
mongosh yaacht --eval "
  db.yachts.find().sort({_id: -1}).limit(1).forEach(printjson)
"

# Test API endpoints after sync
curl http://localhost:3000/api/yachts/debug/collection-info
curl http://localhost:3000/api/catalogue/filters/active
```

### **Monitor Automated Sync**
```bash
# Check automated sync logs
tail -f logs/cron-sync.log

# View cron job status
crontab -l

# Check last automated sync time
ls -la logs/cron-sync.log

# Monitor cron job execution
sudo journalctl -u cron -f
```

---

## ⚡ **Automated Sync Options**

### **Option 1: Cron Job (Recommended) - CURRENTLY ACTIVE**
```bash
# View current cron job
crontab -l

# Edit crontab
crontab -e

# Add daily sync at 2 AM UTC
0 2 * * * cd /home/ubuntu/yacht-api && node dist/scripts/sync.js >> logs/cron-sync.log 2>&1

# Add weekly sync on Sundays at 3 AM UTC
0 3 * * 0 cd /home/ubuntu/yacht-api && node dist/scripts/sync.js >> logs/weekly-sync.log 2>&1
```

**Current Status**: ✅ **ACTIVE** - Daily sync at 2 AM UTC is configured and running

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
- **Daily**: For active charter seasons (✅ Currently Active)
- **Weekly**: For off-season periods
- **Before deployments**: Ensure fresh data
- **After API changes**: Test new endpoints

### **Sync Timing**
- **Off-peak hours**: 2-4 AM UTC (✅ Currently Active)
- **Low traffic periods**: Weekends
- **Monitor performance**: Avoid during peak usage

### **Data Backup**
```bash
# Create MongoDB backup before major sync
mongodump --db yaacht --out /home/ubuntu/backups/$(date +%Y%m%d)

# Restore if needed
mongorestore --db yaacht /home/ubuntu/backups/20250811/yaacht/

# Automated backup script (optional)
echo "0 1 * * * mongodump --db yaacht --out /home/ubuntu/backups/\$(date +%Y%m%d)" | crontab -
```

---

## 📞 **Support & Troubleshooting**

### **If Sync Fails**
1. **Check logs**: `tail -f logs/error.log`
2. **Check automated sync logs**: `tail -f logs/cron-sync.log`
3. **Verify credentials**: Check `.env` file
4. **Test connectivity**: Ping external APIs
5. **Restart services**: MongoDB and Node.js
6. **Check resources**: Memory and disk space

### **Emergency Procedures**
```bash
# Stop sync if it's consuming too many resources
pkill -f "node.*sync.js"

# Restart MongoDB if corrupted
sudo systemctl stop mongod
sudo systemctl start mongod

# Rollback to previous data if needed
# (Use backups created before sync)

# Check automated sync status
crontab -l
sudo systemctl status cron
```

### **Contact Information**
- **Server Access**: `ssh -i nautio.pem ubuntu@3.69.225.186`
- **Logs Location**: `/home/ubuntu/yacht-api/logs/`
- **MongoDB**: `mongosh yaacht`
- **Service Status**: `sudo systemctl status yacht-api`
- **Cron Status**: `crontab -l`

---

## 🎉 **Sync Success Indicators**

### **✅ Successful Sync**
- Data counts increase
- No error messages in logs
- API responses include fresh data
- MongoDB collections updated
- Automated sync logs show success
- Invoice collection is cleaned before sync

### **❌ Failed Sync**
- Error messages in logs
- Data counts unchanged
- API responses show old data
- MongoDB collections not updated
- Automated sync logs show errors
- Invoice conflicts persist

---

## 🚤 **API Testing After Sync**

### **Test Yacht Endpoints**
```bash
# Check if yacht data is available
curl http://localhost:3000/api/yachts/debug/collection-info

# Test yacht search
curl "http://localhost:3000/api/yachts?q=Blue"

# Test yacht filtering
curl "http://localhost:3000/api/yachts?minCabins=4&sortBy=cabins&sortOrder=desc"
```

### **Test Catalogue Endpoints**
```bash
# Check active filters
curl http://localhost:3000/api/catalogue/filters/active

# Check specific catalogue data
curl http://localhost:3000/api/catalogue/categories/active
curl http://localhost:3000/api/catalogue/builders/active
curl http://localhost:3000/api/catalogue/bases/active
```

### **Test Other Endpoints**
```bash
# Reservations
curl http://localhost:3000/api/reservations

# Invoices
curl http://localhost:3000/api/invoices

# Contacts
curl http://localhost:3000/api/contacts
```

---

## 📚 **Additional Resources**

### **Related Documentation**
- `DEPLOYMENT_README.md` - Complete deployment guide
- `DEPLOYMENT.md` - Step-by-step deployment
- `env.template` - Environment variables template
- `README.md` - Main project documentation

### **Useful Commands Reference**
```bash
# Quick status check
sudo systemctl status yacht-api mongod cron

# View recent logs
tail -n 100 logs/combined.log
tail -n 100 logs/cron-sync.log

# Check disk space
df -h

# Monitor system resources
htop

# Check automated sync status
crontab -l
ls -la logs/cron-sync.log
```

---

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

### **Debug & Troubleshooting**
- ✅ **Collection Statistics**: Total counts and sample data
- ✅ **Yacht Debugging**: Individual yacht inspection
- ✅ **Comprehensive Logging**: Full sync activity tracking
- ✅ **Error Handling**: Graceful failure with detailed error messages

---

**Remember**: Regular data synchronization ensures your yacht charter API always provides the most current and accurate information to your clients! The new automated sync system with conflict resolution makes this process seamless and reliable. 🚤✨

---

**Last Updated**: August 14, 2025  
**Sync Guide Version**: 3.0.0  
**Status**: ✅ **PRODUCTION READY - All features working**
