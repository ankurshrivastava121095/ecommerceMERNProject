const express = require('express')
const UserController = require('../controllers/UserController')
const ProductController = require('../controllers/ProductController')
const WishlistController = require('../controllers/WishlistController')
const CartController = require('../controllers/CartController')
const middleWare = require('../middleware/Auth')
const PaymentController = require('../controllers/PaymentController')
const FeaturedImageController = require('../controllers/FeaturedImageController')
const OrderController = require('../controllers/OrderController')
const RatingController = require('../controllers/RatingController')
const CategoryController = require('../controllers/CategoryController')
const MainBannerController = require('../controllers/MainBannerController')
const SecondaryBannerController = require('../controllers/SecondaryBannerController')
const SubCategoryController = require('../controllers/SubCategoryController')
const router = express.Router()



// UserController
router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.post('/send-forget-password-otp', UserController.forgotPassword)
router.post('/verify-forget-password-otp', UserController.verifyOtp)
router.post('/reset-password', UserController.resetPassword)
router.get('/fetch-user', middleWare, UserController.fetchUserById)
router.get('/fetch-all-users', middleWare, UserController.fetchAllUsers)
router.get('/change-user-status/:id', middleWare, UserController.changeUserStatus)
router.put('/update-user', middleWare, UserController.updateUser)


// ProductController
router.post('/product', middleWare, ProductController.store)
router.get('/product', ProductController.fetchAll)
router.get('/best-selling-products', ProductController.fetchBestSellingProducts)
router.get('/product/:id', ProductController.fetchSingle)
router.get('/category-product/:id', ProductController.fetchCategoryProducts)
router.get('/sub-category-product/:id', ProductController.fetchSubCategoryProducts)
router.put('/product/:id', middleWare, ProductController.update)
router.delete('/product/:id', middleWare, ProductController.delete)


// MainBannerController
router.post('/main-banner', middleWare, MainBannerController.store)
router.get('/main-banner', MainBannerController.fetchAll)
router.delete('/main-banner/:id', middleWare, MainBannerController.delete)


// SecondaryBannerController
router.post('/secondary-banner', middleWare, SecondaryBannerController.store)
router.get('/secondary-banner', SecondaryBannerController.fetchAll)
router.delete('/secondary-banner/:id', middleWare, SecondaryBannerController.delete)


// CategoryController
router.post('/category', middleWare, CategoryController.store)
router.get('/category', CategoryController.fetchAll)
router.get('/fetch-all-category-with-products', CategoryController.fetchCategoriesWithProducts)
router.get('/category/:id', CategoryController.fetchSingle)
router.put('/category/:id', middleWare, CategoryController.update)
router.delete('/category/:id', middleWare, CategoryController.delete)


// SubCategoryController
router.post('/sub-category', middleWare, SubCategoryController.store)
router.get('/sub-category', SubCategoryController.fetchAll)
router.get('/sub-category-by-category-id/:id', SubCategoryController.fetchbyCategoryId)
router.get('/sub-category/:id', SubCategoryController.fetchSingle)
router.put('/sub-category/:id', middleWare, SubCategoryController.update)
router.delete('/sub-category/:id', middleWare, SubCategoryController.delete)


// FeaturedImageController
router.get('/featured-image/:id', FeaturedImageController.fetchAll)


// RatingController
router.post('/rating', middleWare, RatingController.storeOrUpdate)
router.get('/rating', RatingController.fetchAll)
router.get('/rating/:id', RatingController.fetchSingleProductRating)


// WishlistController
router.post('/wishlist', middleWare, WishlistController.addOrRemove)
router.get('/wishlist', middleWare, WishlistController.fetchAll)


// CartController
router.post('/cart', middleWare, CartController.add)
router.delete('/cart/:id', middleWare, CartController.remove)
router.get('/cart', middleWare, CartController.fetchAll)
router.put('/cart/:id', middleWare, CartController.update)


// PaymentController
router.post('/payment/initiate', PaymentController.initiatePayment);
router.post('/payment/callback', PaymentController.paymentCallback);

// OrderController
router.post('/place-order', middleWare, OrderController.store)
router.get('/get-orders', middleWare, OrderController.fetchAllOrders)
router.get('/get-all-users-orders', middleWare, OrderController.fetchAllUsersOrders)
router.get('/fetch-user-all-orders/:id', middleWare, OrderController.fetchUserAllOrders)
router.get('/get-all-orders', middleWare, OrderController.fetchAll)
router.get('/get-order-detail/:id', middleWare, OrderController.fetchSingle)
router.post('/update-order-status', middleWare, OrderController.updateOrderStatus)
router.post('/order-refund-request', middleWare, OrderController.orderRefundRequest)
router.post('/order-payment-refund', middleWare, OrderController.processRefund)


module.exports = router