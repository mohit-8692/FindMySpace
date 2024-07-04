const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listings.js");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// Middleware to set showFooter variable
const setShowFooter = (showFooter) => (req, res, next) => {
    res.locals.showFooter = showFooter;
    next();
};

router
    .route("/")
    .get(setShowFooter(true), wrapAsync(listingController.index)) // Index Route
    .post(
        isLoggedIn,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.createListing)
    );

// New Route
router.get("/new", isLoggedIn, setShowFooter(false), listingController.renderNewForm);

router
    .route("/:id")
    .get(setShowFooter(true), wrapAsync(listingController.showListing))  // Show Route
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
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    setShowFooter(false),
    wrapAsync(listingController.renderEditForm)
);

module.exports = router;
