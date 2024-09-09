const mongoose = require('mongoose');

const MainBannerSchema = new mongoose.Schema({
    mainBannerImagePublicId: { type: String, required: true },
    mainBannerImageUrl: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MainBanner', MainBannerSchema);