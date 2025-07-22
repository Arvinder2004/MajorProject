// ✅ Models import kiye – Listing aur Review dono
const Listing = require("../models/listing");
const Review = require("../models/review");


// ==============================================
// ✅ Create Review Controller
// ➤ User jab review form submit karta hai
// Route: POST /listings/:id/reviews
// ==============================================
module.exports.createReview = async (req, res) => {
    console.log(req.body); // 🐞 Debug ke liye – form se aayi data print ho raha hai

    // ✅ Step 1: Listing find karo jisme review add karna hai
    let listing = await Listing.findById(req.params.id);

    // ✅ Step 2: Review object create karo user ke submitted data se
    let newReview = new Review(req.body.review);  // `{ comment, rating }`

    // ✅ Step 3: Review ke author field me current logged-in user ka ID store karo
    newReview.author = req.user.id;

    // ✅ Step 4: Listing ke reviews array me naye review ka reference push karo
    listing.reviews.push(newReview);

    console.log(newReview); // 🐞 Naya review print for checking

    // ✅ Step 5: Dono – review aur listing – save karo database me
    await newReview.save();
    await listing.save();

    // ✅ Step 6: Flash message and redirect
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
};


// ==============================================
// ✅ Destroy Review Controller
// ➤ Jab user kisi review ko delete karta hai
// Route: DELETE /listings/:id/reviews/:reviewId
// ==============================================
module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;

    // ✅ Step 1: Listing me se review ID ko pull (remove) kar rahe hain
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    // ❌❗Step 2: Yahaan galti hai – Review sirf find kiya gaya, delete nahi
    // ✅ Fix: Review ko delete karna chahiye
    await Review.findByIdAndDelete(reviewId);  // 🔧 Fix applied here

    // ✅ Step 3: Flash message and redirect
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
};
