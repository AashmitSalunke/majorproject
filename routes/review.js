const express=require('express');
const router = express.Router({ mergeParams: true });
const wrapAync=require('../utils/wrapAsync.js');
const expressError=require('../utils/ExpressError.js');
const {reviewSchema} =require('../schema.js');
const Review = require('../models/review.js');
const Listing=require('../models/listing.js');

const validateReview = (req,res,next)=>{
    const {error}=reviewSchema.validate(req.body);
    if(error){
        let errorMsg=error.details.map(el=>el.message).join(',');
        throw new expressError(400,errorMsg);
    }else{
        next();
    }
}

router.post("/",validateReview,wrapAync(async (req, res) => {
   let listing=await Listing.findById(req.params.id);
    const review = new Review(req.body.review);
    listing.reviews.push(review);
    await review.save();
    await listing.save();
    req.flash('success', 'Review added successfully!');
    res.redirect(`/listing/${listing._id}`);

}));

router.delete("/:reviewId",wrapAync(async(req,res)=>{
    const{id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});


    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted successfully!');
    res.redirect(`/listing/${id}`);
}))

module.exports=router;
