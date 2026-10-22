#!/usr/bin/env bash
# Exit immediately if a command exits with a non-zero status
set -o errexit

echo "=================================================="
echo "== CareerAI Root Render Build Step"
echo "=================================================="

cd Backend
chmod +x ./render-build.sh
./render-build.sh

echo "=================================================="
echo "== Root build finished successfully!"
echo "=================================================="
