const Listing = require('../models/listing');


module.exports.index = async (req, res) => {
    console.log("GET /listing route accessed"); // Debug log
    let allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
}

module.exports.renderNewForm = (req, res) => {
    res.render('listings/new.ejs');
}

module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({"path": "reviews", "populate": {"path": "author"}}).populate('owner');
    if (!listing) {
        req.flash('error', 'Listing not found!');
        res.redirect('/listing');
        return;
    }
    console.log("Listing data:", listing);
    res.render("listings/show.ejs", { listing });
}

module.exports.editForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash('error', 'Listing not found!');
        res.redirect('/listing');
        return;
    }
    res.render('listings/edit.ejs', { listing });
}

module.exports.createListing = async (req, res) => {
    const data = req.body.listing;
    if (typeof data.image === 'string') {
        data.image = {
            filename: 'default',
            url: data.image,
        };
    }
    const newListing = new Listing(data);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash('success', 'Listing created successfully!');
    res.redirect('/');
}

module.exports.updateListing = async (req, res, next) => {
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
}

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'Listing deleted successfully!');
   res.redirect('/listing');

}