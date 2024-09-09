/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Badge, Button, ButtonBase, IconButton, styled, Tooltip } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import HomeIcon from '@mui/icons-material/Home';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LoginIcon from '@mui/icons-material/Login';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import MenuIcon from '@mui/icons-material/Menu';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode"
import { useDispatch, useSelector } from 'react-redux';
import { getCarts } from '../../Features/Cart/CartSlice';
import { getWishlists } from '../../Features/Wishlist/WishlistSlice';
import { resetAuthState } from '../../Features/Auth/AuthSlice';

const BottomNavigation = ({ renderNavCart, setRenderNavCart, renderNavWishlist, setRenderNavWishlist }) => {

    const StyledBadge = styled(Badge)(({ theme }) => ({
        '& .MuiBadge-badge': {
          right: -3,
          top: 13,
          border: `2px solid ${theme.palette.background.paper}`,
          padding: '0 4px',
          backgroundColor: '#22696b'
        },
    }));

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    const param = useParams()
    const id = param?.id ? param?.id : ''

    const [page, setPage] = useState('home')
    const [fullPageLoading, setFullPageLoading] = useState(true)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [loggedInUser, setLoggedInUser] = useState('')
    const [cartData, setCartData] = useState([])
    const [wishlistData, setWishlistData] = useState([])

    const { carts, responseStatus: cartResponseStatus, responseMessage: cartResponseMessage } = useSelector(state => state.carts)
    const { wishlists, responseStatus: wishlistResponseStatus, responseMessage: wishlistResponseMessage } = useSelector(state => state.wishlists)

    const handleLogout = () => {
        Cookies.remove('ecomProjectLoggedInUserToken')
        Cookies.remove('ecomProjectLoggedInUser')
        // window.location.reload()
        dispatch(resetAuthState())
        navigate('/login')
    }

    useEffect(()=>{
        if(location.pathname === '/cart' || location.pathname === '/checkout'){
            setPage('cart')
        }
        if(location.pathname === '/wishlist'){
            setPage('wishlist')
        }
        if(location.pathname === '/' || location.pathname === `/product-detail/${id}`){
            setPage('home')
        }
        if(location.pathname === '/my-orders' || location.pathname === `/my-profile`){
            setPage('my-orders')
        }
    })

    useEffect(()=>{
        const token = Cookies.get('ecomProjectLoggedInUserToken')
        const userData = Cookies.get('ecomProjectLoggedInUser')
        if (token && userData) {
            const decodedData = jwtDecode(JSON.stringify(token));
            setIsLoggedIn(true)
            setLoggedInUser(decodedData)
        }

        dispatch(getCarts())
        dispatch(getWishlists())

        setTimeout(() => {
            setFullPageLoading(false)
        }, 500);
    },[])

    useEffect(()=>{
        if (renderNavCart) {
            setFullPageLoading(true)
            dispatch(getCarts())
        }
    },[renderNavCart])

    useEffect(()=>{
        if (renderNavWishlist) {
            setFullPageLoading(true)
            dispatch(getWishlists())
        }
    },[renderNavWishlist])

    useEffect(()=>{
        if(cartResponseStatus == 'success' && cartResponseMessage == 'Get All'){
            setRenderNavCart(false)
            setCartData(carts?.data)
            setTimeout(() => {
                setFullPageLoading(false)
            }, 2000);
        }
    },[carts, cartResponseStatus, cartResponseMessage])

    useEffect(()=>{
        if(wishlistResponseStatus == 'success' && wishlistResponseMessage == 'Get All'){
            setRenderNavWishlist(false)
            setWishlistData(wishlists?.data)
            setTimeout(() => {
                setFullPageLoading(false)
            }, 2000);
        }
    },[wishlists, wishlistResponseStatus, wishlistResponseMessage])

    return (
        <>
            <br /><br />
            <div className='w-100 fixed-bottom bg-white border-top border-secondary-subtle bottom-nav d-flex align-items-center justify-content-between gap-3 px-2' style={{ zIndex: '99999999' }}>
                <small>
                    <Tooltip title="Menu" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
                        <IconButton>
                            <MenuIcon />
                        </IconButton>
                    </Tooltip>
                </small>
                <small>
                    <Link className="nav-link" aria-current="page" to="/wishlist">
                        <Tooltip title="Wishlist">
                            <IconButton>
                                <IconButton aria-label="Wishlist">
                                    <StyledBadge badgeContent={wishlistData?.length} color="primary">
                                        <FavoriteIcon className={`${page == 'wishlist' && 'text-primary'}`} />
                                    </StyledBadge>
                                </IconButton>
                            </IconButton>
                        </Tooltip>
                    </Link>
                </small>
                <small>
                    <Link className="nav-link" aria-current="page" to="/">
                        <Tooltip title="Home">
                            <IconButton>
                                <HomeIcon className={`${page == 'home' && 'text-primary'}`} />
                            </IconButton>
                        </Tooltip>
                    </Link>
                </small>
                <small>
                    <Link className="nav-link" aria-current="page" to="/cart">
                        <Tooltip title="Cart">
                            <IconButton aria-label="cart">
                                <StyledBadge badgeContent={cartData?.length} color="primary">
                                    <ShoppingCartIcon className={`${page == 'cart' && 'text-primary'}`} />
                                </StyledBadge>
                            </IconButton>
                        </Tooltip>
                    </Link>
                </small>
                <small>
                    <Link className="nav-link" aria-current="page" to="/my-profile">
                        <Tooltip title="Profile">
                            <IconButton>
                                <AccountCircleIcon className={`${page == 'profile' && 'text-primary'}`} />
                            </IconButton>
                        </Tooltip>
                    </Link>
                </small>
            </div>

            {/* Menu Drawer */}
            <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel" style={{ backgroundColor: '#000000d6', maxWidth: '90% !important', paddingBottom: '150px' }}>
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title text-white" id="sideMenuDrawerLabel"><img src="/logoFinal2.png" style={{ height: '30px' }} alt="/logoFinal2.png" /> <span className='fw-bold fst-italic' style={{ fontFamily: 'Cedarville Cursive' }}>Ecommerce Project</span></h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"><i className="fa-solid fa-xmark" style={{ color: '#fff' }}></i></button>
                </div>
                <div className="offcanvas-body text-white">
                    <div className='d-flex align-items-center mb-3 px-2 py-1 rounded nav-mobile-menus' data-bs-dismiss="offcanvas" aria-label="Close" onClick={()=>{
                        setTimeout(() => {
                            navigate('/')
                        }, 500)
                    }}>
                        <i className="fa-solid fa-house-chimney" style={{ width: '50px', fontSize: '20px' }}></i>
                        <span className=''>Home</span>
                    </div>
                    <div className='d-flex align-items-center mb-3 px-2 py-1 rounded nav-mobile-menus' data-bs-dismiss="offcanvas" aria-label="Close" onClick={()=>{
                        setTimeout(() => {
                            navigate('/my-profile')
                        }, 500)
                    }}>
                        <i className="fa-regular fa-circle-user" style={{ width: '50px', fontSize: '20px' }}></i>
                        <span className=''>Profile</span>
                    </div>
                    <div className='d-flex align-items-center mb-3 px-2 py-1 rounded nav-mobile-menus' data-bs-dismiss="offcanvas" aria-label="Close" onClick={()=>{
                        setTimeout(() => {
                            navigate('/cart')
                        }, 500)
                    }}>
                        <i className="fa-solid fa-cart-shopping" style={{ width: '50px', fontSize: '20px' }}></i>
                        <span className=''>Cart</span>
                    </div>
                    <div className='d-flex align-items-center mb-3 px-2 py-1 rounded nav-mobile-menus' data-bs-dismiss="offcanvas" aria-label="Close" onClick={()=>{
                        setTimeout(() => {
                            navigate('/my-orders')
                        }, 500)
                    }}>
                        <i className="fa-solid fa-dolly" style={{ width: '50px', fontSize: '20px' }}></i>
                        <span className=''>Orders</span>
                    </div>
                    <div className='d-flex align-items-center mb-3 px-2 py-1 rounded nav-mobile-menus' data-bs-dismiss="offcanvas" aria-label="Close" onClick={()=>{
                        setTimeout(() => {
                            navigate('/wishlist')
                        }, 500)
                    }}>
                        <i className="fa-regular fa-heart" style={{ width: '50px', fontSize: '20px' }}></i>
                        <span className=''>Wishlist</span>
                    </div>
                    <div className='d-flex align-items-center mb-3 px-2 py-1 rounded nav-mobile-menus' data-bs-dismiss="offcanvas" aria-label="Close" onClick={()=>{
                        setTimeout(() => {
                            navigate('/mobile-application')
                        }, 500)
                    }}>
                        <i className="fa-solid fa-download" style={{ width: '50px', fontSize: '20px' }}></i>
                        <span className=''>Mobile Application</span>
                    </div>
                    <div className='d-flex align-items-center mb-3 px-2 py-1 rounded nav-mobile-menus' data-bs-dismiss="offcanvas" aria-label="Close" onClick={()=>{
                        setTimeout(() => {
                            navigate('/help-center')
                        }, 500)
                    }}>
                        <i className="fa-solid fa-circle-info" style={{ width: '50px', fontSize: '20px' }}></i>
                        <span className=''>Help Center</span>
                    </div>
                    <div className='d-flex align-items-center mb-3 px-2 py-1 rounded nav-mobile-menus' data-bs-dismiss="offcanvas" aria-label="Close" onClick={()=>{
                        setTimeout(() => {
                            navigate('/edit-profile')
                        }, 500)
                    }}>
                        <i className="fa-solid fa-pen-to-square" style={{ width: '50px', fontSize: '20px' }}></i>
                        <span className=''>Edit Profile</span>
                    </div>
                    <div className='d-flex align-items-center mb-3 px-2 py-1 rounded nav-mobile-menus' data-bs-dismiss="offcanvas" aria-label="Close" onClick={handleLogout}>
                        <i className="fa-solid fa-power-off" style={{ width: '50px', fontSize: '20px' }}></i>
                        <span className=''>Sign out</span>
                    </div>
                    <div className='mt-5'>
                        <div className='d-flex flex-wrap align-items-center gap-2' style={{ fontSize: '12px' }}>
                            <div role='button' data-bs-dismiss="offcanvas" aria-label="Close" onClick={()=>navigate('/privacy-policy')} className='text-decoration-none text-white'>Privacy Policy</div>
                            <div className='text-white'>|</div>
                            <div role='button' data-bs-dismiss="offcanvas" aria-label="Close" onClick={()=>navigate('/shipping-and-delivery')} className='text-decoration-none text-white'>Shipping & Delivery Policy</div>
                            <div className='text-white'>|</div>
                            <div role='button' data-bs-dismiss="offcanvas" aria-label="Close" onClick={()=>navigate('/terms-and-condition')} className='text-decoration-none text-white'>Terms & Condition</div>
                            <div className='text-white'>|</div>
                            <div role='button' data-bs-dismiss="offcanvas" aria-label="Close" onClick={()=>navigate('/return-and-refund-policy')} className='text-decoration-none text-white'>Return & Refund Policy</div>
                            <div className='text-white'>|</div>
                            <div role='button' data-bs-dismiss="offcanvas" aria-label="Close" onClick={()=>navigate('/about-us')} className='text-decoration-none text-white'>About Us</div>
                            <div className='text-white'>|</div>
                            <div role='button' data-bs-dismiss="offcanvas" aria-label="Close" onClick={()=>navigate('/contact-us')} className='text-decoration-none text-white'>Contact Us</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BottomNavigation