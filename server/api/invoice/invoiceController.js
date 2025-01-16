const mongoose = require("mongoose");
const Invoice = require('./invoiceModel')
const Shipment = require('../shipment/shipmentModel')
require('dotenv').config()

// create Invoice 
async function createInvoice(req,res,next){
    await createInvoiceFun(req,next)
    .then((result)=>{
        res.status(result.status).json(result)
    })
    .catch(next)
}

function createInvoiceFun(req,next){
    return new Promise(async(resolve,reject)=>{
        const formData = req.body
       
        if(!formData.createShipmentInvoice || typeof formData.createShipmentInvoice !== 'object'){
            return reject({
                status:400,
                success:false,
                message:"createShipmentInvoice is required and must be an object."
            })
        }
        try{
            const total = await Invoice.countDocuments()
            const invoice = new Invoice({
                ...formData,
                invoiceAutoId:total + 1,
                createdBy:req.decoded?.addedById || null,
                updatedBy:req.decoded?.updatedById || null
            })
            const saveRes = await invoice.save();
            resolve({
                status:201,
                success:true,
                message:"Invoice created successfully",
                data:saveRes
            })

        }catch(err){
            reject({
                status:500,
                success:false,
                message:"internal server error",
                error:err.message
            })
        }
    })
}

//get all invoice 

async function  getAllInvoice(req,res,next){
    await getAllInvoiceFun(req,next)
    .then((result)=>{
        res.status(result.status).json(result)
    })
    .catch(next)
}

function getAllInvoiceFun(req,next){
    return new Promise((resolve,reject)=>{
        let lim = 100000;
        let skip1 = 0;
        let formData = req.body || {}
        formData.isDelete = false

        if(formData.startpoint !== undefined){
            skip1 = parseInt(formData.startpoint);
            lim = 10;
            delete formData.startpoint;
        }
        const find = {$and:[formData]}
        Invoice.find(find).skip(skip1).limit(lim).exec().then(async allDocument =>{
            const total = await Invoice.countDocuments(find)
            resolve({
                status:200,
                success:true,
                total,
                message:"All invoice loaded",
                data:allDocument
            })
        })
        .catch(err=>{
            if (err.kind === "ObjectId"){
                err = "Invalid ID format"
            }
            reject({
                status:422,
                success:false,
                message:String(err)
            })
        })
    })
}

module.exports = {createInvoice,getAllInvoice}