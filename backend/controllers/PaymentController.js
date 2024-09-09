const Razorpay = require('razorpay');
require('dotenv').config();
const { verifySignature, createOrder } = require('../utils/RazorPayUtils');
const Payment = require('../models/Payment');

class PaymentController {
    static initiatePayment = async (req, res) => {
        try {
            const { amount, currency = 'INR' } = req.body;
            const order = await createOrder(amount, currency);
    
            if (!order) return res.status(500).send('Some error occurred');
            res.json(order);
        } catch (error) {
            res.status(500).send(error.message);
        }
    };
    
    static paymentCallback = async (req, res) => {
        try {
            const {
                orderCreationId,
                razorpayPaymentId,
                razorpayOrderId,
                razorpaySignature,
            } = req.body;
    
            const isVerified = verifySignature(orderCreationId, razorpayPaymentId, razorpaySignature);
    
            if (!isVerified) {
                return res.status(400).json({ msg: 'Transaction not legit!' });
            }
    
            const payment = new Payment({
                orderId: razorpayOrderId,
                paymentId: razorpayPaymentId,
                signature: razorpaySignature,
                success: true
            });

            await payment.save();
    
            res.json({
                msg: 'success',
                orderId: razorpayOrderId,
                paymentId: razorpayPaymentId,
            });
    
        } catch (error) {
            res.status(500).send(error.message);
        }
    };
}

module.exports = PaymentController;