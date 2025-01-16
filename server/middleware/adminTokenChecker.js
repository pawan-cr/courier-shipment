const jwt = require('jsonwebtoken')
require('dotenv').config()



module.exports = (req, res, next) => {
    // console.log(req.body)

    const token = req.headers['authorization'];
    // console.log(token);
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token,'your_jwt_secret_key', function (err, decoded) {
            // console.log(token)
            // console.log(process.env.SECRET_KEY)
            // console.log(decoded)
            if (err) {
                // console.log(err);
                res.status(403).send({
                    success: false,
                    status: 403,
                    message: "UnAuthorized"

                })
            }
            req.decoded = decoded;
            req.decoded.addedById = req.decoded._id
            req.decoded.updatedById = req.decoded._id
            next();
        });
    }
    else {
        res.status(403).send({
            success: false,
            status: 403,
            message: "UnAuthorized"

        })
 
    }
}