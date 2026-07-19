const Listing = require("./models/listing");
const Review = require("./models/review");   // <-- Add this
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewsSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {

        // If the request is for reviews,
        // save the listing page instead of the POST URL
        if (req.originalUrl.includes("/reviews")) {
            req.session.redirectUrl = `/listings/${req.params.id}`;
        } else {
            req.session.redirectUrl = req.originalUrl;
        }

        req.flash("error", "Please login first!");
        return res.redirect("/login");
    }

    next();
};
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
        delete req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req,res,next) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You don't have permission to make changes!!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports.isReviewAuthor= async(req,res,next) =>{
    let {id, reviewId} = req.params;
    let review  = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You don't have permission to make changes!!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports.validateListing = (req, res, next) => {
    console.log("BODY:", req.body);

    let { error } = listingSchema.validate(req.body);

    if (error) {
        console.log(error.details);
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }

    next();
};
module.exports.validateReview =(req,res,next) =>{
   let {error }= reviewsSchema.validate(req.body);
  
  if(error){
    let errMsg = error.details.map((el) =>el.message).join(",");
    throw new ExpressError(400,errMsg);
  }else{
    next();
  }
}
