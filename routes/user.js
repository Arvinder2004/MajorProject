// ✅ Express module import karke ek new router object banaya
const express = require("express");
const router = express.Router();  // Is file mein hum user-related routes likhenge

// ✅ wrapAsync: ek helper function hai jo async errors ko automatically next() middleware tak forward karta hai
const wrapAsync = require("../utils/wrapAsync.js");

// ✅ Passport.js ko import kiya, jo authentication ke liye use hota hai
const passport = require("passport");

// ✅ Middleware import kiya jo login se pehle user ka visited URL yaad rakhta hai (taaki login ke baad usi page par redirect ho sake)
const { saveRedirectUrl } = require("../middleware.js");

// ✅ User controller import kiya – jisme saare signup, login, logout ka logic hota hai
const userController = require("../controllers/user.js");


// 🧾 GET route to render SignUp form
// ➤ Jab user `/signup` URL pe jaye to form dikhana
router.get("/signup", userController.renderSignupForm);


// 📝 POST route to handle user registration
// ➤ Jab user signup form submit kare to ye route trigger hoga
router.post(
  "/signup",
  wrapAsync(userController.signup) // ✅ Agar async function me koi error aaya to wo wrapAsync usko handle karega
);


// 🔐 GET route to render Login form
// ➤ Jab user `/login` page pe jaye to login form dikhana
router.get("/login", userController.renderLoginForm);


// 🔐 POST route to handle login form submission
// ➤ Jab login form submit ho, toh user ko authenticate karo
router.post(
  "/login",
  saveRedirectUrl, // ✅ Middleware: Agar user login se pehle kisi protected page pe tha toh us page ka URL yaad rakhta hai

  // ✅ Passport middleware: 'local' strategy use karke username-password check karega
  passport.authenticate("local", {
    failureRedirect: '/login', // ❌ Agar login fail ho gaya to dubara login page pe bhej do
    failureFlash: true         // ❌ Flash message dikhaye (like: "Incorrect username or password")
  }),

  userController.login // ✅ Agar login successful ho gaya to userController ka login() function chalega
);


// 🔓 GET route to logout user
// ➤ Jab user `/logout` pe jaye to session destroy karke logout kar do
router.get("/logout", userController.logout);


// ✅ Is router file ko export kar rahe hain taaki app.js (ya index.js) mein import karke use kiya ja sake
module.exports = router;

