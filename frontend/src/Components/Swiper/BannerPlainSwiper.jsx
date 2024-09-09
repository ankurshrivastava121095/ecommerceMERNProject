/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay, FreeMode, Pagination } from 'swiper/modules';

export default function BannerPlainSwiper({ data }) {
    return (
        <>
            <Swiper 
                loop={true}
                autoplay={{
                    delay: 4000,
                    disableOnInteraction: true,
                }}
                modules={[Autoplay, FreeMode, Pagination]}
                className="mySwiper"
            >
                {
                    Array?.isArray(data) && data?.length > 0 && data?.map((val,key)=>(
                        <SwiperSlide key={key}>
                            <img src={val?.mainBannerImageUrl} alt={val?.mainBannerImageUrl} />
                        </SwiperSlide>
                    ))
                }
            </Swiper>
        </>
    );
}