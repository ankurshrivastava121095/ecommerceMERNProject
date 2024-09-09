/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import Navbar from '../../Components/Layout/Navbar'
import BottomNavigation from '../../Components/Layout/BottomNavigation';
import FullPageLoader from '../../Components/Loaders/FullPageLoader';

const MobileApplication = () => {

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
            <div className="container mt-5">
                <center>
                    <div className='text-primary mt-3 fs-4 fw-bold'>Welcome to Ecommerce Project</div>
                    <div className='mt-1 site-content'>
                        Your ultimate destination for exquisite art and unique decor pieces. Our collection is meticulously curated to inspire and transform your living spaces with creativity and elegance. We believe that every home should reflect the personality and taste of its owner, and our wide range of products is designed to do just that.

                        From stunning paintings and sculptures to innovative decor accessories, our offerings are a perfect blend of artistry and craftsmanship. Each piece in our collection is selected for its quality and uniqueness, ensuring that you find something truly special for your home.

                        Whether you are looking to add a touch of sophistication to your living room, bring warmth to your bedroom, or make a bold statement in your office, Ecommerce Project has something for every style and space. We are dedicated to helping you create an environment that not only looks beautiful but also feels like home.

                        Discover the joy of decorating with our diverse range of products and let your decor journey begin. Shop now and transform your space into a haven of beauty and inspiration.
                    </div>
                </center>
                <div className='row mt-5'>
                    <div className="col-md-12">
                        <h4 className='text-primary text-center'>Mobile Application</h4>
                        <div className='text-center'>
                            Welcome to Ecommerce Project. By accessing and using this website, you can use it as a Mobile Application alos:
                        </div>
                        <div className='text-primary fw-bold mt-3'>Steps to Install Mobile Application:</div>
                        <ul>
                            <li>
                                <span>Step 1: Open <a href="https://ecom.com/" target='_blank' className='text-primary'>ecom.com</a> in Google Chrome (in your Mobile/Tablet).</span>
                            </li>
                            <li>
                                <span>Step 2: Tap on the Morevert Icon on the Top right corner.</span><br />
                                <img src="/moreVertIcon.png" style={{ height: '100px' }} alt="/moreVertIcon.png" />
                            </li>
                            <li>
                                <span>Step 3: Tap on the menu "Add to Home Screen".</span>
                            </li>
                            <li>
                                <span>Step 4: Tap on "Install".</span>
                            </li>
                            <li>
                                <span>Step 5: Enjoy the Application.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <BottomNavigation renderNavCart={renderNavCart} setRenderNavCart={setRenderNavCart} renderNavWishlist={renderNavWishlist} setRenderNavWishlist={setRenderNavWishlist} />
        </>
    )
}

export default MobileApplication