if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path"); 
const methodOverride = require("method-override"); 
const ejsMate = require("ejs-mate"); 
const ExpressError = require("./utils/ExpressError.js"); 
const session = require("express-session"); 
const flash = require("connect-flash"); 
const passport = require("passport"); 
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connected to DB"); 
  })
  .catch((err) => { 
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl); 
}


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);


app.use(express.urlencoded({ extended: true })); 
app.use(methodOverride("_method")); 
app.use(express.static(path.join(__dirname, "/public"))); 


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

app.use(session({
 
  secret: process.env.SECRET, 
  resave: false, 
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
    maxAge: 1000 * 60 * 60 * 24 * 3,
    httpOnly: true 
  },
}));



app.use(flash()); 


app.use(passport.initialize()); 
app.use(passport.session()); 
passport.use(new LocalStrategy(User.authenticate())); 


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
  res.locals.success = req.flash("success"); 
  res.locals.error = req.flash("error");     
  res.locals.currUser = req.user;         
  next();
});


app.use("/listings", listingRouter); 
app.use("/listings/:id/reviews", reviewRouter); 
app.use("/", userRouter); 


app.get("/", (req, res) => {
});


app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found")); 
});


app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message }); 
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ server is listening on port ${PORT}`);
});




