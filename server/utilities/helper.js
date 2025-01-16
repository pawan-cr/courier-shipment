const multer = require('multer')
const path = require('path')
const fs = require('fs')

var imageStorageFun = multer.diskStorage({
    destination: function (req, file, cb) {
        var string = file.fieldname.split("_");
        var dir = "server/public/" + string[0]
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        var string = file.fieldname.split("_")
        req.body[string[1]] = Date.now() + path.extname(file.originalname)
        cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
})

function unlinkImage(pic) {
    if (pic != undefined) {
        fs.unlink(pic.path, (err) => { });
    }
}

var uploadImageFun = multer({
    storage: imageStorageFun
});

module.exports = {
    uploadImageFun,
    unlinkImage
}