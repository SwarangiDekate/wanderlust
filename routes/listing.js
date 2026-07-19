// const express = require("express");
// const router = express.Router();
// const Listing = require("../models/listing.js");
// const methodOverride = require("method-override");
// const wrapAsync = require("../utils/wrapAsync.js");
// const {isLoggedIn ,isOwner,validateListing} =require("../middleware.js");
// const listingController= require("../controller/listing.js")


// //Index Route //Create Route
// router
//     .route("/")
//     .get( wrapAsync (listingController.index))
//     .post(
//         isLoggedIn ,
//         validateListing,
//         wrapAsync(listingController.createListing));


// //New Route
// router.get("/new",isLoggedIn, listingController.renderForm);

// //Show Route //Update Route  //Delete Route
// router.route("/:id")
//     .get(wrapAsync(listingController.showListing))
//     .put(
//         isLoggedIn,
//         isOwner,
//         validateListing,
//         wrapAsync(listingController.updateListing)
//     )
//     .delete(
//         isLoggedIn,
//         isOwner,
//         wrapAsync(listingController.destroyListing)
//     );
// //Edit Route
// router.get("/:id/edit",
//     isLoggedIn,
//     isOwner,
//     wrapAsync(listingController.EditForm));
// module.exports = router;
const express = require("express");
const router = express.Router();

const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controller/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig");

const upload = multer({ storage });

// Index Route & Create Route
router
  .route("/")
  .get(wrapAsync(listingController.index))
.post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
);
router.get("/category/:category", listingController.filterByCategory);
router.get("/search", wrapAsync(listingController.searchListing));
// New Route
router.get("/new", isLoggedIn, listingController.renderForm);

// Show, Update & Delete Routes
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing)
  );

// Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.EditForm)
);

module.exports = router;