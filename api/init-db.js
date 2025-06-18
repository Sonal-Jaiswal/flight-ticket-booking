const mongoose = require("mongoose");
const User = require("../models/user.js");
const Flight = require("../models/flight.js");
const Admin = require("../models/admin.js");
const Booking = require("../models/booking.js");

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
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    airline: "Air India",
    seats: 100
  },
  {
    name: "IndiGo 202",
    source: "Delhi",
    destination: "Bangalore",
    duration: 3,
    ar_time: 16,
    dp_time: 13,
    price: 6000,
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    airline: "IndiGo",
    seats: 120
  },
  {
    name: "SpiceJet 303",
    source: "Bangalore",
    destination: "Mumbai",
    duration: 2,
    ar_time: 11,
    dp_time: 9,
    price: 4500,
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    airline: "SpiceJet",
    seats: 80
  },
  {
    name: "Vistara 404",
    source: "Chennai",
    destination: "Kolkata",
    duration: 2.5,
    ar_time: 15,
    dp_time: 12.5,
    price: 5500,
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    airline: "Vistara",
    seats: 90
  },
  {
    name: "GoAir 505",
    source: "Hyderabad",
    destination: "Pune",
    duration: 1.5,
    ar_time: 10,
    dp_time: 8.5,
    price: 3500,
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    airline: "GoAir",
    seats: 70
  }
];

module.exports = async (req, res) => {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
    
    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Flight.deleteMany({});
    await Admin.deleteMany({});
    await Booking.deleteMany({});
    console.log('Existing data cleared');
    
    // Create admin account
    console.log('Creating admin account...');
    const adminData = {
      username: process.env.ADMIN_USERNAME || "admin",
      email: process.env.ADMIN_EMAIL || "admin@flightbooking.com",
      name: "System Administrator"
    };
    
    const admin = new Admin(adminData);
    await Admin.register(admin, process.env.ADMIN_PASSWORD || "admin123");
    console.log('Admin account created');
    
    // Create sample flights
    console.log('Creating sample flights...');
    await Flight.insertMany(sampleFlights);
    console.log('Sample flights created');
    
    // Create a sample user
    console.log('Creating demo user...');
    const userData = {
      username: "demo",
      email: "demo@example.com",
      name: "Demo User",
      address: "123 Demo Street, Demo City",
      number: 9876543210
    };
    
    const user = new User(userData);
    await User.register(user, "demo123");
    console.log('Demo user created');
    
    console.log('Database initialization complete');
    
    res.json({ 
      success: true, 
      message: "Database initialized successfully",
      admin: {
        username: adminData.username,
        password: process.env.ADMIN_PASSWORD || "admin123"
      },
      demo: {
        username: "demo",
        password: "demo123"
      }
    });
    
  } catch (error) {
    console.error('Initialization error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}; 