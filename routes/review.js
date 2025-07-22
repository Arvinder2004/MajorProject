// ✅ Express ko import kar rahe hain jisse routes aur server banate hain
const express = require("express");

// ✅ express.Router() ka use karke ek naya router object bana rahe hain
// mergeParams: true ka matlab hai ki parent route ke params (like :id) ko bhi yeh router access kar sakta hai
const router = express.Router({ mergeParams: true });

// ✅ wrapAsync ek utility function hai jo async functions ke errors ko automatically next() middleware tak bhej deta hai
const wrapAsync = require("../utils/wrapAsync.js");

// ✅ Custom middleware functions ko import kar rahe hain
// validateReview: review ka data sahi format ka hai ya nahi check karta hai
// isLoggedIn: user login hai ya nahi yeh check karta hai
const { validateReview, isLoggedIn } = require("../middleware.js");

// ✅ Controller file jisme actual logic likha hai reviews se related
// listing.js ke andar createReview aur destroyReview functions defined hain
const reviewController = require("../controllers/review.js");


// ==========================
// ✅ Reviews Routes Shuru
// ==========================

// ✅ POST route: Review create karne ke liye
// Example URL: /listings/:id/reviews
router.post(
  "/",                         // Base path ke liye post route
  isLoggedIn,                  // Middleware: Sirf logged-in user hi review likh sakta hai
  validateReview,              // Middleware: Review ka content valid hai ya nahi check karta hai
  wrapAsync(reviewController.createReview)  // Controller function ko error handler ke saath run kar rahe hain
);


// ✅ DELETE route: Review delete karne ke liye
// Example URL: /listings/:id/reviews/:reviewId
router.delete(
  "/:reviewId",               // Dynamic URL: jisme reviewId diya gaya hai
  isLoggedIn,                 // Middleware: Sirf logged-in user hi review delete kar sakta hai
  wrapAsync(reviewController.destroyReview)  // Controller function with error handling
);


// ✅ Router ko export kar rahe hain taki app.js ya index.js mein use ho sake
module.exports = router;
