#!/usr/bin/env bash
# ShadowSweep — Git Initialization Script
# Run once from the project root: bash init-git.sh

set -e

echo "🚀  Initializing ShadowSweep git repository..."

# Configure identity
git config --global user.name  "xolani198"
git config --global user.email "konelaxolani@gmail.com"

# Initialize repo (idempotent)
git init

# Stage everything
git add .

# Initial commit
git commit -m "feat: initial architecture for ShadowSweep SaaS"

# Set default branch to main
git branch -M main

# Add remote (replace with your PAT if using HTTPS auth)
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/xolani198/shadowsweep.git

echo ""
echo "✅  Repository initialized."
echo ""
echo "Next step — push to GitHub:"
echo "  git push -u origin main"
echo ""
echo "If you're using a Personal Access Token (PAT) set it as your password"
echo "when prompted, or configure it via gh CLI:"
echo "  gh auth login"
