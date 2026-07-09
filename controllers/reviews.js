const Review = require('../models/review');
const Listing=require('../models/listing');

module.exports.createReviews = async (req, res) => {
   let listing=await Listing.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    listing.reviews.push(review);
    await review.save();
    await listing.save();
    req.flash('success', 'Review added successfully!');
    res.redirect(`/listing/${listing._id}`);
   

}

module.exports.deleteReviews = async(req,res)=>{
    const{id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});


    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted successfully!');
    res.redirect(`/listing/${id}`);
}