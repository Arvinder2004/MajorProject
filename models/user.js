// ✅ Mongoose ko import kiya – ye MongoDB ke saath kaam karne ke liye ODM (Object Data Modeling) library hai
const mongoose = require("mongoose");

// ✅ Schema constructor ko extract kiya – isse hum MongoDB ke documents ka structure define karte hain
const Schema = mongoose.Schema;

// ✅ passport-local-mongoose ko import kiya – ye username/password authentication ko simplify karta hai
const passportLocalMongoose = require("passport-local-mongoose");

// ✅ Naya schema banaya jo User collection ke liye hoga
const userSchema = new Schema({
    // 🔑 Email field define kiya – isko required banaya gaya hai
    email: {
        type: String,
        required: true
    }
    // ❗Note: Hum yahan username aur password fields manually nahi likh rahe, because plugin automatically add karega
});

// ✅ Plugin use kiya jo userSchema me authentication-related fields aur methods add karta hai
// ➤ Ye automatically username, hash (password), salt fields ko schema me add kar deta hai
// ➤ Saath hi register(), authenticate(), serializeUser(), etc. jaise methods bhi milte hain
userSchema.plugin(passportLocalMongoose);

// ✅ Ab is schema ko model banake export kar diya taaki dusri files me import karke use kar sakein
// ➤ 'User' collection ka naam hoga (MongoDB me 'users' ban jaata hai by default)
module.exports = mongoose.model('User', userSchema);
