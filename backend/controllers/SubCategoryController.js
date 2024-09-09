const cloudinary = require('cloudinary').v2;
const SubCategory = require('../models/SubCategory');
const Category = require('../models/Category');
const User = require('../models/User');

cloudinary.config({ 
    cloud_name: 'depjzfj9a', 
    api_key: '489915939841262', 
    api_secret: '5tBdTUHJ33XMIN3iP-49Rfeps9I'
});

class SubCategoryController {

    static store = async (req, res) => {
        try {
            const { categoryId, subCategoryName } = req.body;
            const userId = req.user_id;

            const user = await User.findById(userId);
            const existingSubCategory = await SubCategory.findOne({ subCategoryName });

            if (!existingSubCategory && user && user.role === 'Admin') {
                let subCategoryImagePublicId = null;
                let subCategoryImageUrl = null;

                if (req.files.subCategoryImage) {
                    const subCategoryImage = req.files.subCategoryImage;
                    const uploadResult = await cloudinary.uploader.upload(subCategoryImage.tempFilePath, {
                        folder: 'ecommerceProjectImages'
                    });
                    subCategoryImagePublicId = uploadResult.public_id;
                    subCategoryImageUrl = uploadResult.secure_url;
                }

                const category = await Category.findById(categoryId);
                const categoryName = category ? category.categoryName : '';

                const newSubCategory = new SubCategory({
                    categoryId,
                    categoryName,
                    subCategoryName,
                    subCategoryImageUrl,
                    subCategoryImagePublicId
                });

                await newSubCategory.save();
                res.status(201).json({ 'status': 'success', 'message': 'Sub Category Added Successfully' });
            } else {
                res.status(403).json({ 'status': 'failed', 'message': 'Sub Category already exists or unauthorized' });
            }
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static fetchAll = async (req, res) => {
        try {
            const subCategories = await SubCategory.find().sort({ _id: -1 }).lean();
            res.status(200).json({ success: true, data: subCategories });
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static fetchByCategoryId = async (req, res) => {
        try {
            const subCategories = await SubCategory.find({ categoryId: req.params.id }).sort({ _id: -1 }).lean();
            res.status(200).json({ success: true, data: subCategories });
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static fetchSingle = async (req, res) => {
        try {
            const subCategory = await SubCategory.findById(req.params.id).lean();
            if (subCategory) {
                res.status(200).json({ success: true, data: subCategory });
            } else {
                res.status(404).json({ 'status': 'failed', 'message': 'Sub Category not found' });
            }
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static update = async (req, res) => {
        try {
            const { categoryId, subCategoryName } = req.body;
            const userId = req.user_id;

            const user = await User.findById(userId);
            const existingSubCategory = await SubCategory.findOne({ 
                subCategoryName,
                _id: { $ne: req.params.id }
            });
            const category = await Category.findById(categoryId);
            const categoryName = category ? category.categoryName : '';

            if (user && user.role === 'Admin') {
                if (!existingSubCategory) {
                    let updateFields = { categoryId, categoryName, subCategoryName };

                    if (req.files && req.files.subCategoryImage) {
                        const subCategoryImage = req.files.subCategoryImage;
                        const uploadResult = await cloudinary.uploader.upload(subCategoryImage.tempFilePath, {
                            folder: 'ecommerceProjectImages'
                        });
                        const subCategoryImagePublicId = uploadResult.public_id;
                        const subCategoryImageUrl = uploadResult.secure_url;

                        const oldImage = await SubCategory.findById(req.params.id);
                        if (oldImage && oldImage.subCategoryImagePublicId) {
                            await cloudinary.uploader.destroy(oldImage.subCategoryImagePublicId);
                        }

                        updateFields = { ...updateFields, subCategoryImagePublicId, subCategoryImageUrl };
                    }

                    const result = await SubCategory.findByIdAndUpdate(req.params.id, updateFields, { new: true });
                    if (result) {
                        res.status(200).json({ 'status': 'success', 'message': 'Sub Category Updated Successfully' });
                    } else {
                        res.status(500).json({ 'status': 'failed', 'message': 'Internal Server Error' });
                    }
                } else {
                    res.status(400).json({ 'status': 'failed', 'message': 'Sub Category Already Exists' });
                }
            } else {
                res.status(403).json({ 'status': 'failed', 'message': 'Unauthorized' });
            }
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static delete = async (req, res) => {
        try {
            const userId = req.user_id;
            const user = await User.findById(userId);

            if (user && user.role === 'Admin') {
                const subCategory = await SubCategory.findById(req.params.id);
                if (subCategory) {
                    const isDeleted = subCategory.isDeleted ? false : true;

                    if (subCategory.subCategoryImagePublicId) {
                        await cloudinary.uploader.destroy(subCategory.subCategoryImagePublicId);
                    }

                    await SubCategory.findByIdAndUpdate(req.params.id, { isDeleted }, { new: true });
                    res.status(200).json({ 'status': 'success', 'message': 'Sub Category Deleted Successfully' });
                } else {
                    res.status(404).json({ 'status': 'failed', 'message': 'Sub Category not found' });
                }
            } else {
                res.status(403).json({ 'status': 'failed', 'message': 'Unauthorized' });
            }
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }
}

module.exports = SubCategoryController;