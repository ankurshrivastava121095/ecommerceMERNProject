/* eslint-disable no-unused-vars */
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import { Autoplay, FreeMode, Pagination } from 'swiper/modules';

const FreeModeSwiper = ({ data }) => {

    return (
        <>
            <Swiper
                slidesPerView={1.75}
                loop={true}
                spaceBetween={30}
                freeMode={true}
                autoplay={{
                    delay: 1000,
                    disableOnInteraction: true,
                }}
                // pagination={{
                //     clickable: true,
                // }}
                // modules={[Autoplay, FreeMode, Pagination]}
                modules={[FreeMode, Pagination]}
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
                      slidesPerView: 2,
                    },
                }}
                className="mySwiper"
            >
                {
                    Array?.isArray(data) && data?.length > 0 && data?.map((val,key)=>(
                        <SwiperSlide key={key}>
                            <img src={val?.secondaryBannerImageUrl} className='rounded' alt={val?.secondaryBannerImageUrl} />
                        </SwiperSlide>
                    ))
                }
            </Swiper>
        </>
    )
}

export default FreeModeSwiper