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

## 📊 Monitoring

- **Service Status**: `sudo systemctl status yacht-api`
- **Real-time Logs**: `sudo journalctl -u yacht-api -f`
- **API Health**: `curl http://localhost:3000/api/yachts`

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
