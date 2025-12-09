const express=require('express');
const app=express();
const mongoose=require('mongoose');
const Listing=require('./models/listing.js');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const path = require("path");
const wrapAync=require('./utils/wrapAsync.js');
const expressError=require('./utils/ExpressError.js');
const {listingSchema} =require('./schema.js');

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
app.set('view engine', 'ejs');


app.get('/',(req,res)=>{
    res.redirect('/listing');
})
const validateListing = (req,res,next)=>{
    const {error}=listingSchema.validate(req.body);
    if(error){
        let errorMsg=error.details.map(el=>el.message).join(',');
        throw new expressError(400,errorMsg);
    }else{
        next();
    }
}
//index route
app.get('/listing',wrapAync(async(req,res)=>{
    let allListing=await Listing.find({});
    res.render("listings/index.ejs",{allListing});
    }));

    app.get('/listing/new',(req,res)=>{
        res.render('listings/new.ejs')
    })

    //new route
    app.post('/listing',validateListing,wrapAync(async (req,res,next)=>{
        
            let newlisting=new Listing(req.body.listing);
            await newlisting.save();
            res.redirect('/listing');
        })
    );
    

//show route
app.get("/listing/:id", wrapAync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
}));

app.get('/listing/:id/edit',wrapAync(async(req,res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/edit.ejs',{ listing });
}))

app.put('/listing/:id',validateListing,wrapAync(async(req,res)=>{
    let { id }=req.params;
    const listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect('/listing');

}))

app.delete('/listing/:id',wrapAync(async(req,res)=>{
     let { id }=req.params;
    const listing=await Listing.findByIdAndDelete(id);
    res.redirect('/listing');

}))

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
