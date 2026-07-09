const express=require('express');
const router=express.Router();
const Listing=require('../models/listing.js');
const expressError=require('../utils/ExpressError.js');
const wrapAsync=require('../utils/wrapAsync.js');
const {listingSchema} =require('../schema.js');
const { isLoggedIn ,isOwner} = require('../middleware.js');
const listingController=require('../controllers/listings.js');

const validateListing = (req,res,next)=>{
    const {error}=listingSchema.validate(req.body);
    if(error){
        let errorMsg=error.details.map(el=>el.message).join(',');
        throw new expressError(400,errorMsg);
    }else{
        next();
    }
}
router
.route('/')
.get(wrapAsync(listingController.index))
.post(isLoggedIn, validateListing, wrapAsync(listingController.createListing));


router.get('/new',isLoggedIn, listingController.renderNewForm);

router
.route('/:id')
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner, wrapAsync(listingController.updateListing))
.delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));




router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(listingController.editForm));


module.exports=router;