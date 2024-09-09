const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String, required: true },
    productImageUrl: { type: String },
    price: { type: Number, required: true },
    discount: { type: Number },
    freeDelivery: { type: Boolean },
    openBoxDelivery: { type: Boolean },
    returnAndRefund: { type: Boolean },
}, { timestamps: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);