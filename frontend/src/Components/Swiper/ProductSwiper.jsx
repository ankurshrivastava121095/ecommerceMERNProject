/* eslint-disable no-unused-vars */
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import { Autoplay, FreeMode, Pagination } from 'swiper/modules';

const ProductSwiper = () => {

    const images = [
        {url: '/product1.png'},
        {url: '/product2New.png'},
        {url: '/product3New.png'},
        {url: '/product4New.png'},
        {url: '/product5New.png'},
        {url: '/product6New.png'},
        {url: '/product7New.png'},
        {url: '/product8New.png'},
        {url: '/product9New.png'},
        {url: '/product10New.png'}
    ]

    return (
        <>
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
                      slidesPerView: 1,
                    },
                    480: {
                      slidesPerView: 1,
                    },
                    768: {
                      slidesPerView: 1,
                    },
                    1024: {
                      slidesPerView: 5,
                    },
                }}
                className="mySwiper"
            >
                {
                    images.map((val,key)=>(
                        <SwiperSlide key={key}>
                            <img src={val?.url} className='rounded p-4 dropShadow' alt={val?.url} />
                        </SwiperSlide>
                    ))
                }
            </Swiper>
        </>
    )
}

export default ProductSwiper