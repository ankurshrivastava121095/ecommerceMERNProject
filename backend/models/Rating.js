const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    productId: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
    userName: String,
    rating: Number,
    review: String,
    ratingProductOneImageUrl: String,
    ratingProductOneImagePublicId: String,
    ratingProductTwoImageUrl: String,
    ratingProductTwoImagePublicId: String,
    ratingProductThreeImageUrl: String,
    ratingProductThreeImagePublicId: String,
    ratingProductFourImageUrl: String,
    ratingProductFourImagePublicId: String,
    ratingProductFiveImageUrl: String,
    ratingProductFiveImagePublicId: String
});

module.exports = mongoose.model('Rating', ratingSchema);