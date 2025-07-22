// ✅ Import JOI for validation
const Joi = require('joi');

// ✅ SCHEMA 1: listingSchema
// ➤ Ye schema use hota hai jab user koi new listing create ya update karta hai
module.exports.listingSchema = Joi.object({
    // 🧩 listing ke andar ek object aayega
    listing: Joi.object({
        title: Joi.string().required(),        // Title field string honi chahiye & required hai
        description: Joi.string().required(),  // Description bhi required string hai
        location: Joi.string().required(),     // Location (city, etc.) bhi required
        country: Joi.string().required(),      // Country required
        price: Joi.number().required().min(0),// Price number hai, required hai & min value 0 (👈 NOTE: ideally price should be number)
        image: Joi.string().allow("", null),   // Image optional hai, empty string ya null bhi allowed hai
    }).required() // 🔐 Entire listing object required hona chahiye
});


// ✅ SCHEMA 2: reviewSchema
// ➤ Ye schema use hota hai jab user koi review post ya update karta hai
module.exports.reviewSchema = Joi.object({
    // 🧩 review ke andar ek object aayega
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5), // Rating number honi chahiye 1–5 ke beech
        comment: Joi.string().required(),              // Comment required string hai
    }).required() // 🔐 Entire review object required hona chahiye
});
