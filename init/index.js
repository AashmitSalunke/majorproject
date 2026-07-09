const mongoose=require('mongoose');
const initData=require('./init.js');
const Listing=require('../models/listing.js');
main().then(()=>{
    console.log("Connected to MongoDB");

})
.catch(err=>{
    console.log("Error connecting to MongoDB:",err);
});
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
const initDB= async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"69f9deedb57f6813df4ec321"}));
    await Listing.insertMany(initData.data);
    console.log("created");
}
initDB();