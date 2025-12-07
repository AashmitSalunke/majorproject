const express = require('express');
const mongoose = require('mongoose');
const Schema=mongoose.Schema;
const listingSchema=Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        filename:String,
        url:{
            type:String,
            default:'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60'
        }
    },
    price:Number,
    location:String,
    country:String,
})
const Listing=mongoose.model('Listing',listingSchema);
module.exports=Listing;
