const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
    categoryId: mongoose.Schema.Types.ObjectId,
    categoryName: String,
    subCategoryName: String,
    subCategoryImageUrl: String,
    subCategoryImagePublicId: String,
    isDeleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('SubCategory', subCategorySchema);