// ✅ Express module ko import karke router object banaya
const express = require("express");
const router = express.Router(); // Ab hum is router mein saare listing-related routes define karenge

const Listing = require("../models/listing"); // If not already there


// ✅ wrapAsync ek helper function hai jo async functions ke errors ko next() middleware tak bhej deta hai
const wrapAsync = require("../utils/wrapAsync.js");

// ✅ Middleware import kiya:
// isLoggedIn → check karta hai ki user logged-in hai ya nahi
// validateListing → listing data valid hai ya nahi (form submission ke time check karta hai)
const { isLoggedIn, validateListing } = require("../middleware.js");

// ✅ Controller file jahan actual logic likha hota hai har route ke liye
const listingController = require("../controllers/listing.js");


// ===========================================
// ✅ Index Route → Sabhi listings dikhata hai
// URL: /listings
// Method: GET
// ===========================================
router.get("/", wrapAsync(listingController.index));


// ===========================================
// ✅ New Route → Form dikhata hai nayi listing banane ke liye
// URL: /listings/new
// Method: GET
// ➤ Sirf logged-in user hi form dekh sakta hai
// ===========================================
router.get("/new", isLoggedIn, listingController.renderNewForm);


// 🔍 Search Route → Title ya location ke basis par listings filter karta hai
// URL: /listings/search?q=goa
// Method: GET
router.get("/search", wrapAsync(async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim() === "") {
    req.flash("error", "Please enter a search term.");
    return res.redirect("/listings");
  }

  // 🔍 MongoDB regex search on title or location (case-insensitive)
  const listings = await Listing.find({
    $or: [
      { title: { $regex: q, $options: "i" } },
      { location: { $regex: q, $options: "i" } },
    ]
  });

  if (listings.length === 0) {
    req.flash("error", `No results found for "${q}"`);
  }

  res.render("listings/index", { listings });
}));


// ===========================================
// ✅ Show Route → Specific ek listing ki details dikhata hai
// URL: /listings/:id
// Method: GET
// ===========================================
router.get("/:id", wrapAsync(listingController.showListing));


// ===========================================
// ✅ Create Route → Form submit karne ke baad new listing create karta hai
// URL: /listings
// Method: POST
// ➤ Sirf logged-in user hi listing create kar sakta hai
// ➤ validateListing middleware se data validate hota hai
// ===========================================
router.post("/", 
  isLoggedIn,             // Sirf login user hi create kar sakta hai
  validateListing,        // Listing data valid hai ya nahi check karega
  wrapAsync(listingController.createListing)  // Controller me actual DB logic hai
);


// ===========================================
// ✅ Edit Route → Existing listing ke liye edit form dikhata hai
// URL: /listings/:id/edit
// Method: GET
// ➤ Sirf logged-in user hi form dekh sakta hai
// ===========================================
router.get("/:id/edit", isLoggedIn, wrapAsync(listingController.renderEditForm));


// ===========================================
// ✅ Update Route → Edit form submit karne ke baad DB update karta hai
// URL: /listings/:id
// Method: PUT
// ➤ Sirf logged-in user hi update kar sakta hai
// ➤ validateListing se data valid hone ka check hota hai
// ===========================================
router.put("/:id", 
  isLoggedIn, 
  validateListing, 
  wrapAsync(listingController.updateListing)
);


// ===========================================
// ✅ Delete Route → Listing ko delete karta hai
// URL: /listings/:id
// Method: DELETE
// ➤ Sirf logged-in user hi delete kar sakta hai
// ===========================================
router.delete("/:id", isLoggedIn, wrapAsync(listingController.destroyListing));


// ✅ Export router taaki app.js mein use ho sake
module.exports = router;
