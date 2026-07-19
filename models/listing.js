const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },

    description: String,

    image: {
        url:String,
        filename: String,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
    },
},
category: {
    type: String,
    enum: [
        "Trending",
        "Mountain",
        "Rooms",
        "Castles",
        "Arctic",
        "Camping",
        "Iconic Cities",
        "Farms",
        "Forest",
        "Beach",
        "Amazing Pools"
    ]
}});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({
            _id: { $in: listing.reviews },
        });
    }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;
// const Review = require("./review.js");

// const listingSchema = new Schema({
//     title: {
//         type: String,
//         required: true,
//     },
//     description: String,

//     // image: {
//     //     type: String,
//     //     default: "https://amusementlogic.com/wp-content/uploads/2024/06/Architecture-and-environment-luxury-villa-and-nature-02.jpg",
//     // },
//     image: {
//     filename: {
//         type: String,
//         default: "listingimage",
//     },
//     url: {
//         type: String,
//         default:
//             "https://amusementlogic.com/wp-content/uploads/2024/06/Architecture-and-environment-luxury-villa-and-nature-02.jpg",
//     },
// },

//     price: Number,
//     location: String,
//     country: String,

//     reviews: [
//         {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "Review",
//         },
//     ],
// });

// listingSchema.post("findOneAndDelete", async (listing) => {
//     if (listing) {
//         await Review.deleteMany({
//             _id: { $in: listing.reviews },
//         });
//     }
// });

// const Listing = mongoose.model("Listing", listingSchema);

// module.exports = Listing;