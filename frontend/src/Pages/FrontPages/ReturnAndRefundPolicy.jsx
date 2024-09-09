/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import Navbar from '../../Components/Layout/Navbar'
import BottomNavigation from '../../Components/Layout/BottomNavigation';
import FullPageLoader from '../../Components/Loaders/FullPageLoader';

const ReturnAndRefundPolicy = () => {

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
                        <h4 className='text-primary text-center'>Return & Refund Policy</h4>
                        <div className='text-center'>
                            At Ecommerce Project, we want you to be completely satisfied with your purchase. Please read our return and refund policy below:
                        </div>
                        <div className='text-primary fw-bold mt-3'>Return Timeline:</div>
                        <ul>
                            <li><span className='fw-bold'>Minimum Time:</span> Returns must be initiated within 7 days of receiving the product.</li>
                            <li><span className='fw-bold'>Maximum Time:</span> Returns must be completed within 14-15 days from the date of delivery</li>
                        </ul>
                        <div className='text-primary fw-bold mt-3'>Return Conditions:</div>
                        <ul>
                            <li>Products must be unused, in their original packaging, and with all tags intact.</li>
                            <li>Certain items are non-returnable, including customized products, perishable goods, etc.</li>
                        </ul>
                        <div className='text-primary fw-bold mt-3'>Refund Process:</div>
                        <ul>
                            <li>Once your return is received and inspected, we will notify you of the approval or rejection of your refund.</li>
                            <li>Approved refunds will be processed within 1-2 days and will be applied to your original method of payment.</li>
                        </ul>
                        <div className='text-primary fw-bold mt-3'>Return Shipping:</div>
                        <ul>
                            <li>The cost of return shipping will be the customer’s responsibility unless the return is due to a defect or error on our part.</li>
                        </ul>
                    </div>
                </div>
            </div>
            <BottomNavigation renderNavCart={renderNavCart} setRenderNavCart={setRenderNavCart} renderNavWishlist={renderNavWishlist} setRenderNavWishlist={setRenderNavWishlist} />
        </>
    )
}

export default ReturnAndRefundPolicy