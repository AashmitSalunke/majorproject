const express=require('express');
const app=express();
const mongoose=require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const path = require("path");
const expressError=require('./utils/ExpressError.js');
const listingRouter=require('./routes/listing.js');
const reviewRouter=require('./routes/review.js');
const userRouter=require('./routes/user.js');
const session=require('express-session');
const flash=require('connect-flash');
const User=require('./models/user.js');
const passport=require('passport');
const LocalStrategy=require('passport-local');


const port=3000;
main().then(()=>{
    console.log("Connected to MongoDB");

})
.catch(err=>{
    console.log("Error connecting to MongoDB:",err);
});
async function main(){
    await mongoose.
    connect('mongodb://127.0.0.1:27017/wanderlust');
}
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.engine('ejs', ejsMate);

let sessionOptions={
    secret:"mysecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
}
app.get('/', (req, res) => {
    res.redirect('/listing');
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    res.locals.currentUser=req.user;
    next();
})


app.use('/listing',listingRouter);

app.use('/listings/:id/reviews',reviewRouter);

app.use('/',userRouter);

app.use((req, res, next) => {
    next(new expressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong" } = err;
    res.status(status).render("listings/error", { status, message });
});

app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
})
