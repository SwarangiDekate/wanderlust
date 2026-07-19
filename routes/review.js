const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn, isReviewAuthor,} = require("../middleware.js");

const { createReview, destroyReview,} = require("../controller/review.js");

// Create Review
router.post(
    "/",
    isLoggedIn,
    validateReview,
    wrapAsync(createReview)
);

// Delete Review
router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(destroyReview)
);

module.exports = router;