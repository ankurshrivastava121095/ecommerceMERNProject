/* eslint-disable no-unused-vars */
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import { Autoplay, FreeMode, Pagination } from 'swiper/modules';
import { Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CategorySwiper = ({ data }) => {

    const navigate = useNavigate()

    return (
        <>
            <div className='px-3'>
                <Swiper
                    slidesPerView={1.75}
                    loop={true}
                    spaceBetween={30}
                    freeMode={true}
                    autoplay={{
                        delay: 2000,
                        disableOnInteraction: true,
                    }}
                    // pagination={{
                    //     clickable: true,
                    // }}
                    modules={[Autoplay, FreeMode, Pagination]}
                    breakpoints={{
                        320: {
                        slidesPerView: 1.5,
                        },
                        375: {
                        slidesPerView: 2.5,
                        },
                        480: {
                        slidesPerView: 3.5,
                        },
                        768: {
                        slidesPerView: 4.5,
                        },
                        1024: {
                        slidesPerView: 5.5,
                        },
                    }}
                    className="mySwiper"
                >
                    {
                        Array?.isArray(data) && data?.length > 0 && data.map((val,key)=>(
                            <SwiperSlide key={key}>
                                <div role='button' style={{ width: '130px' }} onClick={()=>navigate(`/category-product/${val?._id}`)}>
                                    <Avatar
                                        alt={val?.categoryImageUrl}
                                        src={val?.categoryImageUrl}
                                        sx={{ width: 130, height: 130, border: '2px solid #22696b', boxShadow: 5 }}
                                    />
                                    <div style={{ fontSize: '14px' }} className='mt-2'>{val?.categoryName}</div>
                                </div>
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
            </div>
        </>
    )
}

export default CategorySwiper