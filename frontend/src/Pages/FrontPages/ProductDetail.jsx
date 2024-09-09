/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import FullPageLoader from '../../Components/Loaders/FullPageLoader';
import Navbar from '../../Components/Layout/Navbar';
import BottomNavigation from '../../Components/Layout/BottomNavigation';
import { Avatar, Box, Button, ButtonGroup, IconButton, Modal, Rating, TextField, Tooltip, Typography } from '@mui/material';
import ProductSwiper from '../../Components/Swiper/ProductSwiper'
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PlainSwiper from '../../Components/Swiper/PlainSwiper';
import { Link, useNavigate, useParams } from 'react-router-dom';
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.min.css';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { getProduct, resetProductState } from '../../Features/Product/ProductSlice';
import { createCart, getCarts, resetCartState } from '../../Features/Cart/CartSlice';
import { createWishlist, getWishlists, resetWishlistState } from '../../Features/Wishlist/WishlistSlice';
import PersonIcon from '@mui/icons-material/Person';
import GradeIcon from '@mui/icons-material/Grade';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode"
import CloseIcon from '@mui/icons-material/Close';
import { createRating, getRating } from '../../Features/Rating/RatingSlice';



const imagePreviewStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    minWidth: '300px',
    maxWidth: '500px',
    // bgcolor: 'background.paper',
    bgcolor: 'transparent',
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 300,
    maxWidth: 600,
    width: '100%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
}


