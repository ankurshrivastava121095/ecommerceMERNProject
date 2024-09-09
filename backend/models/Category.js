const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    categoryName: { type: String, required: true, unique: true },
    categoryImageUrl: { type: String },
    categoryImagePublicId: { type: String },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Category', CategorySchema);