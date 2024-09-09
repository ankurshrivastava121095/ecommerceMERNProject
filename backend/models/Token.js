const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    mobileNumber: { type: String },
    otp: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Token', tokenSchema);