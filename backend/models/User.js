const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    mobileNumber: {
        type: Number,
    },
    alternateNumber: {
        type: Number,
    },
    password: {
        type: String,
    },
    pincode: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    country: {
        type: String,
    },
    role: {
        type: String,
        required: true,
        default: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

var UserModel = mongoose.model('users',userSchema)
module.exports = UserModel