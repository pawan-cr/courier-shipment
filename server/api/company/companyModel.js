const mongoose = require('mongoose')
const companySchema = new mongoose.Schema({
    companyName: { type: String, required: true },           
    createdAt: { type: Date, default: Date.now },            
    status: { type: Boolean, default: true },       
   });


module.exports = mongoose.model('company', companySchema)