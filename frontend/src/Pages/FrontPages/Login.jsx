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

const Login = () => {

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
    const [showLoginPassword, setShowLoginPassword] = useState(false)
    const [showRegisterPassword, setShowRegisterPassword] = useState(false)
    const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false)
    const [loginData, setLoginData] = useState(loginFields)
    const [registerData, setRegisterData] = useState(registerFields)
    const [renderNavCart, setRenderNavCart] = useState(false)
    const [renderNavWishlist, setRenderNavWishlist] = useState(false)
    
    const { auth, loading, success, message, error } = useSelector(state => state.auth)

    const fetchCity = () => {
        if (registerData?.pincode?.length == 6) {
            setFullPageLoading(true)
            fetch(`https://api.postalpincode.in/pincode/${registerData?.pincode}`)
            .then((res)=>res.json())
            .then(result=>{
                setRegisterData({
                    ...registerData,
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

    const handleLoginInput = (e) => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value
        })
    }

    const handleRegisterInput = (e) => {
        setRegisterData({
            ...registerData,
            [e.target.name]: e.target.value
        })
    }

    const handleLoginSubmit = (e) => {
        e.preventDefault()
        setFullPageLoading(true)
        dispatch(userLogin(loginData))
    }

    const handleRegisterSubmit = (e) => {
        e.preventDefault()

        if (registerData?.password == registerData?.confirmPassword) {
            setFullPageLoading(true)
            setTimeout(() => {
                dispatch(registerUser(registerData))
            }, 1000);
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Password not matching"
            });
        }
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
        if (success && message == 'Registered Successfully') {
            setFullPageLoading(false)
            setRegisterData({
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
            })
            Swal.fire({
                icon: "success",
                title: "Congrats",
                text: message
            });
            setTimeout(() => {
                dispatch(resetAuthState())
            }, 1000);
        }
        if (success && message == 'Logged In') {
            setLoginData({
                email: '',
                password: '',
            })
            setTimeout(() => {
                navigate('/')
            }, 1000);
        }
        if (success && message != '' && message != 'Logged In' && message != 'Registered Successfully') {
            setFullPageLoading(false)
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: message
            });
            setTimeout(() => {
                dispatch(resetAuthState())
            }, 1000);
        }
        if (!success && message != '' && message != null) {
            setFullPageLoading(false)
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: message
            });
            setTimeout(() => {
                dispatch(resetAuthState())
            }, 1000);
        }
    },[auth, loading, success, message, error])

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
                <div className='row mt-5'>
                    <div className="col-md-4">
                        <div className='border border-primary bg-white p-3 custom-box-shadow mb-3'>
                            <h5 className='text-center'>Login to Get Started!</h5>
                            <form onSubmit={handleLoginSubmit}>
                                <TextField 
                                    id="email" 
                                    label="Email" 
                                    size='small'
                                    variant="outlined"
                                    className='mb-3 w-100'
                                    name='email'
                                    value={loginData?.email}
                                    onChange={handleLoginInput}
                                    required
                                />
                                <TextField 
                                    type={`${showLoginPassword ? 'text' : 'password'}`}
                                    id="password" 
                                    label="Password" 
                                    size='small'
                                    variant="outlined"
                                    className='mb-3 w-100'
                                    name='password'
                                    value={loginData?.password}
                                    onChange={handleLoginInput}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={()=>setShowLoginPassword(!showLoginPassword)}
                                                    edge="end"
                                                >
                                                    {showLoginPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    required
                                />
                                <Button type='submit' variant="contained" size='small' className='w-100 mb-3 bg-button-primary'><VpnKeyIcon />&nbsp;&nbsp;Login</Button>
                            </form>
                            <Link to='/forget-password' className='text-decoration-none text-primary'>Forget Password ?</Link>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className='border border-primary bg-white p-3 custom-box-shadow mb-3'>
                            <h5 className='text-center'>Register Yourself here!</h5>
                            <form onSubmit={handleRegisterSubmit}>
                                <div className="row">
                                    <div className="col-md-6">
                                        <TextField 
                                            id="name" 
                                            label="Name" 
                                            size='small'
                                            variant="outlined"
                                            className='mb-3 w-100'
                                            name='name'
                                            value={registerData?.name}
                                            onChange={handleRegisterInput}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <TextField 
                                            id="email" 
                                            label="Email" 
                                            size='small'
                                            variant="outlined"
                                            className='mb-3 w-100'
                                            name='email'
                                            value={registerData?.email}
                                            onChange={handleRegisterInput}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <TextField 
                                            id="mobileNumber" 
                                            label="Mobile Number" 
                                            size='small'
                                            variant="outlined"
                                            className='w-100'
                                            name='mobileNumber'
                                            value={registerData?.mobileNumber}
                                            onChange={handleRegisterInput}
                                            required
                                        />
                                        <div className='fw-bold text-red' style={{ fontSize: '12px' }}><small><i className="fa-solid fa-circle-exclamation"></i> Make Sure your mobile number must be of 10 digit and must be registered as your WhatsApp number for notifications and password recovery.</small></div>
                                    </div>
                                    <div className="col-md-6">
                                        <TextField 
                                            id="alternateNumber" 
                                            label="Alternate Number" 
                                            size='small'
                                            variant="outlined"
                                            className='mb-3 w-100'
                                            name='alternateNumber'
                                            value={registerData?.alternateNumber}
                                            onChange={handleRegisterInput}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <TextField 
                                            type={`${showRegisterPassword ? 'text' : 'password'}`}
                                            id="password" 
                                            label="Password" 
                                            size='small'
                                            variant="outlined"
                                            className='mb-3 w-100'
                                            name='password'
                                            value={registerData?.password}
                                            onChange={handleRegisterInput}
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
                                    </div>
                                    <div className="col-md-6">
                                        <TextField 
                                            type={`${showRegisterConfirmPassword ? 'text' : 'password'}`}
                                            id="confirmPassword" 
                                            label="Confirm Password" 
                                            size='small'
                                            variant="outlined"
                                            className='mb-3 w-100' 
                                            name='confirmPassword'
                                            value={registerData?.confirmPassword}
                                            onChange={handleRegisterInput}
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
                                    </div>
                                    <div className="col-md-5">
                                        <TextField 
                                            id="pincode" 
                                            label="Pincode" 
                                            size='small'
                                            variant="outlined"
                                            className='mb-3 w-100'
                                            name='pincode'
                                            value={registerData?.pincode}
                                            onChange={handleRegisterInput}
                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <div className='mb-3 text-primary'>
                                            <center>
                                                <small role='button' onClick={fetchCity}><i className="fa-solid fa-magnifying-glass"></i> Search City</small>
                                            </center>
                                        </div>
                                    </div>
                                    <div className="col-md-5">
                                        {
                                            registerData?.city != '' ?
                                                <TextField 
                                                    id="city" 
                                                    label="City" 
                                                    size='small'
                                                    variant="outlined"
                                                    className='mb-3 w-100'
                                                    name='city'
                                                    value={registerData?.city}
                                                    onChange={handleRegisterInput}
                                                    InputProps={{
                                                        readOnly: true,
                                                    }}
                                                />
                                            : ''
                                        }
                                    </div>
                                    {
                                        registerData?.state != '' && registerData?.country != '' ?
                                        <>
                                            <div className="col-md-6">
                                                <TextField 
                                                    id="state" 
                                                    label="State" 
                                                    size='small'
                                                    variant="outlined"
                                                    className='mb-3 w-100'
                                                    name='state'
                                                    value={registerData?.state}
                                                    onChange={handleRegisterInput}
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
                                                    value={registerData?.country}
                                                    onChange={handleRegisterInput}
                                                    InputProps={{
                                                        readOnly: true,
                                                    }}
                                                />
                                            </div>
                                        </>
                                        : ''
                                    }
                                </div>
                                <Button type='submit' variant="contained" size='small' className='w-100 bg-button-primary'><AddIcon />&nbsp;&nbsp;Register</Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <BottomNavigation renderNavCart={renderNavCart} setRenderNavCart={setRenderNavCart} renderNavWishlist={renderNavWishlist} setRenderNavWishlist={setRenderNavWishlist} />
        </>
    )
}

export default Login