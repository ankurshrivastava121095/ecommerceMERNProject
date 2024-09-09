const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    mandateOrderId: {
        type: Number,
        required: true,
        unique: true
    },
    orderId: {
        type: String,
        required: true
    },
    paymentId: {
        type: String
    },
    signature: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    billingAddressName: {
        type: String,
        required: true
    },
    billingAddressEmail: {
        type: String,
        required: true
    },
    billingAddressContactNumber: {
        type: String,
        required: true
    },
    billingAddressAlternateNumber: {
        type: String
    },
    billingAddressPincode: {
        type: String,
        required: true
    },
    billingAddressCity: {
        type: String,
        required: true
    },
    billingAddressState: {
        type: String,
        required: true
    },
    billingAddressCountry: {
        type: String,
        required: true
    },
    billingAddressFullAddress: {
        type: String,
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    quantitySelected: {
        type: Number,
        required: true
    },
    returnedQuantity: {
        type: Number,
        required: true
    },
    productImageUrl: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number
    },
    freeDelivery: {
        type: Boolean
    },
    openBoxDelivery: {
        type: Boolean
    },
    returnAndRefund: {
        type: Boolean
    },
    paymentMode: {
        type: String,
        enum: ['Online', 'COD'],
        required: true
    },
    grandTotal: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['Paid', 'Yet to Pay'],
        required: true
    },
    status: {
        type: String,
        enum: [
            'Pending', 'Shipped', 'Out for Delivery', 'Delivered',
            'Cancelled', 'Refund Request', 'Proceed for Refund', 'Refund Completed'
        ],
        default: 'Pending'
    },
    shipmentDate: {
        type: Date
    },
    outForDeliveryDate: {
        type: Date
    },
    deliveredDate: {
        type: Date
    },
    cancelledDate: {
        type: Date
    },
    refundRequestDate: {
        type: Date
    },
    proceedForRefundDate: {
        type: Date
    },
    refundCompletedDate: {
        type: Date
    },
    upiForRefund: {
        type: String
    },
    bankAccountHolderNameForRefund: {
        type: String
    },
    bankAccountNumberForRefund: {
        type: String
    },
    bankAccountIfscForRefund: {
        type: String
    },
    bankName: {
        type: String
    },
    bankBranchName: {
        type: String
    },
    bankFullAddress: {
        type: String
    },
    bankCity: {
        type: String
    },
    bankDistrict: {
        type: String
    },
    refundAmount: {
        type: Number
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);