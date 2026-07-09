const express=require('express');
const router = express.Router();
const User=require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync.js');
const passport=require('passport');
const { savedRedirectUrl } = require('../middleware.js');
const userController = require('../controllers/users.js');

router
.route('/signup')
.get(userController.renderSignUp)
.post(wrapAsync(userController.signup));

router
.route('/login')
.get(userController.renderLogIn)
.post(savedRedirectUrl, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), wrapAsync(userController.login));

/*router.post('/login', wrapAsync(async (req, res, next) => {
    console.log("Login attempt:", req.body);
    const { email, password } = req.body;

    // Ensure email and password are provided
    if (!email || !password) {
        req.flash("error", "Email and password are required.");
        return res.redirect("/login");
    }

    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.flash("error", info.message || "Invalid email or password.");
            return res.redirect("/login");
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome back!");
            res.redirect(res.locals.redirectUrl || '/listing');
        });
    })(req, res, next);
}));*/


router.get('/logout',userController.logout);


module.exports=router;