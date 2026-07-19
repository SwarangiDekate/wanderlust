const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("Connected to DB");
    initDB();
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  // Delete all old listings
  await Listing.deleteMany({});

  // Add owner to every listing

const data = initData.data.map((obj) => ({
    ...obj,
    owner: new mongoose.Types.ObjectId("6a4a92b57dd09ba1fe532775"),
    geometry: {
        type: "Point",
        coordinates: [79.0882, 21.1458], // Default coordinates
    },
}));

await Listing.insertMany(data);

  // Insert new listings
  await Listing.insertMany(data);

  console.log("Database initialized");
};