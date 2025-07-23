if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}

// ✅ Required Modules
const express = require("express");
const app = express();
const mongoose = require("mongoose"); // MongoDB se connect hone ke liye
const path = require("path"); // Path utilities ke liye
const methodOverride = require("method-override"); // PUT/DELETE HTTP methods use karne ke liye forms ke through
const ejsMate = require("ejs-mate"); // EJS templates mein layouts use karne ke liye
const ExpressError = require("./utils/ExpressError.js"); // Custom error handling class
const session = require("express-session"); // Sessions ke liye (login/logout track karne ke liye)
const flash = require("connect-flash"); // Flash messages dikhane ke liye (like success/error)
const passport = require("passport"); // Authentication ke liye
const LocalStrategy = require("passport-local"); // Local strategy for username-password auth
const User = require("./models/user.js"); // User model import

// ✅ Routes Import
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// ✅ MongoDB Connection
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;
// Database se connect hone ki async function
main()
  .then(() => {
    console.log("connected to DB"); // Connection success
  })
  .catch((err) => { 
    console.log(err); // Error aaya toh print karo
  });

async function main() {
  await mongoose.connect(dbUrl); // MongoDB connect
}

// ✅ View Engine Setup
app.set("view engine", "ejs"); // Template engine set kiya
app.set("views", path.join(__dirname, "views")); // Views folder ka path set
app.engine("ejs", ejsMate); // EJS-mate ko use karo layouts ke liye

// ✅ Middleware Setup
app.use(express.urlencoded({ extended: true })); // Form data ko parse karne ke liye
app.use(methodOverride("_method")); // PUT/DELETE method allow karne ke liye (via query string)
app.use(express.static(path.join(__dirname, "/public"))); // Static files serve karne ke liye (CSS/JS/images)


// // ✅ MongoDB Store for Sessions
// const store = MongoStore.create({
//   mongoUrl: dbUrl, // MongoDB URL
//   crypto: {
//     secret: process.env.SECRET, // Session data ko encrypt karne ke liye secret
//   },
//   touchAfter: 24 * 3600, // Session ko update karne ka interval (24 hours)
// });

// store.on("error", () => {
//   console.log("Session Store Error", err); // Agar store mein koi error aaye toh print
// });

// ✅ Session Setup
app.use(session({
  // store, // MongoDB store use karo
  secret: process.env.SECRET, // Secret key for session encryption
  resave: false, // Har request par session save na ho
  saveUninitialized: true, // Empty session bhi save ho
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 3, // 3 din baad session expire
    maxAge: 1000 * 60 * 60 * 24 * 3, // Max age bhi 3 din
    httpOnly: true // Client-side JS session access na kar sake
  },
}));


// ✅ Flash Messages
app.use(flash()); // Flash middleware use karo

// ✅ Passport Authentication Setup
app.use(passport.initialize()); // Passport init
app.use(passport.session()); // Persistent login ke liye
passport.use(new LocalStrategy(User.authenticate())); // Local strategy use karo, `passport-local-mongoose` ka function

// Serialize (login data session mein save) & Deserialize (session se user find)
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ✅ Custom Middleware - res.locals (har response mein available)
app.use((req, res, next) => {
  res.locals.success = req.flash("success"); // Flash success message
  res.locals.error = req.flash("error");     // Flash error message
  res.locals.currUser = req.user;            // Currently logged in user
  next();
});

// ✅ Routes
app.use("/listings", listingRouter); // Listings se related routes
app.use("/listings/:id/reviews", reviewRouter); // Nested reviews route
app.use("/", userRouter); // Signup, login, logout, etc.

// ✅ Default route for homepage (root URL)
app.get("/", (req, res) => {
  res.redirect("/listings"); // 👈 Redirect to listings or your intended homepage
});

// ✅ Catch-all Route for 404 Errors
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found")); // Koi bhi route match na ho toh 404 error throw
});

// ✅ Error Handler Middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err; // Default values
  res.status(statusCode).render("error.ejs", { message }); // Error view render karo
});

// ✅ Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ server is listening on port ${PORT}`);
});




