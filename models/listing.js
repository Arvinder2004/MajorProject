// ✅ Mongoose import kiya – MongoDB ke saath kaam karne ke liye
const mongoose = require("mongoose");

// ✅ Schema constructor extract kiya
const Schema = mongoose.Schema;

// ✅ Review model import kiya – taaki delete hone par associated reviews bhi delete ho saken
const Review = require("./review.js");

// ✅ Listing ka schema banaya – ye batata hai ek listing document ke andar kya fields honge
const listingSchema = new Schema({
  
  // 🏷️ Title of the listing (required field)
  title: {
    type: String,
    required: true,
  },

  // 📝 Description field (optional)
  description: String,

  // 🖼️ Image URL – agar user ne nahi diya to ek default image use hoga
  image: {
    type: String,
    default:
      "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",

    // ✅ Agar user ne khali string diya hai, to default image use hoga
    set: (v) =>
      v === ""
        ? "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
        : v,
  },

  // 💰 Price of the listing
  price: Number,

  // 📍 Location details
  location: String,
  country: String,

  // ⭐ Review IDs ka array – har ek review ko reference kiya gaya hai (foreign key)
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],

  // 👤 Owner of the listing – ek user ko reference diya gaya hai
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});


// ✅ Mongoose middleware (post hook) – jab bhi koi listing delete hoti hai...
// ➤ Us listing ke saare reviews bhi delete ho jaate hain
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    // 🔄 Us listing ke saare reviews ke IDs ko use karke unhe delete karo
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});


// ✅ Model banaya aur export kar diya jisse dusri files me use kiya ja sake
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
