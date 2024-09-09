const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const featuredImageSchema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    featuredImagesPublicId: { type: String, required: true },
    featuredImagesUrl: { type: String, required: true }
}, { timestamps: true });

const FeaturedImage = mongoose.model('FeaturedImage', featuredImageSchema);

module.exports = FeaturedImage;