const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

class OrderController {
    
    static store = async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();
    
        try {
            const userId = req.user_id;
            const {
                orderId,
                paymentId,
                signature,
                billingAddressName,
                billingAddressEmail,
                billingAddressContactNumber,
                billingAddressAlternateNumber,
                billingAddressPincode,
                billingAddressCity,
                billingAddressState,
                billingAddressCountry,
                billingAddressFullAddress,
                products,
                paymentMode,
                grandTotal
            } = req.body;
    
            let paymentStatus = paymentMode === 'Online' ? 'Paid' : 'Yet to Pay';
    
            const mandateOrderId = (await Order.find().sort({ mandateOrderId: -1 }).limit(1))[0]?.mandateOrderId + 1 || 100000001;
    
            for (let product of products) {
                const {
                    productId,
                    productName,
                    quantitySelected,
                    productImageUrl,
                    price,
                    discount,
                    freeDelivery,
                    openBoxDelivery,
                    returnAndRefund,
                } = product;
    
                const productData = await Product.findById(productId);
    
                if (!productData) {
                    await session.abortTransaction();
                    session.endSession();
                    return res.status(404).json({ 'status': 'failed', 'message': 'Product not found' });
                }
    
                const newQuantity = productData.availableQuantity - quantitySelected;
                const newSoldQty = productData.quantitySold + quantitySelected;
    
                if (newQuantity < 0) {
                    await session.abortTransaction();
                    session.endSession();
                    return res.status(400).json({ 'status': 'failed', 'message': 'Insufficient stock for product: ' + productName });
                }
    
                const order = new Order({
                    mandateOrderId,
                    orderId,
                    paymentId,
                    signature,
                    userId,
                    billingAddressName,
                    billingAddressEmail,
                    billingAddressContactNumber,
                    billingAddressAlternateNumber,
                    billingAddressPincode,
                    billingAddressCity,
                    billingAddressState,
                    billingAddressCountry,
                    billingAddressFullAddress,
                    productId,
                    productName,
                    quantitySelected,
                    productImageUrl,
                    price,
                    discount,
                    freeDelivery,
                    openBoxDelivery,
                    returnAndRefund,
                    paymentMode,
                    grandTotal,
                    paymentStatus
                });
    
                await order.save({ session });
    
                await Product.findByIdAndUpdate(productId, {
                    availableQuantity: newQuantity,
                    quantitySold: newSoldQty
                }, { session });
            }
    
            await Cart.deleteMany({ userId });
    
            await session.commitTransaction();
            session.endSession();
    
            const accountSid = '';   // accountsid
            const authToken = '';   // auth token
            const client = require('twilio')(accountSid, authToken);
    
            client.messages
                .create({
                    body: `We’ve received your order and are getting it ready for you. You’ll receive a confirmation and tracking details shortly. Thank you!`,
                    from: 'whatsapp:+14155238886',
                    to: `whatsapp:+91${billingAddressContactNumber}`
                })
                .then(message => console.log(message.sid))
    
            res.status(201).json({ 'status': 'success', 'message': 'Order Added Successfully and Cart Cleared' });
        } catch (err) {
            await session.abortTransaction();
            session.endSession();
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static fetchAllOrders = async (req, res) => {
        try {
            const data = await Order.find().sort({ _id: -1 });
            res.status(200).json({
                success: true,
                data
            });
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static fetchUserAllOrders = async (req, res) => {
        try {
            const data = await Order.find({ userId: req.params.id }).sort({ _id: -1 });
            res.status(200).json({
                success: true,
                data
            });
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static fetchAllUsersOrders = async (req, res) => {
        try {
            const searchedStatus = req.headers["searched-status"] || '';
            const searchedRecord = req.headers["searched-record"] || '';
            const pageNumber = Number(req.headers["page-number"]) || 1;
        
            const recordsPerPage = 12;
            const fetchRecordTill = recordsPerPage * pageNumber;
            const fetchRecordFrom = fetchRecordTill - recordsPerPage;

            const matchConditions = {};
            if (searchedStatus) {
                matchConditions.status = searchedStatus;
            }
            if (searchedRecord) {
                matchConditions.$or = [
                    { productName: { $regex: searchedRecord, $options: 'i' } },
                    { billingAddressName: { $regex: searchedRecord, $options: 'i' } },
                    { billingAddressContactNumber: { $regex: searchedRecord, $options: 'i' } }
                ];
            }

            const totalRecords = await Order.countDocuments(matchConditions);
            const data = await Order.find(matchConditions)
                .populate('userId')
                .sort({ _id: -1 })
                .skip(fetchRecordFrom)
                .limit(recordsPerPage);

            res.status(200).json({
                success: true,
                data,
                totalRecords
            });
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static fetchAll = async (req, res) => {
        try {
            const userId = req.user_id;
            const data = await Order.find({ userId }).sort({ _id: -1 });
            res.status(200).json({
                success: true,
                data
            });
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static fetchSingle = async (req, res) => {
        try {
            const data = await Order.findById(req.params.id).populate('userId');
            res.status(200).json({
                success: true,
                data
            });
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static updateOrderStatus = async (req, res) => {
        try {
            const { mandateOrderId, orderStatus, updateAll, id } = req.body;
            const currentDate = new Date().toISOString();
    
            let order = await Order.findById(id);
            if (!order) {
                return res.status(404).json({ status: 'failed', message: 'Order not found' });
            }
    
            const currentStatus = order.status;
            let updateData = { status: orderStatus };
    
            if (updateAll == 1) {
                switch (orderStatus) {
                    case 'Pending':
                        if (currentStatus === 'Cancelled') return res.status(404).json({ status: 'failed', message: 'Order Cancelled' });
                        updateData = { ...updateData, shipmentDate: null, outForDeliveryDate: null, deliveredDate: null, cancelledDate: null, refundRequestDate: null, proceedForRefundDate: null, refundCompletedDate: null };
                        break;
                    case 'Cancelled':
                        if (currentStatus === 'Pending') {
                            const product = await Product.findById(order.productId);
                            if (product) {
                                const newQuantity = product.availableQuantity + order.quantitySelected;
                                const newSoldQty = product.quantitySold - order.quantitySelected;
                                await Product.findByIdAndUpdate(order.productId, { availableQuantity: newQuantity, quantitySold: newSoldQty });
                            }
                            updateData = { ...updateData, cancelledDate: currentDate };
                        } else {
                            return res.status(404).json({ status: 'failed', message: `Order can not be cancelled now, Order can be cancelled before Shipment only, Order Status: ${currentStatus}` });
                        }
                        break;
                    case 'Shipped':
                        if (currentStatus === 'Cancelled') return res.status(404).json({ status: 'failed', message: 'Order Cancelled' });
                        updateData = { ...updateData, shipmentDate: currentDate };
                        break;
                    case 'Out for Delivery':
                        if (currentStatus === 'Cancelled') return res.status(404).json({ status: 'failed', message: 'Order Cancelled' });
                        updateData = { ...updateData, outForDeliveryDate: currentDate };
                        break;
                    case 'Delivered':
                        if (currentStatus === 'Cancelled') return res.status(404).json({ status: 'failed', message: 'Order Cancelled' });
                        updateData = { ...updateData, deliveredDate: currentDate, paymentStatus: 'Paid' };
                        break;
                    case 'Refund Request':
                        if (currentStatus === 'Cancelled') return res.status(404).json({ status: 'failed', message: 'Order Cancelled' });
                        updateData = { ...updateData, refundRequestDate: currentDate };
                        break;
                    case 'Proceed for Refund':
                        if (currentStatus === 'Cancelled') return res.status(404).json({ status: 'failed', message: 'Order Cancelled' });
                        updateData = { ...updateData, proceedForRefundDate: currentDate };
                        break;
                    case 'Refund Completed':
                        updateData = { ...updateData, refundCompletedDate: currentDate };
                        break;
                    default:
                        return res.status(400).json({ status: 'failed', message: 'Invalid order status' });
                }
    
                await Order.updateOne({ mandateOrderId }, updateData);
            } else {
                switch (orderStatus) {
                    case 'Pending':
                        if (currentStatus === 'Cancelled') return res.status(404).json({ status: 'failed', message: 'Order Cancelled' });
                        updateData = { ...updateData, shipmentDate: null, outForDeliveryDate: null, deliveredDate: null, cancelledDate: null, refundRequestDate: null, proceedForRefundDate: null, refundCompletedDate: null };
                        break;
                    case 'Cancelled':
                        if (currentStatus === 'Pending') {
                            const product = await Product.findById(order.productId);
                            if (product) {
                                const newQuantity = product.availableQuantity + order.quantitySelected;
                                const newSoldQty = product.quantitySold - order.quantitySelected;
                                await Product.findByIdAndUpdate(order.productId, { availableQuantity: newQuantity, quantitySold: newSoldQty });
                            }
                            updateData = { ...updateData, cancelledDate: currentDate };
                        } else {
                            return res.status(404).json({ status: 'failed', message: `Order can not be cancelled now, Order can be cancelled before Shipment only, Order Status: ${currentStatus}` });
                        }
                        break;
                    case 'Shipped':
                        if (currentStatus === 'Cancelled') return res.status(404).json({ status: 'failed', message: 'Order Cancelled' });
                        updateData = { ...updateData, shipmentDate: currentDate };
                        break;
                    case 'Out for Delivery':
                        if (currentStatus === 'Cancelled') return res.status(404).json({ status: 'failed', message: 'Order Cancelled' });
                        updateData = { ...updateData, outForDeliveryDate: currentDate };
                        break;
                    case 'Delivered':
                        if (currentStatus === 'Cancelled') return res.status(404).json({ status: 'failed', message: 'Order Cancelled' });
                        updateData = { ...updateData, deliveredDate: currentDate, paymentStatus: 'Paid' };
                        break;
                    case 'Refund Request':
                        if (currentStatus === 'Cancelled') return res.status(404).json({ status: 'failed', message: 'Order Cancelled' });
                        updateData = { ...updateData, refundRequestDate: currentDate };
                        break;
                    case 'Proceed for Refund':
                        if (currentStatus === 'Cancelled') return res.status(404).json({ status: 'failed', message: 'Order Cancelled' });
                        updateData = { ...updateData, proceedForRefundDate: currentDate };
                        break;
                    case 'Refund Completed':
                        if (currentStatus === 'Cancelled') return res.status(404).json({ status: 'failed', message: 'Order Cancelled' });
                        const product = await Product.findById(order.productId);
                        if (product) {
                            const updatedQuantity = order.quantitySelected + product.availableQuantity;
                            await Product.findByIdAndUpdate(order.productId, { availableQuantity: updatedQuantity });
                        }
                        updateData = { ...updateData, refundCompletedDate: currentDate };
                        break;
                    default:
                        return res.status(400).json({ status: 'failed', message: 'Invalid order status' });
                }
    
                await Order.findByIdAndUpdate(id, updateData);
            }
    
            // Send WhatsApp message
            await sendWhatsAppMessage(order.billingAddressContactNumber, `Order Status Update for your product ${order.productName}, SSID: ${order.mandateOrderId}, Order Status: ${orderStatus}.`);
    
            res.status(200).json({ status: 'success', message: 'Order status updated successfully' });
        } catch (err) {
            res.status(500).json({ status: 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static orderRefundRequest = async (req, res) => {
        try {
            const { id, orderStatus, upiForRefund, bankAccountHolderNameForRefund, bankAccountNumberForRefund, bankAccountIfscForRefund, bankName, bankBranchName, bankFullAddress, bankCity, bankDistrict, refundAmount } = req.body;
            const currentDate = new Date().toISOString();
            
            const order = await Order.findById(id);
            if (!order) {
                return res.status(404).json({ status: 'failed', message: 'Order not found' });
            }
    
            const updateData = {
                status: orderStatus,
                upiForRefund,
                bankAccountHolderNameForRefund,
                bankAccountNumberForRefund,
                bankAccountIfscForRefund,
                bankName,
                bankBranchName,
                bankFullAddress,
                bankCity,
                bankDistrict,
                refundAmount,
                refundRequestDate: currentDate
            };
    
            const result = await Order.findByIdAndUpdate(id, updateData);
            if (result) {
                await sendWhatsAppMessage(order.billingAddressContactNumber, `Thank you for reaching out. Your refund request is being processed for the product ${order.productName}, SSID: ${order.mandateOrderId} and we’ll update you on the status shortly.`);
                
                res.status(200).json({ status: 'success', message: 'Order refund request sent successfully' });
            } else {
                res.status(404).json({ status: 'failed', message: 'Internal Server Error' });
            }
        } catch (err) {
            res.status(500).json({ status: 'failed', message: `Error: ${err.message}` });
        }
    }

    static processRefund = async (req, res) => {
        try {
            const { paymentId, productId } = req.body;
    
            const razorpay = new Razorpay({
                key_id: process.env.RAZORPAY_KEY_ID,
                key_secret: process.env.RAZORPAY_KEY_SECRET,
            });
    
            const currentDate = new Date().toISOString();
            const order = await Order.findById(productId);
    
            if (!order) {
                return res.status(400).json({ status: 'failed', message: 'Order not found' });
            }
    
            const refund = await razorpay.refunds.create({
                payment_id: paymentId,
                amount: order.grandTotal * 100,
                notes: { reason: 'Refund for order cancellation' }
            });
    
            await Order.findByIdAndUpdate(productId, {
                status: 'Proceed for Refund',
                cancelledDate: null,
                proceedForRefundDate: currentDate,
                refundCompletedDate: null
            });
    
            res.status(200).json({
                success: true,
                message: 'Refund processed successfully',
                refund
            });
        } catch (err) {
            res.status(500).json({ status: 'failed', 'message': `Error: ${err.message}` });
        }
    }

}
module.exports = OrderController