const ProductDetail = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const param = useParams()
    const productId = param?.id

    const fields = {
        productData: '',
        quantitySelected: 1,
    }

    const ratingFields = {
        rating: '',
        review: '',
        ratingProductOneImage: '',
        ratingProductTwoImage: '',
        ratingProductThreeImage: '',
        ratingProductFourImage: '',
        ratingProductFiveImage: '',
    }

    const [fullPageLoading, setFullPageLoading] = useState(true)
    const [data, setData] = useState()
    const [ratingData, setRatingData] = useState(ratingFields)
    const [ratingArray, setRatingArray] = useState([])
    const [wishListArray, setWishListArray] = useState([])
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [displayImage, setDisplayImage] = useState('')
    const [showImage, setShowImage] = useState(true)
    const [bottomSection, setBottomSection] = useState('reviews')
    const [cartData, setCartData] = useState(fields)
    const [renderNavCart, setRenderNavCart] = useState(false)
    const [renderNavWishlist, setRenderNavWishlist] = useState(false)
    const [showRatingModal, setShowRatingModal] = useState(false)
    const [isBuyNowClick, setIsBuyNowClick] = useState(false)
    const [imagePreviewModal, setImagePreviewModalModal] = useState(false)
    const [ratingImagePreviewModal, setRatingImagePreviewModalModal] = useState(false)
    const [ratingImageForPreview, setRatingImageForPreview] = useState('')

    const { products, responseStatus, responseMessage } = useSelector(state => state.products)
    const { carts, responseStatus: cartResponseStatus, responseMessage: cartResponseMessage } = useSelector(state => state.carts)
    const { wishlists, responseStatus: wishlistResponseStatus, responseMessage: wishlistResponseMessage } = useSelector(state => state.wishlists)
    const { ratings, responseStatus: ratingResponseStatus, responseMessage: ratingResponseMessage } = useSelector(state => state.ratings)

    const fetchRatings = (productId) => {
        dispatch(getRating(productId))
    }

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

    const handleRatingImages = (e) => {
        const files = Array.from(e.target.files);

        if (files.length > 5) {
            alert("You can select a maximum of 5 images.");
            return;
        }
    
        const updatedImages = {
            ratingProductOneImage: files[0] ? files[0] : '',
            ratingProductTwoImage: files[1] ? files[1] : '',
            ratingProductThreeImage: files[2] ? files[2] : '',
            ratingProductFourImage: files[3] ? files[3] : '',
            ratingProductFiveImage: files[4] ? files[4] : ''
        };
    
        setRatingData({
            ...ratingData,
            ...updatedImages
        });
    }

    const handleRatingSubmit = () => {
        if (isLoggedIn) {
            setFullPageLoading(true)
            
            const formdata = new FormData()
            formdata.append('productId', productId)
            formdata.append('rating', ratingData?.rating)
            formdata.append('review', ratingData?.review)
            formdata.append('ratingProductOneImage', ratingData?.ratingProductOneImage)
            formdata.append('ratingProductTwoImage', ratingData?.ratingProductTwoImage)
            formdata.append('ratingProductThreeImage', ratingData?.ratingProductThreeImage)
            formdata.append('ratingProductFourImage', ratingData?.ratingProductFourImage)
            formdata.append('ratingProductFiveImage', ratingData?.ratingProductFiveImage)

            dispatch(createRating(formdata))
        } else {
            navigate('/login')
        }
    }

    const handleAddToCart = () => {
        const token = Cookies.get("ecomProjectLoggedInUserToken");
        if (token) {
            const cart = {
                productId: data?._id,
                quantitySelected: cartData?.quantitySelected,
                productName: data?.productName,  
                productImageUrl: data?.productImageUrl,   
                price: data?.price,  
                discount: data?.discount,   
                freeDelivery: data?.freeDelivery,  
                openBoxDelivery: data?.openBoxDelivery, 
                returnAndRefund: data?.returnAndRefund, 
            }
    
            setFullPageLoading(true)
            dispatch(createCart(cart))
        } else {
            navigate('/login')
        }
    }

    const handleBuyNow = () => {
        const token = Cookies.get("ecomProjectLoggedInUserToken");
        if (token) {
            setIsBuyNowClick(true)

            const cart = {
                productId: data?._id,
                quantitySelected: cartData?.quantitySelected,
                productName: data?.productName,  
                productImageUrl: data?.productImageUrl,   
                price: data?.price,  
                discount: data?.discount,   
                freeDelivery: data?.freeDelivery,  
                openBoxDelivery: data?.openBoxDelivery, 
                returnAndRefund: data?.returnAndRefund, 
            }
    
            setFullPageLoading(true)
            dispatch(createCart(cart))
        } else {
            navigate('/login')
        }
    }

    const viewRatingImage = (imageUrl) => {
        setRatingImageForPreview(imageUrl)
        setRatingImagePreviewModalModal(true)
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
        window.scrollTo(0, 0)
    },[])

    useEffect(() => {
        dispatch(getProduct(productId));
    }, [dispatch]);

    useEffect(()=>{
        if(responseStatus == 'success' && responseMessage == 'Get Single'){
            setData(products?.data)
            setDisplayImage(products?.data?.productImageUrl)
            fetchRatings(products?.data?._id)
            setTimeout(() => {
                setFullPageLoading(false)
            }, 1000);
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
                navigate('/ecom-project/products')
            }, 1000);
        }
    },[products, responseStatus, responseMessage])

    useEffect(()=>{
        if(cartResponseStatus == 'success' && cartResponseMessage == 'Product Added in Cart successfully'){
            Swal.fire({
                icon: "success",
                title: "Congrats",
                text: cartResponseMessage
            });
            if (isBuyNowClick) {
                navigate('/cart')
            } else {
                dispatch(getCarts())
            }
        }
        if(cartResponseStatus == 'success' && cartResponseMessage == 'Get All'){
            setRenderNavCart(true)

            setTimeout(() => {
                setFullPageLoading(false)
            }, 1000);
        }
        if(cartResponseStatus == 'rejected' && cartResponseMessage != '' && cartResponseMessage != null){
            setFullPageLoading(false)
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: cartResponseMessage
            });
            setTimeout(() => {
                // dispatch(resetCartState())
            }, 1000);
        }
    },[carts, cartResponseStatus, cartResponseMessage])

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
        if(ratingResponseStatus == 'success' && ratingResponseMessage == 'Rating sent successfully'){
            setRatingData({
                ...ratingData,
                rating: '',
                review: ''
            })
            fetchRatings(data?._id)
            dispatch(getProduct(productId))
        }
        if(ratingResponseStatus == 'success' && ratingResponseMessage == 'Get Single'){
            setRatingArray(ratings?.data)
            setShowRatingModal(false)
            setTimeout(() => {
                // setFullPageLoading(false)
            }, 1000);
        }
        if(ratingResponseStatus == 'rejected' && ratingResponseMessage != '' && ratingResponseMessage != null){
            setFullPageLoading(false)
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: ratingResponseMessage
            });
            setTimeout(() => {
                // dispatch(resetCartState())
            }, 1000);
        }
    },[carts, ratingResponseStatus, ratingResponseMessage])

    return (
        <>
            { fullPageLoading && <FullPageLoader /> }
            <Navbar renderNavCart={renderNavCart} setRenderNavCart={setRenderNavCart} renderNavWishlist={renderNavWishlist} setRenderNavWishlist={setRenderNavWishlist} />
            <div className="container">
                <div className='row mt-3'>
                    <div className="col-md-7">
                        <div className='d-flex align-items-center justify-content-center w-100 rounded'>
                            {
                                showImage ?
                                    <img src={displayImage} className='box-shadow-custom' role='button' style={{ maxHeight: '700px', maxWidth: '100%' }} alt={displayImage} onClick={()=>setImagePreviewModalModal(true)} />
                                :
                                    <video
                                        className='w-100' 
                                        style={{ maxHeight: '700px' }} 
                                        autoPlay 
                                        loop 
                                        muted
                                        onEnded={(e) => e.target.play()}
                                        controls={false}
                                    >
                                        <source src={data?.productVideoUrl} type="video/mp4" />
                                    </video>
                            }
                        </div>
                        <div className='d-flex flex-wrap align-items-baseline justify-content-center gap-3 my-4'>
                            <img src={data?.productImageUrl} role='button' style={{ maxHeight: '50px', maxWidth: '50px' }} onClick={()=>{
                                setDisplayImage(data?.productImageUrl)
                                setShowImage(true)
                            }} className='shadow w-auto h-100' alt={data?.productImageUrl} />
                            {
                                data?.featuredImages?.map((val,key)=>(
                                    <img key={key} src={val?.featuredImagesUrl} role='button' style={{ maxHeight: '50px', maxWidth: '50px' }} onClick={()=>{
                                        setDisplayImage(val?.featuredImagesUrl)
                                        setShowImage(true)
                                    }} className='shadow w-auto h-100' alt={val?.featuredImagesUrl} />
                                ))
                            }
                            {
                                data?.productVideoUrl &&
                                <>
                                    <img role='button' src="/video_tn.jpg" style={{ maxHeight: '50px', maxWidth: '50px' }} alt="/video_tn.jpg" onClick={()=>{
                                        setShowImage(false)
                                    }} />
                                </>
                            }
                        </div>
                    </div>
                    <div className="col-md-5 px-4">
                        <div className='d-flex flex-wrap align-items-center justify-content-between gap-5'>
                            <div className='fs-4' style={{ fontFamily: 'Cardamon, serif' }}>{data?.productName}</div>
                            <Tooltip title="Wishlist">
                                <IconButton onClick={()=>handleWishlist(data)}>
                                    {
                                        wishListArray?.some(product => product?.productId == data?._id) ?
                                            <FavoriteIcon role='button' className='text-red' />
                                        :
                                            <FavoriteBorderIcon role='button' className='text-primary' />
                                    }
                                </IconButton>
                            </Tooltip>
                        </div>
                        <div className='text-secondary fw-bold' style={{ fontFamily: 'Cardamon, serif' }}><div dangerouslySetInnerHTML={{ __html: data?.shortDescription }} /></div>
                        <div className='fs-4 mt-4' style={{ fontFamily: 'Cardamon, serif' }}>₹{data?.price} <span className='text-secondary text-decoration-line-through fs-6'>₹{(data?.price * (1 + (data?.discount/100)))?.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</span></div>
                        <div className='text-red fw-bold mt-2' style={{ fontFamily: 'Cardamon, serif' }}><i className="fa-solid fa-burst fa-beat-fade text-warning"></i> {data?.discount}% OFF <i className="fa-solid fa-burst fa-beat-fade text-warning"></i></div>
                        <div className='mt-4'>
                            <div className='d-flex align-items-center gap-2'>
                                <small style={{ fontFamily: 'Cedarville Cursive' }}>Select Qty.</small><br />
                                <ButtonGroup variant="outlined" className='mt-1' aria-label="Basic button group">
                                    <Button sx={{ width: '60px' }} className='border-primary text-primary' onClick={()=>{
                                        setCartData({
                                            ...cartData,
                                            quantitySelected: cartData?.quantitySelected > 1 ? cartData?.quantitySelected - 1 : 1
                                        })
                                    }}><RemoveIcon /></Button>
                                    <Button sx={{ width: '60px' }} className='border-primary text-primary'>{cartData?.quantitySelected}</Button>
                                    <Button sx={{ width: '60px' }} className='border-primary text-primary' onClick={()=>{
                                        setCartData({
                                            ...cartData,
                                            quantitySelected: cartData?.quantitySelected != data?.availableQuantity ? cartData?.quantitySelected + 1 : cartData?.quantitySelected
                                        })
                                    }}><AddIcon /></Button>
                                </ButtonGroup>
                                <span style={{ fontFamily: 'Cardamon, serif' }}>&nbsp;Pcs.</span>
                            </div>
                        </div>
                        <div className='my-4 d-flex flex-wrap align-items-center gap-2'>
                            {
                                data?.availableQuantity == 0 || data?.isDeleted == 1 ?
                                <><center><h4 className='text-red' style={{ fontFamily: 'Cardamon, serif' }}>**Not Available**</h4></center></>
                                :
                                <>
                                    {
                                        carts?.data?.some(cart => cart?.productId == data?._id) ?
                                        <Button type='button' variant="outlined" className='w-100 rounded-5 border-primary text-primary' sx={{ fontFamily: 'Cardamon, serif' }} onClick={()=>{
                                            setTimeout(() => {
                                                navigate('/cart')
                                            }, 500);
                                        }}>Go To Cart</Button>
                                        :
                                        <Button type='button' variant="outlined" className='w-100 rounded-5 border-primary text-primary' sx={{ fontFamily: 'Cardamon, serif' }} onClick={handleAddToCart}><i className="fa-solid fa-plus"></i>&nbsp;&nbsp;Add To Cart</Button>
                                    }
                                    <Button type='button' variant="contained" className='w-100 rounded-5 bg-button-primary' sx={{ fontFamily: 'Cardamon, serif' }} onClick={handleBuyNow}><i className="fa-solid fa-cart-shopping"></i>&nbsp;&nbsp;Buy Now</Button>
                                </>
                            }
                        </div>
                        <div role='button' className='text-decoration-underline text-primary my-3' onClick={()=>handleWishlist(data)}>ADD TO WISHLIST</div>
                        <div className='my-3'>
                            {
                                data?.freeDelivery == 1 ?
                                    <>
                                        <div className='text-secondary fw-bold mt-3'><i className="fa-solid fa-truck-fast text-primary fs-4"></i> Free delivery</div>
                                    </>
                                : ''
                            }
                            {
                                data?.returnAndRefund == 1 ? 
                                <div className='text-success fw-bold mt-3'><i className="fa-solid fa-rotate-left fs-4"></i> 7 Day Return</div>
                                :
                                    <div className='text-red fw-bold mt-3'><i className="fa-solid fa-ban fs-4"></i> Return/Refund not available</div>
                            }
                            {
                                data?.openBoxDelivery == 1 ?
                                    <>
                                        <div className='text-secondary fw-bold mt-3'><i className="fa-solid fa-box-open text-primary fs-4"></i> Open box delivery</div>
                                    </>
                                : ''
                            }
                        </div>
                        <div className='bg-secondary-subtle p-4'>
                            <center>
                                <div><i className="fa-solid fa-truck-fast fs-2"></i></div>
                                <div className='fs-5'>Buy now to receive in 7-8 working days</div>
                            </center>
                        </div>
                        <div className='mt-4'>
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1-content"
                                    id="panel1-header"
                                >
                                    Description
                                </AccordionSummary>
                                <AccordionDetails>
                                    <small><div dangerouslySetInnerHTML={{ __html: data?.detailedDescription }} /></small>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel2-content"
                                    id="panel2-header"
                                >
                                    Delivery Policy
                                </AccordionSummary>
                                <AccordionDetails>
                                    <small><div dangerouslySetInnerHTML={{ __html: data?.deliveryPolicy }} /></small>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel3-content"
                                    id="panel3-header"
                                >
                                    Return Policy
                                </AccordionSummary>
                                <AccordionDetails>
                                    <small><div dangerouslySetInnerHTML={{ __html: data?.returnPolicy }} /></small>
                                </AccordionDetails>
                            </Accordion>
                        </div>
                    </div>
                    <div className="col-md-12 mt-4 text-uppercase">
                        <div className='d-flex flex-nowrap align-items-center justify-content-between' style={{ maxWidth: '700px' }}>
                            <div role='button' className={`product-detail-tabs fw-bold ${bottomSection == 'reviews' ? 'text-decoration-underline text-primary' : 'text-decoration-none text-dark'}`} onClick={()=>setBottomSection('reviews')}>Product Reviews</div>
                            <div role='button' className={`product-detail-tabs fw-bold ${bottomSection == 'description' ? 'text-decoration-underline text-primary' : 'text-decoration-none text-dark'}`} onClick={()=>setBottomSection('description')}>Description</div>
                            <div role='button' className={`product-detail-tabs fw-bold ${bottomSection == 'deliveryPOlicy' ? 'text-decoration-underline text-primary' : 'text-decoration-none text-dark'}`} onClick={()=>setBottomSection('deliveryPOlicy')}>Delivery Policy</div>
                            <div role='button' className={`product-detail-tabs fw-bold ${bottomSection == 'returnPolicy' ? 'text-decoration-underline text-primary' : 'text-decoration-none text-dark'}`} onClick={()=>setBottomSection('returnPolicy')}>Return Policy</div>
                        </div>
                        {
                            bottomSection == 'reviews' ?
                                <div className='container'>
                                    <div className="row">
                                        <div className="col-md-2"></div>
                                        <div className="col-md-8">
                                            <center>
                                                <div className='fs-4 my-3'>Customer Reviews</div>
                                                <div className='fs-3'>{data?.currentRating}/5</div>
                                                <div><Rating name="size-large" value={Number(data?.currentRating) || 0} size="large" precision={0.5} onClick={()=>setShowRatingModal(true)} readOnly /></div>
                                                <Button type='button' variant="contained" className='rounded-5 bg-button-primary px-5 mb-4' onClick={()=>setShowRatingModal(true)}>Write a Review</Button>
                                            </center>
                                            {
                                                Array?.isArray(ratingArray) && ratingArray?.length > 0 ?
                                                Array?.isArray(ratingArray) && ratingArray?.map((val,key)=>(
                                                    <div key={key} className={`py-3`} style={{ maxHeight: '350px', overflowY: 'auto', borderBottom: '1px solid lightgrey' }}>
                                                        <div className='d-flex align-items-top gap-4'>
                                                            <Avatar><PersonIcon /></Avatar>
                                                            <div>
                                                                <div>{val?.userName}</div>
                                                                <div><Rating name="read-only" value={val?.rating} size="small" readOnly /></div>
                                                                <small>{val?.review}</small>
                                                                {
                                                                    val?.ratingProductOneImageUrl ?
                                                                        <div className='mt-2 d-flex flex-wrap align-items-center gap-3'>
                                                                            <img role='button' src={val?.ratingProductOneImageUrl} style={{ height: '80px' }} alt={val?.ratingProductOneImageUrl} onClick={()=>viewRatingImage(val?.ratingProductOneImageUrl)} />
                                                                            <img role='button' src={val?.ratingProductTwoImageUrl} style={{ height: '80px' }} alt={val?.ratingProductTwoImageUrl} onClick={()=>viewRatingImage(val?.ratingProductTwoImageUrl)} />
                                                                            <img role='button' src={val?.ratingProductThreeImageUrl} style={{ height: '80px' }} alt={val?.ratingProductThreeImageUrl} onClick={()=>viewRatingImage(val?.ratingProductThreeImageUrl)} />
                                                                            <img role='button' src={val?.ratingProductFourImageUrl} style={{ height: '80px' }} alt={val?.ratingProductOnFourageUrl} onClick={()=>viewRatingImage(val?.ratingProductFourImageUrl)} />
                                                                            <img role='button' src={val?.ratingProductFiveImageUrl} style={{ height: '80px' }} alt={val?.ratingProductOneFivegeUrl} onClick={()=>viewRatingImage(val?.ratingProductFiveImageUrl)} />
                                                                        </div>
                                                                    : ''
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                                :
                                                <><center><h6>No Ratings</h6></center></>
                                            }
                                        </div>
                                        <div className="col-md-2"></div>
                                    </div>
                                </div>
                            : ''
                        }
                        {
                            bottomSection == 'description' ?
                                <div className='py-4'>
                                    <small><div dangerouslySetInnerHTML={{ __html: data?.detailedDescription }} /></small>
                                </div>
                            : ''
                        }
                        {
                            bottomSection == 'deliveryPOlicy' ?
                                <div className='py-4'>
                                    <small><div dangerouslySetInnerHTML={{ __html: data?.deliveryPolicy }} /></small>
                                </div>
                            : ''
                        }
                        {
                            bottomSection == 'returnPolicy' ?
                                <div className='py-4'>
                                    <small><div dangerouslySetInnerHTML={{ __html: data?.returnPolicy }} /></small>
                                </div>
                            : ''
                        }
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
            
            {/* Image Preview Modal */}
            <Modal
                open={imagePreviewModal}
                onClose={()=>setImagePreviewModalModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={imagePreviewStyle}>
                    <Typography id="modal-modal-description">
                        <CloseIcon sx={{ color: '#fff', my: 1, float: 'right', cursor: 'pointer' }} onClick={()=>setImagePreviewModalModal(false)} />
                        <img src={displayImage} className='w-100' alt={displayImage} />
                    </Typography>
                </Box>
            </Modal>
            
            {/* Rating Image Preview Modal */}
            <Modal
                open={ratingImagePreviewModal}
                onClose={()=>setRatingImagePreviewModalModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={imagePreviewStyle}>
                    <Typography id="modal-modal-description">
                        <CloseIcon sx={{ color: '#fff', my: 1, float: 'right', cursor: 'pointer' }} onClick={()=>setRatingImagePreviewModalModal(false)} />
                        <img src={ratingImageForPreview} className='w-100' alt={ratingImageForPreview} />
                    </Typography>
                </Box>
            </Modal>
            
            {/* Rating Modal */}
            <Modal
                open={showRatingModal}
                onClose={()=>setShowRatingModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Rate this Product
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <center>
                            <div>
                                <Rating 
                                    name="simple-controlled" 
                                    size="large"
                                    value={ratingData?.rating} 
                                    onChange={(event, newValue) => {
                                        setRatingData({
                                            ...ratingData,
                                            rating: newValue
                                        });
                                    }}
                                />
                            </div>
                            <div className='my-4'>
                                <small>Select maximum 5 Images.</small>
                                <input 
                                    type="file"
                                    onChange={handleRatingImages}
                                    className='form-control mb-3'
                                    multiple 
                                />
                            </div>
                            <div>
                                <TextField
                                    id="outlined-multiline-static"
                                    label="Your Review"
                                    multiline
                                    rows={4}
                                    value={ratingData?.review}
                                    onChange={e => setRatingData({
                                        ...ratingData,
                                        review: e.target.value
                                    })}
                                    fullWidth
                                />
                            </div>
                        </center>
                        <div className='d-flex align-items-center gap-3'>
                            <Button type='button' size='small' sx={{ mt: 3, px: 4 }} variant="contained" className='bg-button-primary' onClick={handleRatingSubmit}>Send</Button>
                            <Button type='button' size='small' sx={{ mt: 3, px: 4 }} variant="outlined" color='error' onClick={()=>{
                                setTimeout(() => {
                                    setShowRatingModal(false)
                                }, 400)
                            }}>Cancel</Button>
                        </div>
                    </Typography>
                </Box>
            </Modal>
        </>
    )
}

export default ProductDetail