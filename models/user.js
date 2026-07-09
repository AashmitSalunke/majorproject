const express = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new Schema({
    username:{
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true, // Ensure email is unique
    }
});

// Configure passport-local-mongoose to use email as the username field
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);