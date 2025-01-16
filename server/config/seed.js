const User = require('../api/user/userModel')

// const userObj = {
//     userAutoId: 1,
//     name: "Admin",
//     email: "admin@srinventory.com",
//     password: "$2b$10$tbSZP8IZYfEw/3FcZZhSLOsuQhxBSw.2dHYcofSnXU9m1fdE.manK",
//     isDelete: false,
//     isBlocked: false,
//     userType: 1,
//     phone: 9915710720

// }

const userObj = {
    userAutoId: 1,
    name: "pawan",
    email: "pawangoswami9424@gmail.com",
    password: "$2b$10$8ztuQZLwUxHKVbvW2UtKBOfYP6xohaQbdcmgSpEcRlk69nlcVeq82",
    isDelete: false,
    isBlocked: false,
    userType: 1,
    phone: 7497060299

}
exports.createAdmin = async () => {
    let existingAdmin = await User.find({ email: userObj.email }).then().catch()
    if (!!existingAdmin && existingAdmin.length == 0) {
        new User(userObj).save().then(r => {
            console.log("Admin created for the project")
        })
    }
}
