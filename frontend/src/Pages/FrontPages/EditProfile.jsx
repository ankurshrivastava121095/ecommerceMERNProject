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
import { Button, IconButton, InputAdornment, TextField } from '@mui/material';
import FullPageLoader from '../../Components/Loaders/FullPageLoader';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import AddIcon from '@mui/icons-material/Add';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { registerUser, resetAuthState, userLogin } from '../../Features/Auth/AuthSlice';
import { getUser, resetUserState, updateUser } from '../../Features/User/UserSlice';

const EditProfile = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const loginFields = {
        email: '',
        password: '',
    }

    const registerFields = {
        name: '',
        email: '',
        mobileNumber: '',
        alternateNumber: '',
        password: '',
        confirmPassword: '',
        pincode: '',
        city: '',
        state: '',
        country: '',
    }

    const [fullPageLoading, setFullPageLoading] = useState(true)
    const [registerData, setRegisterData] = useState(registerFields)
    const [renderNavCart, setRenderNavCart] = useState(false)
    const [renderNavWishlist, setRenderNavWishlist] = useState(false)
    const [userData, setUserData] = useState('')
    
    const { users, responseStatus, responseMessage } = useSelector(state => state.users)

    const fetchCity = () => {
        if (userData?.pincode?.length == 6) {
            setFullPageLoading(true)
            fetch(`https://api.postalpincode.in/pincode/${userData?.pincode}`)
            .then((res)=>res.json())
            .then(result=>{
                setUserData({
                    ...userData,
                    city: result[0]?.PostOffice[0]?.District,
                    state: result[0]?.PostOffice[0]?.State,
                    country: result[0]?.PostOffice[0]?.Country,
                })
                setFullPageLoading(false)
                })
            .catch((err)=>{
                console.log('err:', err)
                setFullPageLoading(false)
            })
        } else {
            Swal.fire({
                icon: "info",
                title: "Oops...",
                text: "Enter valid pincode"
            });
        }
    }

    const handleInput = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (userData?.name == '' || userData?.pincode == '' || userData?.city == '' || userData?.state == '' || userData?.country == '') {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "All fields are required"
            });
        } else {
            setFullPageLoading(true)
            setTimeout(() => {
                dispatch(updateUser(userData))
            }, 1000);
        }
    }

    useEffect(()=>{
        const token = Cookies.get('ecomProjectLoggedInUserToken')
        const userData = Cookies.get('ecomProjectLoggedInUser')
        if (!token || !userData) {
            navigate('/login')
        } else {
            dispatch(getUser())
        }
        setTimeout(() => {
            setFullPageLoading(false)
        }, 1000);
        window.scrollTo(0, 0)
    },[])

    useEffect(()=>{
        if(responseStatus == 'success' && responseMessage == 'Your Details Updated Successfully'){
            Swal.fire({
                icon: "success",
                title: "Congrats",
                text: `${responseMessage}, If Changes are not visible please logout from your account and login again!`
            });
            dispatch(getUser())
        }
        if(responseStatus == 'success' && responseMessage == 'Get User Detail'){
            setUserData(users?.data)
            setRenderNavCart(true)

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
                dispatch(resetUserState())
            }, 1000);
        }
    },[users, responseStatus, responseMessage])

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
                    <div className="col-md-3"></div>
                    <div className="col-md-6">
                        <div className='border border-primary bg-white p-3 custom-box-shadow mb-3'>
                            <h5 className='text-center'>Update your details here!</h5>
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6">
                                        <TextField 
                                            id="name" 
                                            label="Name" 
                                            size='small'
                                            variant="outlined"
                                            className='mb-3 w-100'
                                            name='name'
                                            value={userData?.name}
                                            onChange={handleInput}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6"></div>
                                    <div className="col-md-6">
                                        <TextField 
                                            id="pincode" 
                                            label="Pincode" 
                                            size='small'
                                            variant="outlined"
                                            className='mb-3 w-100'
                                            name='pincode'
                                            value={userData?.pincode}
                                            onChange={handleInput}
                                        />
                                    </div>
                                    <div className="col-md-6"></div>
                                    <div className="col-md-6">
                                        <div className='mb-3 text-primary'>
                                            <center>
                                                <Button type='button' variant="contained" size='small' className='bg-button-primary' onClick={fetchCity}><i className="fa-solid fa-magnifying-glass"></i>&nbsp;&nbsp;Search City</Button>
                                            </center>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <TextField 
                                            id="city" 
                                            label="City" 
                                            size='small'
                                            variant="outlined"
                                            className='mb-3 w-100'
                                            name='city'
                                            value={userData?.city}
                                            onChange={handleInput}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <TextField 
                                            id="state" 
                                            label="State" 
                                            size='small'
                                            variant="outlined"
                                            className='mb-3 w-100'
                                            name='state'
                                            value={userData?.state}
                                            onChange={handleInput}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <TextField 
                                            id="country" 
                                            label="Country" 
                                            size='small'
                                            variant="outlined"
                                            className='mb-3 w-100'
                                            name='country'
                                            value={userData?.country}
                                            onChange={handleInput}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                        />
                                    </div>
                                </div>
                                <Button type='submit' variant="contained" size='small' className='w-100 bg-button-primary'>Save</Button>
                            </form>
                        </div>
                    </div>
                    <div className="col-md-3"></div>
                </div>
                <div className="row mt-3">
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

export default EditProfile