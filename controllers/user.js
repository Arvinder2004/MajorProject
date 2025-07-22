// ✅ User model import kiya – jisme passport-local-mongoose laga hua hai
const User = require("../models/user.js");

// ================================================
// ✅ Render Signup Form
// ➤ Jab user GET /signup par jaye to form dikhao
// ================================================
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");  // Signup form render karega
};


// ================================================
// ✅ Signup Logic – New user ko register karta hai
// ➤ POST /signup se aata hai
// ================================================
module.exports.signup = async (req, res) => {
    try {
        // ✅ Destructure user input: username, email, password
        let { username, email, password } = req.body;

        // ✅ Sirf username & email se new User object banaya (password alag handle hota hai)
        const newUser = new User({ email, username });

        // ✅ passport-local-mongoose ka register method use kiya
        // ➤ password ko hash karke DB me securely store karega
        const registeredUser = await User.register(newUser, password);

        console.log(registeredUser); // For debugging

        // ✅ User ko register karne ke baad turant login bhi kara rahe hain
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err); // ❌ Agar login me error aaya
            }

            // ✅ Flash message show & redirect to listings
            req.flash("success", "Welcome to WanderLust!");
            res.redirect("/listings");
        });

    } catch (e) {
        // ❌ Agar registration me koi error aaya (jaise duplicate username)
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};


// ================================================
// ✅ Render Login Form
// ➤ Jab user GET /login par jaye to form dikhao
// ================================================
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs"); // Login form render karega
};


// ================================================
// ✅ Login Success Handler
// ➤ POST /login ke baad passport authenticate karta hai
// ➤ Agar success ho gaya to ye function chalega
// ================================================
module.exports.login = async (req, res) => {
    req.flash("success", "Welcome to Wanderlust!");

    // ✅ Agar user kisi protected page se redirect hua hai to wapas wahi le jao
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};


// ================================================
// ✅ Logout Controller
// ➤ GET /logout par session destroy karta hai
// ================================================
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err); // ❌ Agar logout me error ho
        }

        req.flash("success", "you are logged out!"); // ✅ Flash message show karo
        res.redirect("/listings"); // ✅ Redirect back to main page
    });
};
