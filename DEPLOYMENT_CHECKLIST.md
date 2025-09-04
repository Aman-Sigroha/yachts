# 🚀 Production Deployment Checklist

## ✅ **Pre-Deployment Checklist**

- [x] **Code built successfully** (`npm run build` completed)
- [x] **All tests passed** (local testing completed)
- [x] **Environment variables configured** (`server.env` ready)
- [x] **SSH access available** (PEM file or password)
- [x] **Production server accessible** (`3.69.225.186`)
- [x] **TypeScript compilation errors fixed** (swagger-jsdoc and swagger-ui-express types)
- [x] **Equipment data sync working** (standardEquipment properly populated)
- [x] **Picture sizing implemented** (600x600 parameters added)

## 🖥️ **Server Setup Checklist**

- [x] **SSH to production server**
- [x] **Create application directory** (`/home/ubuntu/yachts`)
- [x] **Upload application files** (package.json, dist/, .env, src/)
- [x] **Install dependencies** (`npm install --production`)
- [x] **Create systemd service** (`yacht-api.service`)
- [x] **Enable and start service**
- [x] **Check service status**

## 🔧 **Configuration Checklist**

- [x] **Environment file configured** (MongoDB URI, Nausys credentials)
- [x] **Service restarted** after config changes
- [x] **Firewall configured** (port 3000 open)
- [x] **MongoDB connection tested**
- [x] **Nausys API credentials verified**

## 🧪 **Testing Checklist**

- [x] **Basic endpoint working** (`/api/yachts?limit=1`)
- [x] **New filters working** (length, toilets, year, berths, beam)
- [x] **Free yachts working** (with date parameters)
- [x] **Catalogue filters working** (`/api/catalogue/filters`)
- [x] **API documentation accessible** (`/api-docs`)
- [x] **External access working** (from local machine)
- [x] **Equipment data working** (standardEquipment populated)
- [x] **Sized pictures working** (600x600 parameters)
- [x] **Production sync working** (npm run sync completed)

## 🚀 **Production Features Checklist**

- [x] **Automated data sync configured** (cron job)
- [x] **Health checks enabled** (every 5 minutes)
- [x] **Log rotation configured**
- [x] **Monitoring set up** (optional)
- [x] **Backup strategy configured** (optional)

## 📊 **Verification Commands**

```bash
# Service status
sudo systemctl status yacht-api

# View logs
sudo journalctl -u yacht-api -f

# Test endpoints
curl http://localhost:3000/api/yachts?limit=1
curl "http://localhost:3000/api/yachts?minLength=10&maxLength=20&minToilets=2&limit=1"
curl "http://localhost:3000/api/yachts?free=true&startDate=2025-09-20&endDate=2025-09-27&limit=1"

# External access
curl http://3.69.225.186:3000/api/yachts?limit=1
```

## 🎯 **Success Criteria**

- [x] **API responding** on port 3000
- [x] **All 38 filter parameters** working
- [x] **Free yachts functionality** working
- [x] **Swagger documentation** accessible
- [x] **Data synchronization** working
- [x] **Service auto-restarting** on failure
- [x] **Equipment data populated** (standardEquipment from Nausys API)
- [x] **Sized pictures working** (600x600 parameters)
- [x] **TypeScript compilation** working

## 🚨 **Troubleshooting Quick Reference**

| Issue | Command | Solution |
|-------|---------|----------|
| Service won't start | `sudo journalctl -u yacht-api -n 50` | Check logs for errors |
| Port in use | `sudo netstat -tlnp \| grep :3000` | Kill existing process |
| MongoDB issues | `mongosh "mongodb://localhost:27017/yaacht"` | Test connection |
| Permission issues | `ls -la /home/ubuntu/yacht-api/` | Check file permissions |

## 🌐 **Final URLs**

- **API Base**: `http://3.69.225.186:3000`
- **API Documentation**: `http://3.69.225.186:3000/api-docs`
- **Yachts Endpoint**: `http://3.69.225.186:3000/api/yachts`
- **Catalogue Filters**: `http://3.69.225.186:3000/api/catalogue/filters`

---

**🎉 PRODUCTION DEPLOYMENT COMPLETE! Your yacht API has enterprise-grade features, sized pictures (600x600), complete equipment data, and is fully documented and operational.**
