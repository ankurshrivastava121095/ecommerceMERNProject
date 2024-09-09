/* eslint-disable no-unused-vars */
import { IconButton, TextField, Tooltip, styled } from '@mui/material'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CategoryIcon from '@mui/icons-material/Category';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import Badge from '@mui/material/Badge';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode"
import { resetAuthState } from '../../Features/Auth/AuthSlice';
import { useDispatch } from 'react-redux';


const AdminNavbar = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogout = () => {
        Cookies.remove('ecomProjectLoggedInUserToken')
        Cookies.remove('ecomProjectLoggedInUser')
        // window.location.reload()
        dispatch(resetAuthState())
        navigate('/login')
    }

    const StyledBadge = styled(Badge)(({ theme }) => ({
        '& .MuiBadge-badge': {
          right: -3,
          top: 13,
          border: `2px solid ${theme.palette.background.paper}`,
          padding: '0 4px',
          backgroundColor: '#22696b'
        },
    }));

    return (
        <>
            <nav className="navbar navbar-expand-lg fixed-top bg-body-tertiary">
                <div className="container">
                    <Link className="navbar-brand" to="/"><img src="/logoFinal2.png" style={{ height: '40px' }} alt="/logoFinal2.png" /></Link>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link" aria-current="page" to="/ecom-project/dashboard">
                                    <Tooltip title="Home">
                                        <IconButton>
                                            {/* <HomeIcon /> */}
                                            <small className='text-primary fw-bold' style={{ fontSize: '16px' }}>Home</small>
                                        </IconButton>
                                    </Tooltip>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" aria-current="page" to="/ecom-project/users">
                                    <Tooltip title="Users">
                                        <IconButton>
                                            {/* <CategoryIcon /> */}
                                            <small className='text-primary fw-bold' style={{ fontSize: '16px' }}>Users</small>
                                        </IconButton>
                                    </Tooltip>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" aria-current="page" to="/ecom-project/categories">
                                    <Tooltip title="Categories">
                                        <IconButton>
                                            {/* <CategoryIcon /> */}
                                            <small className='text-primary fw-bold' style={{ fontSize: '16px' }}>Categories</small>
                                        </IconButton>
                                    </Tooltip>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" aria-current="page" to="/ecom-project/sub-categories">
                                    <Tooltip title="Sub Categories">
                                        <IconButton>
                                            {/* <CategoryIcon /> */}
                                            <small className='text-primary fw-bold' style={{ fontSize: '16px' }}>Sub Categories</small>
                                        </IconButton>
                                    </Tooltip>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" aria-current="page" to="/ecom-project/products">
                                    <Tooltip title="Products">
                                        <IconButton>
                                            {/* <CategoryIcon /> */}
                                            <small className='text-primary fw-bold' style={{ fontSize: '16px' }}>Products</small>
                                        </IconButton>
                                    </Tooltip>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" aria-current="page" to="/ecom-project/orders">
                                    <Tooltip title="Orders">
                                        <IconButton>
                                            {/* <CategoryIcon /> */}
                                            <small className='text-primary fw-bold' style={{ fontSize: '16px' }}>Orders</small>
                                        </IconButton>
                                    </Tooltip>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" aria-current="page" to="/ecom-project/main-banner">
                                    <Tooltip title="Main Banner">
                                        <IconButton>
                                            <small className='text-primary fw-bold' style={{ fontSize: '16px' }}>Main Banner</small>
                                        </IconButton>
                                    </Tooltip>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" aria-current="page" to="/ecom-project/secondary-banner">
                                    <Tooltip title="Secondary Banner">
                                        <IconButton>
                                            <small className='text-primary fw-bold' style={{ fontSize: '16px' }}>Secondary Banner</small>
                                        </IconButton>
                                    </Tooltip>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" aria-current="page" to="/my-profile">
                                    <Tooltip title="Profile">
                                        <IconButton>
                                            <small className='text-primary fw-bold' style={{ fontSize: '16px' }}>Profile</small>
                                        </IconButton>
                                    </Tooltip>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Tooltip title="Logout" className='mt-2' onClick={handleLogout}>
                                    <IconButton>
                                        <small className='text-primary fw-bold' style={{ fontSize: '16px' }}>Logout</small>
                                    </IconButton>
                                </Tooltip>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default AdminNavbar