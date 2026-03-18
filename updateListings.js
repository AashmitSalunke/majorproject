const mongoose = require('mongoose');
const Listing = require('./models/listing');

async function updateListings() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
        console.log("Connected to MongoDB");

        const listings = await Listing.find({});
        for (const listing of listings) {
            if (typeof listing.image === 'string' || !listing.image) {
                listing.image = {
                    url: listing.image || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
                    filename: ''
                };
                await listing.save();
                console.log(`Updated listing with ID: ${listing._id}`);
            }
        }

        console.log("All listings updated successfully");
        mongoose.connection.close();
    } catch (err) {
        console.error("Error updating listings:", err);
        mongoose.connection.close();
    }
}

updateListings();