const express=require('express');
const app=express();
const mongoose=require('mongoose');
const Listing=require('./models/listing.js');
const methodOverride = require('method-override');
const path = require("path");
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

// Content Security Policy - allow external CDNs for Bootstrap, Font Awesome, etc.
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net; font-src 'self' https://cdnjs.cloudflare.com; img-src 'self' data: https:; connect-src 'self';"
  );
  next();
});

app.get('/',(req,res)=>{
    res.redirect('/listing');
})
//index route
app.get('/listing',async(req,res)=>{
    let allListing=await Listing.find({});
    res.render("listings/index.ejs",{allListing});
    });

    app.get('/listing/new',(req,res)=>{
        res.render('listings/new.ejs')
    })

    //new route
    app.post('/listing',async (req,res)=>{
        let newlisting=new Listing(req.body.listing);
        await newlisting.save();
        res.redirect('/listing');

    })
    

//show route
app.get("/listing/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});

app.get('/listing/:id/edit',async(req,res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/edit.ejs',{ listing });
})

app.put('/listing/:id',async(req,res)=>{
    let { id }=req.params;
    const listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect('/listing');

})

app.delete('/listing/:id',async(req,res)=>{
     let { id }=req.params;
    const listing=await Listing.findByIdAndDelete(id);
    res.redirect('/listing');

})


app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
})
