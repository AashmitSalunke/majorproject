const express=require('express');
const router = express.Router();
const User=require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync.js');
const passport=require('passport');
const { savedRedirectUrl } = require('../middleware.js');

router.get('/signup',(req,res)=>{
    res.render("users/signup.ejs");
})

router.post('/signup',wrapAsync(async (req,res)=>{
    try{
        let{name,email,password}=req.body;
        const registeredUser=new User({email,name});
        const newUser=await User.register(registeredUser,password);
        req.login(newUser,(err)=>{
            if(err){
                return next(err);
            }
         req.flash("success","Welcome to Wanderlust!");
        res.redirect("/listing");
    });
       
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}))



router.get('/login',(req,res)=>{
    res.render("users/login.ejs");
});


router.post('/login',savedRedirectUrl,passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),async(req,res)=>{
    req.flash("success","Welcome back!");
    res.redirect(res.locals.redirectUrl || '/listing');
});



router.get('/logout',(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","Logged out successfully!");
        res.redirect("/listing");
    })
})


module.exports=router;