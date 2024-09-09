/* eslint-disable no-unused-vars */
import { Button, IconButton, Tooltip } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import PlayForWorkIcon from '@mui/icons-material/PlayForWork';
import CategoryIcon from '@mui/icons-material/Category';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ImageIcon from '@mui/icons-material/Image';
import BurstModeIcon from '@mui/icons-material/BurstMode';
import MenuIcon from '@mui/icons-material/Menu';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode"
import { resetAuthState } from '../../Features/Auth/AuthSlice';
import { useDispatch } from 'react-redux';


const AdminBottomNavigation = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const param = useParams()
    const id = param?.id ? param?.id : ''

    const [page, setPage] = useState('home')

    const handleLogout = () => {
        Cookies.remove('ecomProjectLoggedInUserToken')
        Cookies.remove('ecomProjectLoggedInUser')
        // window.location.reload()
        dispatch(resetAuthState())
        navigate('/login')
    }

    useEffect(()=>{
        if(location.pathname === '/ecom-project/dashboard'){
            setPage('dashboard')
        }
        if(location.pathname === '/ecom-project/products'){
            setPage('products')
        }
        if(location.pathname === '/' || location.pathname === `/product-detail/${id}`){
            setPage('home')
        }
        if(location.pathname === '/my-orders' || location.pathname === `/product-detail/${id}`){
            setPage('my-orders')
        }
    })

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
                    <Link className="nav-link" aria-current="page" to="/ecom-project/dashboard">
                        <Tooltip title="Dashboard">
                            <IconButton>
                                <DashboardIcon className={`${page == 'dashboard' && 'text-primary'}`} />
                            </IconButton>
                        </Tooltip>
                    </Link>
                </small>
                <small>
                    <Link className="nav-link" aria-current="page" to="/ecom-project/products">
                        <Tooltip title="Products">
                            <IconButton>
                                <CategoryIcon className={`${page == 'products' && 'text-primary'}`} />
                            </IconButton>
                        </Tooltip>
                    </Link>
                </small>
                <small>
                    <Link className="nav-link" aria-current="page" to="/ecom-project/orders">
                        <Tooltip title="Orders">
                            <IconButton>
                                <PlayForWorkIcon className={`${page == 'orders' && 'text-primary'}`} />
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
                        <i className="fa-solid fa-house" style={{ width: '50px', fontSize: '20px' }}></i>
                        <span className=''>Main Homepage</span>
                    </div>
                    <div className='d-flex align-items-center mb-3 px-2 py-1 rounded nav-mobile-menus' data-bs-dismiss="offcanvas" aria-label="Close" onClick={()=>{
                        setTimeout(() => {
                            navigate('/')
                        }, 500)
                    }}>
                        <i className="fa-solid fa-house-lock" style={{ width: '50px', fontSize: '20px' }}></i>
                        <span className=''>Admin Homepage</span>
                    </div>

                    <div className='d-flex align-items-center mb-3 px-2 py-1 rounded nav-mobile-menus' data-bs-dismiss="offcanvas" aria-label="Close" onClick={()=>{
                        setTimeout(() => {
                            navigate('/ecom-project/users')
                        }, 500)
                    }}>
                        <i className="fa-solid fa-users" style={{ width: '50px', fontSize: '20px' }}></i>
                        <span className=''>Users</span>
                    </div>

                    <div className='d-flex align-items-center mb-3 px-2 py-1 rounded nav-mobile-menus' data-bs-dismiss="offcanvas" aria-label="Close" onClick={()=>{
                        setTimeout(() => {
                            navigate('/ecom-project/main-banner')
                        }, 500)
                    }}>
                        <i className="fa-solid fa-image" style={{ width: '50px', fontSize: '20px' }}></i>
                        <span className=''>Main Banner</span>
                    </div>
                    <div className='d-flex align-items-center mb-3 px-2 py-1 rounded nav-mobile-menus' data-bs-dismiss="offcanvas" aria-label="Close" onClick={()=>{
                        setTimeout(() => {
                            navigate('/ecom-project/secondary-banner')
                        }, 500)
                    }}>
                        <i className="fa-solid fa-images" style={{ width: '50px', fontSize: '20px' }}></i>
                        <span className=''>Secondary Banner</span>
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
                            navigate('/ecom-project/categories')
                        }, 500)
                    }}>
                        <i className="fa-solid fa-list" style={{ width: '50px', fontSize: '20px' }}></i>
                        <span className=''>Categories</span>
                    </div> 
                    <div className='d-flex align-items-center mb-3 px-2 py-1 rounded nav-mobile-menus' data-bs-dismiss="offcanvas" aria-label="Close" onClick={()=>{
                        setTimeout(() => {
                            navigate('/ecom-project/sub-categories')
                        }, 500)
                    }}>
                        <i className="fa-solid fa-layer-group" style={{ width: '50px', fontSize: '20px' }}></i>
                        <span className=''>Sub Categories</span>
                    </div>
                    <div className='d-flex align-items-center mb-3 px-2 py-1 rounded nav-mobile-menus' data-bs-dismiss="offcanvas" aria-label="Close" onClick={()=>{
                        setTimeout(() => {
                            navigate('/ecom-project/products')
                        }, 500)
                    }}>
                        <i className="fa-solid fa-boxes-packing" style={{ width: '50px', fontSize: '20px' }}></i>
                        <span className=''>Products</span>
                    </div>
                 
                    <div className='d-flex align-items-center mb-3 px-2 py-1 rounded nav-mobile-menus' data-bs-dismiss="offcanvas" aria-label="Close" onClick={()=>{
                        setTimeout(() => {
                            navigate('/ecom-project/orders')
                        }, 500)
                    }}>
                        <i className="fa-solid fa-arrow-down-short-wide" style={{ width: '50px', fontSize: '20px' }}></i>
                        <span className=''>Orders</span>
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

export default AdminBottomNavigation