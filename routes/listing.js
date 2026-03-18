const express=require('express');
const router=express.Router();
const Listing=require('../models/listing.js');
const expressError=require('../utils/ExpressError.js');
const wrapAync=require('../utils/wrapAsync.js');
const {listingSchema} =require('../schema.js');
const { isLoggedIn } = require('../middleware.js');

const validateListing = (req,res,next)=>{
    const {error}=listingSchema.validate(req.body);
    if(error){
        let errorMsg=error.details.map(el=>el.message).join(',');
        throw new expressError(400,errorMsg);
    }else{
        next();
    }
}

router.get('/', wrapAync(async (req, res) => {
    console.log("GET /listing route accessed"); // Debug log
    let allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
}));

router.get('/new', isLoggedIn, (req, res) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be logged in to create a listing!');
        return res.redirect('/login');
    }
    res.render('listings/new.ejs');
});

router.post('/',isLoggedIn, async (req, res) => {
    const data = req.body.listing;
    if (typeof data.image === 'string') {
        data.image = {
            filename: 'default',
            url: data.image,
        };
    }
    const newListing = new Listing(data);
    await newListing.save();
    req.flash('success', 'Listing created successfully!');
    res.redirect('/');
});

router.get('/:id', wrapAync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
        req.flash('error', 'Listing not found!');
        res.redirect('/listing');
        return;
    }
    console.log("Listing data:", listing);
    res.render("listings/show.ejs", { listing });
}));

router.get('/:id/edit',isLoggedIn, wrapAync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash('error', 'Listing not found!');
        res.redirect('/listing');
        return;
    }
    res.render('listings/edit.ejs', { listing });
}));

router.put('/:id',isLoggedIn, async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = req.body.listing;
        if (typeof data.image === 'string') {
            data.image = {
                filename: 'default',
                url: data.image,
            };
        }
        await Listing.findByIdAndUpdate(id, { ...data });
        req.flash('success', 'Listing updated successfully!');
       res.redirect(`/listing/${id}`);
    } catch (err) {
        console.error("Error during update:", err);
        next(err);
    }
});

router.delete('/:id',isLoggedIn, wrapAync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'Listing deleted successfully!');
   res.redirect('/listing');

}));

module.exports=router;