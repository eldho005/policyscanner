#!/bin/bash
# ============================================================
# PolicyScanner — Hostinger VPS Setup Script (run once)
# Ubuntu 22.04 LTS
# ============================================================

set -e  # Exit on any error

echo "🚀 Starting PolicyScanner server setup..."

# ─── 1. Update system ───────────────────────────────────────
apt update && apt upgrade -y

# ─── 2. Install Node.js 20 via nvm ──────────────────────────
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"
nvm install 20
nvm use 20
nvm alias default 20
echo "✅ Node $(node -v) installed"

# ─── 3. Install PM2 ─────────────────────────────────────────
npm install -g pm2
pm2 startup systemd -u root --hp /root
echo "✅ PM2 installed"

# ─── 4. Install Nginx ───────────────────────────────────────
apt install -y nginx
systemctl enable nginx
systemctl start nginx
echo "✅ Nginx installed"

# ─── 5. Install Certbot for SSL ─────────────────────────────
apt install -y certbot python3-certbot-nginx
echo "✅ Certbot installed"

# ─── 6. Install Git ─────────────────────────────────────────
apt install -y git
echo "✅ Git installed"

# ─── 7. Create app directory ────────────────────────────────
mkdir -p /var/www/policyscanner
echo "✅ /var/www/policyscanner created"

echo ""
echo "============================================"
echo "✅ Server setup complete!"
echo "Next steps:"
echo "  1. cd /var/www/policyscanner"
echo "  2. git clone YOUR_GITHUB_REPO_URL ."
echo "  3. Create .env.local with your secrets"
echo "  4. npm ci"
echo "  5. npm run build"
echo "  6. pm2 start ecosystem.config.js"
echo "  7. cp nginx/policyscanner.conf /etc/nginx/sites-available/policyscanner"
echo "  8. ln -s /etc/nginx/sites-available/policyscanner /etc/nginx/sites-enabled/"
echo "  9. nginx -t && systemctl reload nginx"
echo "  10. certbot --nginx -d policyscanner.ca -d www.policyscanner.ca"
echo "============================================"
