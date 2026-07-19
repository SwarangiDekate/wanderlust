const Listing = require("../models/listing");
const geocoder = require("../utils/geocoder.js");

// Show all listings
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};
module.exports.filterByCategory = async (req, res) => {
    const { category } = req.params;

    const allListings = await Listing.find({ category });

    res.render("listings/index.ejs", { allListings });
};
module.exports.searchListing = async (req, res) => {
    console.log(req.query);

    const { q } = req.query;
    console.log(q);

    const allListings = await Listing.find({
        $or: [
            { title: { $regex: q, $options: "i" } },
            { location: { $regex: q, $options: "i" } },
            { country: { $regex: q, $options: "i" } },
        ],
    });

    console.log(allListings);

    res.render("listings/index.ejs", { allListings });
};
// Render New Listing Form
module.exports.renderForm = (req, res) => {
    res.render("listings/new.ejs");
};

// Show Single Listing
module.exports.showListing = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
};

// Create New Listing
module.exports.createListing = async (req, res, next) => {
    try {
        const newListing = new Listing(req.body.listing);

        newListing.owner = req.user._id;

        if (req.file) {
            newListing.image = {
                url: req.file.path,
                filename: req.file.filename,
            };
        }

        // Get coordinates
        const response = await geocoder.geocode(req.body.listing.location);

        if (response.length > 0) {
            newListing.geometry = {
                type: "Point",
                coordinates: [
                    Number(response[0].longitude),
                    Number(response[0].latitude),
                ],
            };
        } else {
            // Default coordinates (Nagpur)
            newListing.geometry = {
                type: "Point",
                coordinates: [79.0882, 21.1458],
            };
        }
        

        await newListing.save();

        req.flash("success", "Listing Created Successfully!");
        res.redirect("/listings");
    } catch (err) {
        next(err);
    }
};


// Render Edit Form
module.exports.EditForm = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");

    res.render("listings/edit.ejs", {
        listing,
        originalImageUrl,
    });
};

// Update Listing
module.exports.updateListing = async (req, res) => {
    const { id } = req.params;

    const response = await geocoder.geocode(req.body.listing.location);

    const listing = await Listing.findByIdAndUpdate(
        id,
        { ...req.body.listing },
        { new: true }
    );

    if (response.length > 0) {
        listing.geometry = {
            type: "Point",
            coordinates: [
                Number(response[0].longitude),
                Number(response[0].latitude),
            ],
        };
    }

    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename,
        };
    }
    console.log(listing.geometry);
    await listing.save();

    req.flash("success", "Listing Updated Successfully!");
    res.redirect(`/listings/${id}`);
};

// Delete Listing
module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;

    await Listing.findByIdAndDelete(id);

    req.flash("success", "Listing Deleted Successfully!");
    res.redirect("/listings");
};