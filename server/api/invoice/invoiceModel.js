const mongoose = require('mongoose');

// Define the Invoice schema
const invoiceSchema = new mongoose.Schema({
  // Shipment Invoice
  invoiceAutoId: { type: Number, default:0 },
  createShipmentInvoice: {
    invoiceType: { type: String, enum: ['Proforma', 'Commercial', 'Tax'], required: true },
    currency: { type: String, enum: ['INR', 'USD', 'EUR'], default: 'INR' },
    incoterms: { type: String, enum: ['EXW', 'FOB', 'CIF', 'CFR'], required: true },
    noteType: { type: String, enum: ['General', 'Legal'], default: 'General' },
    note: { type: String }
  },
  
  // Shipment Invoice Items
  shipmentInvoiceItems: [{
    boxNo: { type: String, required: true },
    srNo: { type: Number, required: true },
    description: { type: String, required: true },
    hsCode: { type: String },
    unitType: { type: String, enum: ['Kg', 'Litre', 'Piece'], required: true },
    quantity: { type: Number, required: true },
    unitWeight: { type: Number },
    igst: { type: Number },
    unitRate: { type: Number, required: true },
    amount: { type: Number }
  }],

  shipmentId: { type: mongoose.Schema.Types.ObjectId, default: null, ref: 'shipment' },

  // System Metadata
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null},
  addedById:{type:mongoose.Schema.Types.ObjectId,default:null,ref:'company'},
  updatedById:{type:mongoose.Schema.Types.ObjectId,default:null,ref:'company'},
  status: { type: String, enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' },
  isDelete: { type: Boolean, default: false },
  deleteAt: { type: Date,default:null },
  deleteBy: { type: String }
});

// Compile Schema into Model
const Invoice = mongoose.model('invoice', invoiceSchema);

module.exports = Invoice;
