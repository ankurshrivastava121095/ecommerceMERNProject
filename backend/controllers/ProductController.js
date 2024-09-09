const cloudinary = require('cloudinary').v2;
const Product = require('../models/Product');
const FeaturedImage = require('../models/FeaturedImage');
const Category = require('../models/Category'); 
const SubCategory = require('../models/SubCategory'); 

cloudinary.config({ 
    cloud_name: 'depjzfj9a', 
    api_key: '489915939841262', 
    api_secret: '5tBdTUHJ33XMIN3iP-49Rfeps9I',
    // secure: true
});

class ProductController {
    static store = async (req, res) => {
        try {
            const { 
                productName,  
                categoryId,  
                subCategoryId,  
                shortDescription,  
                detailedDescription,  
                price,  
                discount,  
                availableQuantity,  
                freeDelivery,  
                openBoxDelivery,  
                returnAndRefund,  
                deliveryPolicy,  
                returnPolicy,  
            } = req.body;

            const userId = req.user_id;

            const user = await User.findById(userId);
            if (user && user.role === 'Admin') {
                let productImagePublicId = null;
                let productImageUrl = null;
                let productVideoPublicId = null;
                let productVideoUrl = null;

                if (req.files.productImage) {
                    const productImage = req.files.productImage;
                    const uploadResult = await cloudinary.uploader.upload(productImage.tempFilePath, {
                        folder: 'ecommerceProjectImages'
                    });
                    productImagePublicId = uploadResult.public_id;
                    productImageUrl = uploadResult.secure_url;
                }

                if (req.files.productVideo) {
                    const productVideo = req.files.productVideo;
                    const uploadResult = await cloudinary.uploader.upload(productVideo.tempFilePath, {
                        folder: 'ecommerceProjectVideos',
                        resource_type: 'video'
                    });
                    productVideoPublicId = uploadResult.public_id;
                    productVideoUrl = uploadResult.secure_url;
                }

                const category = await Category.findById(categoryId);
                const subCategory = await SubCategory.findById(subCategoryId);

                const product = new Product({
                    productName,
                    categoryId,
                    categoryName: category ? category.categoryName : '',
                    subCategoryId,
                    subCategoryName: subCategory ? subCategory.subCategoryName : '',
                    shortDescription,
                    detailedDescription,
                    price,
                    discount: discount || 0,
                    availableQuantity,
                    freeDelivery: freeDelivery || 0,
                    openBoxDelivery: openBoxDelivery || 0,
                    returnAndRefund: returnAndRefund || 0,
                    deliveryPolicy,
                    returnPolicy,
                    productImagePublicId,
                    productImageUrl,
                    productVideoPublicId,
                    productVideoUrl
                });

                const savedProduct = await product.save();
                const productId = savedProduct._id;

                if (req.files.featuredImages) {
                    const files = Array.isArray(req.files.featuredImages) ? req.files.featuredImages : [req.files.featuredImages];
                    for (const file of files) {
                        const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
                            folder: 'ecommerceProjectImages/featured'
                        });

                        const featuredImage = new FeaturedImage({
                            productId,
                            featuredImagesPublicId: uploadResult.public_id,
                            featuredImagesUrl: uploadResult.secure_url
                        });

                        await featuredImage.save();
                    }
                }

                res.status(201).json({ 'status': 'success', 'message': 'Product Added Successfully' });
            } else {
                res.status(403).json({ 'status': 'failed', 'message': 'Unauthorized' });
            }
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static fetchAll = async (req, res) => {
        try {
            const searchedRecord = req.headers["searched-record"] || '';
            const pageNumber = Number(req.headers["page-number"]) || 1;
        
            const recordsPerPage = 12;
            const fetchRecordTill = recordsPerPage * pageNumber;
            const fetchRecordFrom = fetchRecordTill - recordsPerPage;

            const filter = { isDeleted: false };
            if (searchedRecord) {
                filter.productName = new RegExp(searchedRecord, 'i');
            }

            const [products, totalRecords] = await Promise.all([
                Product.find(filter)
                    .skip(fetchRecordFrom)
                    .limit(recordsPerPage)
                    .populate('categoryId', 'categoryName')
                    .populate('subCategoryId', 'subCategoryName')
                    .lean(), 
                Product.countDocuments(filter)
            ]);

            const featuredImages = await FeaturedImage.find({ productId: { $in: products.map(p => p._id) } }).lean();

            products.forEach(product => {
                product.featuredImage = featuredImages.filter(img => img.productId.equals(product._id));
            });

            res.status(200).json({
                success: true,
                data: products,
                totalRecords
            });
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static fetchBestSellingProducts = async (req, res) => {
        try {
            const searchedRecord = req.headers["searched-record"] || '';
            const pageNumber = Number(req.headers["page-number"]) || 1;
        
            const recordsPerPage = 12;
            const fetchRecordTill = recordsPerPage * pageNumber;
            const fetchRecordFrom = fetchRecordTill - recordsPerPage;

            const filter = { isDeleted: false };
            if (searchedRecord) {
                filter.productName = new RegExp(searchedRecord, 'i');
            }

            const [products, totalRecords] = await Promise.all([
                Product.find(filter)
                    .sort({ quantitySold: -1 })
                    .skip(fetchRecordFrom)
                    .limit(recordsPerPage)
                    .populate('categoryId', 'categoryName')
                    .populate('subCategoryId', 'subCategoryName')
                    .lean(), 
                Product.countDocuments(filter)
            ]);

            const featuredImages = await FeaturedImage.find({ productId: { $in: products.map(p => p._id) } }).lean();

            products.forEach(product => {
                product.featuredImage = featuredImages.filter(img => img.productId.equals(product._id));
            });

            res.status(200).json({
                success: true,
                data: products,
                totalRecords
            });
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static fetchCategoryProducts = async (req, res) => {
        try {
            const pageNumber = Number(req.headers["page-number"]) || 1;
        
            const recordsPerPage = 12;
            const fetchRecordTill = recordsPerPage * pageNumber;
            const fetchRecordFrom = fetchRecordTill - recordsPerPage;

            const categoryId = req.params.id;

            const [products, totalRecords] = await Promise.all([
                Product.find({ categoryId, isDeleted: false })
                    .skip(fetchRecordFrom)
                    .limit(recordsPerPage)
                    .populate('categoryId', 'categoryName')
                    .populate('subCategoryId', 'subCategoryName')
                    .lean(), 
                Product.countDocuments({ categoryId, isDeleted: false })
            ]);

            const featuredImages = await FeaturedImage.find({ productId: { $in: products.map(p => p._id) } }).lean();

            products.forEach(product => {
                product.featuredImage = featuredImages.filter(img => img.productId.equals(product._id));
            });

            res.status(200).json({
                success: true,
                data: products,
                totalRecords
            });
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static fetchSubCategoryProducts = async (req, res) => {
        try {
            const pageNumber = Number(req.headers["page-number"]) || 1;
            const recordsPerPage = 12;
            const fetchRecordTill = recordsPerPage * pageNumber;
            const fetchRecordFrom = fetchRecordTill - recordsPerPage;
    
            const subCategoryId = req.params.id;
    
            const filter = { subCategoryId, isDeleted: false };
            const [products, totalRecords] = await Promise.all([
                Product.find(filter)
                    .skip(fetchRecordFrom)
                    .limit(recordsPerPage)
                    .sort({ _id: -1 }) 
                    .populate('categoryId', 'categoryName')
                    .populate('subCategoryId', 'subCategoryName')
                    .lean(), 
                Product.countDocuments(filter)
            ]);
    
            const featuredImages = await FeaturedImage.find({ productId: { $in: products.map(p => p._id) } }).lean();
    
            products.forEach(product => {
                product.featuredImage = featuredImages.filter(img => img.productId.equals(product._id));
            });
    
            res.status(200).json({
                success: true,
                data: products,
                totalRecords
            });
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static fetchSingle = async (req, res) => {
        try {
            const productId = req.params.id;
    
            const product = await Product.findById(productId)
                .populate('categoryId', 'categoryName')
                .populate('subCategoryId', 'subCategoryName')
                .lean();
    
            if (product) {
                const featuredImages = await FeaturedImage.find({ productId }).lean();
                res.status(200).json({
                    success: true,
                    data: {
                        ...product,
                        featuredImages
                    }
                });
            } else {
                res.status(404).json({ 'status': 'failed', 'message': 'Product not found' });
            }
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static update = async (req, res) => {
        try {
            const { 
                productName,  
                categoryId,
                subCategoryId,
                shortDescription,  
                detailedDescription,  
                price,  
                discount,  
                availableQuantity,  
                freeDelivery,  
                openBoxDelivery,  
                returnAndRefund,  
                deliveryPolicy,  
                returnPolicy,   
            } = req.body;
    
            const updates = {
                productName,  
                categoryId,
                subCategoryId,
                shortDescription,  
                detailedDescription,  
                price,  
                discount: discount || 0,  
                availableQuantity,  
                freeDelivery: freeDelivery || 0,  
                openBoxDelivery: openBoxDelivery || 0,  
                returnAndRefund: returnAndRefund || 0,  
                deliveryPolicy,  
                returnPolicy
            };
    
            if (req.files && req.files.productImage) {
                const productImage = req.files.productImage;
                const uploadResult = await cloudinary.uploader.upload(productImage.tempFilePath, {
                    folder: 'ecommerceProjectImages'
                });
                updates.productImagePublicId = uploadResult.public_id;
                updates.productImageUrl = uploadResult.secure_url;
    
                const product = await Product.findById(req.params.id);
                if (product.productImagePublicId) {
                    await cloudinary.uploader.destroy(product.productImagePublicId);
                }
            }
    
            if (req.files && req.files.productVideo) {
                const productVideo = req.files.productVideo;
                const uploadResult = await cloudinary.uploader.upload(productVideo.tempFilePath, {
                    folder: 'ecommerceProjectVideos',
                    resource_type: 'video'
                });
                updates.productVideoPublicId = uploadResult.public_id;
                updates.productVideoUrl = uploadResult.secure_url;
    
                const product = await Product.findById(req.params.id);
                if (product.productVideoPublicId) {
                    await cloudinary.uploader.destroy(product.productVideoPublicId);
                }
            }
    
            if (req.files && req.files.featuredImages) {
                await FeaturedImage.deleteMany({ productId: req.params.id });
    
                const files = Array.isArray(req.files.featuredImages) ? req.files.featuredImages : [req.files.featuredImages];
                for (const file of files) {
                    const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
                        folder: 'ecommerceProjectImages/featured'
                    });
    
                    await new FeaturedImage({
                        productId: req.params.id,
                        featuredImagesPublicId: uploadResult.public_id,
                        featuredImagesUrl: uploadResult.secure_url
                    }).save();
                }
            }
    
            const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
    
            if (product) {
                res.status(200).json({ 'status': 'success', 'message': 'Product Updated Successfully' });
            } else {
                res.status(500).json({ 'status': 'failed', 'message': 'Internal Server Error' });
            }
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static delete = async (req, res) => {
        try {
            const productId = req.params.id;
    
            const product = await Product.findById(productId);
            if (product) {
                product.isDeleted = !product.isDeleted;
                await product.save();
    
                res.status(200).json({ 'status': 'success', 'message': 'Product Deleted Successfully' });
            } else {
                res.status(404).json({ 'status': 'failed', 'message': 'Product not found' });
            }
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }
}

module.exports = ProductController;