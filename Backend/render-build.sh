#!/usr/bin/env bash
# Exit immediately if a command exits with a non-zero status
set -o errexit

echo "=================================================="
echo "== CareerAI Backend Render Build Step"
echo "=================================================="

# 1. Install Node.js backend dependencies
echo "==> Running npm install..."
npm install

# 2. Explicitly install the compatible Chrome browser into project cache
echo "==> Installing Puppeteer Chrome browser binary..."
npx puppeteer browsers install chrome

echo "==> Verifying Puppeteer Chrome installation..."
node -e 'const puppeteer = require("puppeteer"); console.log("==> Chrome executable path:", puppeteer.executablePath());'

echo "=================================================="
echo "== Build finished successfully!"
echo "=================================================="
