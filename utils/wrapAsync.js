// ✅ Ye ek higher-order function hai jo async functions ke errors ko handle karta hai.
// ❗ Yeh error handling middleware se automatically connect karta hai agar async mein error aaye toh.

// ✅ fn = async function (e.g. async (req, res, next) => { ... }) 
module.exports = (fn) => {
    // ✅ Middleware return kar rahe hain jo Express ke req, res, next ko accept karta hai
    return (req, res, next) => {
        // ✅ fn ko call karo aur agar koi error aaye toh usse .catch(next) se handle karo
        // ❗ next(error) automatically Express ke global error handler ko call karega
        fn(req, res, next).catch(next);
    };
};
