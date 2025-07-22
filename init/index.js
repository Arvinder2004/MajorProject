// ✅ Mongoose import kiya – MongoDB ke saath kaam karne ke liye
const mongoose = require("mongoose");

// ✅ initData import kiya – ye ek file hai jisme dummy listings data hai
const initData = require("./data.js");

// ✅ Listing model import kiya – taaki usme data insert kar sakein
const Listing = require("../models/listing.js");

// ✅ Local MongoDB ka URL jahan hum connect kar rahe hain
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// ✅ MongoDB connection start karne ke liye async function banaya
main()
  .then(() => {
    console.log("connected to DB"); // ✅ Agar connection successful hua to ye print hoga
  })
  .catch((err) => {
    console.log(err); // ❌ Agar connection me error aaya to yahan catch hoga
  });

// ✅ MongoDB se connect hone wala actual async function
async function main() {
  await mongoose.connect(MONGO_URL);
}

// ✅ DB ko initialize karne wala function – saara purana data hata ke naya insert karega
const initDB = async () => {
  // ❌ Purani saari listings delete kar do (clean start)
  await Listing.deleteMany({});

  // ✅ Har ek listing object me ek fixed `owner` ID daal rahe hain
  // ➤ Iska matlab hai ki saari listings ek hi user ke naam pe ho jaayengi (demo/testing ke liye)
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "6694c364e1f062a54331f0a8", // ✅ User ID hardcoded – make sure this exists in DB
  }));

  // ✅ Modified listings ko DB me insert kar rahe hain
  await Listing.insertMany(initData.data);

  console.log("data was initialized"); // ✅ Success message
};

// ✅ Ab initDB function call kar rahe hain taaki seeding process start ho jaaye
initDB();
