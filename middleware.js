// ✅ Importing custom ExpressError class for throwing structured errors
const ExpressError = require("./utils/ExpressError.js");

// ✅ Importing JOI schemas for server-side validation
const { listingSchema, reviewSchema } = require("./schema.js");


// ✅ MIDDLEWARE 1: isLoggedIn
// ➤ Ye middleware ensure karta hai ki user logged in ho before accessing protected routes (like create/edit)
module.exports.isLoggedIn = (req, res, next) => {
    // ❌ Agar user logged in nahi hai (passport method)
    if (!req.isAuthenticated()) {
        // 🔐 Save current URL in session so user can be redirected back after login
        req.session.redirectUrl = req.originalUrl;

        // ⚠️ Show error flash message
        req.flash("error", "you must be logged in to create listing!");

        // 🔁 Redirect to login page
        return res.redirect("/login");
    }

    // ✅ User authenticated hai, toh proceed to next middleware/handler
    next();
};


// ✅ MIDDLEWARE 2: saveRedirectUrl
// ➤ Login ke baad user ko originally requested page par redirect karne ke liye
module.exports.saveRedirectUrl = (req, res, next) => {
    // 💾 Agar session mein redirect URL hai, use res.locals mein store karo (so EJS templates can access it)
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};


// ✅ MIDDLEWARE 3: validateListing
// ➤ Listing create/update ke liye data validation using JOI
module.exports.validateListing = (req, res, next) => {
    // 📋 Validate incoming listing data against schema
    let { error } = listingSchema.validate(req.body);

    // ❌ Agar validation error mila
    if (error) {
        // 🔍 All error messages ko join karke ek readable string banao
        let errMsg = error.details.map((el) => el.message).join(",");

        // 🚨 Custom error throw karo with status code 400
        throw new ExpressError(400, errMsg);
    } else {
        // ✅ Valid data → proceed to route handler
        next();
    }
};


// ✅ MIDDLEWARE 4: validateReview
// ➤ Review create/update ke liye data validation using JOI
module.exports.validateReview = (req, res, next) => {
    // 📋 Validate review data (usually rating & comment)
    let { error } = reviewSchema.validate(req.body);

    // ❌ Agar validation fail hua
    if (error) {
        // 🛠️ Sare validation messages combine karo
        let errMsg = error.details.map((el) => el.message).join(",");

        // 🚨 Custom 400 error throw
        throw new ExpressError(400, errMsg);
    } else {
        // ✅ All good, move forward
        next();
    }
};



  // module.exports.isReviewAuthor = async (req, res, next) => {
  //   let { id, reviewId } = req.params;
  //   let review = await Review.findById(reviewId);
  //   if(!review.author.equals(res.locals.currUser._id)) {
  //     req.flash("error", "You must be the author of this review to delete it!");
  //     return res.redirect(`/listings/${listing._id}`);
  //   }
  //   next();
  // };