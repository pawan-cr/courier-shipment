const express = require('express');
const { getAllCompany, getSpecifiedCompany, createNewCompany, updatedCompanyById, deletedCompanyById } = require('../api/company/companyController');
const { createNewPrice, getAllPrices, getPriceById, updatePriceById, deletePriceById } = require('../api/priceList/priceController');
const {createInvoice,getAllInvoice} = require('../api/invoice/invoiceController')
const sharp = require('sharp')

const router = express.Router();
const userController = require('../api/user/userController')
const categoryController = require('../api/category/categoryController')

// import the helper files 
let helper = require('../utilities/helper')

//AUTHENTICATION 
router.post('/login',userController.login)

//AUTHENTICATION 
router.use(require('../middleware/adminTokenChecker'))

/** User Routes */
router.post('/user/all', userController.index)
router.post('/user/single', userController.fetchUserById)
router.post('/user/add', userController.addUser)
router.post('/user/update', userController.updateUser)
router.post('/user/delete', userController.deleteUser)
/** User Routes  Ends*/

/** User Routes */
async function trim(req) {
    if (req != null && req.file != null && req.file.path != null) {
        await sharp(req.file.path)
            .resize(100)
            .jpeg({ quality: 80 })
            .toFile(
                req.file.destination + "/trim_" + req.body.image
                , (err, info) => {
                    if (info != null && info != undefined)
                        req.body.trimImage = "trim_" + req.body.image
                });
    }
}

// /**  Category routes */
// router.post('/category/all', categoryController.index)
// router.post('/category/single', categoryController.fetchCategoryById)
// router.post('/category/add', categoryController.addCategory)
// router.post('/category/update', categoryController.updateCategory)
// router.post('/category/delete', categoryController.deleteCategory)
// /**  Category routes ends */









// Company routes
router.post('/companies/all', getAllCompany);
router.post('/companies/single', getSpecifiedCompany);
router.post('/companies/add', createNewCompany);
router.post('/companies/update', updatedCompanyById);
router.post('/companies/delete', deletedCompanyById);

// Price routes
router.post('/prices/add', createNewPrice);
router.post('/prices/all', getAllPrices);
router.post('/prices/single', getPriceById);
router.post('/prices/update', updatePriceById);
router.post('/prices/delete', deletePriceById);
/**price route ends */



// /** Consignor Routes */
router.post('/invoice/all', getAllInvoice)
// router.post('/invoice/single', getConsigneeById)
router.post('/invoice/add', createInvoice)
// router.post('/invoice/update', updateConsignorById)
// router.post('/invoice/delete', deletedConsignorById)
// /** Consignor Routes  Ends*/

router.post('*', (req, res) => {
    res.status(404).send({
        success: false,
        status: 404,
        message: "Invalid address"
    })
})

module.exports = router;
