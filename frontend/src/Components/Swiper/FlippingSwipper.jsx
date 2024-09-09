/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-flip';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { EffectFlip, Pagination, Navigation, Autoplay, FreeMode } from 'swiper/modules';


export default function FlippingSwipper() {

    const images = [
        {url: '/slider1.png'},
        {url: '/slider2.png'},
        {url: '/slider3.png'},
        {url: '/slider4.png'},
        {url: '/slider5.png'},
        {url: '/slider6.png'},
    ]

    return (
        <>
            <Swiper
                effect={'flip'}
                slidesPerView={1}
                loop={true}
                freeMode={true}
                spaceBetween={30}
                grabCursor={true}
                pagination={true}
                navigation={true}
                modules={[EffectFlip, Pagination, Navigation, Autoplay, FreeMode,]}
                className="mySwiper"
                autoplay={{
                    delay: 1000,
                    disableOnInteraction: true,
                }}
            >
                {
                    images.map((val,key)=>(
                        <SwiperSlide key={key}>
                            <img src={val?.url} className='rounded' alt={val?.url} />
                        </SwiperSlide>
                    ))
                }
            </Swiper>
        </>
    );
}