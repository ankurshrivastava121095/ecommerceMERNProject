/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import Navbar from '../../Components/Layout/Navbar'
import BottomNavigation from '../../Components/Layout/BottomNavigation';
import FullPageLoader from '../../Components/Loaders/FullPageLoader';

const ShippingAndDelivery = () => {

    const [fullPageLoading, setFullPageLoading] = useState(true)
    const [renderNavCart, setRenderNavCart] = useState(false)
    const [renderNavWishlist, setRenderNavWishlist] = useState(false)

    useEffect(()=>{
        setTimeout(() => {
            setFullPageLoading(false)
        }, 1000);
        window.scrollTo(0, 0)
    },[])

    return (
        <>
            { fullPageLoading && <FullPageLoader /> }
            <Navbar renderNavCart={renderNavCart} setRenderNavCart={setRenderNavCart} renderNavWishlist={renderNavWishlist} setRenderNavWishlist={setRenderNavWishlist} />
            <div className="container">
                <div className='row mt-3'>
                    <div className="col-md-12">
                        <h4 className='text-primary text-center'>Shipping & Delivery</h4>
                        <div className='text-center'>
                            We strive to ensure that your products reach you in the best condition and as quickly as possible. Here are our shipping and delivery policies:
                        </div>
                        <div className='text-primary fw-bold mt-3'>Shipping Timeline:</div>
                        <ul>
                            <li><span className='fw-bold'>Minimum Delivery Time:</span> 7 days after the order is placed.</li>
                            <li><span className='fw-bold'>Maximum Delivery Time:</span> 14-15 days, depending on your location and availability of products.</li>
                        </ul>
                        <div className='text-primary fw-bold mt-3'>Shipping Charges:</div>
                        <ul>
                            <li>Shipping charges may vary based on the weight and destination of your order. These charges will be calculated at checkout.</li>
                        </ul>
                        <div className='text-primary fw-bold mt-3'>Delivery Process:</div>
                        <ul>
                            <li>Once your order is shipped, you will receive a tracking number via email to monitor your package.</li>
                        </ul>
                        <div className='text-primary fw-bold mt-3'>International Shipping:</div>
                        <ul>
                            <li>Currently, we do not offer international shipping.</li>
                        </ul>
                        <div className='text-primary fw-bold mt-3'>Delays:</div>
                        <ul>
                            <li>Please note that delays may occur due to unforeseen circumstances like weather conditions or courier service delays.</li>
                        </ul>
                    </div>
                </div>
            </div>
            <BottomNavigation renderNavCart={renderNavCart} setRenderNavCart={setRenderNavCart} renderNavWishlist={renderNavWishlist} setRenderNavWishlist={setRenderNavWishlist} />
        </>
    )
}

export default ShippingAndDelivery