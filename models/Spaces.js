const mongoose   = require("mongoose");
const Schema     = mongoose.Schema;
var SpacesSchema = new Schema({ 
    name: String,
    age: Number,
    role: String 
})

var Spaces     = mongoose.model("Users", SpacesSchema)
module.exports = Spaces; 