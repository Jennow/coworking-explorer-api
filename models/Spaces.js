const mongoose = require("mongoose");
const Double   = require('@mongoosejs/double');

const Schema     = mongoose.Schema;
var SpacesSchema = new Schema({ 
    id: Number,
    name: String,
    identifier: String,
    subTitle: String,
    description: String,
    url: String,
    website: String,
    logo: String,
    largeCoverPhoto: String,
    smallCoverPhoto: String, // For Map
    lat: Double,
    lng: Double,
    zoom: Number,
    streetNumber: String,
    streetName: String,
    streetNameShort: String,
    city: String,
    state: String,
    postCode: String,
    contry: String,
    countryShort: String,
    prices: [
        {
            priceTitle: String,
            personHint: String,
            legend: String,
            price: String,
            frequency: String
        }
    ]
})

var Spaces     = mongoose.model("Spaces", SpacesSchema)

module.exports = Spaces; 