/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import FullPageLoader from '../../Components/Loaders/FullPageLoader';
import Navbar from '../../Components/Layout/Navbar';
import BottomNavigation from '../../Components/Layout/BottomNavigation';
import { Button, ButtonGroup, FormControl, FormControlLabel, IconButton, Paper, RadioGroup, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip } from '@mui/material';
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
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode"
import { useDispatch, useSelector } from 'react-redux';
import { resetCartState } from '../../Features/Cart/CartSlice';
import Swal from 'sweetalert2';
import axios from 'axios';
import { createOrder, resetOrderState } from '../../Features/Order/OrderSlice';


const Checkout = () => {

    function loadScript(src) {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    }

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const fields = {
        orderId: '',
        paymentId: '',
        name: '',
        email: '',
        contactNumber: '',
        alternateNumber: '',
        pincode: '',
        city: '',
        state: '',
        country: '',
        fullAddress: '',
        products: [],
        paymentMode: ''
    }

    const [fullPageLoading, setFullPageLoading] = useState(true)
    const [renderNavCart, setRenderNavCart] = useState(false)
    const [renderNavWishlist, setRenderNavWishlist] = useState(false)
    const [checkoutData, setCheckoutData] = useState(fields)
    const [cartData, setCartData] = useState([])

    const { carts, responseStatus: cartResponseStatus, responseMessage: cartResponseMessage } = useSelector(state => state.carts)
    const { orders, responseStatus: ordersResponseStatus, responseMessage: ordersResponseMessage } = useSelector(state => state.orders)

    const handleInput = (e) => {
        setCheckoutData({
            ...checkoutData,
            [e.target.name]: e.target.value
        })
    }

    const calculateGrandTotal = () => {
        return cartData.reduce((total, val) => total + val.price * val.quantitySelected, 0);
    };

    const grandTotal = calculateGrandTotal();

    const handleButtonClick = () => {
        // setIsTruckMoving(true);
        // console.log('working');

        if (checkoutData?.name == '' || checkoutData?.email == '' || checkoutData?.contactNumber == '' || checkoutData?.pincode == '' || checkoutData?.city == '' || checkoutData?.state == '' || checkoutData?.country == '' || checkoutData?.fullAddress == '') {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: 'Please fill required details'
            });
        } else {
            if (cartData?.length > 0) {
                if (checkoutData?.paymentMode == '') {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: 'Please select any payment method'
                    });
                } else {
                    const orderData = {
                        orderId: checkoutData?.orderId,
                        paymentId: checkoutData?.paymentId,
                        billingAddressName: checkoutData?.name,
                        billingAddressEmail: checkoutData?.email,
                        billingAddressContactNumber: checkoutData?.contactNumber,
                        billingAddressAlternateNumber: checkoutData?.alternateNumber,
                        billingAddressPincode: checkoutData?.pincode,
                        billingAddressCity: checkoutData?.city,
                        billingAddressState: checkoutData?.state,
                        billingAddressCountry: checkoutData?.country,
                        billingAddressFullAddress: checkoutData?.fullAddress,
                        products: cartData,
                        paymentMode: checkoutData?.paymentMode,
                        grandTotal: grandTotal
                    }
                    if (checkoutData?.paymentMode == 'Online') {
                        displayRazorpay()
                    } else {
                        setFullPageLoading(true)
                        dispatch(createOrder(orderData))
                    }
                }
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: 'Please select atleast one product'
                });
            }     
        }
    };

    async function displayRazorpay() {
        setFullPageLoading(true)

        const res = await loadScript(
          'https://checkout.razorpay.com/v1/checkout.js'
        );
    
        if (!res) {
          alert('Razorpay SDK failed to load. Are you online?');
          return;
        }
    
        const result = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/payment/initiate`,{ amount: grandTotal});
    
        if (!result) {
          alert('Server error. Are you online?');
          return;
        }

        setFullPageLoading(false)
    
        const { amount, id: order_id, currency } = result.data;
    
        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY_ID,
          amount: amount.toString(),
          currency: currency,
          name: 'SASVAT',
          description: 'Test Transaction',
          image:  '/logoFinal.png',
          order_id: order_id,
          handler: async function (response) {
            const data = {
              orderCreationId: order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            };
    
            const result = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/payment/callback`, data);
            // const orderData 
            const orderData = {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                name: checkoutData?.name,
                email: checkoutData?.email,
                contactNumber: checkoutData?.contactNumber,
                alternateNumber: checkoutData?.alternateNumber,
                pincode: checkoutData?.pincode,
                city: checkoutData?.city,
                state: checkoutData?.state,
                country: checkoutData?.country,
                billingAddressName: checkoutData?.name,
                billingAddressEmail: checkoutData?.email,
                billingAddressContactNumber: checkoutData?.contactNumber,
                billingAddressAlternateNumber: checkoutData?.alternateNumber,
                billingAddressPincode: checkoutData?.pincode,
                billingAddressCity: checkoutData?.city,
                billingAddressState: checkoutData?.state,
                billingAddressCountry: checkoutData?.country,
                billingAddressFullAddress: checkoutData?.fullAddress,
                products: cartData,
                paymentMode: checkoutData?.paymentMode,
                grandTotal: grandTotal
            }
            dispatch(createOrder(orderData))
    
            alert(result.data.msg);
        },
          prefill: {
            name: checkoutData?.name,
            email: checkoutData?.email,
            contact: checkoutData?.contactNumber,
          },
          notes: {
            address: 'CITY CENTER GWALIOR',
          },
          theme: {
            color: '#61dafb',
          },
        };
    
        const paymentObject = new window.Razorpay(options);
        // paymentObject.on("payment.failed", function (response) {
        //     alert(response.error.code);
        //     alert(response.error.description);
        //     alert(response.error.source);
        //     alert(response.error.step);
        //     alert(response.error.reason);
        //     alert(response.error.metadata.order_id);
        //     alert(response.error.metadata.payment_id);
        //   })
        paymentObject.open();
    }

    useEffect(()=>{
        const user = Cookies.get('ecomProjectLoggedInUser')
        const token = Cookies.get('ecomProjectLoggedInUserToken')
        
        if (user && token) {
            const userObj = JSON.parse(user)
            setCheckoutData({
                ...checkoutData,
                name: userObj?.name,
                email: userObj?.email,
                contactNumber: userObj?.contactNumber,
                alternateNumber: userObj?.alternateNumber,
                pincode: userObj?.pincode,
                city: userObj?.city,
                state: userObj?.state,
                country: userObj?.country
            })
        } else {
            navigate('/login')
        }

        setTimeout(() => {
            setFullPageLoading(false)
        }, 1000);
        window.scrollTo(0, 0)
    },[])

    useEffect(()=>{
        if(cartResponseStatus == 'success' && cartResponseMessage == 'Get All'){
            // setCheckoutData({
            //     ...checkoutData,
            //     products: carts?.data
            // })
            if (carts?.data?.length > 0) {
                setCartData(carts?.data)
                
                setTimeout(() => {
                    setFullPageLoading(false)
                }, 1000);
            } else {
                navigate(-1)
            }
            setRenderNavCart(true)
        }
        if(cartResponseStatus == 'rejected' && cartResponseMessage != '' && cartResponseMessage != null){
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

    useEffect(()=>{
        if(ordersResponseStatus == 'success' && ordersResponseMessage == 'Order Placed Successfully'){
            setFullPageLoading(false)
            Swal.fire({
                icon: "success",
                title: "Congrats",
                text: ordersResponseMessage
            });
            setTimeout(() => {
                dispatch(resetOrderState())
                navigate('/my-orders')
            }, 1000);
        }
        if(ordersResponseStatus == 'rejected' && ordersResponseMessage != '' && ordersResponseMessage != null){
            setFullPageLoading(false)
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: ordersResponseMessage
            });
            setTimeout(() => {
                dispatch(resetOrderState())
            }, 1000);
        }
    },[orders, ordersResponseStatus, ordersResponseMessage])

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
                <div className='row'>
                    <h5 className='mt-4'>Checkout</h5>
                    <div className="col-md-7">
                        <div className='bg-white custom-box-shadow mt-3 p-3'>
                            <div className="row">
                                <div className="col-md-4">
                                    <label htmlFor="name" className='mb-2'>Name<span className='text-red'>*</span> :</label>
                                </div>
                                <div className="col-md-8">
                                    <TextField 
                                        id="name" 
                                        label="Enter Name" 
                                        variant="outlined"
                                        size='small'
                                        className='w-100 mb-3'
                                        name="name"
                                        value={checkoutData?.name}
                                        onChange={handleInput}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="email" className='mb-2'>Email<span className='text-red'>*</span> :</label>
                                </div>
                                <div className="col-md-8">
                                    <TextField 
                                        id="email" 
                                        label="Enter Email" 
                                        variant="outlined"
                                        size='small'
                                        className='w-100 mb-3'
                                        name="email"
                                        value={checkoutData?.email}
                                        onChange={handleInput}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="contactNumber" className='mb-2'>Contact Number<span className='text-red'>*</span> :</label>
                                </div>
                                <div className="col-md-8 mb-3">
                                    <TextField 
                                        id="contactNumber" 
                                        label="Enter Contact Number" 
                                        variant="outlined"
                                        size='small'
                                        className='w-100'
                                        name="contactNumber"
                                        value={checkoutData?.contactNumber}
                                        onChange={handleInput}
                                    />
                                    <div className='fw-bold text-red' style={{ fontSize: '12px' }}><small><i className="fa-solid fa-circle-exclamation"></i> Contact number must be of 10 digit and must be registered on WhatsApp to receive updates.</small></div>
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="alternateNumber" className='mb-2'>Alternate Number :</label>
                                </div>
                                <div className="col-md-8">
                                    <TextField 
                                        id="alternateNumber" 
                                        label="Enter Alternate Number" 
                                        variant="outlined"
                                        size='small'
                                        className='w-100 mb-3'
                                        name="alternateNumber"
                                        value={checkoutData?.alternateNumber}
                                        onChange={handleInput} 
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="pincode" className='mb-2'>Pincode<span className='text-red'>*</span> :</label>
                                </div>
                                <div className="col-md-8">
                                    <TextField 
                                        id="pincode" 
                                        label="Enter Pincode" 
                                        variant="outlined"
                                        size='small'
                                        className='w-100 mb-3'
                                        name="pincode"
                                        value={checkoutData?.pincode}
                                        onChange={handleInput}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="city" className='mb-2'>City<span className='text-red'>*</span> :</label>
                                </div>
                                <div className="col-md-8">
                                    <TextField 
                                        id="city" 
                                        label="Enter City" 
                                        variant="outlined"
                                        size='small'
                                        className='w-100 mb-3'
                                        name="city"
                                        value={checkoutData?.city}
                                        onChange={handleInput}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="state" className='mb-2'>State<span className='text-red'>*</span> :</label>
                                </div>
                                <div className="col-md-8">
                                    <TextField 
                                        id="state" 
                                        label="Enter State" 
                                        variant="outlined"
                                        size='small'
                                        className='w-100 mb-3'
                                        name="state"
                                        value={checkoutData?.state}
                                        onChange={handleInput}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="country" className='mb-2'>Country<span className='text-red'>*</span> :</label>
                                </div>
                                <div className="col-md-8">
                                    <TextField 
                                        id="country" 
                                        label="Enter Country" 
                                        variant="outlined"
                                        size='small'
                                        className='w-100 mb-3'
                                        name="country"
                                        value={checkoutData?.country}
                                        onChange={handleInput}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="fullAddress" className='mb-2'>Full Address<span className='text-red'>*</span> :</label>
                                </div>
                                <div className="col-md-8">
                                    <TextField
                                        id="outlined-textarea"
                                        label="Enter Full Address"
                                        className='w-100'
                                        name="fullAddress"
                                        value={checkoutData?.fullAddress}
                                        onChange={handleInput} 
                                        rows={4}
                                        multiline
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-5">
                        <div className='bg-white custom-box-shadow mt-3'>
                            <TableContainer>
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className='fw-bold'>Summary</TableCell>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className='fw-bold'>Product</TableCell>
                                            <TableCell>Price</TableCell>
                                            <TableCell>Qty</TableCell>
                                            <TableCell>Total</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            Array?.isArray(cartData) && cartData?.map((val,key)=>(
                                                <TableRow key={key}>
                                                    <TableCell>{val?.productName}</TableCell>
                                                    <TableCell>₹{val?.price}</TableCell>
                                                    <TableCell>{val?.quantitySelected}</TableCell>
                                                    <TableCell>₹{val?.quantitySelected * val?.price}</TableCell>
                                                </TableRow>
                                            ))
                                        }
                                    </TableBody>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className='fw-bold'>Grand Total</TableCell>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                            <TableCell>₹{grandTotal}</TableCell>
                                        </TableRow>
                                    </TableHead>
                                </Table>
                            </TableContainer>
                        </div>
                        <div className='bg-white custom-box-shadow mt-3'>
                            <TableContainer>
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className='fw-bold'>Select Payment mode</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>
                                                <div className="form-check">
                                                    <input role='button' className="form-check-input" type="radio" name="paymentMode" value="Online" id="flexRadioDefault1" onClick={(e)=>setCheckoutData({
                                                        ...checkoutData,
                                                        paymentMode: e.target.value
                                                    })} />
                                                    <label role='button' className="form-check-label" htmlFor="flexRadioDefault1">
                                                        <img src="/payOnline3.png" style={{ height: '35px' }} alt="/payOnline3.png" />
                                                    </label>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                <div className="form-check">
                                                    <input role='button' className="form-check-input" type="radio" name="paymentMode" value="Cash on Delivery" id="flexRadioDefault2" onClick={(e)=>setCheckoutData({
                                                        ...checkoutData,
                                                        paymentMode: e.target.value
                                                    })} />
                                                    <label role='button' className="form-check-label" htmlFor="flexRadioDefault2">
                                                        <img src="/cod.png" style={{ height: '25px' }} alt="/cod.png" />
                                                    </label>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                        <Button type='button' variant="contained" size='small' className='w-100 rounded-5 mt-3 mb-4 bg-button-primary' onClick={handleButtonClick}><i className="fa-solid fa-cart-shopping"></i>&nbsp;&nbsp;Place Order</Button>
                    </div>
                </div>
            </div>
            <BottomNavigation renderNavCart={renderNavCart} setRenderNavCart={setRenderNavCart} renderNavWishlist={renderNavWishlist} setRenderNavWishlist={setRenderNavWishlist} />
        </>
    )
}

export default Checkout