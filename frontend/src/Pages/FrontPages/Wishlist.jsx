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
import { Button, ButtonBase, IconButton, Tooltip } from '@mui/material';
import FullPageLoader from '../../Components/Loaders/FullPageLoader';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { createWishlist, getWishlists, resetWishlistState } from '../../Features/Wishlist/WishlistSlice';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode"

const Wishlist = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [fullPageLoading, setFullPageLoading] = useState(true)
    const [wishListArray, setWishListArray] = useState([])
    const [renderNavCart, setRenderNavCart] = useState(false)
    const [renderNavWishlist, setRenderNavWishlist] = useState(false)
    const [hoveredIndex, setHoveredIndex] = useState(null)

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
    
    useEffect(()=>{
        const user = Cookies.get('ecomProjectLoggedInUser')
        const token = Cookies.get('ecomProjectLoggedInUserToken')
        
        if (!user || !token) {
            navigate('/login')
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
            <div className="container">
                <div className='row mt-4'>
                    <h3 className='text-primary text-center mb-3'><img src="/logoFinal2.png" style={{ height: '25px' }} alt="/logoFinal2.png" /> Wishlist</h3>
                    {
                        Array?.isArray(wishListArray) && wishListArray?.map((val, key) => (
                            <div key={key} className={`col-lg-2 col-md-4 col-sm-4 mb-3 product-card`} onMouseEnter={() => setHoveredIndex(key)} onMouseLeave={() => setHoveredIndex(null)}>
                                <div role='button' className='shadow position-relative' style={{ height: '230px', overflow: 'hidden' }}>
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
                                                <Tooltip title={wishListArray?.some(product => product?.productId == val?.productId) ? 'Remove from Wishlist' : 'Add to Wishlist'}>
                                                    <IconButton onClick={() => handleWishlist(val)}>
                                                        {wishListArray?.some(product => product?.productId == val?.productId) ?
                                                            <FavoriteIcon role='button' className='text-red' />
                                                            :
                                                            <FavoriteBorderIcon role='button' className='text-primary' />
                                                        }
                                                    </IconButton>
                                                </Tooltip>
                                            </div>
                                            <div className={`${hoveredIndex === key ? 'visible' : 'invisible'} transition-opacity duration-300`} onClick={()=>navigate(`/product-detail/${val?.productId}`)}>
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
                                        navigate(`/product-detail/${val?.productId}`)
                                    }, 500)
                                }}>
                                    <div role='button' className='w-100 d-flex flex-column align-items-center py-3 px-1 bg-dark shadow-lg' style={{ borderRadius: '0 0 20px 20px' }}>
                                        <div className='w-100 text-center text-white'>₹{val?.price}</div>
                                        <div className='w-100 text-center fw-bold text-white' style={{ fontSize: '14px' }}>{val?.productName?.length > 15 ? `${val?.productName?.substring(0, 15)}...` : val?.productName}</div>
                                    </div>
                                </ButtonBase>
                            </div>
                        ))
                    }
                </div>
            </div>
            <BottomNavigation renderNavCart={renderNavCart} setRenderNavCart={setRenderNavCart} renderNavWishlist={renderNavWishlist} setRenderNavWishlist={setRenderNavWishlist} />
        </>
    )
}

export default Wishlist