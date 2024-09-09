/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import FullPageLoader from '../../Components/Loaders/FullPageLoader';
import Navbar from '../../Components/Layout/Navbar';
import BottomNavigation from '../../Components/Layout/BottomNavigation';
import { Button, ButtonGroup, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import ProductSwiper from '../../Components/Swiper/ProductSwiper'
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PlainSwiper from '../../Components/Swiper/PlainSwiper';
import { Link, useNavigate } from 'react-router-dom';
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.min.css';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useDispatch, useSelector } from 'react-redux';
import { getCarts, removeItem, resetCartState, updateCart } from '../../Features/Cart/CartSlice';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode"


const Cart = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [fullPageLoading, setFullPageLoading] = useState(true)
    const [cartData, setCartData] = useState([])
    const [renderNavCart, setRenderNavCart] = useState(false)
    const [renderNavWishlist, setRenderNavWishlist] = useState(false)

    const { carts, responseStatus: cartResponseStatus, responseMessage: cartResponseMessage } = useSelector(state => state.carts)

    const handleQuantityUpdate = (counterType, cartId, currentQuantity) => {
        if(currentQuantity < 2 && counterType == 'decrement'){
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: 'Minimum Quantity should 1'
            });
        } else {
            setFullPageLoading(true)
            dispatch(updateCart({ counterType, cartId }))
        }
    }

    const removeProductFromCart = (cartId) => {
        setFullPageLoading(true)
        dispatch(removeItem(cartId))
    }

    const calculateGrandTotal = () => {
        return cartData.reduce((total, val) => total + val.price * val.quantitySelected, 0);
    };

    const grandTotal = calculateGrandTotal();

    useEffect(()=>{
        const user = Cookies.get('ecomProjectLoggedInUser')
        const token = Cookies.get('ecomProjectLoggedInUserToken')
        
        if (!user || !token) {
            navigate('/login')
        }

        setTimeout(() => {
            setFullPageLoading(false)
        }, 1000);
        window.scrollTo(0, 0)
    },[])

    useEffect(() => {
        dispatch(getCarts());
    }, [dispatch]);

    useEffect(()=>{
        if(cartResponseStatus == 'success' && cartResponseMessage == 'Cart updated successfully'){
            dispatch(getCarts())
        }
        if(cartResponseStatus == 'success' && cartResponseMessage == 'Item removed successfully'){
            dispatch(getCarts())
        }
        if(cartResponseStatus == 'success' && cartResponseMessage == 'Get All'){
            setCartData(carts?.data)
            setRenderNavCart(true)

            setTimeout(() => {
                setFullPageLoading(false)
            }, 1000);
        }
        if(cartResponseStatus == 'rejected' && cartResponseMessage != '' && cartResponseMessage != null && cartResponseMessage != 'Product Already Added, Go to Cart'){
            setFullPageLoading(false)
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: cartResponseMessage
            });
            setTimeout(() => {
                dispatch(resetCartState())
            }, 1000);
        }
    },[carts, cartResponseStatus, cartResponseMessage])

    return (
        <>
            { fullPageLoading && <FullPageLoader /> }
            <Navbar renderNavCart={renderNavCart} setRenderNavCart={setRenderNavCart} renderNavWishlist={renderNavWishlist} setRenderNavWishlist={setRenderNavWishlist} />
            <div className="container mt-4">
                <center>
                    <div className='text-primary mt-3 fs-4 fw-bold'>Welcome to Ecommerce Project</div>
                    <div className='mt-1 site-content'>
                        Your ultimate destination for exquisite art and unique decor pieces. Our collection is meticulously curated to inspire and transform your living spaces with creativity and elegance. We believe that every home should reflect the personality and taste of its owner, and our wide range of products is designed to do just that.

                        From stunning paintings and sculptures to innovative decor accessories, our offerings are a perfect blend of artistry and craftsmanship. Each piece in our collection is selected for its quality and uniqueness, ensuring that you find something truly special for your home.

                        Whether you are looking to add a touch of sophistication to your living room, bring warmth to your bedroom, or make a bold statement in your office, Ecommerce Project has something for every style and space. We are dedicated to helping you create an environment that not only looks beautiful but also feels like home.

                        Discover the joy of decorating with our diverse range of products and let your decor journey begin. Shop now and transform your space into a haven of beauty and inspiration.
                    </div>
                </center>
                <div className='row'>
                    <h5 className='mt-4'>My Cart</h5>
                    <div className="col-md-12">
                        <div className='bg-white custom-box-shadow mt-3'>
                            <TableContainer>
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className='fw-bold'>#</TableCell>
                                            <TableCell className='fw-bold' align="">Product Name</TableCell>
                                            <TableCell className='fw-bold' align="right">Price</TableCell>
                                            <TableCell className='fw-bold' align="right">Discount</TableCell>
                                            <TableCell className='fw-bold' align="right">Qty</TableCell>
                                            <TableCell className='fw-bold' align="right">Total</TableCell>
                                            <TableCell className='fw-bold' align="end">Remove</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            Array?.isArray(cartData) && cartData?.length > 0 ?
                                                Array?.isArray(cartData) && cartData?.map((val,key) => (
                                                    <TableRow key={key}>
                                                        <TableCell component="th" scope="row">
                                                            <img role='button' src={val?.productImageUrl} style={{ height: '40px' }} alt={val?.productImageUrl} onClick={()=>navigate(`/product-detail/${val?.productId}`)} />
                                                        </TableCell>
                                                        <TableCell align="">{val?.productName}</TableCell>
                                                        <TableCell align="right">₹{val?.price}</TableCell>
                                                        <TableCell align="right">{val?.discount}%</TableCell>
                                                        <TableCell align="right">
                                                            <ButtonGroup variant="outlined" className='mt-1' aria-label="Basic button group">
                                                                <Button sx={{ width: '60px' }} className='border-primary text-primary' onClick={()=>handleQuantityUpdate('decrement', val?._id, val?.quantitySelected)}><RemoveIcon /></Button>
                                                                <Button sx={{ width: '60px' }} className='border-primary text-primary'>{val?.quantitySelected}</Button>
                                                                <Button sx={{ width: '60px' }} className='border-primary text-primary' onClick={()=>handleQuantityUpdate('increment', val?._id, val?.quantitySelected)}><AddIcon /></Button>
                                                            </ButtonGroup>
                                                        </TableCell>
                                                        <TableCell align="right">₹{val?.quantitySelected * val?.price}</TableCell>
                                                        <TableCell align="end">
                                                            <Tooltip title="Remove" onClick={()=>removeProductFromCart(val?._id)}>
                                                                <IconButton>
                                                                    <HighlightOffIcon role='button' className='text-red' />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            : 
                                            <TableRow>
                                                <TableCell align="center" colSpan={6}>No Product Added</TableCell>
                                            </TableRow>
                                        }
                                        {
                                            Array?.isArray(cartData) && cartData?.length > 0 ?
                                                <TableRow>
                                                    <TableCell sx={{ textAlign: 'right', fontWeight: 'bold' }} colSpan={5}>Grand Total</TableCell>
                                                    <TableCell align="end">₹{grandTotal}</TableCell>
                                                </TableRow>
                                            : ''
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                        {
                            Array?.isArray(cartData) && cartData?.length > 0 ?
                                <Button variant="contained" size='small' className='w-100 rounded-5 mt-3 mb-2 bg-button-primary' onClick={()=>navigate('/checkout')}><i className="fa-solid fa-cart-shopping"></i>&nbsp;&nbsp;Proceed to Checkout</Button>
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
        </>
    )
}

export default Cart