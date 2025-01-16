const User = require('./userModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const db = require('../../config/db')
const Joi = require('joi')
const Company = require('../company/companyModel');
const { default: mongoose } = require('mongoose');
let salt = bcrypt.genSaltSync(10);
require('dotenv').config()

module.exports = {
    login,
    index,
    fetchUserById,
    addUser,
    updateUser,
    deleteUser
}        


async function login(req, res, next) {
    let result = {};
    try {
        result = await loginFun(req, next);
        res.status(result.status).json(result);
    } catch (error) {
        next(error);
    }
}

function loginFun(req, next) {
    const body = req.body;

    if (!body.email || typeof body.email !== 'string') {
        return Promise.reject({
            status: 400,
            success: false,
            message: "Email is required and must be a string."
        });
    }

    if (!body.password || typeof body.password !== 'string') {
        return Promise.reject({
            status: 400,
            success: false,
            message: "Password is required and must be a string."
        });
    }

    return new Promise(async (resolve, reject) => {
        let finder = {};
        if (body.email !== undefined) finder = { email: body.email };

        User.findOne(finder)
            // .populate("role")
            .populate("assignCompanies")
            .then(res => {
                if (res != null) {
                    // Check if the user is deleted
                    if (res.isDelete) {
                        reject({
                            status: 403,
                            success: false,
                            message: "User is deleted! Contact Admin."
                        });
                        return;
                    }

                    // Check if the user is blocked
                    if (res.isBlocked) {
                        reject({
                            status: 403,
                            success: false,
                            message: "User is blocked! Contact Admin."
                        });
                        return;
                    }

                    // Verify the password using bcrypt
                    if (!bcrypt.compareSync(body.password, res.password)) {
                        reject({
                            status: 403,
                            success: false,
                            message: "Invalid Username or Password"
                        });
                    } else {
                        if (res.status == true) {
                            const user = {
                                name: res.name,
                                email: res.email,
                                userType: res.userType,
                                _id: res._id
                            };

                            // Generate JWT token
                            const token = jwt.sign(user,'your_jwt_secret_key');

                            resolve({
                                token: token,
                                status: 200,
                                success: true,
                                message: "Login Successfully",
                                data: res
                            });
                        } else {
                            reject({
                                status: 403,
                                success: false,
                                message: "User is inactive! Contact Admin."
                            });
                        }
                    }
                } else {
                    reject({
                        status: 404,
                        success: false,
                        message: "User does not exist"
                    });
                }
            })
            .catch(err => {
                reject({
                    status: 500,
                    success: false,
                    message: "Server Error",
                    error: err
                });
            });
    });
}


async function index(req, res, next) {
    await indexFun(req, next)
        .then(data => { res.status(data.status).json(data) })
        .catch(next);
};
function indexFun(req, next) {
    return new Promise((resolve, reject) => {
        var lim = 100000;
        var skip1 = 0;
        let formData = {}
        if (req.body != undefined)
            formData = req.body
        else formData = req
        formData.isDelete = false
        if (formData.startpoint != undefined) {
            skip1 = parseInt(formData.startpoint)
            lim = 10;
            delete formData.startpoint
        }
        var find = { $and: [formData] }

        User.find(find)
            .skip(skip1)
            .limit(lim)
            .exec()
            .then(async alldocuments => {
                var total = 0
                total = await User.countDocuments(find)
                resolve({
                    status: 200,
                    success: true,
                    total: total,
                    message: "All Users Loaded",
                    data: alldocuments
                });
            })
            .catch(err => {
                if (err.kind == "ObjectId") {
                    err = "Your Id Format is Wrong"
                }
                reject({
                    status: 422,
                    success: false,
                    message: String(err)
                });
            })
    });
}




async function addUser(req, res, next) {
    await addUserFun(req, next)
        .then(data => {
            res.status(data.status).json(data);
        })
        .catch(next);
}

function addUserFun(req, next) {
    return new Promise(async (resolve, reject) => {
        const formData = req.body;

    
        if (!formData.name || typeof formData.name !== 'string') {
            return reject({
                status: 400,
                success: false,
                message: "Name is required and must be a string."
            });
        }

        if (!formData.phone || typeof formData.phone !== 'string') {
            return reject({
                status: 400,
                success: false,
                message: "Phone is required and must be a string."
            });
        }

        if (!formData.email || typeof formData.email !== 'string') {
            return reject({
                status: 400,
                success: false,
                message: "Email is required and must be a string."
            });
        }

        if (!formData.password || typeof formData.password !== 'string') {
            return reject({
                status: 400,
                success: false,
                message: "Password is required and must be a string."
            });
        }

        try {
            const userData = await User.findOne({ $and: [{ email: formData.email }, { isDelete: false }] });
            if (userData == null) {
                const total = await User.countDocuments();
                const user = new User({
                    userAutoId: total + 1,
                    name: formData.name,
                    phone: formData.phone,
                    email: formData.email,
                    role: formData.role || undefined,
                    password: bcrypt.hashSync(formData.password, salt),
                    userType:formData.userType || 2,
                    addedById: req.decoded.addedById || null,
                    updatedById:req.decoded.updatedById || null
                });

                const saveRes = await user.save();
                resolve({
                    status: 200,
                    success: true,
                    message: "User added successfully.",
                    data: saveRes
                });
            } else {
                reject({
                    success: false,
                    status: 422,
                    message: "User already exists with the same email/phone"
                });
            }
        } catch (err) {
            console.log("err", err);
            reject({
                success: false,
                status: 500,
                message: "Server error occurred.",
                error: err
            });
        }
    });
}


async function fetchUserById(req, res, next) {
    await fetchUserByIdFun(req, next)
        .then(data => { res.status(data.status).json(data) })
        .catch(next);
};
function fetchUserByIdFun(req, next) {
    return new Promise(async (resolve, reject) => {
        if (req.body != undefined && req.body._id != undefined) {
            // if (db.isValid(req.body._id)) {
            if(mongoose.Types.ObjectId.isValid(req.body._id)){
                var finder = { $and: [req.body] };
                User.findOne(finder)
                    .exec()
                    .then(document => {
                        if (document != null) {
                            resolve({
                                status: 200,
                                success: true,
                                message: "Single User Loaded",
                                data: document
                            });
                        }
                        else {
                            reject({
                                status: 404,
                                success: false,
                                message: "No User Found",
                                data: document
                            });
                        }

                    })
                    .catch(err => {
                        reject({
                            status: 500,
                            success: false,
                            message: err
                        });
                    })
            }
            else {
                reject({ success: false, status: 422, message: "Id Format is Wrong" })
            }
        }
        else {
            resolve({
                status: 400,
                success: false,
                message: "Please enter _id to Proceed "
            });
        }
    })
}

// 
async function updateUser(req, res, next) {
    try {
        const data = await updateUserFun(req);
        res.status(data.status).json(data);
    } catch (error) {
        next(error);
    }
}

async function updateUserFun(req) {
    const result = {};
    const formData = req.body;

    // Ensure _id is provided and is a valid ObjectId
    if (!formData._id || !mongoose.Types.ObjectId.isValid(formData._id)) {
        result.status = 422;
        result.success = false;
        result.message = formData._id ? "Invalid ID format" : "Please enter an _id to proceed";
        throw result;
    }

    try {
        const user = await User.findOne({ "_id": formData._id });

        if (!user) {
            result.status = 404;
            result.success = false;
            result.message = "User not found";
            throw result;
        }

        // Update user fields if provided in the request body
        if (formData.name) user.name = formData.name;
        if (formData.email) user.email = formData.email;
        if (formData.phone) user.phone = formData.phone;
        if (formData.password) user.password = formData.password;
        if (formData.role) user.role = formData.role;
        // if (req.decoded.updatedById) user.updatedById = req.decoded.updatedById;

        // Check if the email is already taken by another user (excluding the current user)
        if (formData.email) {
            const existingUser = await User.findOne({
                $and: [{ email: formData.email }, { isDelete: false }, { _id: { $ne: user._id } }]
            });
            if (existingUser) {
                result.status = 409;
                result.success = false;
                result.message = "User exists with the same email";
                throw result;
            }
        }

        // Update the updatedAt field and save
        user.updatedAt = new Date();
        await user.save();

        result.status = 200;
        result.success = true;
        result.message = "User Updated Successfully";
        result.data = user;

        return result;

    } catch (err) {
        result.status = 500;
        result.success = false;
        result.message = err.message || "Server Issue";
        throw result;
    }
}


async function deleteUser(req, res, next) {
    await deleteUserFun(req, next)
        .then(data => { res.status(data.status).json(data) })
        .catch(next);
};
function deleteUserFun(req, next) {
    let result = {}
    let formData = req.body
    let isValidated = true
    return new Promise((resolve, reject) => {
        if (req.body != undefined && req.body._id != undefined) {

            User.findOne({ "_id": req.body._id })
                .then(async res => {
                    if (res == null) {
                        result.status = 404;
                        result.success = false;
                        result.message = "User not found"
                        reject(result);
                    }
                    else {
                        res.isDelete = true
                        res.updatedAt = new Date();
                        if (req.decoded.updatedById != undefined && req.decoded.updatedById != '')
                            res.updatedById = req.decoded.updatedById
                        res.save()
                            .then(res => {
                                {
                                    result.status = 200;
                                    result.success = true;
                                    result.message = "User deleted Successfully"
                                    resolve(result)
                                }
                            })
                            .catch(err => {
                                result.status = 422;
                                if (err.code == 11000) {
                                    result.status = 409
                                    result.message = "Can't Update Value Already Exists"
                                }
                                else {
                                    result.message = "Server Issue" + err
                                }

                                result.success = false
                                reject(result);
                            })
                    }

                })
                .catch(err => {
                    result.message = "Server Issue" + err
                    result.status = 422;
                    result.success = false
                    reject(result);
                })

        }
        else {

            result.status = 400;
            result.success = false;
            result.message = "Please enter an _id to Proceed"
            reject(result);
        }
    });

}