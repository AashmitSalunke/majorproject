const User = require('../models/user.js');

module.exports.renderSignUp = (req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signup = async (req, res, next) => {
    console.log(req.body);
    try {
        const { username, email, password } = req.body;

        // Ensure email is provided
        if (!email) {
            req.flash("error", "Email is required.");
            return res.redirect("/signup");
        }

        const registeredUser = new User({ username, email });
        const newUser = await User.register(registeredUser, password);

       req.login(newUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "Welcome to Wanderlust!");
        res.redirect("/listing");
       });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}


module.exports.renderLogIn = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect(res.locals.redirectUrl || '/listing');
}

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","Logged out successfully!");
        res.redirect("/listing");
    })
}