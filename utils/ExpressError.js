// ✅ Custom Error Class bana rahe hain jo Express ke error handling mein kaam aata hai
class ExpressError extends Error {
  
  // ✅ Jab bhi new ExpressError(statusCode, message) banega
  constructor(statusCode, message) {
    super(); // ✅ parent Error class ka constructor call kar rahe hain

    // ✅ Custom property: HTTP status code jaise 404, 400, 500
    this.statusCode = statusCode;

    // ✅ Error message jo hum manually denge
    this.message = message;
  }
}

// ✅ Is class ko dusri files mein use karne ke liye export kar rahe hain
module.exports = ExpressError;
