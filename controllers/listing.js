// ✅ Listing model import kiya - taaki hum MongoDB me listings se related operations kar sakein
const Listing = require("../models/listing");

// ============================================
// ✅ INDEX CONTROLLER: Show all listings
// Route: GET /listings
// ============================================
module.exports.index = async (req, res) => {
    // 🔍 Saare listings database se fetch kar liye
    const allListings = await Listing.find({});
    // 🖥️ listings/index.ejs page render karo aur listings data bhejo
    res.render("listings/index.ejs", { allListings });
};

// ============================================
// ✅ NEW FORM CONTROLLER: Show form to create a new listing
// Route: GET /listings/new
// ============================================
module.exports.renderNewForm = (req, res) => {
    // 🖥️ Nayi listing banane ke liye form show karo
    res.render("listings/new.ejs");
};

// ============================================
// ✅ SHOW CONTROLLER: Show single listing with populated data
// Route: GET /listings/:id
// ============================================
module.exports.showListing = async (req, res) => {
    let { id } = req.params;

    // 🔍 Listing find karo + reviews ke andar ke authors aur listing ke owner ko populate karo
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author", // ✅ Har review ka author bhi load hoga 
            },
        })
        .populate("owner"); // ✅ Listing ka owner bhi populate hoga

    // ❌ Agar listing nahi mili (invalid ID ya delete ho chuki hai)
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }

    // 🖥️ Show page render karo with complete data
    res.render("listings/show.ejs", { listing });
};

// ============================================
// ✅ CREATE CONTROLLER: Create new listing
// Route: POST /listings
// ============================================
module.exports.createListing = async (req, res, next) => {

  try {
    const newListing = new Listing(req.body.listing); // ✅ Using nested listing object
    newListing.owner = req.user._id;
    await newListing.save();

    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  } catch (err) {
    next(err);
  }
};



// ============================================
// ✅ EDIT FORM CONTROLLER: Show edit form for a listing
// Route: GET /listings/:id/edit
// ============================================
module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    // 🔍 Listing fetch kiya jise edit karna hai
    const listing = await Listing.findById(id);

    // ❌ Agar listing nahi mili
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }

    // 🖥️ Edit form render kiya
    res.render("listings/edit.ejs", { listing });
};

// ============================================
// ✅ UPDATE CONTROLLER: Update listing data
// Route: PUT /listings/:id
// ============================================
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    // ✏️ Listing ko update kar diya nayi data se
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    // ✅ Success message flash kiya
    req.flash("success", "Listing Updated!");
    // 🔁 Show page pe redirect kiya
    res.redirect(`/listings/${id}`);
};

// ============================================
// ✅ DELETE CONTROLLER: Delete listing
// Route: DELETE /listings/:id
// ============================================
module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    // 🗑️ Listing ko database se delete kar diya
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing); // 🐞 Debugging ke liye deleted object dekha
    // ✅ Flash message dikhaya
    req.flash("success", "Listing Deleted!");
    // 🔁 Redirect back to all listings
    res.redirect("/listings");
};