const Price = require('./priceModel')
const Company = require('../company/companyModel')




// Route to create a new price entry
const createNewPrice = async (req, res) => {
    try {
        const { companyId, updatedAt,  parcelType, priceList, internationalOrDomestic } = req.body;

        // Validate top-level required fields
        const missingFields = [];
        if (!companyId) missingFields.push("companyId is required");
        if (!updatedAt) missingFields.push("updatedAt is required");
        if (!parcelType) missingFields.push("parcelType is required");
        if (internationalOrDomestic === undefined) missingFields.push("internationalOrDomestic is required");
        if (!Array.isArray(priceList) || priceList.length === 0) missingFields.push("priceList must be a non-empty array");

        if (missingFields.length > 0) {
            return res.status(422).json({
                status: 422,
                success: false,
                message: "Validation error",
                error: missingFields
            });
        }

        // Validate each item in priceList
        for (let i = 0; i < priceList.length; i++) {
            const item = priceList[i];
            const { zoneNumber, zoneName, unitType, length, breadth, height, netWeight, grossWeight, price } = item;
            const itemErrors = [];

            if (zoneNumber === undefined) itemErrors.push("zoneNumber is required");
            if (!zoneName) itemErrors.push("zoneName is required");
            if (unitType === undefined) itemErrors.push("unitType is required");
            if (length === undefined) itemErrors.push("length is required");
            if (breadth === undefined) itemErrors.push("breadth is required");
            if (height === undefined) itemErrors.push("height is required");
            if (netWeight === undefined) itemErrors.push("netWeight is required");
            if (grossWeight === undefined) itemErrors.push("grossWeight is required");
            if (price === undefined) itemErrors.push("price is required");

            if (itemErrors.length > 0) {
                return res.status(422).json({
                    status: 422,
                    success: false,
                    message: "Validation error",
                    error: itemErrors,
                    itemIndex: i
                });
            }

            // Validate unitType (1: cm, 2: m, 3: mm)
            if (![1, 2, 3].includes(unitType)) {
                return res.status(400).json({
                    message: "Invalid unit type. Allowed values: 1 (cm), 2 (m), 3 (mm).",
                    itemIndex: i
                });
            }

            // Check if dimensions and weights are positive numbers
            if (length <= 0 || breadth <= 0 || height <= 0 || netWeight <= 0 || grossWeight <= 0 || price <= 0) {
                return res.status(400).json({
                    message: "All dimensions, weights, and price must be positive numbers.",
                    itemIndex: i
                });
            }
        }



        // Validate parcelType (1: Box, 2: Document)
        if (![1, 2].includes(parcelType)) {
            return res.status(400).json({ message: "Invalid parcel type. Allowed values: 1 (Box), 2 (Document)." });
        }

        // Create and save the new price entry
        const newPrice = new Price(req.body);
        await newPrice.save();

            res.send({
            status:201,
            success:true,
            message:"New price entry created successfully",
            data:newPrice
        })
    } catch (error) {
    
        
        res.send({
            status:500,
            success:false,
            message:"internal server error",
            error:error.message
        })
    }
};



// Route to get all price entries
const getAllPrices =  (req, res) => {
    Price.find()
    .populate("companyId")
    .then((userdata)=>{

        res.send({
            status:200,
            success:true,
            message:"Data fetched successfully",
            data:userdata
        })
    })
    .catch(err=>{
        
        res.send({
            status:500,
            success:false,
            message:"internal server error",
            error:err.message
        })
    })
   
};

// Route to get a specific price entry by ID
const getPriceById = async (req, res) => {
    let validationError = []
    if(!req.body._id){
        validationError.push("_id is required")
    }
    if(validationError.length>0){
        res.send({
            status:404,
            success:false,
            message:"validation is required",
            error:validationError
        })
    }else{
        Price.findOne({_id:req.body._id})
        .then((result)=>{
            res.send({
                status:200,
                success:true,
                message:"data found",
                data:result
            })
        })
        .catch(err=>{
            res.send({
                status:500,
                success:false,
                message:"internal server error",
                error:err.message
            })
        })
    }
   
};

// Route to update a price entry by ID
const updatePriceById = async (req, res) => {
    let validation = [];
    if (!req.body._id) {
        validation.push("_id is required");
    }
    if (validation.length > 0) {
        return res.status(400).send({
            status: 400,
            success: false,
            message: "Validation error",
            error: validation
        });
    }
    
    try {
        const updatedPrice = await Price.findOneAndUpdate(
            { _id: req.body._id },         // Find by ID
            { $set: req.body },             // Update with new data
            { new: true }                   // Return the updated document
        );

        if (!updatedPrice) {
            return res.status(404).send({
                status: 404,
                success: false,
                message: "Price not found"
            });
        }

        res.send({
            status: 200,
            success: true,
            message: "Price updated successfully",
            data: updatedPrice
        });
    } catch (err) {
        res.send({
            status: 500,
            success: false,
            message: "Internal server error",
            error: err.message
        });
    }
   
};

// Route to delete a price entry by ID
const deletePriceById = async (req, res) => {
   let validationError = []
   if(!req.body._id){
    validationError.push("_id is required")

   }
   if(validationError.length>0){
    res.send({
        status:404,
        success:false,
        message:"validation error",
        error:validationError
    })
   }else{
    try{
        const result = await Price.findByIdAndDelete(req.body._id);
        if(result){
            res.send({
                status:200,
                success:true,
                message:"price deleted successfully"
            })
        }else{
            res.send({
                status:404,
                success:false,
                message:"price not found"     
            })
        }
    }catch(err){
        res.send({
            status:500,
            success:false,
            message:"internal server error",
            error:err.message
        })
    }
   }
};

module.exports = { createNewPrice, getAllPrices, getPriceById, updatePriceById, deletePriceById };
