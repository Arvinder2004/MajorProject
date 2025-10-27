const Listing = require("../models/listing");

module.exports.index = async (req, res) => {

    try{
        const allListings = await Listing.find({});
        
        res.render("listings/index.ejs", { allListings });
    }
    catch (err) {
        console.error("Error fetching listings:", err);
        req.flash("error", "Server is waking up or listing fetch failed. Please try again shortly.");
        res.redirect("/");
    }
};


module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};


module.exports.showListing = async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
};


module.exports.createListing = async (req, res, next) => {

  try {
    const newListing = new Listing(req.body.listing); 
    newListing.owner = req.user._id;
    await newListing.save();

    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  } catch (err) {
    next(err);
  }
};


module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }

    res.render("listings/edit.ejs", { listing });
};


module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    
    req.flash("success", "Listing Updated!");
  
    res.redirect(`/listings/${id}`);
};


module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    
    req.flash("success", "Listing Deleted!");
   
    res.redirect("/listings");
};


module.exports.searchListings = async (req, res) => {
  const { q } = req.query;

  if (!q) {
    const allListings = await Listing.find({});
    return res.render("listings/index", { allListings });
  }

  
  const regex = new RegExp(q, 'i');
  const allListings = await Listing.find({
    $or: [
      { title: regex },
      { country: regex },
      { location: regex }
    ]
  });

  res.render("listings/index", { allListings });
};
