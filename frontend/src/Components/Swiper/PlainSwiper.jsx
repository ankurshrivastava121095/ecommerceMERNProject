/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay, FreeMode, Pagination } from 'swiper/modules';

export default function PlainSwiper({ productImageUrl, data }) {
    return (
        <>
            <Swiper 
                loop={true}
                autoplay={{
                    delay: 2000,
                    disableOnInteraction: true,
                }}
                modules={[Autoplay, FreeMode, Pagination]}
                className="mySwiper"
            >
                <SwiperSlide>
                    <img src={productImageUrl} alt={productImageUrl} />
                </SwiperSlide>
                {
                    data?.map((val,key)=>(
                        <SwiperSlide key={key}>
                            <img src={val?.featuredImageUrl} alt={val?.featuredImageUrl} />
                        </SwiperSlide>
                    ))
                }
            </Swiper>
        </>
    );
}
