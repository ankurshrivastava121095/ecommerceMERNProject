const Category = require('../models/Category');
const User = require('../models/User');
const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: 'depjzfj9a', 
    api_key: '489915939841262', 
    api_secret: '5tBdTUHJ33XMIN3iP-49Rfeps9I',
    // secure: true
});

class CategoryController {

    static store = async (req, res) => {
        try {
            const { categoryName } = req.body;
            const userId = req.user_id;
            
            const userData = await User.findById(userId);

            if (!userData || userData.role !== 'Admin') {
                return res.status(403).json({ status: 'failed', message: 'Unauthorized' });
            }

            const categoryData = await Category.findOne({ categoryName });

            if (!categoryData) {
                let categoryImagePublicId = null;
                let categoryImageUrl = null;

                if (req.files && req.files.categoryImage) {
                    const categoryImage = req.files.categoryImage;
                    const uploadResult = await cloudinary.uploader.upload(categoryImage.tempFilePath, {
                        folder: 'ecommerceProjectImages'
                    });
                    categoryImagePublicId = uploadResult.public_id;
                    categoryImageUrl = uploadResult.secure_url;
                }

                const newCategory = new Category({
                    categoryName,
                    categoryImageUrl,
                    categoryImagePublicId
                });

                const savedCategory = await newCategory.save();

                if (savedCategory) {
                    res.status(201).json({ status: 'success', message: 'Category Added Successfully' });
                } else {
                    res.status(500).json({ status: 'failed', message: 'Internal Server Error' });
                }
            } else {
                res.status(403).json({ status: 'failed', message: 'Category Already Exists' });
            }
        } catch (err) {
            res.status(500).json({ status: 'failed', message: `Error: ${err.message}` });
        }
    };

    static fetchAll = async (req, res) => {
        try {
            const categories = await Category.find({ isDeleted: false }).sort({ _id: -1 });
            res.status(200).json({ success: true, data: categories });
        } catch (err) {
            res.status(500).json({ status: 'failed', message: `Error: ${err.message}` });
        }
    };

    static fetchCategoriesWithProducts = async (req, res) => {
        try {
            const categoriesWithProducts = await Category.aggregate([
                { $match: { isDeleted: false } },
                {
                    $lookup: {
                        from: 'products', // Assuming your Product collection is named 'products'
                        localField: '_id',
                        foreignField: 'categoryId',
                        as: 'products'
                    }
                },
                { $limit: 12 }
            ]);

            res.status(200).json({ success: true, data: categoriesWithProducts });
        } catch (err) {
            res.status(500).json({ status: 'failed', message: `Error: ${err.message}` });
        }
    };

    static fetchSingle = async (req, res) => {
        try {
            const category = await Category.findById(req.params.id);

            if (category) {
                res.status(200).json({ success: true, data: category });
            } else {
                res.status(404).json({ status: 'failed', message: 'Category not found' });
            }
        } catch (err) {
            res.status(500).json({ status: 'failed', message: `Error: ${err.message}` });
        }
    };

    static update = async (req, res) => {
        try {
            const { categoryName } = req.body;
            const userId = req.user_id;
            const userData = await User.findById(userId);

            if (!userData || userData.role !== 'Admin') {
                return res.status(403).json({ status: 'failed', message: 'Unauthorized' });
            }

            const existingCategory = await Category.findOne({ categoryName, _id: { $ne: req.params.id } });

            if (!existingCategory) {
                let updateData = { categoryName };

                if (req.files && req.files.categoryImage) {
                    const categoryImage = req.files.categoryImage;
                    const uploadResult = await cloudinary.uploader.upload(categoryImage.tempFilePath, {
                        folder: 'ecommerceProjectImages'
                    });
                    updateData.categoryImagePublicId = uploadResult.public_id;
                    updateData.categoryImageUrl = uploadResult.secure_url;

                    const oldCategory = await Category.findById(req.params.id);
                    if (oldCategory && oldCategory.categoryImagePublicId) {
                        await cloudinary.uploader.destroy(oldCategory.categoryImagePublicId);
                    }
                }

                const updatedCategory = await Category.findByIdAndUpdate(req.params.id, updateData, { new: true });

                if (updatedCategory) {
                    res.status(200).json({ status: 'success', message: 'Category Updated Successfully' });
                } else {
                    res.status(500).json({ status: 'failed', message: 'Internal Server Error' });
                }
            } else {
                res.status(500).json({ status: 'failed', message: 'Category Already Exists' });
            }
        } catch (err) {
            res.status(500).json({ status: 'failed', message: `Error: ${err.message}` });
        }
    };

    static delete = async (req, res) => {
        try {
            const userId = req.user_id;
            const userData = await User.findById(userId);

            if (!userData || userData.role !== 'Admin') {
                return res.status(403).json({ status: 'failed', message: 'Unauthorized' });
            }

            const category = await Category.findById(req.params.id);

            if (category) {
                category.isDeleted = !category.isDeleted;
                const updatedCategory = await category.save();

                if (updatedCategory) {
                    res.status(200).json({ status: 'success', message: 'Category Deleted Successfully' });
                } else {
                    res.status(500).json({ status: 'failed', message: 'Internal Server Error' });
                }
            } else {
                res.status(404).json({ status: 'failed', message: 'Category not found' });
            }
        } catch (err) {
            res.status(500).json({ status: 'failed', message: `Error: ${err.message}` });
        }
    }
}

module.exports = CategoryController;