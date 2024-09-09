const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product'); 

class WishlistController {

    static addOrRemove = async (req, res) => {
        try {
            const userId = req.user_id;
            const {
                productId,
                productName,
                productImageUrl,
                price,
                discount,
                freeDelivery,
                openBoxDelivery,
                returnAndRefund,
            } = req.body;

            const existingWishlistItem = await Wishlist.findOne({ productId, userId });

            if (existingWishlistItem) {
                await Wishlist.deleteOne({ _id: existingWishlistItem._id });
                res.status(200).json({ 'status': 'success', 'message': 'Product Removed Successfully' });
            } else {
                const newWishlistItem = new Wishlist({
                    userId,
                    productId,
                    productName,
                    price,
                    discount,
                    freeDelivery,
                    openBoxDelivery,
                    returnAndRefund,
                    productImageUrl,
                });

                await newWishlistItem.save();
                res.status(201).json({ 'status': 'success', 'message': 'Product Added Successfully' });
            }

        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static fetchAll = async (req, res) => {
        try {
            const userId = req.user_id;
            const wishlists = await Wishlist.find({ userId }).populate('productId').sort({ _id: -1 });

            res.status(200).json({
                success: true,
                data: wishlists
            });

        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }
}

module.exports = WishlistController;