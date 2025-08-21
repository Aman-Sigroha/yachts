# 🚀 Production Deployment Checklist

## ✅ **Pre-Deployment Checklist**

- [ ] **Code built successfully** (`npm run build` completed)
- [ ] **All tests passed** (local testing completed)
- [ ] **Environment variables configured** (`server.env` ready)
- [ ] **SSH access available** (PEM file or password)
- [ ] **Production server accessible** (`3.69.225.186`)

## 🖥️ **Server Setup Checklist**

- [ ] **SSH to production server**
- [ ] **Create application directory** (`/home/ubuntu/yacht-api`)
- [ ] **Upload application files** (package.json, dist/, .env)
- [ ] **Install dependencies** (`npm install --production`)
- [ ] **Create systemd service** (`yacht-api.service`)
- [ ] **Enable and start service**
- [ ] **Check service status**

## 🔧 **Configuration Checklist**

- [ ] **Environment file configured** (MongoDB URI, Nausys credentials)
- [ ] **Service restarted** after config changes
- [ ] **Firewall configured** (port 3000 open)
- [ ] **MongoDB connection tested**
- [ ] **Nausys API credentials verified**

## 🧪 **Testing Checklist**

- [ ] **Basic endpoint working** (`/api/yachts?limit=1`)
- [ ] **New filters working** (length, toilets, year, berths, beam)
- [ ] **Free yachts working** (with date parameters)
- [ ] **Catalogue filters working** (`/api/catalogue/filters`)
- [ ] **API documentation accessible** (`/api-docs`)
- [ ] **External access working** (from local machine)

## 🚀 **Production Features Checklist**

- [ ] **Automated data sync configured** (cron job)
- [ ] **Health checks enabled** (every 5 minutes)
- [ ] **Log rotation configured**
- [ ] **Monitoring set up** (optional)
- [ ] **Backup strategy configured** (optional)

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

- [ ] **API responding** on port 3000
- [ ] **All 38 filter parameters** working
- [ ] **Free yachts functionality** working
- [ ] **Swagger documentation** accessible
- [ ] **Data synchronization** working
- [ ] **Service auto-restarting** on failure

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

**🎉 Ready for Production! Your yacht API has enterprise-grade features and is fully documented.**
