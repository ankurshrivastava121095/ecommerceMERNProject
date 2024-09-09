/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import Navbar from '../../../Components/Layout/Navbar'
import FreeModeSwiper from '../../../Components/Swiper/FreeModeSwiper'
import ProductSwiper from '../../../Components/Swiper/ProductSwiper'
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Link, useNavigate, useParams } from 'react-router-dom';
import BottomNavigation from '../../../Components/Layout/BottomNavigation';
import PlainSwiper from '../../../Components/Swiper/PlainSwiper';
import { Button, ButtonBase } from '@mui/material';
import FullPageLoader from '../../../Components/Loaders/FullPageLoader';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode"
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { getOrders, getUserAllOrders, resetOrderState } from '../../../Features/Order/OrderSlice';

const UserAllOrders = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { id: userId } = useParams()

    const [fullPageLoading, setFullPageLoading] = useState(true)
    const [renderNavCart, setRenderNavCart] = useState(false)
    const [renderNavWishlist, setRenderNavWishlist] = useState(false)
    const [list, setList] = useState([])

    const { orders, responseStatus: ordersResponseStatus, responseMessage: ordersResponseMessage } = useSelector(state => state.orders)

    const fetchOrders = () => {
        dispatch(getUserAllOrders(userId))
    }

    useEffect(()=>{
        const user = Cookies.get('ecomProjectLoggedInUser')
        const token = Cookies.get('ecomProjectLoggedInUserToken')
        
        if (!user || !token) {
            navigate('/login')
        } else {
            if (userId) {
                fetchOrders()
            }
        }

        setTimeout(() => {
            setFullPageLoading(false)
        }, 1000);
    },[])

    useEffect(()=>{
        if(ordersResponseStatus == 'success' && ordersResponseMessage == 'Get All'){
            setList(orders?.data)
            setTimeout(() => {
                setFullPageLoading(false)
            }, 500)
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
                <div className='row mt-3'>
                    <h3 className='text-primary text-center mb-3'><img src="/logoFinal2.png" style={{ height: '25px' }} alt="/logoFinal2.png" /> My Orders</h3>
                    <div className="col-md-12 mt-3 px-0">
                        {
                            Array?.isArray(list) && list?.length > 0 ?
                            Array?.isArray(list) && list?.map((val,key)=>(
                                <ButtonBase key={key} className={`w-100 text-start ${key == list.length - 1 ? '' : 'border-bottom border-secondary-subtle'} px-3 py-2`} onClick={()=>{
                                    setTimeout(() => {
                                        navigate(`/ecom-project/order-detail/${val?.orderUniqueId}`)
                                    }, 500)
                                }}>
                                    <div className='w-100 d-flex justify-content-between'>
                                        <div>
                                            <div className='text-primary fw-bold'>{val?.productName}</div>
                                            <div>₹{val?.price}</div>
                                            <div className={`fw-bold text-${val?.status == 'Delivered' || val?.status == 'Refund Completed' ? 'success' : 'red'}`}>Status: {val?.status}</div>
                                        </div>
                                        <img src={val?.productImageUrl} style={{ height: '70px' }} alt={val?.productImageUrl} />
                                    </div>
                                </ButtonBase>
                            ))
                            :
                            <><center><h6>No Product Found</h6></center></>
                        }
                    </div>
                </div>
            </div>
            <BottomNavigation renderNavCart={renderNavCart} setRenderNavCart={setRenderNavCart} renderNavWishlist={renderNavWishlist} setRenderNavWishlist={setRenderNavWishlist} />
        </>
    )
}

export default UserAllOrders