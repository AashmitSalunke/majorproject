const Listing = require('./models/listing');
const Review = require('./models/review');

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash('error','You must be logged in to do that!');
        return res.redirect('/login');
    }
    next();
}

module.exports.savedRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;

}
next();
}

module.exports.isOwner=async(req,res,next)=>{
    const {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currentUser._id)){
        req.flash('error', 'You do not have permission');
        return res.redirect(`/listing/${id}`);
}
next();
}


module.exports.isAuthor=async(req,res,next)=>{
    const {reviewId}=req.params;
    const review=await Review.findById(reviewId);
    if(!review || !review.author){
        req.flash('error', 'Review not found');
        return res.redirect('back');
    }
    if(!review.author.equals(res.locals.currentUser._id)){
        req.flash('error', 'You do not have permission');
        return res.redirect('back');
    }
    next();
}