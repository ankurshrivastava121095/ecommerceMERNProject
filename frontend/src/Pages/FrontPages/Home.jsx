/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import Navbar from '../../Components/Layout/Navbar'
import FreeModeSwiper from '../../Components/Swiper/FreeModeSwiper'
import ProductSwiper from '../../Components/Swiper/ProductSwiper'
import FavoriteIcon from '@mui/icons-material/Favorite';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Link, useNavigate } from 'react-router-dom';
import BottomNavigation from '../../Components/Layout/BottomNavigation';
import PlainSwiper from '../../Components/Swiper/PlainSwiper';
import { Avatar, Button, ButtonBase, IconButton, Tooltip } from '@mui/material';
import FullPageLoader from '../../Components/Loaders/FullPageLoader';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { getBestSellingProducts, getProducts, resetProductState } from '../../Features/Product/ProductSlice';
import { createWishlist, getWishlists, resetWishlistState } from '../../Features/Wishlist/WishlistSlice';
import BannerPlainSwiper from '../../Components/Swiper/BannerPlainSwiper';
import { fetchAllCategoryWithProducts, getCategories, resetCategoryState } from '../../Features/Category/CategorySlice';
import { getMainBanners, resetMainBannerState } from '../../Features/MainBanner/MainBannerSlice';
import { getSecondaryBanners, resetSecondaryBannerState } from '../../Features/SecondaryBanner/SecondaryBannerSlice';
import CategorySwiper from '../../Components/Swiper/CategorySwiper';

