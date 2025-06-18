#!/bin/bash

echo "🚀 Flight Ticket Booking System - Vercel Deployment Script"
echo "========================================================"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Installing now..."
    npm install -g vercel
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please login to Vercel..."
    vercel login
fi

echo "📦 Installing dependencies..."
npm install

echo "🔧 Checking environment variables..."
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found. Make sure to set environment variables in Vercel dashboard."
    echo "Required environment variables:"
    echo "  - MONGODB_URI"
    echo "  - SESSION_SECRET"
    echo "  - ADMIN_USERNAME"
    echo "  - ADMIN_PASSWORD"
    echo "  - ADMIN_EMAIL"
    echo "  - NODE_ENV=production"
fi

echo "🚀 Deploying to Vercel..."
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Go to your Vercel dashboard"
echo "2. Set environment variables in Settings > Environment Variables"
echo "3. Visit your deployed URL"
echo "4. Initialize database by visiting: https://your-app.vercel.app/api/init-db"
echo ""
echo "🔑 Default credentials after initialization:"
echo "  - Admin: admin / admin123"
echo "  - Demo User: demo / demo123"
echo ""
echo "🎉 Your Flight Ticket Booking System is now live!" 