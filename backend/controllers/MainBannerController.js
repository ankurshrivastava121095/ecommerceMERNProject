const MainBanner = require('../models/MainBanner');
const User = require('../models/User');
const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: 'depjzfj9a', 
    api_key: '489915939841262', 
    api_secret: '5tBdTUHJ33XMIN3iP-49Rfeps9I',
    // secure: true
});

class MainBannerController {

    static store = async (req, res) => {
        try {
            const userId = req.user_id;
            const userData = await User.findById(userId);

            if (userData && userData.role === 'Admin') {
                if (req.files && req.files.mainBannerImages) {
                    const files = Array.isArray(req.files.mainBannerImages) ? req.files.mainBannerImages : [req.files.mainBannerImages];
                    
                    for (const file of files) {
                        const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
                            folder: 'ecommerceProjectImages/mainBannerImage'
                        });

                        const newBanner = new MainBanner({
                            mainBannerImagePublicId: uploadResult.public_id,
                            mainBannerImageUrl: uploadResult.secure_url
                        });

                        await newBanner.save();
                    }

                    res.status(201).json({ status: 'success', message: 'Main Banner Image Added Successfully' });
                } else {
                    res.status(400).json({ status: 'failed', message: 'No images provided' });
                }
            } else {
                res.status(403).json({ status: 'failed', message: 'Unauthorized' });
            }
        } catch (err) {
            res.status(500).json({ status: 'failed', message: `Error: ${err.message}` });
        }
    };

    static fetchAll = async (req, res) => {
        try {
            const banners = await MainBanner.find().sort({ _id: -1 });
            res.status(200).json({ success: true, data: banners });
        } catch (err) {
            res.status(500).json({ status: 'failed', message: `Error: ${err.message}` });
        }
    };

    static delete = async (req, res) => {
        try {
            const userId = req.user_id;
            const userData = await User.findById(userId);

            if (userData && userData.role === 'Admin') {
                const banner = await MainBanner.findById(req.params.id);

                if (banner) {
                    // Delete image from Cloudinary
                    await cloudinary.uploader.destroy(banner.mainBannerImagePublicId);

                    // Delete from the database
                    await MainBanner.findByIdAndDelete(req.params.id);

                    res.status(200).json({ status: 'success', message: 'Main Banner Image Deleted Successfully' });
                } else {
                    res.status(404).json({ status: 'failed', message: 'Main Banner not found' });
                }
            } else {
                res.status(403).json({ status: 'failed', message: 'Unauthorized' });
            }
        } catch (err) {
            res.status(500).json({ status: 'failed', message: `Error: ${err.message}` });
        }
    }
}

module.exports = MainBannerController;