const { ref } = require('joi');
const mongoose = require('mongoose');
const shipmentSchema = new mongoose.Schema({
  
  // Consignor Details
  consignorDetails: {
    companyName: { type: String, required: true },
    consignorName: { type: String, required: true },
    email: { type: String, match: /.+\@.+\..+/ },
    phoneNumber: { type: String, required: true, match: /^[0-9]{10,15}$/ },
    address1: { type: String, required: true },
    address2: { type: String },
    address3: { type: String },
    postZipCode: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    kycType: { type: String, enum: ['PAN', 'Aadhaar', 'GST', 'Voter ID'], required: true },
    kycNumber: { type: String, required: true },
    kycFile: { type: String } // URL or file path for uploaded KYC
  },
  
  // Consignee Details
  consigneeDetails: {
    destination: { type: String, required: true },
    company: { type: String },
    consigneeName: { type: String, required: true },
    email: { type: String, match: /.+\@.+\..+/ },
    phone1: { type: String, required: true, match: /^[0-9]{10,15}$/ },
    phone2: { type: String, match: /^[0-9]{10,15}$/ },
    address1: { type: String, required: true },
    address2: { type: String },
    address3: { type: String },
    postZipCode: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true }
  },
  // Shipment Description
  shipmentDescription: {
    description: { type: String, required: true },
    invoiceNo: { type: String },
    currency: { type: String, enum: ['INR', 'USD', 'EUR'], default: 'INR' },
    docsOrNoDocs: { type: String, enum: ['Docs', 'No-Docs'], required: true },
    commVsCsbv: { type: String, enum: ['Commercial', 'CSB V'], required: true },
    deliveryZone: { type: String },
    isInsured: { type: Boolean, default: false },
    freightProtection: { type: Boolean, default: false },
    custRef: { type: String },
    remark: { type: String }
  },
  // Weights and Dimensions
  weightsAndDimensions: {
    totalPcs: { type: Number, required: true },
    actualWeight: { type: Number, required: true },
    volumetricWeight: { type: Number },
    chargeableWeight: { type: Number }
  },
  // Package Details
  packageDetails: [{
    packageType: { type: String, enum: ['Box', 'Envelope', 'Crate', 'Pallet'], required: true },
    network: { type: String, required: true },
    service: { type: String, required: true },
    boxNo: { type: String, required: true },
    actualWeight: { type: Number, required: true },
    dimensions: {
      length: { type: Number },
      breadth: { type: Number },
      height: { type: Number }
    },
    volumetricWeight: { type: Number },
    chargeableWeight: { type: Number }
  }],
  invoiceId:{  type: mongoose.Schema.Types.ObjectId, default: null, ref: 'invoice' },

  
  // System Metadata
  createdAt: { type: Date, default: Date.now },
  createdById:{type:mongoose.Schema.Types.ObjectId,default:null,ref:'company'},
  updatedAt: { type: Date, default: null },
  updatedById:{type:mongoose.Schema.Types.ObjectId,default:null,ref:'company'},
  status: { type: String, enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' },
  isDelete: { type: Boolean, default: false },
  deleteAt: { type: Date },
  deleteBy: { type: String }

});
// Compile Schema into Model
const Shipment = mongoose.model('shipment', shipmentSchema);
module.exports = Shipment;