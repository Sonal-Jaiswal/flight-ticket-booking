//Dependencies
require("dotenv").config();
var express = require("express"),
  bodyParser = require("body-parser"),
  app = express();
var mongoose = require("mongoose"),
  passport = require("passport"),
  localStrategy = require("passport-local"),
  passportLocalMongoose = require("passport-local-mongoose");
var methodOverride = require("method-override");

//Importing database models
var user = require("./models/user.js"),
  flight = require("./models/flight.js"),
  admin = require("./models/admin.js"),
  booking = require("./models/booking.js");

//Connecting Database
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(console.log("DB  is connected"));

//============================== App Settings ==============================

//Hashing Secret For Password
app.use(
  require("express-session")({
    secret: "Java Project for Group 1",
    resave: false,
    saveUninitialized: false,
  })
);

//Setting Views
app.set("view engine", "ejs");
app.use(express.static("views"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

//Login Logout Settings For User
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

//===================================== ROUTES ==================================

//Landing Route
app.get("/", (req, res) => {
  res.render("land");
});

//Customer Register / Login / Logout Pages

//Sign Up Page
app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  user.register(
    new user({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        console.log(err);
        return res.render("register");
      } else {
        passport.authenticate("local")(req, res, function () {
          res.redirect("home");
        });
      }
    }
  );
});

//Login Page
app.get("/login", (req, res) => {
  res.render("login");
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/",
  }),
  (req, res) => {}
);

//===================================== PAGES ======================================
//Home Page showing all flights
app.get("/home", isLoggedIn, (req, res) => {
  flight.find({}, (err, flights) => {
    res.render("home", { flights: flights });
  });
});

//Details for specific flight
app.get("/home/:id", isLoggedIn, function (req, res) {
  flight.findById(req.params.id, function (err, foundFlight) {
    if (err) {
      return res.redirect("/home");
    } else {
      return res.render("show", { flight: foundFlight });
    }
  });
});

//Booking For Specific Selected Flight
app.get("/home/:id/book", isLoggedIn, function (req, res) {
  flight.findById(req.params.id, (err, foundFlight) => {
    res.render("book", { flight: foundFlight });
  });
});
//Booking post route
app.post("/home/:id/book/bill", isLoggedIn, (req, res) => {
  flight.findById(req.params.id, (err, foundFlight) => {
    booking.create(req.body.book, (err, newBooking) => {
      if (err) {
        return res.redirect("/");
      }
      res.render("bill", { book: newBooking, flight: foundFlight });
    });
  });
});

//==============================Admin Controls===========================

//See all flights
app.get("/allflights", (req, res) => {
  flight.find({}, (err, flights) => {
    if (err) {
      console.log(err);
    } else {
      res.render("allflights", { flights: flights });
    }
  });
});

//Create new flight
app.get("/allflights/new", (req, res) => {
  res.render("new");
});
//Post newly created flight
app.post("/allflights", (req, res) => {
  flight.create(req.body.flight, (err, newFlight) => {
    if (err) {
      res.render("new");
    } else {
      res.redirect("/allflights");
    }
  });
});

//View Details of One Specific Flight
app.get("/allflights/:id", function (req, res) {
  flight.findById(req.params.id, function (err, foundFlight) {
    if (err) {
      res.redirect("/allflights");
    } else {
      res.render("showflight", { flight: foundFlight });
    }
  });
});

//Edit one flight
app.get("/allflights/:id/edit", function (req, res) {
  flight.findById(req.params.id, function (err, foundFlight) {
    if (err) {
      res.redirect("/allflights");
    } else {
      res.render("edit", { flight: foundFlight });
    }
  });
});
//Save changes of edited flight
app.put("/allflights/:id", function (req, res) {
  flight.findByIdAndUpdate(
    req.params.id,
    req.body.flight,
    function (err, updatedFlight) {
      if (err) {
        res.redirect("/allflights");
      } else {
        res.redirect("/allflights/" + req.params.id);
      }
    }
  );
});

//Delete flight
app.delete("/allflights/:id", function (req, res) {
  flight.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.redirect("/allflights");
    } else {
      res.redirect("/allflights");
    }
  });
});

//Logout for Customer
app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

//Middleware to check if someone is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

//Listen Route
var port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Web app is running on http://localhost:${port}`);
});
