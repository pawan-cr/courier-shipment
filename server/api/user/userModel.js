const mongoose = require('mongoose')

var userSchema = mongoose.Schema({
    userAutoId: { type: Number, default: 0 },
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },

    userType: { type: Number, default: 2 },// 1>Admin, 2> user
    password: { type: String, default: '' },
    
    isDelete: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },

    addedById: { type: mongoose.Schema.Types.ObjectId, default: null, ref: 'user' },
    updatedById: { type: mongoose.Schema.Types.ObjectId, default: null, ref: 'user' },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: null },
    status: { type: Boolean, default: true },
    assignCompanies:[{ companyId:{type: mongoose.Schema.Types.ObjectId, default: null, ref: 'company'} }]
})

var User = module.exports = mongoose.model('user', userSchema)
module.exports.get = (callback, limit) => {
    User.find(callback).limit(limit)
}