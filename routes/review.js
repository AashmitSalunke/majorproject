const express=require('express');
const router = express.Router({ mergeParams: true });
const wrapAync=require('../utils/wrapAsync.js');
const expressError=require('../utils/ExpressError.js');
const {reviewSchema} =require('../schema.js');
const Review = require('../models/review.js');
const Listing=require('../models/listing.js');
const {isLoggedIn,isAuthor}=require('../middleware.js');
const reviewController=require('../controllers/reviews.js');

const validateReview = (req,res,next)=>{
    const {error}=reviewSchema.validate(req.body);
    if(error){
        let errorMsg=error.details.map(el=>el.message).join(',');
        throw new expressError(400,errorMsg);
    }else{
        next();
    }
}

router.post("/",isLoggedIn,validateReview,wrapAync(reviewController.createReviews));

router.delete("/:reviewId",isAuthor,wrapAync(reviewController.deleteReviews))

module.exports=router;
