const mongoose  = require("mongoose")
const connectDB = require("../models/db")
var database    = "mongoose"

const Spaces = require("../models/Spaces")
connectDB("mongodb://localhost:27017/"+database)

Spaces.find({}, (err, spaces)=>{ 
    if(err) throw err
    console.log(spaces)
    mongoose.disconnect()
})