// Dependencies
require("dotenv").config({ path: './config.env' });
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const localStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");

// Importing database models
const User = require("./models/user.js");
const Flight = require("./models/flight.js");
const Admin = require("./models/admin.js");
const Booking = require("./models/booking.js");

const app = express();

// Database Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/flight_booking");
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1);
  }
};

connectDB();

// ============================== App Settings ==============================

// Session Configuration
app.use(session({
  secret: process.env.SESSION_SECRET || "Java Project for Group 1",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.RENDER_EXTERNAL_URL ? false : process.env.NODE_ENV === 'production',
  maxAge: 24 * 60 * 60 * 1000
  }
}));

// Flash Messages
app.use(flash());

// View Engine Setup
app.set("view engine", "ejs");
app.use(express.static("views"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Passport Configuration
app.use(passport.initialize());
app.use(passport.session());

// Method Override for PUT/DELETE requests
app.use(methodOverride("_method"));

// Passport Local Strategy for Users
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Global Variables for Templates
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.currentAdmin = req.session.admin;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// ====================================== ROUTES ======================================

// Landing Route
app.get("/", (req, res) => {
  res.render("land");
});

// =============================== USER ROUTES ===============================

// User Registration
app.get("/register", (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/home");
  }
  res.render("register");
});

app.post("/register", async (req, res) => {
  try {
    const { username, password, email, name, address, number } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      req.flash("error", "Username already exists");
      return res.redirect("/register");
    }

    const newUser = new User({
      username,
      email,
      name,
      address,
      number
    });

    await User.register(newUser, password);
    
    passport.authenticate("local")(req, res, () => {
      req.flash("success", "Registration successful! Welcome to Flight Booking");
      res.redirect("/home");
    });
  } catch (error) {
    console.error("Registration error:", error);
    req.flash("error", "Registration failed. Please try again.");
    res.redirect("/register");
  }
});

// User Login
app.get("/login", (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/home");
  }
  res.render("login");
});

app.post("/login", passport.authenticate("local", {
  successRedirect: "/home",
  failureRedirect: "/login",
  failureFlash: true
}));

// User Logout
app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err);
    }
    req.flash("success", "Logged out successfully");
    res.redirect("/");
  });
});

// =============================== FLIGHT ROUTES ===============================

// Home Page - Show all flights with search
app.get("/home", isLoggedIn, async (req, res) => {
  try {
    const { source, destination, date } = req.query;
    let query = {};
    
    if (source) query.source = new RegExp(source, 'i');
    if (destination) query.destination = new RegExp(destination, 'i');
    if (date) query.date = { $gte: new Date(date) };
    
    const flights = await Flight.find(query).sort({ date: 1 });
    res.render("home", { flights, searchQuery: { source, destination, date } });
  } catch (error) {
    console.error("Error fetching flights:", error);
    req.flash("error", "Error loading flights");
    res.redirect("/");
  }
});

// Flight Details
app.get("/home/:id", isLoggedIn, async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) {
      req.flash("error", "Flight not found");
      return res.redirect("/home");
    }
    res.render("show", { flight });
  } catch (error) {
    console.error("Error fetching flight:", error);
    req.flash("error", "Error loading flight details");
    res.redirect("/home");
  }
});

// Booking Routes
app.get("/home/:id/book", isLoggedIn, async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) {
      req.flash("error", "Flight not found");
      return res.redirect("/home");
    }
    res.render("book", { flight });
  } catch (error) {
    console.error("Error loading booking page:", error);
    req.flash("error", "Error loading booking page");
    res.redirect("/home");
  }
});

app.post("/home/:id/book/bill", isLoggedIn, async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) {
      req.flash("error", "Flight not found");
      return res.redirect("/home");
    }

    const bookingData = {
      ...req.body.book,
      booker: { id: req.user._id },
      username: req.user.username,
      flight: flight._id,
      price: flight.price * req.body.book.quantity
    };

    const newBooking = await Booking.create(bookingData);
    res.render("bill", { book: newBooking, flight });
  } catch (error) {
    console.error("Booking error:", error);
    req.flash("error", "Booking failed. Please try again.");
    res.redirect("/home");
  }
});

// User Bookings
app.get("/my-bookings", isLoggedIn, async (req, res) => {
  try {
    const bookings = await Booking.find({ "booker.id": req.user._id }).populate('flight');
    res.render("my-bookings", { bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    req.flash("error", "Error loading your bookings");
    res.redirect("/home");
  }
});

// =============================== ADMIN ROUTES ===============================

// Admin Login
app.get("/admin/login", (req, res) => {
  if (req.session.admin) {
    return res.redirect("/admin/dashboard");
  }
  res.render("loginadmin");
});

app.post("/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    
    if (!admin) {
      req.flash("error", "Admin not found");
      return res.redirect("/admin/login");
    }
    
    const isMatch = await admin.authenticate(password);
    if (!isMatch) {
      req.flash("error", "Invalid password");
      return res.redirect("/admin/login");
    }
    
    req.session.admin = admin;
    req.flash("success", "Admin login successful");
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error("Admin login error:", error);
    req.flash("error", "Login failed");
    res.redirect("/admin/login");
  }
});

