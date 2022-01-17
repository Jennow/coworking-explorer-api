const mongoose  = require("mongoose")
const db        = require("../models/db")
var database    = "mongoose";
const Spaces    = require("../models/Spaces");

// Connect to database
db("mongodb://localhost:27017/"+database)

var insertedSpace = new Spaces({ // Create new document
    name: "John Doe",
    age: 18,
    role: "Example User"
})

insertedSpace.save(err => { // save document inside Users collection
    if(err) throw err // error handling
    console.log("Document inserted!")
    mongoose.disconnect() // disconnect connection from database once document is saved
})