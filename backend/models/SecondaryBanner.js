const mongoose = require('mongoose');

const secondaryBannerSchema = new mongoose.Schema({
    secondaryBannerImagePublicId: String,
    secondaryBannerImageUrl: String
});

module.exports = mongoose.model('SecondaryBanner', secondaryBannerSchema);