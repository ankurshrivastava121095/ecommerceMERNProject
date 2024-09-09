/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import Navbar from '../../Components/Layout/Navbar'
import FreeModeSwiper from '../../Components/Swiper/FreeModeSwiper'
import ProductSwiper from '../../Components/Swiper/ProductSwiper'
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Link, useNavigate } from 'react-router-dom';
import BottomNavigation from '../../Components/Layout/BottomNavigation';
import PlainSwiper from '../../Components/Swiper/PlainSwiper';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { Button, ButtonBase, IconButton } from '@mui/material';
import FullPageLoader from '../../Components/Loaders/FullPageLoader';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode"
import Swal from 'sweetalert2';
import { createWishlist, getWishlists, resetWishlistState } from '../../Features/Wishlist/WishlistSlice';
import { resetAuthState } from '../../Features/Auth/AuthSlice';

const MyProfile = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [fullPageLoading, setFullPageLoading] = useState(true)
    const [wishListArray, setWishListArray] = useState([])
    const [renderNavCart, setRenderNavCart] = useState(false)
    const [renderNavWishlist, setRenderNavWishlist] = useState(false)
    const [loggedInUserData, setLoggedInUserData] = useState('')

    const { wishlists, responseStatus: wishlistResponseStatus, responseMessage: wishlistResponseMessage } = useSelector(state => state.wishlists)

    const handleWishlist = (val) => {
        const data = {
            productId: val?.productId,
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
    }

    const handleLogout = () => {
        Cookies.remove('ecomProjectLoggedInUserToken')
        Cookies.remove('ecomProjectLoggedInUser')
        // window.location.reload()
        dispatch(resetAuthState())
        navigate('/login')
    }
    
    useEffect(()=>{
        const user = Cookies.get('ecomProjectLoggedInUser')
        const token = Cookies.get('ecomProjectLoggedInUserToken')
        
        if (!user || !token) {
            navigate('/login')
        } else {
            const decodedData = jwtDecode(JSON.stringify(token));
            setLoggedInUserData(decodedData)
        }
        setTimeout(() => {
            setFullPageLoading(false)
        }, 1000);
    },[])

    useEffect(() => {
        dispatch(getWishlists());
    }, [dispatch]);

    useEffect(()=>{
        if(wishlistResponseStatus == 'success' && wishlistResponseMessage == 'Item Added Successfully'){
            dispatch(getWishlists());
            setTimeout(() => {
                setFullPageLoading(false)
            }, 1000);
        }
        if(wishlistResponseStatus == 'success' && wishlistResponseMessage == 'Get All'){
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

    return (
        <>
            { fullPageLoading && <FullPageLoader /> }
            <Navbar renderNavCart={renderNavCart} setRenderNavCart={setRenderNavCart} renderNavWishlist={renderNavWishlist} setRenderNavWishlist={setRenderNavWishlist} />
            <div className="container mt-5">
                <center>
                    <div className='text-primary mt-3 fs-4 fw-bold'>Welcome to Ecommerce Project</div>
                    <div className='mt-1 site-content'>
                        Your ultimate destination for exquisite art and unique decor pieces. Our collection is meticulously curated to inspire and transform your living spaces with creativity and elegance. We believe that every home should reflect the personality and taste of its owner, and our wide range of products is designed to do just that.

                        From stunning paintings and sculptures to innovative decor accessories, our offerings are a perfect blend of artistry and craftsmanship. Each piece in our collection is selected for its quality and uniqueness, ensuring that you find something truly special for your home.

                        Whether you are looking to add a touch of sophistication to your living room, bring warmth to your bedroom, or make a bold statement in your office, Ecommerce Project has something for every style and space. We are dedicated to helping you create an environment that not only looks beautiful but also feels like home.

                        Discover the joy of decorating with our diverse range of products and let your decor journey begin. Shop now and transform your space into a haven of beauty and inspiration.
                    </div>
                </center>
                {
                    loggedInUserData?.role != 'Admin' ?
                        <div className='row mt-4'>
                            <h3 className='text-primary text-center mb-3'><img src="/logoFinal2.png" style={{ height: '25px' }} alt="/logoFinal2.png" /> My Profile</h3>
                            <div className="col-md-12">
                                <div className="w-100 my-profile-button-section">
                                    <div className='my-profile-buttons'>
                                        <Button type='button' variant="outlined" className='w-100 px-2 mb-1 rounded-5 border-primary text-primary' size='large' onClick={()=>navigate('/my-orders')}>My Orders</Button>
                                    </div>
                                    <div className='my-profile-buttons'>
                                        <Button type='button' variant="outlined" className='w-100 px-2 mb-1 rounded-5 border-primary text-primary' size='large' onClick={()=>navigate('/wishlist')}>My Wishlist</Button>
                                    </div>
                                    <div className='my-profile-buttons'>
                                        <Button type='button' variant="outlined" className='w-100 px-2 mb-1 rounded-5 border-primary text-primary' size='large' onClick={()=>navigate('/cart')}>My Cart</Button>
                                    </div>
                                    <div className='my-profile-buttons'>
                                        <Button type='button' variant="outlined" className='w-100 px-2 mb-1 rounded-5 border-primary text-primary' size='large' onClick={handleLogout}>Sign out&nbsp;<i className="fa-solid fa-power-off"></i></Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    : ''
                }
                <div className="row mt-3">
                    <div className="col-md-12">
                        {
                            loggedInUserData?.role == 'Admin' ? 
                                <ButtonBase className='w-100 text-start border-bottom border-secondary-subtle p-2' onClick={()=>navigate('/ecom-project/dashboard')}>
                                    <div className='w-100'>Admin Dashboard</div>
                                </ButtonBase>
                            : ''
                        }
                        <ButtonBase className='w-100 text-start border-bottom border-secondary-subtle p-2' onClick={()=>navigate('/edit-profile')}>
                            <div className='w-100'>Edit Profile</div>
                        </ButtonBase>
                        <ButtonBase className='w-100 text-start border-bottom border-secondary-subtle p-2' onClick={()=>navigate('/help-center')}>
                            <div className='w-100'>Help Center</div>
                        </ButtonBase>
                        <ButtonBase className='w-100 text-start p-2' onClick={handleLogout}>
                            <div className='w-100'>Sign out</div>
                        </ButtonBase>
                    </div>
                </div>
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
            <BottomNavigation renderNavCart={renderNavCart} setRenderNavCart={setRenderNavCart} renderNavWishlist={renderNavWishlist} setRenderNavWishlist={setRenderNavWishlist} />
        </>
    )
}

export default MyProfile