const mongoose = require('mongoose')


const priceListSchema = new mongoose.Schema({
    zoneNumber: { type: Number, required: true },   // Unique zone identifier
    zoneName: { type: String, required: true },     // Descriptive name of the zone
    unitType: { type: Number, enum: [1, 2, 3], required: true }, // 1: cm, 2: m, 3: mm
    length: { type: Number, required: true },       // Length of the parcel
    breadth: { type: Number, required: true },      // Breadth of the parcel
    height: { type: Number, required: true },       // Height of the parcel
    netWeight: { type: Number, required: true },    // Net weight of the parcel
    grossWeight: { type: Number, required: true },  // Gross weight of the parcel
    price: { type: Number, required: true }         // Price for the parcel in the given zone
});

const priceSchema = new mongoose.Schema({
    companyId: { type: mongoose.Schema.Types.ObjectId,ref: "company", default: null,  },           // Name of the company
    createdAt: { type: Date, default: Date.now },            // Timestamp when the company was created
    updatedAt: { type: Date, default: Date.now },                // Timestamp when the company was last updated
    status: { type: Boolean, default: true },                // Status of the company (true: active, false: inactive)
    parcelType: { type: Number, enum: [1, 2], required: true }, // 1: Box, 2: Document
    internationalOrDomestic: { type: Boolean, required: true }, // true: international, false: domestic
    priceList: { type: [priceListSchema], default: [] }      // List of pricing information
});


module.exports = mongoose.model('price', priceSchema)