const Cart = require('../models/Cart'); // Assuming the Cart model is in the models folder
const Product = require('../models/Product'); // Assuming the Product model is in the models folder

class CartController {

    static add = async (req, res) => {
        try {
            const id = req.user_id;
            const {
                productId,
                quantitySelected,
                productName,
                productImageUrl,
                price,
                discount,
                freeDelivery,
                openBoxDelivery,
                returnAndRefund
            } = req.body;

            const existingCartItem = await Cart.findOne({ productId, userId: id });

            if (existingCartItem) {
                return res.status(401).json({ status: 'failed', message: 'Product Already Added, Go to Cart' });
            }

            const cartItem = new Cart({
                userId: id,
                productId,
                quantitySelected,
                productName,
                productImageUrl,
                price,
                discount,
                freeDelivery,
                openBoxDelivery,
                returnAndRefund
            });

            const savedCartItem = await cartItem.save();

            if (savedCartItem) {
                res.status(201).json({ status: 'success', message: 'Product Added Successfully' });
            } else {
                res.status(500).json({ status: 'failed', message: 'Internal Server Error' });
            }

        } catch (err) {
            res.status(500).json({ status: 'failed', message: `Error: ${err.message}` });
        }
    };

    static update = async (req, res) => {
        try {
            const { counterType } = req.body;
            const cartItem = await Cart.findById(req.params.id);

            if (!cartItem) {
                return res.status(404).json({ status: 'failed', message: 'Cart item not found' });
            }

            let newQuantity = cartItem.quantitySelected;
            newQuantity = counterType === 'increment' ? newQuantity + 1 : newQuantity - 1;

            const product = await Product.findById(cartItem.productId);

            if (product && product.availableQuantity < newQuantity) {
                return res.status(404).json({ status: 'failed', message: 'Product out of stock' });
            }

            cartItem.quantitySelected = newQuantity;
            const updatedCartItem = await cartItem.save();

            if (updatedCartItem) {
                res.status(200).json({ status: 'success', message: 'Product Updated Successfully' });
            } else {
                res.status(500).json({ status: 'failed', message: 'Internal Server Error' });
            }

        } catch (err) {
            res.status(500).json({ status: 'failed', message: `Error: ${err.message}` });
        }
    };

    static remove = async (req, res) => {
        try {
            const deletedCartItem = await Cart.findByIdAndDelete(req.params.id);

            if (deletedCartItem) {
                res.status(200).json({ status: 'success', message: 'Product Removed Successfully' });
            } else {
                res.status(500).json({ status: 'failed', message: 'Internal Server Error' });
            }

        } catch (err) {
            res.status(500).json({ status: 'failed', message: `Error: ${err.message}` });
        }
    };

    static fetchAll = async (req, res) => {
        try {
            const id = req.user_id;
            const carts = await Cart.find({ userId: id }).sort({ _id: -1 });

            res.status(200).json({
                success: true,
                data: carts
            });

        } catch (err) {
            res.status(500).json({ status: 'failed', message: `Error: ${err.message}` });
        }
    };
}

module.exports = CartController;