// ✅ Mongoose ko import kiya – MongoDB ke documents ko handle karne ke liye
const mongoose = require("mongoose");

// ✅ Schema constructor extract kiya jisse hum schema banate hain
const Schema = mongoose.Schema;

// ✅ Review ka schema banaya – ye batata hai ki har review document me kya-kya fields honge
const reviewSchema = new Schema({
    
    // ✅ User ka comment (plain text)
    comment: String,

    // ✅ Rating field – 1 se 5 ke beech me number hi allowed hai
    rating: {
        type: Number,
        min: 1,  // Minimum rating allowed
        max: 5   // Maximum rating allowed
    },

    // ✅ Review kab create hua uska timestamp store karne ke liye
    createdAt: {
        type: Date,
        default: Date.now()  // ✅ Default value: jab document banega tab ki date
    },

    // ✅ Review ka author kaun hai – uska reference User collection se
    author: {
        type: Schema.Types.ObjectId,  // ✅ Mongoose ObjectId use hota hai reference ke liye
        ref: "User"  // ✅ 'User' model se reference banata hai (foreign key jaisa)
    }
});

// ✅ Review model banakar export kar diya jisse doosri files me import karke use kar sakein
module.exports = mongoose.model("Review", reviewSchema);