// Admin Logout
app.get("/admin/logout", (req, res) => {
  req.session.admin = null;
  req.flash("success", "Admin logged out successfully");
  res.redirect("/");
});

// Admin Dashboard
app.get("/admin/dashboard", isAdminLoggedIn, async (req, res) => {
  try {
    const totalFlights = await Flight.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalUsers = await User.countDocuments();
    const recentBookings = await Booking.find().populate('flight').limit(5).sort({ date: -1 });
    
    res.render("admin-dashboard", { 
      totalFlights, 
      totalBookings, 
      totalUsers, 
      recentBookings 
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    req.flash("error", "Error loading dashboard");
    res.redirect("/admin/login");
  }
});

// Admin Flight Management
app.get("/admin/flights", isAdminLoggedIn, async (req, res) => {
  try {
    const flights = await Flight.find().sort({ date: 1 });
    res.render("allflights", { flights });
  } catch (error) {
    console.error("Error fetching flights:", error);
    req.flash("error", "Error loading flights");
    res.redirect("/admin/dashboard");
  }
});

app.get("/admin/flights/new", isAdminLoggedIn, (req, res) => {
  res.render("new");
});

app.post("/admin/flights", isAdminLoggedIn, async (req, res) => {
  try {
    await Flight.create(req.body.flight);
    req.flash("success", "Flight created successfully");
    res.redirect("/admin/flights");
  } catch (error) {
    console.error("Flight creation error:", error);
    req.flash("error", "Error creating flight");
    res.render("new");
  }
});

app.get("/admin/flights/:id", isAdminLoggedIn, async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) {
      req.flash("error", "Flight not found");
      return res.redirect("/admin/flights");
    }
    res.render("showflight", { flight });
  } catch (error) {
    console.error("Error fetching flight:", error);
    req.flash("error", "Error loading flight");
    res.redirect("/admin/flights");
  }
});

app.get("/admin/flights/:id/edit", isAdminLoggedIn, async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) {
      req.flash("error", "Flight not found");
      return res.redirect("/admin/flights");
    }
    res.render("edit", { flight });
  } catch (error) {
    console.error("Error fetching flight for edit:", error);
    req.flash("error", "Error loading flight");
    res.redirect("/admin/flights");
  }
});

app.put("/admin/flights/:id", isAdminLoggedIn, async (req, res) => {
  try {
    await Flight.findByIdAndUpdate(req.params.id, req.body.flight);
    req.flash("success", "Flight updated successfully");
    res.redirect("/admin/flights/" + req.params.id);
  } catch (error) {
    console.error("Flight update error:", error);
    req.flash("error", "Error updating flight");
    res.redirect("/admin/flights");
  }
});

app.delete("/admin/flights/:id", isAdminLoggedIn, async (req, res) => {
  try {
    await Flight.findByIdAndDelete(req.params.id);
    req.flash("success", "Flight deleted successfully");
    res.redirect("/admin/flights");
  } catch (error) {
    console.error("Flight deletion error:", error);
    req.flash("error", "Error deleting flight");
    res.redirect("/admin/flights");
  }
});

// Admin User Management
app.get("/admin/users", isAdminLoggedIn, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.render("admin-users", { users });
  } catch (error) {
    console.error("Error fetching users:", error);
    req.flash("error", "Error loading users");
    res.redirect("/admin/dashboard");
  }
});

// Admin Booking Management
app.get("/admin/bookings", isAdminLoggedIn, async (req, res) => {
  try {
    const bookings = await Booking.find().populate('flight').populate('booker.id');
    res.render("admin-bookings", { bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    req.flash("error", "Error loading bookings");
    res.redirect("/admin/dashboard");
  }
});

// =============================== MIDDLEWARE ===============================

// Check if user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "Please login first");
  res.redirect("/login");
}

// Check if admin is logged in
function isAdminLoggedIn(req, res, next) {
  if (req.session.admin) {
    return next();
  }
  req.flash("error", "Please login as admin first");
  res.redirect("/admin/login");
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("error", { 
    error: "Something went wrong!",
    message: process.env.NODE_ENV === 'development' ? err.message : "Internal server error"
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render("error", { 
    error: "404 - Page Not Found",
    message: "The page you're looking for doesn't exist."
  });
});

// =============================== SERVER START ===============================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Admin panel: http://localhost:${PORT}/admin/login`);
});


