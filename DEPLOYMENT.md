# Deployment Guide - Vercel + MongoDB

This guide will help you deploy your Flight Ticket Booking System to Vercel with MongoDB Atlas.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **MongoDB Atlas Account**: Sign up at [mongodb.com/atlas](https://mongodb.com/atlas)
3. **GitHub Account**: For version control

## Step 1: Set Up MongoDB Atlas

### 1.1 Create MongoDB Atlas Cluster

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a new project
3. Build a new cluster (Free tier is sufficient)
4. Choose your preferred cloud provider and region
5. Click "Create Cluster"

### 1.2 Configure Database Access

1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Create a username and password (save these!)
4. Select "Read and write to any database"
5. Click "Add User"

### 1.3 Configure Network Access

1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production: Add Vercel's IP ranges or use 0.0.0.0/0
5. Click "Confirm"

### 1.4 Get Connection String

1. Go to "Database" in the left sidebar
2. Click "Connect"
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with `flight_booking`

**Example connection string:**
```
mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/flight_booking?retryWrites=true&w=majority
```

## Step 2: Prepare Your Code for Deployment

### 2.1 Update Environment Variables

Create a `.env` file in your project root (this will be for local development):

```env
# Database Configuration
MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/flight_booking?retryWrites=true&w=majority

# Session Secret
SESSION_SECRET=your-super-secret-session-key-change-this-in-production

# Port Configuration
PORT=3000

# Admin Credentials (for initial setup)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
ADMIN_EMAIL=admin@flightbooking.com

# Environment
NODE_ENV=production
```

### 2.2 Update package.json

Make sure your `package.json` has the correct start script:

```json
{
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js",
    "init": "node init-db.js"
  }
}
```

### 2.3 Create .gitignore

Create a `.gitignore` file:

```
node_modules/
.env
config.env
.DS_Store
*.log
```

## Step 3: Deploy to Vercel

### 3.1 Install Vercel CLI

```bash
npm install -g vercel
```

### 3.2 Login to Vercel

```bash
vercel login
```

### 3.3 Deploy Your Application

```bash
vercel
```

Follow the prompts:
- Set up and deploy: `Y`
- Which scope: Select your account
- Link to existing project: `N`
- Project name: `flight-ticket-booking` (or your preferred name)
- Directory: `./` (current directory)
- Override settings: `N`

### 3.4 Set Environment Variables in Vercel

After deployment, go to your Vercel dashboard:

1. Select your project
2. Go to "Settings" tab
3. Click "Environment Variables"
4. Add the following variables:

```
MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/flight_booking?retryWrites=true&w=majority
SESSION_SECRET=your-super-secret-session-key-change-this-in-production
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
ADMIN_EMAIL=admin@flightbooking.com
NODE_ENV=production
```

### 3.5 Redeploy with Environment Variables

```bash
vercel --prod
```

## Step 4: Initialize Database

### 4.1 Run Database Initialization

After deployment, you need to initialize your database. You can do this by:

1. **Option A: Using Vercel Functions**
   Create a temporary API route to run initialization:

   Create `api/init-db.js`:
   ```javascript
   const mongoose = require("mongoose");
   const User = require("../../models/user.js");
   const Flight = require("../../models/flight.js");
   const Admin = require("../../models/admin.js");
   const Booking = require("../../models/booking.js");

   // Sample flights data
   const sampleFlights = [
     {
       name: "Air India 101",
       source: "Mumbai",
       destination: "Delhi",
       duration: 2,
       ar_time: 14,
       dp_time: 12,
       price: 5000,
       date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
       airline: "Air India",
       seats: 100
     },
     // ... add more flights
   ];

   module.exports = async (req, res) => {
     try {
       await mongoose.connect(process.env.MONGODB_URI);
       
       // Clear existing data
       await User.deleteMany({});
       await Flight.deleteMany({});
       await Admin.deleteMany({});
       await Booking.deleteMany({});
       
       // Create admin account
       const admin = new Admin({
         username: process.env.ADMIN_USERNAME,
         email: process.env.ADMIN_EMAIL,
         name: "System Administrator"
       });
       await Admin.register(admin, process.env.ADMIN_PASSWORD);
       
       // Create sample flights
       await Flight.insertMany(sampleFlights);
       
       // Create demo user
       const user = new User({
         username: "demo",
         email: "demo@example.com",
         name: "Demo User",
         address: "123 Demo Street, Demo City",
         number: 9876543210
       });
       await User.register(user, "demo123");
       
       res.json({ success: true, message: "Database initialized successfully" });
     } catch (error) {
       res.status(500).json({ success: false, error: error.message });
     }
   };
   ```

   Then visit: `https://your-app.vercel.app/api/init-db`

2. **Option B: Using MongoDB Compass**
   - Connect to your MongoDB Atlas cluster
   - Manually create the collections and documents

## Step 5: Verify Deployment

### 5.1 Test Your Application

Visit your deployed URL and test:

1. **Landing Page**: `https://your-app.vercel.app/`
2. **User Registration**: `https://your-app.vercel.app/register`
3. **User Login**: `https://your-app.vercel.app/login`
4. **Admin Login**: `https://your-app.vercel.app/admin/login`

### 5.2 Default Credentials

- **Admin**: admin / admin123
- **Demo User**: demo / demo123

## Step 6: Custom Domain (Optional)

1. Go to your Vercel project dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Configure DNS settings as instructed

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check your connection string
   - Verify network access settings
   - Ensure database user has correct permissions

2. **Environment Variables Not Working**
   - Make sure variables are set in Vercel dashboard
   - Redeploy after setting environment variables
   - Check variable names match your code

3. **Session Issues**
   - Ensure `SESSION_SECRET` is set
   - Check cookie settings for production

4. **Build Errors**
   - Check Node.js version compatibility
   - Verify all dependencies are in `package.json`
   - Check for syntax errors

### Debugging

1. **Check Vercel Logs**
   ```bash
   vercel logs
   ```

2. **Check Function Logs**
   - Go to Vercel dashboard
   - Click on your project
   - Go to "Functions" tab
   - Check for errors

3. **Test Locally with Production Environment**
   ```bash
   NODE_ENV=production npm start
   ```

## Security Considerations

1. **Environment Variables**: Never commit sensitive data to Git
2. **MongoDB Security**: Use strong passwords and restrict network access
3. **Session Security**: Use strong session secrets
4. **HTTPS**: Vercel provides HTTPS by default
5. **Input Validation**: Ensure all user inputs are validated

## Performance Optimization

1. **Database Indexing**: Add indexes to frequently queried fields
2. **Connection Pooling**: MongoDB Atlas handles this automatically
3. **Caching**: Consider adding Redis for session storage
4. **CDN**: Vercel provides global CDN automatically

## Monitoring

1. **Vercel Analytics**: Enable in project settings
2. **MongoDB Atlas Monitoring**: Use built-in monitoring tools
3. **Error Tracking**: Consider adding Sentry or similar service

## Cost Optimization

1. **MongoDB Atlas**: Free tier includes 512MB storage
2. **Vercel**: Free tier includes 100GB bandwidth
3. **Monitor Usage**: Check usage in both platforms regularly

Your Flight Ticket Booking System is now deployed and ready for production use! 🚀 