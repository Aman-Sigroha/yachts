#!/bin/bash

# Deployment Script for Yacht Charter API
# Server: yatch.nautio.net (3.69.225.186)

echo "🚀 Starting deployment to yatch.nautio.net..."

# Configuration
SERVER_IP="3.69.225.186"
SERVER_USER="ubuntu"  # Usually 'ubuntu' for AWS EC2
PEM_FILE="nautio.pem"
REMOTE_DIR="/home/ubuntu/yacht-api"
SERVICE_NAME="yacht-api"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📋 Deployment Configuration:${NC}"
echo "   Server: $SERVER_IP"
echo "   User: $SERVER_USER"
echo "   Remote Directory: $REMOTE_DIR"
echo "   Service Name: $SERVICE_NAME"
echo ""

# Check if PEM file exists
if [ ! -f "$PEM_FILE" ]; then
    echo -e "${RED}❌ Error: $PEM_FILE not found!${NC}"
    echo "Please download the PEM file from your chat and place it in the project root."
    exit 1
fi

# Set correct permissions for PEM file
chmod 400 "$PEM_FILE"

echo -e "${GREEN}✅ PEM file permissions set correctly${NC}"

# Test SSH connection
echo -e "${YELLOW}🔌 Testing SSH connection...${NC}"
ssh -i "$PEM_FILE" -o ConnectTimeout=10 -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" "echo 'SSH connection successful!'"

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ SSH connection failed!${NC}"
    echo "Please check:"
    echo "  1. PEM file is correct"
    echo "  2. Server IP is correct"
    echo "  3. Server is running and accessible"
    exit 1
fi

echo -e "${GREEN}✅ SSH connection successful!${NC}"

# Create remote directory structure
echo -e "${YELLOW}📁 Creating remote directory structure...${NC}"
ssh -i "$PEM_FILE" "$SERVER_USER@$SERVER_IP" "mkdir -p $REMOTE_DIR"

# Copy package files
echo -e "${YELLOW}📦 Copying package files...${NC}"
scp -i "$PEM_FILE" package.json package-lock.json "$SERVER_USER@$SERVER_IP:$REMOTE_DIR/"

# Copy built application
echo -e "${YELLOW}📁 Copying built application...${NC}"
scp -i "$PEM_FILE" -r dist/ "$SERVER_USER@$SERVER_IP:$REMOTE_DIR/"

# Copy environment template
echo -e "${YELLOW}⚙️  Copying environment configuration...${NC}"
scp -i "$PEM_FILE" .env.example "$SERVER_USER@$SERVER_IP:$REMOTE_DIR/.env" 2>/dev/null || echo "No .env.example found, you'll need to create .env manually"

# Install dependencies on server
echo -e "${YELLOW}📥 Installing dependencies on server...${NC}"
ssh -i "$PEM_FILE" "$SERVER_USER@$SERVER_IP" "cd $REMOTE_DIR && npm install --production"

# Create systemd service file
echo -e "${YELLOW}🔧 Creating systemd service...${NC}"
ssh -i "$PEM_FILE" "$SERVER_USER@$SERVER_IP" "sudo tee /etc/systemd/system/$SERVICE_NAME.service > /dev/null << EOF
[Unit]
Description=Yacht Charter API
After=network.target

[Service]
Type=simple
User=$SERVER_USER
WorkingDirectory=$REMOTE_DIR
ExecStart=/usr/bin/node dist/server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
EOF"

# Reload systemd and enable service
echo -e "${YELLOW}🔄 Enabling and starting service...${NC}"
ssh -i "$PEM_FILE" "$SERVER_USER@$SERVER_IP" "sudo systemctl daemon-reload && sudo systemctl enable $SERVICE_NAME && sudo systemctl start $SERVICE_NAME"

# Check service status
echo -e "${YELLOW}📊 Checking service status...${NC}"
ssh -i "$PEM_FILE" "$SERVER_USER@$SERVER_IP" "sudo systemctl status $SERVICE_NAME --no-pager -l"

echo ""
echo -e "${GREEN}🎉 Deployment completed!${NC}"
echo ""
echo -e "${YELLOW}📋 Next steps:${NC}"
echo "1. SSH into your server: ssh -i $PEM_FILE $SERVER_USER@$SERVER_IP"
echo "2. Edit environment file: nano $REMOTE_DIR/.env"
echo "3. Set your MongoDB URI and Nausys credentials"
echo "4. Restart the service: sudo systemctl restart $SERVICE_NAME"
echo "5. Check logs: sudo journalctl -u $SERVICE_NAME -f"
echo ""
echo -e "${YELLOW}🌐 Your API will be available at:${NC}"
echo "   http://yatch.nautio.net:3000"
echo "   http://3.69.225.186:3000"
echo ""
echo -e "${YELLOW}📚 API Documentation:${NC}"
echo "   http://yatch.nautio.net:3000/api-docs"
echo "   http://3.69.225.186:3000/api-docs"
