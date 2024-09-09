const cloudinary = require('cloudinary').v2;
const User = require('../models/User');
const Rating = require('../models/Rating');
const Product = require('../models/Product');

cloudinary.config({ 
    cloud_name: 'depjzfj9a', 
    api_key: '489915939841262', 
    api_secret: '5tBdTUHJ33XMIN3iP-49Rfeps9I'
});

class RatingController {
    static storeOrUpdate = async (req, res) => {
        try {
            const userId = req.user_id;
            const { productId, rating, review } = req.body;
            
            let ratingProductImages = {};
            for (let i = 1; i <= 5; i++) {
                if (req.files[`ratingProduct${i}Image`]) {
                    const image = req.files[`ratingProduct${i}Image`];
                    const uploadResult = await cloudinary.uploader.upload(image.tempFilePath, {
                        folder: 'ecommerceProjectImages'
                    });
                    ratingProductImages[`ratingProduct${i}ImageUrl`] = uploadResult.secure_url;
                    ratingProductImages[`ratingProduct${i}ImagePublicId`] = uploadResult.public_id;
                }
            }

            const user = await User.findById(userId);
            const userName = user.name;

            const existingRating = await Rating.findOne({ userId, productId });

            if (existingRating) {
                // Update
                await Rating.findByIdAndUpdate(existingRating._id, {
                    rating,
                    review,
                    ...ratingProductImages
                });
            } else {
                // Store
                await new Rating({
                    productId,
                    userId,
                    userName,
                    rating,
                    review,
                    ...ratingProductImages
                }).save();
            }
            
            const ratings = await Rating.find({ productId });
            const totalRating = ratings.reduce((sum, r) => sum + r.rating, 0);
            const currentRating = (totalRating / ratings.length).toFixed(1);

            await Product.findByIdAndUpdate(productId, { currentRating });

            res.status(201).json({ 'status': 'success', 'message': 'Ratings Added Successfully' });
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static fetchAll = async (req, res) => {
        try {
            const ratings = await Rating.find().sort({ _id: -1 }).lean();
            res.status(200).json({
                success: true,
                data: ratings
            });
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static fetchSingleProductRating = async (req, res) => {
        try {
            const productId = req.params.id;
            const ratings = await Rating.find({ productId }).sort({ _id: -1 }).lean();
            res.status(200).json({
                success: true,
                data: ratings
            });
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }
}

module.exports = RatingController;