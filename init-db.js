require("dotenv").config({ path: './config.env' });
const mongoose = require("mongoose");
const User = require("./models/user.js");
const Flight = require("./models/flight.js");
const Admin = require("./models/admin.js");
const Booking = require("./models/booking.js");

// Database Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/flight_booking", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1);
  }
};

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

// Initialize database
const initializeDB = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await User.deleteMany({});
    await Flight.deleteMany({});
    await Admin.deleteMany({});
    await Booking.deleteMany({});
    
    console.log("Cleared existing data");
    
    // Create admin account
    const adminData = {
      username: process.env.ADMIN_USERNAME || "admin",
      email: process.env.ADMIN_EMAIL || "admin@flightbooking.com",
      name: "System Administrator"
    };
    
    const admin = new Admin(adminData);
    await Admin.register(admin, process.env.ADMIN_PASSWORD || "admin123");
    console.log("Admin account created");
    
    // Create sample flights
    await Flight.insertMany(sampleFlights);
    console.log("Sample flights created");
    
    // Create a sample user
    const userData = {
      username: "demo",
      email: "demo@example.com",
      name: "Demo User",
      address: "123 Demo Street, Demo City",
      number: 9876543210
    };
    
    const user = new User(userData);
    await User.register(user, "demo123");
    console.log("Demo user created");
    
    console.log("\n=== Database Initialization Complete ===");
    console.log("Admin Login:");
    console.log(`Username: ${adminData.username}`);
    console.log(`Password: ${process.env.ADMIN_PASSWORD || "admin123"}`);
    console.log("\nDemo User Login:");
    console.log("Username: demo");
    console.log("Password: demo123");
    console.log("\nYou can now start the application!");
    
    process.exit(0);
  } catch (error) {
    console.error("Initialization error:", error);
    process.exit(1);
  }
};

// Run initialization
initializeDB(); 