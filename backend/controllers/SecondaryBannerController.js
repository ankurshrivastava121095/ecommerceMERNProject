const cloudinary = require('cloudinary').v2;
const SecondaryBanner = require('../models/SecondaryBanner');
const User = require('../models/User');

cloudinary.config({ 
    cloud_name: 'depjzfj9a', 
    api_key: '489915939841262', 
    api_secret: '5tBdTUHJ33XMIN3iP-49Rfeps9I'
});

class SecondaryBannerController {

    static store = async (req, res) => {
        try {
            const userId = req.user_id;
            const user = await User.findById(userId);
            
            if (user && user.role === 'Admin') {
                if (req.files.secondaryBannerImages) {
                    const files = Array.isArray(req.files.secondaryBannerImages) ? req.files.secondaryBannerImages : [req.files.secondaryBannerImages];
                    for (const file of files) {
                        const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
                            folder: 'ecommerceProjectImages/secondaryBannerImage'
                        });

                        await new SecondaryBanner({
                            secondaryBannerImagePublicId: uploadResult.public_id,
                            secondaryBannerImageUrl: uploadResult.secure_url
                        }).save();
                    }
                }

                res.status(201).json({ 'status': 'success', 'message': 'Secondary Banner Image Added Successfully' });
            } else {
                res.status(403).json({ 'status': 'failed', 'message': 'Unauthorized' });
            }
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static fetchAll = async (req, res) => {
        try {
            const banners = await SecondaryBanner.find().sort({ _id: -1 }).lean();
    
            res.status(200).json({
                success: true,
                data: banners
            });
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static delete = async (req, res) => {
        try {
            const userId = req.user_id;
            const user = await User.findById(userId);

            if (user && user.role === 'Admin') {
                const banner = await SecondaryBanner.findById(req.params.id);
                if (banner && banner.secondaryBannerImagePublicId) {
                    await cloudinary.uploader.destroy(banner.secondaryBannerImagePublicId);
                }

                const result = await SecondaryBanner.findByIdAndDelete(req.params.id);

                if (result) {
                    res.status(200).json({ 'status': 'success', 'message': 'Secondary Banner Image Deleted Successfully' });
                } else {
                    res.status(500).json({ 'status': 'failed', 'message': 'Internal Server Error' });
                }
            } else {
                res.status(403).json({ 'status': 'failed', 'message': 'Unauthorized' });
            }

        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }
}

module.exports = SecondaryBannerController;