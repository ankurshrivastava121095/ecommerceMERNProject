/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import Navbar from '../../Components/Layout/Navbar'
import BottomNavigation from '../../Components/Layout/BottomNavigation';
import FullPageLoader from '../../Components/Loaders/FullPageLoader';

const PrivacyPolicy = () => {

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
                        <h4 className='text-primary text-center'>Privacy Policy</h4>
                        <div className='text-center'>
                            At Ecommerce Project, we are committed to protecting your privacy. This Privacy Policy outlines how we collect, use, and protect your personal information.
                        </div>
                        <div className='text-primary fw-bold mt-3'>Information We Collect:</div>
                        <ul>
                            <li>Personal Information: Name, email address, phone number, billing and shipping address.</li>
                            <li>Payment Information: Payment details including credit/debit card numbers and other payment information.</li>
                            <li>Browsing Information: Information about your browsing behavior on our website, such as pages viewed and products added to the cart.</li>
                        </ul>
                        <div className='text-primary fw-bold mt-3'>How We Use Your Information:</div>
                        <ul>
                            <li>To process your orders and deliver the products.</li>
                            <li>To communicate with you regarding your order or any inquiries.</li>
                            <li>To improve our website and customer service.</li>
                        </ul>
                        <div className='text-primary fw-bold mt-3'>Protection of Your Information:</div>
                        <ul>
                            <li>We implement a variety of security measures to protect your personal information.</li>
                            <li>Payment details are processed through secure gateways and are not stored on our servers.</li>
                        </ul>
                        <div className='text-primary fw-bold mt-3'>Cookies:</div>
                        <ul>
                            <li>We use cookies to enhance your browsing experience and gather analytics data.</li>
                        </ul>
                        <div className='text-primary fw-bold mt-3'>Your Consent:</div>
                        <ul>
                            <li>By using our website, you consent to our Privacy Policy.</li>
                        </ul>
                        <div className='text-primary fw-bold mt-3'>Changes to Our Privacy Policy:</div>
                        <ul>
                            <li>Any changes will be updated on this page, and the modification date will be revised.</li>
                        </ul>
                        <div className='text-primary fw-bold mt-3'>Contact Us:</div>
                        <ul>
                            <li>If you have any questions, please contact us at ppatchint75@gmail.com/ecom@gmail.com</li>
                        </ul>
                    </div>
                </div>
            </div>
            <BottomNavigation renderNavCart={renderNavCart} setRenderNavCart={setRenderNavCart} renderNavWishlist={renderNavWishlist} setRenderNavWishlist={setRenderNavWishlist} />
        </>
    )
}

export default PrivacyPolicy