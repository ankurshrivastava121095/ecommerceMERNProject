const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantitySelected: { type: Number, required: true },
    productName: { type: String, required: true },
    productImageUrl: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, required: true },
    freeDelivery: { type: Boolean, required: true },
    openBoxDelivery: { type: Boolean, required: true },
    returnAndRefund: { type: Boolean, required: true }
});

module.exports = mongoose.model('Cart', CartSchema);