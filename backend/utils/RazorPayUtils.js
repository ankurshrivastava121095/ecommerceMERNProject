const Razorpay = require('razorpay');
const crypto = require('crypto');
require('dotenv').config();

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (amount, currency = 'INR') => {
    const options = {
        amount: amount * 100,
        currency,
        payment_capture: 1,
    };
    return await razorpayInstance.orders.create(options);
};

const verifySignature = (orderId, paymentId, signature) => {
    const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

    return generatedSignature === signature;
};

const refundPayment = async (paymentId, amount) => {
    try {
        const refund = await razorpayInstance.refunds.create({
            payment_id: paymentId,
            amount: amount * 100,
            notes: {
                reason: 'Refund for order cancellation'
            }
        });
        return refund;
    } catch (error) {
        throw new Error(`Refund Error: ${error.message}`);
    }
};

module.exports = {
    createOrder,
    verifySignature,
    refundPayment
};