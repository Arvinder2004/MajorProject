const express = require("express");
const router = express.Router();

const Listing = require("../models/listing");

const wrapAsync = require("../utils/wrapAsync.js");

const { isLoggedIn, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listing.js");


router.get("/", wrapAsync(listingController.index));


router.get("/new", isLoggedIn, listingController.renderNewForm);


router.get("/search", wrapAsync(listingController.searchListings));


router.get("/:id", wrapAsync(listingController.showListing));


router.post("/", 
  isLoggedIn,             
  validateListing,        
  wrapAsync(listingController.createListing) 
);


router.get("/:id/edit", isLoggedIn, wrapAsync(listingController.renderEditForm));


router.put("/:id", 
  isLoggedIn, 
  validateListing, 
  wrapAsync(listingController.updateListing)
);


router.delete("/:id", isLoggedIn, wrapAsync(listingController.destroyListing));


module.exports = router;