const Home = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [fullPageLoading, setFullPageLoading] = useState(true)
    const [list, setList] = useState([])
    const [bestSellingProductList, setBestSellingProductList] = useState([])
    const [categoryList, setCategoryList] = useState([])
    const [categoryWithProductList, setCategoryWithProductList] = useState([])
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [wishListArray, setWishListArray] = useState([])
    const [mainBannerArray, setSecondaryBannerArray] = useState([])
    const [secondaryBannerArray, setMainBannerArray] = useState([])
    const [renderNavCart, setRenderNavCart] = useState(false)
    const [renderNavWishlist, setRenderNavWishlist] = useState(false)
    const [hoveredIndex, setHoveredIndex] = useState(null)

    const { products, responseStatus, responseMessage } = useSelector(state => state.products)
    const { categories, responseStatus: categoryResponseStatus, responseMessage: categoryResponseMessage } = useSelector(state => state.categories)
    const { wishlists, responseStatus: wishlistResponseStatus, responseMessage: wishlistResponseMessage } = useSelector(state => state.wishlists)
    const { mainBanners, responseStatus: mainBannerResponseStatus, responseMessage: mainBannerResponseMessage } = useSelector(state => state.mainBanners)
    const { secondaryBanners, responseStatus: secondaryBannerResponseStatus, responseMessage: secondaryBannerResponseMessage } = useSelector(state => state.secondaryBanners)

    const handleWishlist = (val) => {
        if (isLoggedIn) {
            const data = {
                productId: val?._id,
                productImageUrl: val?.productImageUrl,
                productName: val?.productName,
                price: val?.price,
                discount: val?.discount,
                freeDelivery: val?.freeDelivery,
                openBoxDelivery: val?.openBoxDelivery,
                returnAndRefund: val?.returnAndRefund,
            }
            setFullPageLoading(true)
            dispatch(createWishlist(data))
        } else {
            navigate('/login')
        }
    }

    useEffect(()=>{
        const user = Cookies.get('ecomProjectLoggedInUser')
        const token = Cookies.get('ecomProjectLoggedInUserToken')

        if (user && token) {
            setIsLoggedIn(true)
        }
        setTimeout(() => {
            setFullPageLoading(false)
        }, 1000);
    },[])

    useEffect(() => {
        dispatch(getProducts());
        dispatch(getBestSellingProducts());
        dispatch(getCategories());
        dispatch(fetchAllCategoryWithProducts());
        dispatch(getMainBanners());
        dispatch(getSecondaryBanners());
    }, [dispatch]);

    useEffect(()=>{
        if(responseStatus == 'success' && responseMessage == 'Get All'){
            setList(products?.data)
            dispatch(getWishlists());
        }
        if(responseStatus == 'success' && responseMessage == 'Get All Best Selling Products'){
            setBestSellingProductList(products?.data)
            dispatch(getWishlists());
        }
        if(responseStatus == 'rejected' && responseMessage != '' && responseMessage != null){
            setFullPageLoading(false)
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: responseMessage
            });
            setTimeout(() => {
                dispatch(resetProductState())
            }, 1000);
        }
    },[products, responseStatus, responseMessage])

    useEffect(()=>{
        if(categoryResponseStatus == 'success' && categoryResponseMessage == 'Get All'){
            setCategoryList(categories?.data)
        }
        if(categoryResponseStatus == 'success' && categoryResponseMessage == 'Get All Categories with their Products'){
            setCategoryWithProductList(categories?.data)
        }
        if(categoryResponseStatus == 'rejected' && categoryResponseMessage != '' && categoryResponseMessage != null){
            setFullPageLoading(false)
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: categoryResponseMessage
            });
            setTimeout(() => {
                dispatch(resetCategoryState())
            }, 1000);
        }
    },[categories, categoryResponseStatus, categoryResponseMessage])

    useEffect(()=>{
        if(wishlistResponseStatus == 'success' && wishlistResponseMessage == 'Item Added Successfully'){
            dispatch(getWishlists());
            setTimeout(() => {
                setFullPageLoading(false)
            }, 1000);
        }
        if(wishlistResponseStatus == 'success' && wishlistResponseMessage == 'Get All'){
            setRenderNavWishlist(true)
            setWishListArray(wishlists?.data)
            setTimeout(() => {
                setFullPageLoading(false)
            }, 1000);
        }
        if(wishlistResponseStatus == 'rejected' && wishlistResponseMessage != '' && wishlistResponseMessage != null){
            setFullPageLoading(false)
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: wishlistResponseMessage
            });
            setTimeout(() => {
                dispatch(resetWishlistState())
            }, 1000);
        }
    },[wishlists, wishlistResponseStatus, wishlistResponseMessage])

    useEffect(()=>{
        if(mainBannerResponseStatus == 'success' && mainBannerResponseMessage == 'Get All'){
            setMainBannerArray(mainBanners?.data)
            setTimeout(() => {
                setFullPageLoading(false)
            }, 1000);
        }
        if(mainBannerResponseStatus == 'rejected' && mainBannerResponseMessage != '' && mainBannerResponseMessage != null){
            setFullPageLoading(false)
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: mainBannerResponseMessage
            });
            setTimeout(() => {
                dispatch(resetMainBannerState())
            }, 1000);
        }
    },[mainBanners, mainBannerResponseStatus, mainBannerResponseMessage])

    useEffect(()=>{
        if(secondaryBannerResponseStatus == 'success' && secondaryBannerResponseMessage == 'Get All'){
            setSecondaryBannerArray(secondaryBanners?.data)
            setTimeout(() => {
                setFullPageLoading(false)
            }, 1000);
        }
        if(secondaryBannerResponseStatus == 'rejected' && secondaryBannerResponseMessage != '' && secondaryBannerResponseMessage != null){
            setFullPageLoading(false)
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: secondaryBannerResponseMessage
            });
            setTimeout(() => {
                dispatch(resetSecondaryBannerState())
            }, 1000);
        }
    },[secondaryBanners, secondaryBannerResponseStatus, secondaryBannerResponseMessage])

    return (
        <>
            { fullPageLoading && <FullPageLoader /> }
            <Navbar renderNavCart={renderNavCart} setRenderNavCart={setRenderNavCart} renderNavWishlist={renderNavWishlist} setRenderNavWishlist={setRenderNavWishlist} />
            
            
            <div className="w-100">
                <BannerPlainSwiper data={mainBanners?.data} />
            </div>
            <div className="container-fluid">
                <div className='row mt-3'>
                    <div className='mb-1 d-flex flex-wrap align-items-center justify-content-between gap-3'>
                        <h3 className='text-primary'><img src="/logoFinal2.png" style={{ height: '25px' }} alt="/logoFinal2.png" /> New Arrival</h3>
                        <Button type='button' variant="text" className='text-primary' size='small' onClick={()=>navigate('/all-products')}>Show All <TrendingFlatIcon fontSize='small' /></Button>
                    </div>
                    {
                        Array?.isArray(list) && list?.map((val, key) => (
                            <div key={key} className={`col-lg-2 col-md-4 col-sm-4 mb-3 product-card`} onMouseEnter={() => setHoveredIndex(key)} onMouseLeave={() => setHoveredIndex(null)}>
                                <div role='button' className='shadow position-relative' style={{ height: '230px', overflow: 'hidden', borderRadius: '20px 20px 0 0' }}>
                                    {/* Foreground Content */}
                                    <div className='position-relative' style={{ zIndex: 2 }}>
                                        <div style={{ height: '230px' }} className='d-flex flex-column justify-content-between'>
                                            <div className='d-flex align-items-center justify-content-between p-2'>
                                                <div>
                                                    {val?.currentRating > 1 && (
                                                        <span className="badge text-bg-success px-3">
                                                            {val?.currentRating} <small><i className="fa-solid fa-star text-warning"></i></small>
                                                        </span>
                                                    )}
                                                </div>
                                                <Tooltip title={wishListArray?.some(product => product?.productId == val?._id) ? 'Remove from Wishlist' : 'Add to Wishlist'}>
                                                    <IconButton onClick={() => handleWishlist(val)}>
                                                        {wishListArray?.some(product => product?.productId == val?._id) ?
                                                            <FavoriteIcon role='button' className='text-red' />
                                                            :
                                                            <FavoriteBorderIcon role='button' className='text-primary' />
                                                        }
                                                    </IconButton>
                                                </Tooltip>
                                            </div>
                                            <div className={`${hoveredIndex === key ? 'visible' : 'invisible'} transition-opacity duration-300`} onClick={()=>navigate(`/product-detail/${val?._id}`)}>
                                                <div style={{ backgroundColor: 'rgb(0 0 0 / 57%)' }} className='rounded-3 p-3 m-2 text-white'>
                                                    <center>
                                                        <div className='fs-5'>{val?.productName}</div>
                                                        <div className='mt-2'>₹{val?.price}</div>
                                                        <div><small className='text-nowrap mt-2'>{ val?.freeDelivery ? <><i className="fa-solid fa-truck-fast"></i> Free delivery</> : '' }</small></div>
                                                        <div className='mt-2'>Click to Buy Now</div>
                                                    </center>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Blurred Background Image */}
                                    <div
                                        className='blur-background'
                                        style={{
                                            backgroundImage: `url(${val?.productImageUrl})`,
                                            backgroundPosition: 'center',
                                            backgroundSize: 'cover',
                                            backgroundRepeat: 'no-repeat',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            zIndex: 1,
                                            // filter: 'blur(1px)'
                                            filter: 'blur(0px)'
                                        }}
                                    ></div>
                                </div>
                                <ButtonBase sx={{ width: '100%' }} onClick={()=>{
                                    setTimeout(() => {
                                        navigate(`/product-detail/${val?._id}`)
                                    }, 500)
                                }}>
                                    <div role='button' className='w-100 d-flex flex-column align-items-center py-3 px-1 bg-dark shadow-lg' style={{ borderRadius: '0 0 20px 20px' }}>
                                        <div className='w-100 text-center text-white'>₹{val?.price} <span className='text-white'>{val?.availableQuantity == 0 || val?.isDeleted == 1 ? '**Not Available**' : ''}</span></div>
                                        <div className='w-100 text-center fw-bold text-white' style={{ fontSize: '14px' }}>{val?.productName?.length > 15 ? `${val?.productName?.substring(0, 15)}...` : val?.productName}</div>
                                    </div>
                                </ButtonBase>
                            </div>
                        ))
                    }
                </div>
            </div>
            <div className="w-100 bg-button-primary py-3 site-content">
                <div className="container">
                    <div className="row">
                        <div className="col-md-1"></div>
                        <div className="col-md-10">
                            <center>
                                <div className='text-white mt-3 fs-4 fw-bold'>Welcome to Ecommerce Project</div>
                                <div className='text-white mt-1 mb-4'>
                                    Your ultimate destination for exquisite art and unique decor pieces. Our collection is meticulously curated to inspire and transform your living spaces with creativity and elegance. We believe that every home should reflect the personality and taste of its owner, and our wide range of products is designed to do just that.

                                    From stunning paintings and sculptures to innovative decor accessories, our offerings are a perfect blend of artistry and craftsmanship. Each piece in our collection is selected for its quality and uniqueness, ensuring that you find something truly special for your home.

                                    Whether you are looking to add a touch of sophistication to your living room, bring warmth to your bedroom, or make a bold statement in your office, Ecommerce Project has something for every style and space. We are dedicated to helping you create an environment that not only looks beautiful but also feels like home.

                                    Discover the joy of decorating with our diverse range of products and let your decor journey begin. Shop now and transform your space into a haven of beauty and inspiration.
                                </div>
                            </center>
                        </div>
                        <div className="col-md-1"></div>
                    </div>
                </div>
            </div>
            <div className="w-100 p-3">
                <FreeModeSwiper data={secondaryBanners?.data} />
            </div>
            {
                Array?.isArray(categoryWithProductList) && categoryWithProductList?.length > 0 ?
                Array?.isArray(categoryWithProductList) &&  categoryWithProductList?.map((val,key)=>(
                    <div className={`container-fluid mt-5 ${ key > 5 || val?.products?.length == 0 ? 'd-none' : '' }`}>
                        <div className="row">
                            <div className='mb-3 d-flex flex-wrap align-items-center justify-content-between gap-3'>
                                <h3 className='text-primary'><img src="/logoFinal2.png" style={{ height: '25px' }} alt="/logoFinal2.png" /> {val?.categoryName}</h3>
                                <Button type='button' variant="text" className='text-primary' size='small' onClick={()=>navigate(`/category-product/${val?._id}`)}>Show All <TrendingFlatIcon fontSize='small' /></Button>
                            </div>
                            {
                                Array?.isArray(val?.products) && val?.products?.map((product, childKey) =>(
                                    <div key={childKey} className={`col-lg-2 col-md-4 col-sm-4 mb-3 product-card`} onMouseEnter={() => setHoveredIndex(key +'_'+ childKey)} onMouseLeave={() => setHoveredIndex(null)}>
                                        <div role='button' className='shadow position-relative' style={{ height: '230px', overflow: 'hidden', borderRadius: '20px 20px 0 0' }}>
                                            {/* Foreground Content */}
                                            <div className='position-relative' style={{ zIndex: 2 }}>
                                                <div style={{ height: '230px' }} className='d-flex flex-column justify-content-between'>
                                                    <div className='d-flex align-items-center justify-content-between p-2'>
                                                        <div>
                                                            {val?.currentRating > 1 && (
                                                                <span className="badge text-bg-success px-3">
                                                                    {product?.currentRating} <small><i className="fa-solid fa-star text-warning"></i></small>
                                                                </span>
                                                            )}
                                                        </div>
                                                        <Tooltip title={wishListArray?.some(product => product?.productId == product?._id) ? 'Remove from Wishlist' : 'Add to Wishlist'}>
                                                            <IconButton onClick={() => handleWishlist(val)}>
                                                                {wishListArray?.some(product => product?.productId == product?._id) ?
                                                                    <FavoriteIcon role='button' className='text-red' />
                                                                    :
                                                                    <FavoriteBorderIcon role='button' className='text-primary' />
                                                                }
                                                            </IconButton>
                                                        </Tooltip>
                                                    </div>
                                                    <div className={`${hoveredIndex === key +'_'+ childKey ? 'visible' : 'invisible'} transition-opacity duration-300`} onClick={()=>navigate(`/product-detail/${product?._id}`)}>
                                                        <div style={{ backgroundColor: 'rgb(0 0 0 / 57%)' }} className='rounded-3 p-3 m-2 text-white'>
                                                            <center>
                                                                <div className='fs-5'>{product?.productName}</div>
                                                                <div className='mt-2'>₹{product?.price}</div>
                                                                <div><small className='text-nowrap mt-2'>{ product?.freeDelivery ? <><i className="fa-solid fa-truck-fast"></i> Free delivery</> : '' }</small></div>
                                                                <div className='mt-2'>Click to Buy Now</div>
                                                            </center>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Blurred Background Image */}
                                            <div
                                                className='blur-background'
                                                style={{
                                                    backgroundImage: `url(${product?.productImageUrl})`,
                                                    backgroundPosition: 'center',
                                                    backgroundSize: 'cover',
                                                    backgroundRepeat: 'no-repeat',
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    bottom: 0,
                                                    zIndex: 1,
                                                    // filter: 'blur(1px)'
                                                    filter: 'blur(0px)'
                                                }}
                                            ></div>
                                        </div>
                                        <ButtonBase sx={{ width: '100%' }} onClick={()=>{
                                            setTimeout(() => {
                                                navigate(`/product-detail/${product?._id}`)
                                            }, 500)
                                        }}>
                                            <div role='button' className='w-100 d-flex flex-column align-items-center py-3 px-1 bg-dark shadow-lg' style={{ borderRadius: '0 0 20px 20px' }}>
                                                <div className='w-100 text-center text-white'>₹{product?.price} <span className='text-white'>{product?.availableQuantity == 0 || product?.isDeleted == 1 ? '**Not Available**' : ''}</span></div>
                                                <div className='w-100 text-center fw-bold text-white' style={{ fontSize: '14px' }}>{product?.productName?.length > 15 ? `${product?.productName?.substring(0, 15)}...` : product?.productName}</div>
                                            </div>
                                        </ButtonBase>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                ))
                : ''
            }
            <div className="container-fluid mt-5">
                <div className="container">
                    <div className="row">
                        <div className='mb-3 d-flex flex-wrap align-items-center justify-content-between gap-3'>
                            <h3 className='text-primary'><img src="/logoFinal2.png" style={{ height: '25px' }} alt="/logoFinal2.png" /> Shop by Category</h3>
                            <Button type='button' variant="text" className='text-primary' size='small' onClick={()=>navigate('/all-categories')}>Show All <TrendingFlatIcon fontSize='small' /></Button>
                        </div>
                        <div className='text-center mb-4 fs-5 site-content'>"Explore our wide range of products in the Shop by Category section, designed to help you find exactly what you’re looking for with ease. Whether you're searching for the latest in home decor, stylish fashion accessories, or unique handcrafted items, we’ve organized everything into categories to make your shopping experience seamless."</div>
                        <CategorySwiper data={categoryList && categoryList?.length > 0 ? categoryList : []} />
                    </div>
                </div>


                {/* <ProductSwiper /> */}
                <div className="w-100 mt-5 bg-footer pt-2 pb-4">
                    <div className="container">
                        <div className='row mt-5'>
                            <h3 className='text-primary mb-4'><img src="/logoFinal2.png" style={{ height: '25px' }} alt="/logoFinal2.png" /> Best selling</h3>
                            <div className='text-center mb-4 fs-5 site-content'>"Discover our most popular products in the Best Selling section, where customer favorites come together in one place. From must-have accessories and stylish home decor to trending fashion pieces and innovative gadgets, these top-selling items are loved for their quality, style, and value."</div>
                            {
                                Array?.isArray(bestSellingProductList) && bestSellingProductList?.map((val, key) => (
                                    <div key={key} className={`col-lg-2 col-md-4 col-sm-4 mb-3 product-card`} onMouseEnter={() => setHoveredIndex(key)} onMouseLeave={() => setHoveredIndex(null)}>
                                        <div role='button' className='shadow position-relative bg-white' style={{ height: '230px', overflow: 'hidden', borderRadius: '20px 20px 0 0' }}>
                                            {/* Foreground Content */}
                                            <div className='position-relative' style={{ zIndex: 2 }}>
                                                <div style={{ height: '230px' }} className='d-flex flex-column justify-content-between'>
                                                    <div className='d-flex align-items-center justify-content-between p-2'>
                                                        <div>
                                                            {val?.currentRating > 1 && (
                                                                <span className="badge text-bg-success px-3">
                                                                    {val?.currentRating} <small><i className="fa-solid fa-star text-warning"></i></small>
                                                                </span>
                                                            )}
                                                        </div>
                                                        <Tooltip title={wishListArray?.some(product => product?.productId == val?._id) ? 'Remove from Wishlist' : 'Add to Wishlist'}>
                                                            <IconButton onClick={() => handleWishlist(val)}>
                                                                {wishListArray?.some(product => product?.productId == val?._id) ?
                                                                    <FavoriteIcon role='button' className='text-red' />
                                                                    :
                                                                    <FavoriteBorderIcon role='button' className='text-primary' />
                                                                }
                                                            </IconButton>
                                                        </Tooltip>
                                                    </div>
                                                    <div className={`${hoveredIndex === key ? 'visible' : 'invisible'} transition-opacity duration-300`} onClick={()=>navigate(`/product-detail/${val?._id}`)}>
                                                        <div style={{ backgroundColor: 'rgb(0 0 0 / 57%)' }} className='rounded-3 p-3 m-2 text-white'>
                                                            <center>
                                                                <div className='fs-5'>{val?.productName}</div>
                                                                <div className='mt-2'>₹{val?.price}</div>
                                                                <div><small className='text-nowrap mt-2'>{ val?.freeDelivery ? <><i className="fa-solid fa-truck-fast"></i> Free delivery</> : '' }</small></div>
                                                                <div className='mt-2'>Click to Buy Now</div>
                                                            </center>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Blurred Background Image */}
                                            <div
                                                className='blur-background'
                                                style={{
                                                    backgroundImage: `url(${val?.productImageUrl})`,
                                                    backgroundPosition: 'center',
                                                    backgroundSize: 'cover',
                                                    backgroundRepeat: 'no-repeat',
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    bottom: 0,
                                                    zIndex: 1,
                                                    // filter: 'blur(1px)'
                                                    filter: 'blur(0px)'
                                                }}
                                            ></div>
                                        </div>
                                        <ButtonBase sx={{ width: '100%' }} onClick={()=>{
                                            setTimeout(() => {
                                                navigate(`/product-detail/${val?._id}`)
                                            }, 500)
                                        }}>
                                            <div role='button' className='w-100 d-flex flex-column align-items-center py-3 px-1 bg-dark shadow-lg' style={{ borderRadius: '0 0 20px 20px' }}>
                                                <div className='w-100 text-center text-white'>₹{val?.price} <span className='text-white'>{val?.availableQuantity == 0 || val?.isDeleted == 1 ? '**Not Available**' : ''}</span></div>
                                                <div className='w-100 text-center fw-bold text-white' style={{ fontSize: '14px' }}>{val?.productName?.length > 15 ? `${val?.productName?.substring(0, 15)}...` : val?.productName}</div>
                                            </div>
                                        </ButtonBase>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="row mt-5">
                        <h3 className='text-primary text-center mb-3'><img src="/logoFinal2.png" style={{ height: '25px' }} alt="/logoFinal2.png" /> Services</h3>
                        <div className="col-md-4">
                            <Button type='button' className='w-100 py-3 px-2 mb-3 border-primary text-primary' variant="outlined" size='small'>
                                <center>
                                    <img src="/uniqueProducts.png" style={{ height: '100px' }} alt="/uniqueProducts.png"/>
                                    <div className='text-center fs-5'>Unique & Genuine Products</div>
                                </center>
                            </Button>
                        </div>
                        <div className="col-md-4">
                            <Button type='button' className='w-100 py-3 px-2 mb-3 border-primary text-primary' variant="outlined" size='small'>
                                <center>
                                    <img src="/homeDeliveryService.png" style={{ height: '100px' }} alt="/homeDeliveryService.png"/>
                                    <div className='text-center fs-5'>Quick Home Delivery</div>
                                </center>
                            </Button>
                        </div>
                        <div className="col-md-4">
                            <Button type='button' className='w-100 py-3 px-2 mb-3 border-primary text-primary' variant="outlined" size='small'>
                                <center>
                                    <img src="/openBoxDeliveryService.png" style={{ height: '100px' }} alt="/openBoxDeliveryService.png"/>
                                    <div className='text-center fs-5'>Open Box Delivery</div>
                                </center>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <BottomNavigation renderNavCart={renderNavCart} setRenderNavCart={setRenderNavCart} renderNavWishlist={renderNavWishlist} setRenderNavWishlist={setRenderNavWishlist} />
        </>
    )
}

export default Home