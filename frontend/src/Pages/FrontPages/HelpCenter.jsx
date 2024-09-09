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
import { Button, ButtonBase, IconButton, TextField } from '@mui/material';
import FullPageLoader from '../../Components/Loaders/FullPageLoader';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { createWishlist, getWishlists, resetWishlistState } from '../../Features/Wishlist/WishlistSlice';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode"

const HelpCenter = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [fullPageLoading, setFullPageLoading] = useState(true)
    const [wishListArray, setWishListArray] = useState([])
    const [renderNavCart, setRenderNavCart] = useState(false)
    const [renderNavWishlist, setRenderNavWishlist] = useState(false)

    const { wishlists, responseStatus: wishlistResponseStatus, responseMessage: wishlistResponseMessage } = useSelector(state => state.wishlists)
    
    useEffect(()=>{
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
                <div className='row mt-4'>
                    <h3 className='text-primary text-center mb-3'><img src="/logoFinal2.png" style={{ height: '25px' }} alt="/logoFinal2.png" /> Help Center</h3>
                    <div className="col-md-12">
                        <small><i className="fa-regular fa-circle-question"></i> Welcome to the Ecommerce Project Help Center. Please feel free to send us your Query. We will soon resolve it.</small>
                        <ButtonBase className='w-100 text-start border-bottom border-secondary-subtle p-2 mt-3'>
                            <div className='w-100'>Send us mail @ ecom@gmail.com</div>
                        </ButtonBase>
                        <div className='w-100 text-start border-bottom border-secondary-subtle p-2'>
                            <div className='w-100'>
                                <div className='mb-3'>Send us via Ecommerce Project Message Box!</div>
                                <div className="row">
                                    <div className="col-md-5">
                                        <form>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <TextField 
                                                        id="name" 
                                                        label="Enter Your Name" 
                                                        variant="outlined"
                                                        size='small'
                                                        className='w-100 mb-3'
                                                        name="name"
                                                        // value={checkoutData?.name}
                                                        // onChange={handleInput} 
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <TextField 
                                                        id="email" 
                                                        label="Enter Your Email" 
                                                        variant="outlined"
                                                        size='small'
                                                        className='w-100 mb-3'
                                                        name="name"
                                                        // value={checkoutData?.name}
                                                        // onChange={handleInput} 
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <TextField 
                                                id="phone" 
                                                label="Enter Your Phone" 
                                                variant="outlined"
                                                size='small'
                                                className='w-100 mb-3'
                                                name="name"
                                                // value={checkoutData?.name}
                                                // onChange={handleInput} 
                                                required
                                            />
                                            <TextField
                                                id="outlined-textarea"
                                                label="Enter Your Message"
                                                className='w-100 mb-3'
                                                name="fullAddress"
                                                // value={checkoutData?.fullAddress}
                                                // onChange={handleInput} 
                                                rows={4}
                                                multiline
                                                required
                                            />
                                            <Button type='button' className='w-100 mb-2 bg-button-primary' variant="contained" size='small'>Send</Button>
                                        </form>
                                    </div>
                                    <div className="col-md-7"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <BottomNavigation renderNavCart={renderNavCart} setRenderNavCart={setRenderNavCart} renderNavWishlist={renderNavWishlist} setRenderNavWishlist={setRenderNavWishlist} />
        </>
    )
}

export default HelpCenter