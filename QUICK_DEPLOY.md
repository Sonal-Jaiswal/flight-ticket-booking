# Quick Deployment Guide - Vercel + MongoDB

## 🚀 Fast Deployment Steps

### 1. Set Up MongoDB Atlas (5 minutes)
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create free account and cluster
3. Create database user (save username/password)
4. Allow network access from anywhere (0.0.0.0/0)
5. Get connection string

### 2. Deploy to Vercel (3 minutes)

**Option A: Using the deployment script**
```bash
./deploy.sh
```

**Option B: Manual deployment**
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### 3. Set Environment Variables in Vercel Dashboard
Go to your project → Settings → Environment Variables

Add these variables:
```
MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/flight_booking?retryWrites=true&w=majority
SESSION_SECRET=your-super-secret-session-key-change-this-in-production
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
ADMIN_EMAIL=admin@flightbooking.com
NODE_ENV=production
```

### 4. Initialize Database
Visit: `https://your-app.vercel.app/api/init-db`

### 5. Test Your Application
- **Landing Page**: `https://your-app.vercel.app/`
- **Admin Login**: `https://your-app.vercel.app/admin/login` (admin/admin123)
- **User Login**: `https://your-app.vercel.app/login` (demo/demo123)

## 🔧 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/flight_booking` |
| `SESSION_SECRET` | Secret for session encryption | `your-super-secret-key-here` |
| `ADMIN_USERNAME` | Admin login username | `admin` |
| `ADMIN_PASSWORD` | Admin login password | `admin123` |
| `ADMIN_EMAIL` | Admin email address | `admin@flightbooking.com` |
| `NODE_ENV` | Environment mode | `production` |

## 🐛 Common Issues & Solutions

### MongoDB Connection Error
- ✅ Check connection string format
- ✅ Verify username/password
- ✅ Ensure network access is allowed
- ✅ Check database user permissions

### Environment Variables Not Working
- ✅ Set variables in Vercel dashboard
- ✅ Redeploy after setting variables
- ✅ Check variable names (case-sensitive)

### Build Errors
- ✅ Check Node.js version compatibility
- ✅ Verify all dependencies in package.json
- ✅ Check for syntax errors

## 📞 Support

If you encounter issues:
1. Check Vercel logs: `vercel logs`
2. Check MongoDB Atlas logs
3. Verify environment variables
4. Test locally first: `NODE_ENV=production npm start`

## 🎉 Success Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user configured
- [ ] Network access allowed
- [ ] Vercel deployment successful
- [ ] Environment variables set
- [ ] Database initialized
- [ ] Application accessible
- [ ] Admin login works
- [ ] User registration works
- [ ] Flight booking works

Your Flight Ticket Booking System is now live! 🚀 