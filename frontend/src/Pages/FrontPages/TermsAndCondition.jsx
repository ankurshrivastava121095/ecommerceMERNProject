/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import Navbar from '../../Components/Layout/Navbar'
import BottomNavigation from '../../Components/Layout/BottomNavigation';
import FullPageLoader from '../../Components/Loaders/FullPageLoader';

const TermsAndCondition = () => {

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
                        <h4 className='text-primary text-center'>Terms & Conditions</h4>
                        <div className='text-center'>
                            Welcome to Ecommerce Project. By accessing and using this website, you agree to be bound by the following terms and conditions:
                        </div>
                        <div className='text-primary fw-bold mt-3'>General Conditions:</div>
                        <ul>
                            <li>By placing an order with us, you agree to provide accurate and complete information.</li>
                            <li>We reserve the right to refuse service to anyone for any reason at any time.</li>
                        </ul>
                        <div className='text-primary fw-bold mt-3'>Product Information:</div>
                        <ul>
                            <li>All products listed on our website are subject to availability.</li>
                            <li>Prices for our products are subject to change without notice.</li>
                        </ul>
                        <div className='text-primary fw-bold mt-3'>Payment Terms:</div>
                        <ul>
                            <li>All payments must be made through our secure payment gateway, Razorpay.</li>
                        </ul>
                        <div className='text-primary fw-bold mt-3'>Limitation of Liability:</div>
                        <ul>
                            <li>We are not liable for any damages resulting from the use of our website or products.</li>
                        </ul>
                        <div className='text-primary fw-bold mt-3'>Changes to Terms:</div>
                        <ul>
                            <li>We reserve the right to update or modify these terms at any time.</li>
                        </ul>
                    </div>
                </div>
            </div>
            <BottomNavigation renderNavCart={renderNavCart} setRenderNavCart={setRenderNavCart} renderNavWishlist={renderNavWishlist} setRenderNavWishlist={setRenderNavWishlist} />
        </>
    )
}

export default TermsAndCondition