/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { IconButton, TextField, Tooltip, styled } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LoginIcon from '@mui/icons-material/Login';
import InstallMobileIcon from '@mui/icons-material/InstallMobile';
import MenuIcon from '@mui/icons-material/Menu';
import ShopIcon from '@mui/icons-material/Shop';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import Badge from '@mui/material/Badge';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode"
import { useDispatch, useSelector } from 'react-redux';
import { getCarts } from '../../Features/Cart/CartSlice';
import FullPageLoader from '../Loaders/FullPageLoader';
import { getWishlists } from '../../Features/Wishlist/WishlistSlice';
import { resetAuthState } from '../../Features/Auth/AuthSlice';


const Navbar = ({ renderNavCart, setRenderNavCart, renderNavWishlist, setRenderNavWishlist }) => {

    const StyledBadge = styled(Badge)(({ theme }) => ({
        '& .MuiBadge-badge': {
          right: -3,
          top: 13,
          border: `2px solid ${theme.palette.background.paper}`,
          padding: '0 4px',
          backgroundColor: '#22696b'
        },
    }));

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const param = useParams()
    const id = param?.id ? param?.id : ''

    const [fullPageLoading, setFullPageLoading] = useState(true)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [loggedInUserData, setLoggedInUserData] = useState('')
    const [cartData, setCartData] = useState([])
    const [wishlistData, setWishlistData] = useState([])
    const [page, setPage] = useState('home')
    const [globalSearch, setGlobalSearch] = useState('')
    const [categoryList, setCategoryList] = useState([])

    const { carts, responseStatus: cartResponseStatus, responseMessage: cartResponseMessage } = useSelector(state => state.carts)
    const { wishlists, responseStatus: wishlistResponseStatus, responseMessage: wishlistResponseMessage } = useSelector(state => state.wishlists)

    const handleGlobalSearch = () => {
        navigate(`/related-products?product=${globalSearch}`)
    }

    const handleLogout = () => {
        Cookies.remove('ecomProjectLoggedInUserToken')
        Cookies.remove('ecomProjectLoggedInUser')
        dispatch(resetAuthState())
        navigate('/login')
        // window.location.reload()
    }

    const fetchCategories = () => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/category`)
        .then(response => response.json())
        .then(data => setCategoryList(data?.data))
        .catch((err)=>console.log(err)
        )
    }

    useEffect(()=>{
        const token = Cookies.get('ecomProjectLoggedInUserToken')
        const userData = Cookies.get('ecomProjectLoggedInUser')
        if (token && userData) {
            const decodedData = jwtDecode(JSON.stringify(token));
            setIsLoggedIn(true)
            setLoggedInUserData(decodedData)
        }
        window.scrollTo(0, 0)

        dispatch(getCarts())
        fetchCategories()

        setTimeout(() => {
            setFullPageLoading(false)
        }, 1000);
    },[])

    useEffect(()=>{
        if(location.pathname === '/cart' || location.pathname === '/checkout'){
            setPage('cart')
        }
        if(location.pathname === '/wishlist'){
            setPage('wishlist')
        }
        if(location.pathname === '/login'){
            setPage('login')
        }
        if(location.pathname === '/' || location.pathname === `/product-detail/${id}`){
            setPage('home')
        }
        if(location.pathname === '/my-orders' || location.pathname === `/my-profile`){
            setPage('my-orders')
        }
    }, [location])

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
            setRenderNavWishlist(true)
            setWishlistData(wishlists?.data)
            setTimeout(() => {
                setFullPageLoading(false)
            }, 1000);
        }
    },[wishlists, wishlistResponseStatus, wishlistResponseMessage])

    return (
        <>
            {fullPageLoading && <FullPageLoader />}
            <div className=''>
                {
                    location.pathname === '/' || location.pathname === `/product-detail/${id}` ?
                        <div>
                            <div className="marquee d-flex gap-5 bg-dark pb-1">
                                <div className="marquee-content">
                                    <div className="text-white">Unique & Genuine Products</div>
                                    <div className="text-white">-</div>
                                    <div className="text-white">Quick Home Delivery</div>
                                    <div className="text-white">-</div>
                                    <div className="text-white">Open Box Delivery</div>
                                </div>
                            </div>
                        </div>
                    : ''
                }
                <div className='d-flex flex-wrap align-items-center justify-content-between w-100 py-4 px-2'>
                    <div className='nav-search-icon'><span data-bs-toggle="offcanvas" data-bs-target="#searchBarCanvas" aria-controls="searchBarCanvas"><SearchIcon sx={{ cursor: 'pointer', fontSize: '30px', width: '130px' }} /></span></div>
                    <div className='nav-search-icon-mobile'><span data-bs-toggle="offcanvas" data-bs-target="#sideMenuDrawer" aria-controls="sideMenuDrawer"><MenuIcon sx={{ cursor: 'pointer', fontSize: '20px' }} /></span></div>
                    <div>
                        <Link className='text-decoration-none' to="/">
                            <div className='d-flex align-items-center gap-1'>
                                <img src="/logoFinal2.png" style={{ height: '30px' }} alt="/logoFinal2.png" />
                                <span className='text-primary fw-bold fst-italic nav-main-logo' style={{ fontFamily: 'Cedarville Cursive' }}>Ecommerce Project</span>
                            </div>
                        </Link>
                    </div>
                    <div className='nav-action-buttons'>
                        <div className='d-flex align-items-center gap-1'>
                            <Link className="nav-link" aria-current="page" to="/wishlist">
                                <Tooltip title="Wishlist">
                                    <IconButton aria-label="wishlist">
                                        <StyledBadge badgeContent={wishlistData?.length} color="primary">
                                            <FavoriteBorderIcon className={page == 'wishlist' ? 'text-primary' : ''} />
                                        </StyledBadge>
                                    </IconButton>
                                </Tooltip>
                            </Link>
                            <Link className="nav-link" aria-current="page" to="/cart">
                                <Tooltip title="Cart">
                                    <IconButton aria-label="cart">
                                        <StyledBadge badgeContent={cartData?.length} color="primary">
                                            <ShoppingCartIcon className={page == 'cart' ? 'text-primary' : ''} />
                                        </StyledBadge>
                                    </IconButton>
                                </Tooltip>
                            </Link>
                            {
                                !isLoggedIn ?
                                    <Link className="nav-link" aria-current="page" to="/login">
                                        <Tooltip title="Login">
                                            <IconButton>
                                                <AccountCircleOutlinedIcon className={page == 'login' ? 'text-primary' : ''} />
                                            </IconButton>
                                        </Tooltip>
                                    </Link>
                                :
                                <>
                                    <Link className="nav-link" aria-current="page" to="/my-profile">
                                        <Tooltip title="Profile">
                                            <IconButton aria-label="profile">
                                                <AccountCircleOutlinedIcon className={page == 'my-orders' ? 'text-primary' : ''} />
                                            </IconButton>
                                        </Tooltip>
                                    </Link>
                                </>
                            }
                        </div>
                    </div>
                    <div className='nav-action-buttons-mobile'>
                        <div className='d-flex align-items-center gap-1'>
                            <span data-bs-toggle="offcanvas" data-bs-target="#searchBarCanvas" aria-controls="searchBarCanvas">
                                <Tooltip title="Search">
                                    <IconButton>
                                        <SearchIcon fontSize='small' />
                                    </IconButton>
                                </Tooltip>
                            </span>
                            {
                                !isLoggedIn ?
                                    <Link className="nav-link" aria-current="page" to="/login">
                                        <Tooltip title="Login">
                                            <IconButton>
                                                <AccountCircleOutlinedIcon fontSize='small' className={page == 'login' ? 'text-primary' : ''} />
                                            </IconButton>
                                        </Tooltip>
                                    </Link>
                                :
                                <>
                                    <Link className="nav-link" aria-current="page" to="/my-profile">
                                        <Tooltip title="Profile">
                                            <IconButton aria-label="profile">
                                                <AccountCircleOutlinedIcon fontSize='small' className={page == 'my-orders' ? 'text-primary' : ''} />
                                            </IconButton>
                                        </Tooltip>
                                    </Link>
                                </>
                            }
                        </div>
                    </div>
                </div>
                <div className='container nav-menus'>
                    <div className="row">
                        <div className="col-md-12">
                            <div className='d-flex align-items-center justify-content-center gap-4 pb-4'>
                                <div role='button' className='fst-italic' style={{ fontWeight: '500' }}><Link to='/' className='text-dark text-decoration-none'>Home</Link></div>
                                {
                                    Array?.isArray(categoryList) && categoryList?.length > 0 && categoryList?.map((val,key)=>(
                                        <div key={key} role='button' className={`fst-italic ${key > 4 || val?.isDeleted == 1 ? 'd-none' : ''}`} style={{ fontWeight: '500' }}><Link to={`/category-product/${val?._id}`} className='text-dark text-decoration-none' onClick={()=>setFullPageLoading(true)}>{val?.categoryName}</Link></div>
                                    ))
                                }
                                <div role='button' className='fst-italic' style={{ fontWeight: '500' }}><Link to='/my-orders' className='text-dark text-decoration-none'>Track My Order</Link></div>
                                <div role='button' className='fst-italic' style={{ fontWeight: '500' }}><Link to='/contact-us' className='text-dark text-decoration-none'>Contact Us</Link></div>
                                <div role='button' className='fst-italic' style={{ fontWeight: '500' }}><Link to='/about-us' className='text-dark text-decoration-none'>About Us</Link></div>
                                <div role='button' className='fst-italic' style={{ fontWeight: '500' }}>
                                    <div className="dropdown">
                                        <button className="btn fst-italic dropdown-toggle p-0" style={{ fontWeight: '500', border: 'none', outline: 'none' }} type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            Policies
                                        </button>
                                        <ul className="dropdown-menu rounded-0">
                                            <li><Link className="dropdown-item" to="/privacy-policy">Privacy Policy</Link></li>
                                            <li><Link className="dropdown-item" to="/shipping-and-delivery">Shipping & Delivery Policy</Link></li>
                                            <li><Link className="dropdown-item" to="/terms-and-condition">Terms & Condition</Link></li>
                                            <li><Link className="dropdown-item" to="/return-and-refund-policy">Return & Refund Policy</Link></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* search bar drawer */}
            <div className="offcanvas offcanvas-top" tabIndex="-1" id="searchBarCanvas" aria-labelledby="searchBarCanvasLabel" style={{ backgroundColor: '#000000d6' }}>
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title text-white" id="searchBarCanvasLabel"><img src="/logoFinal2.png" style={{ height: '30px' }} alt="/logoFinal2.png" /> <span className='fw-bold fst-italic' style={{ fontFamily: 'Cedarville Cursive' }}>Ecommerce Project</span></h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"><i className="fa-solid fa-xmark" style={{ color: '#fff' }}></i></button>
                </div>
                <div className="offcanvas-body">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-3"></div>
                            <div className="col-md-6">
                                <div className='d-flex align-items-center'>
                                    <input 
                                        type="search"
                                        className='form-control rounded-0'
                                        placeholder='Search Here'
                                        onChange={e=>setGlobalSearch(e.target.value)} 
                                    />
                                    <button type="submit" className='btn bg-button-primary text-white rounded-0' style={{ border: '1px solid #22696b' }} onClick={handleGlobalSearch} data-bs-dismiss="offcanvas" aria-label="Close"><i className="fa-solid fa-magnifying-glass"></i></button>
                                </div>
                            </div>
                            <div className="col-md-3"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* mobile view side drawer */}
            <div className="offcanvas offcanvas-start" tabIndex="-1" id="sideMenuDrawer" aria-labelledby="sideMenuDrawerLabel" style={{ backgroundColor: '#000000d6', maxWidth: '90% !important', paddingBottom: '150px' }}>
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

export default Navbar