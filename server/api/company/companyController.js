const Company = require('./companyModel')


// Route to get the all company 

const getAllCompany = async(req,res)=>{
    try{
        const comapanies = await Company.find()
        if(!comapanies){
            return res.json({
                status:404,
                success:false,
                message:"Companies not found"
            })
        }
        res.send({
            status:200,
            success:true,
            message:"Data Fetched Successfully",
            data:comapanies
        })
    }catch(error){
       res.send({
        status:500,
        success:false,
        message:"internal server error",
        error:error.message
       })
    }
}

// Route to get a specified company by ID 

const getSpecifiedCompany = (req,res) =>{
    let validationerror=[]
    if(!req.body._id)
        validationerror.push("_id is required")
    if(validationerror.length>0){
        res.send({
            status:404,
            success:false,
            message:"Validation is required",
            error:validationerror
        })
    }else{
       Company.findOne({_id:req.body._id})
       .then((companyData)=>{
        res.send({
            status:200,
            success:true,
            message:"Data Found",
            data:companyData
        })
       }) 
       .catch(err=>{
        res.send({
            status:500,
            success:false,
            message:"Internal server error",
            error:err.message
        })
       })
    }
}

const createNewCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        
        // Check if required fields are present
        const missingFields = [];
        if (!companyName) missingFields.push("companyName is required");
        if (missingFields.length > 0) {
            return res.status(422).json({ 
                status: 422, 
                success: false, 
                message: "Validation error", 
                error: missingFields 
            });
        }

        // Check if company already exists
        const existingCompany = await Company.findOne({ companyName });
        if (existingCompany) {
            return res.send({
                status:400,
                success:false,
                message:"Company with the same name already exists.",
            })
        }

        // Create and save the new company
        const newCompany = new Company(req.body);
        await newCompany.save();
        res.send({
            status:201,
            success:true,
            message:"New company is created",
            data:newCompany
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

// Route to updated a company by ID 

const updatedCompanyById = async (req, res) => {
    let validationerror = [];
    if (!req.body._id) {
        validationerror.push("ID is required");
    }
    if (validationerror.length > 0) {
        return res.status(400).send({
            status: 400,
            success: false,
            message: "Validation error",
            error: validationerror
        });
    }
    
    try {
        const updatedCompany = await Company.findOneAndUpdate(
            { _id: req.body._id },         // Find by ID
            { $set: req.body },             // Update with new data
            { new: true }                   // Return the updated document
        );

        if (!updatedCompany) {
            return res.send({
                status:404,
                success:false,
                message:"company not found"
            })
        }

        res.status(200).send({
            status: 200,
            success: true,
            message: "Company updated successfully",
            data: updatedCompany
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

   
//Route to deleted a company 
const deletedCompanyById = async (req, res) => {
    try {
      if (!req.body._id) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          error: ["_id is required"]
        });
      }
  
      const company = await Company.findOne({ _id: req.body._id });
  
      if (!company) {
        return res.status(404).json({
          success: false,
          message: "Company not found"
        });
      }
  
      company.status = false
  
      await company.save();
  
      res.status(200).json({
        success: true,
        message: "Company  deleted successfully",
        data: company
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error soft deleting company",
        error: error.message
      });
    }
  };
  

module.exports = {getAllCompany,getSpecifiedCompany,createNewCompany,updatedCompanyById,deletedCompanyById}