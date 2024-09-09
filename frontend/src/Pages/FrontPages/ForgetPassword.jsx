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
import SendIcon from '@mui/icons-material/Send';
import VerifiedIcon from '@mui/icons-material/Verified';
import LockIcon from '@mui/icons-material/Lock';
import AddIcon from '@mui/icons-material/Add';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { registerUser, resetAuthState, userLogin } from '../../Features/Auth/AuthSlice';
import { resetForgetPasswordState, resetPassword, sendOtp, verifyOtp } from '../../Features/ForgetPassword/ForgetPasswordSlice';

const ForgetPassword = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const fpFields = {
        mobileNumber: ''
    }

    const vtFields = {
        mobileNumber: '',
        otp: ''
    }

    const rpFields = {
        userId: '',
        newPassword: '',
        confirmPassword: ''
    }

    const [fullPageLoading, setFullPageLoading] = useState(true)
    const [fpData, setFpData] = useState(fpFields)
    const [vtData, setVtData] = useState(vtFields)
    const [rpData, setRpData] = useState(rpFields)
    const [section, setSection] = useState('fp')
    const [showRegisterPassword, setShowRegisterPassword] = useState(false)
    const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false)
    const [renderNavCart, setRenderNavCart] = useState(false)
    const [renderNavWishlist, setRenderNavWishlist] = useState(false)

    const { forgetPasswords, responseStatus, responseMessage } = useSelector(state => state.forgetPasswords) 

    const handleFpInput = (e) => {
        setFpData({
            ...fpData,
            [e.target.name]: e.target.value
        })
    }

    const handleVtInput = (e) => {
        setVtData({
            ...vtData,
            [e.target.name]: e.target.value
        })
    }

    const handleRpInput = (e) => {
        setRpData({
            ...rpData,
            [e.target.name]: e.target.value
        })
    }

    const handleFpSubmit = (e) => {
        e.preventDefault()

        setTimeout(() => {
            setFullPageLoading(true)
            dispatch(sendOtp(fpData))
        }, 500)
    }

    const handleVtSubmit = (e) => {
        e.preventDefault()
        
        setTimeout(() => {
            setFullPageLoading(true)
            dispatch(verifyOtp(vtData))
        }, 500)
    }

    const handleRpSubmit = (e) => {
        e.preventDefault()
        
        setTimeout(() => {
            setFullPageLoading(true)
            dispatch(resetPassword(rpData))
        }, 500)
    }

    useEffect(()=>{
        const token = Cookies.get('ecomProjectLoggedInUserToken')
        const userData = Cookies.get('ecomProjectLoggedInUser')
        if (token && userData) {
            navigate('/')
        }
        setTimeout(() => {
            setFullPageLoading(false)
        }, 1000);
        window.scrollTo(0, 0)
    },[])

    useEffect(()=>{
        if(responseStatus == 'success' && responseMessage == 'OTP Sent Successfully'){
            setSection('vt')
            setVtData({
                ...vtData,
                mobileNumber: fpData?.mobileNumber
            })
            setRpData({
                ...rpData,
                userId: forgetPasswords?.userId
            })
            setTimeout(() => {
                setFullPageLoading(false)
            }, 500)
        }
        if(responseStatus == 'success' && responseMessage == 'OTP Verified Successfully'){
            setSection('rp')
            setTimeout(() => {
                setFullPageLoading(false)
            }, 500)
        }
        if(responseStatus == 'success' && responseMessage == 'Password Changed Successfully'){
            setSection('fp')
            setTimeout(() => {
                setFullPageLoading(false)
                Swal.fire({
                    icon: "success",
                    title: "Congrats",
                    text: responseMessage
                });
                navigate('/login')
                dispatch(resetForgetPasswordState())
            }, 500)
        }
        if(responseStatus == 'rejected' && responseMessage != '' && responseMessage != null){
            setFullPageLoading(false)
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: responseMessage
            });
            setTimeout(() => {
                dispatch(resetForgetPasswordState())
            }, 1000);
        }
    },[forgetPasswords, responseStatus, responseMessage])

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
                    <div className="col-md-6 mb-3">
                        <div className='border border-primary bg-white p-3 custom-box-shadow mb-3'>
                            {
                                section == 'fp' &&
                                <>
                                    <h5 className='text-center mb-3'>Forget Password</h5>
                                    <form onSubmit={handleFpSubmit}>
                                        <TextField 
                                            id="mobileNumber" 
                                            label="Mobile/WhatsApp Number" 
                                            size='small'
                                            variant="outlined"
                                            className='w-100'
                                            name='mobileNumber'
                                            value={fpData?.mobileNumber}
                                            onChange={handleFpInput}
                                            required
                                        />
                                        <div className='fw-bold text-red' style={{ fontSize: '12px' }}><small><i className="fa-solid fa-circle-exclamation"></i> Registered mobile/whatsapp number on Ecommerce Project.</small></div>
                                        <Button type='submit' variant="contained" size='small' className='w-100 mb-3 mt-3 bg-button-primary'>Send OTP&nbsp;&nbsp;<SendIcon fontSize='small' /></Button>
                                    </form>
                                </>
                            }
                            {
                                section == 'vt' &&
                                <>
                                    <h5 className='text-center mb-3'>Verify OTP</h5>
                                    <form onSubmit={handleVtSubmit}>
                                        <TextField 
                                            id="otp" 
                                            label="OTP" 
                                            size='small'
                                            variant="outlined"
                                            className='w-100'
                                            name='otp'
                                            value={vtData?.otp}
                                            onChange={handleVtInput}
                                            required
                                        />
                                        <Button type='submit' variant="contained" size='small' className='w-100 mb-3 mt-3 bg-button-primary'>Verify OTP&nbsp;&nbsp;<VerifiedIcon fontSize='small' /></Button>
                                    </form>
                                </>
                            }
                            {
                                section == 'rp' &&
                                <>
                                    <h5 className='text-center mb-3'>Reset Password</h5>
                                    <form onSubmit={handleRpSubmit}>
                                        <TextField 
                                            type={`${showRegisterPassword ? 'text' : 'password'}`}
                                            id="newPassword" 
                                            label="New Password" 
                                            size='small'
                                            variant="outlined"
                                            className='mb-3 w-100'
                                            name='newPassword'
                                            value={rpData?.newPassword}
                                            onChange={handleRpInput}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={()=>setShowRegisterPassword(!showRegisterPassword)}
                                                            edge="end"
                                                        >
                                                            {showRegisterPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                            required
                                        />
                                        <TextField 
                                            type={`${showRegisterConfirmPassword ? 'text' : 'password'}`}
                                            id="confirmPassword" 
                                            label="Confirm Password" 
                                            size='small'
                                            variant="outlined"
                                            className='mb-3 w-100' 
                                            name='confirmPassword'
                                            value={rpData?.confirmPassword}
                                            onChange={handleRpInput}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={()=>setShowRegisterConfirmPassword(!showRegisterConfirmPassword)}
                                                            edge="end"
                                                        >
                                                            {showRegisterConfirmPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                            required
                                        />
                                        <Button type='submit' variant="contained" size='small' className='w-100 mb-3 mt-3 bg-button-primary'>Reset Password&nbsp;&nbsp;<LockIcon fontSize='small' /></Button>
                                    </form>
                                </>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <BottomNavigation renderNavCart={renderNavCart} setRenderNavCart={setRenderNavCart} renderNavWishlist={renderNavWishlist} setRenderNavWishlist={setRenderNavWishlist} />
        </>
    )
}

export default ForgetPassword