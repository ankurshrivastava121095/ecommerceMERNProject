import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Features/Auth/AuthSlice";
import categoriesReducer from "./Features/Category/CategorySlice";
import subCategoriesReducer from "./Features/SubCategory/SubCategorySlice";
import productsReducer from "./Features/Product/ProductSlice";
import mainBannersReducer from "./Features/MainBanner/MainBannerSlice";
import secondaryBannersReducer from "./Features/SecondaryBanner/SecondaryBannerSlice";
import forgetPasswordsReducer from "./Features/ForgetPassword/ForgetPasswordSlice";
import ordersReducer from "./Features/Order/OrderSlice";
import ratingsReducer from "./Features/Rating/RatingSlice";
import featuredImagesReducer from "./Features/FeaturedImage/FeaturedImageSlice";
import usersReducer from "./Features/User/UserSlice";
import cartsReducer from "./Features/Cart/CartSlice";
import wishlistsReducer from "./Features/Wishlist/WishlistSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        categories: categoriesReducer,
        subCategories: subCategoriesReducer,
        products: productsReducer,
        mainBanners: mainBannersReducer,
        secondaryBanners: secondaryBannersReducer,
        forgetPasswords: forgetPasswordsReducer,
        orders: ordersReducer,
        ratings: ratingsReducer,
        featuredImages: featuredImagesReducer,
        users: usersReducer,
        carts: cartsReducer,
        wishlists: wishlistsReducer,
    },
});