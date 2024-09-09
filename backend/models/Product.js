const mongoose = require('mongoose');
const { NumberInstance } = require('twilio/lib/rest/pricing/v2/voice/number');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    productName: { type: String, required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    categoryName: { type: String },
    subCategoryId: { type: Schema.Types.ObjectId, ref: 'SubCategory', required: true },
    subCategoryName: { type: String },
    shortDescription: { type: String },
    detailedDescription: { type: String },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    availableQuantity: { type: Number, required: true },
    quantitySold: { type: Number, required: true },
    freeDelivery: { type: Boolean, default: false },
    openBoxDelivery: { type: Boolean, default: false },
    returnAndRefund: { type: Boolean, default: false },
    deliveryPolicy: { type: String },
    returnPolicy: { type: String },
    productImagePublicId: { type: String },
    productImageUrl: { type: String },
    productVideoPublicId: { type: String },
    productVideoUrl: { type: String },
    currentRating: { type: Number },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;