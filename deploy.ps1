# Deployment Script for Yacht Charter API (PowerShell)
# Server: yatch.nautio.net (3.69.225.186)

Write-Host "🚀 Starting deployment to yatch.nautio.net..." -ForegroundColor Green

# Configuration
$SERVER_IP = "3.69.225.186"
$SERVER_USER = "ubuntu"  # Usually 'ubuntu' for AWS EC2
$PEM_FILE = "nautio.pem"
$REMOTE_DIR = "/home/ubuntu/yacht-api"
$SERVICE_NAME = "yacht-api"

Write-Host "📋 Deployment Configuration:" -ForegroundColor Yellow
Write-Host "   Server: $SERVER_IP" -ForegroundColor White
Write-Host "   User: $SERVER_USER" -ForegroundColor White
Write-Host "   Remote Directory: $REMOTE_DIR" -ForegroundColor White
Write-Host "   Service Name: $SERVICE_NAME" -ForegroundColor White
Write-Host ""

# Check if PEM file exists
if (-not (Test-Path $PEM_FILE)) {
    Write-Host "❌ Error: $PEM_FILE not found!" -ForegroundColor Red
    Write-Host "Please download the PEM file from your chat and place it in the project root." -ForegroundColor Red
    exit 1
}

Write-Host "✅ PEM file found" -ForegroundColor Green

# Test SSH connection
Write-Host "🔌 Testing SSH connection..." -ForegroundColor Yellow
try {
    $sshTest = ssh -i $PEM_FILE -o ConnectTimeout=10 -o StrictHostKeyChecking=no "${SERVER_USER}@${SERVER_IP}" "echo 'SSH connection successful!'" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ SSH connection successful!" -ForegroundColor Green
    } else {
        throw "SSH connection failed"
    }
} catch {
    Write-Host "❌ SSH connection failed!" -ForegroundColor Red
    Write-Host "Please check:" -ForegroundColor Red
    Write-Host "  1. PEM file is correct" -ForegroundColor Red
    Write-Host "  2. Server IP is correct" -ForegroundColor Red
    Write-Host "  3. Server is running and accessible" -ForegroundColor Red
    exit 1
}

# Create remote directory structure
Write-Host "📁 Creating remote directory structure..." -ForegroundColor Yellow
ssh -i $PEM_FILE "${SERVER_USER}@${SERVER_IP}" "mkdir -p $REMOTE_DIR"

# Copy package files
Write-Host "📦 Copying package files..." -ForegroundColor Yellow
scp -i $PEM_FILE package.json package-lock.json "${SERVER_USER}@${SERVER_IP}:${REMOTE_DIR}/"

# Copy built application
Write-Host "📁 Copying built application..." -ForegroundColor Yellow
scp -i $PEM_FILE -r dist/ "${SERVER_USER}@${SERVER_IP}:${REMOTE_DIR}/"

# Copy environment template
Write-Host "⚙️  Copying environment configuration..." -ForegroundColor Yellow
if (Test-Path "env.template") {
    scp -i $PEM_FILE env.template "${SERVER_USER}@${SERVER_IP}:${REMOTE_DIR}/.env"
} else {
    Write-Host "No env.template found, you'll need to create .env manually" -ForegroundColor Yellow
}

# Install dependencies on server
Write-Host "📥 Installing dependencies on server..." -ForegroundColor Yellow
ssh -i $PEM_FILE "${SERVER_USER}@${SERVER_IP}" "cd $REMOTE_DIR && npm install --production"

# Create systemd service file
Write-Host "🔧 Creating systemd service..." -ForegroundColor Yellow
$serviceContent = @"
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
"@

ssh -i $PEM_FILE "${SERVER_USER}@${SERVER_IP}" "echo '$serviceContent' | sudo tee /etc/systemd/system/$SERVICE_NAME.service > /dev/null"

# Reload systemd and enable service
Write-Host "🔄 Enabling and starting service..." -ForegroundColor Yellow
ssh -i $PEM_FILE "${SERVER_USER}@${SERVER_IP}" "sudo systemctl daemon-reload && sudo systemctl enable $SERVICE_NAME && sudo systemctl start $SERVICE_NAME"

# Check service status
Write-Host "📊 Checking service status..." -ForegroundColor Yellow
ssh -i $PEM_FILE "${SERVER_USER}@${SERVER_IP}" "sudo systemctl status $SERVICE_NAME --no-pager -l"

Write-Host ""
Write-Host "🎉 Deployment completed!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Yellow
Write-Host "1. SSH into your server: ssh -i $PEM_FILE $SERVER_USER@$SERVER_IP" -ForegroundColor White
Write-Host "2. Edit environment file: nano $REMOTE_DIR/.env" -ForegroundColor White
Write-Host "3. Set your MongoDB URI and Nausys credentials" -ForegroundColor White
Write-Host "4. Restart the service: sudo systemctl restart $SERVICE_NAME" -ForegroundColor White
Write-Host "5. Check logs: sudo journalctl -u $SERVICE_NAME -f" -ForegroundColor White
Write-Host ""
Write-Host "🌐 Your API will be available at:" -ForegroundColor Yellow
Write-Host "   http://yatch.nautio.net:3000" -ForegroundColor White
Write-Host "   http://$SERVER_IP:3000" -ForegroundColor White
Write-Host ""
Write-Host "📚 API Documentation:" -ForegroundColor Yellow
Write-Host "   http://yatch.nautio.net:3000/api-docs" -ForegroundColor White
Write-Host "   http://$SERVER_IP:3000/api-docs" -ForegroundColor White
