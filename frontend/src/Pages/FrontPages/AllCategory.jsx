/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import Navbar from '../../Components/Layout/Navbar'
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Link, useNavigate } from 'react-router-dom';
import BottomNavigation from '../../Components/Layout/BottomNavigation';
import PlainSwiper from '../../Components/Swiper/PlainSwiper';
import { Avatar, Button, IconButton } from '@mui/material';
import FullPageLoader from '../../Components/Loaders/FullPageLoader';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { getCategories, resetCategoryState } from '../../Features/Category/CategorySlice';
import CategorySwiper from '../../Components/Swiper/CategorySwiper';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

const AllCategories = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [fullPageLoading, setFullPageLoading] = useState(true)
    const [list, setList] = useState([])
    const [renderNavCart, setRenderNavCart] = useState(false)
    const [renderNavWishlist, setRenderNavWishlist] = useState(false)

    const { categories, responseStatus, responseMessage } = useSelector(state => state.categories)

    useEffect(() => {
        dispatch(getCategories());
    }, [dispatch]);

    useEffect(()=>{
        if(responseStatus == 'success' && responseMessage == 'Get All'){
            setList(categories?.data)
            setTimeout(() => {
                setFullPageLoading(false)
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
                dispatch(resetCategoryState())
            }, 1000);
        }
    },[categories, responseStatus, responseMessage])

    return (
        <>
            { fullPageLoading && <FullPageLoader /> }
            <Navbar renderNavCart={renderNavCart} setRenderNavCart={setRenderNavCart} renderNavWishlist={renderNavWishlist} setRenderNavWishlist={setRenderNavWishlist} />
            <div className="container mt-5">
                <div className='row my-5'>
                    <div className='mb-3 d-flex flex-wrap align-items-center justify-content-between gap-3'>
                        <h3 className='text-primary'><img src="/logoFinal2.png" style={{ height: '25px' }} alt="/logoFinal2.png" /> All Categories</h3>
                    </div>
                    <CategorySwiper data={list && list?.length > 0 ? list : []} />
                </div>
            </div>
            <BottomNavigation renderNavCart={renderNavCart} setRenderNavCart={setRenderNavCart} renderNavWishlist={renderNavWishlist} setRenderNavWishlist={setRenderNavWishlist} />
        </>
    )
}

export default AllCategories