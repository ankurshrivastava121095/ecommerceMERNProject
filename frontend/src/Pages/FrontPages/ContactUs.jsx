/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import Navbar from '../../Components/Layout/Navbar'
import BottomNavigation from '../../Components/Layout/BottomNavigation';
import FullPageLoader from '../../Components/Loaders/FullPageLoader';

const ContactUs = () => {

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
                    <h4 className='text-primary text-center'>Contact Us</h4>
                    <div className='text-center mb-3'>
                        We are here to assist you with any questions or concerns. Please reach out to us through the following contact details:
                    </div>
                    <div className="col-md-1"></div>
                    <div className="col-md-5">
                        <div className='text-primary fw-bold mt-3'>Operational Address:</div>
                        <ul>
                            <li>Rajiv Plaza, Jayandraganj, Lashkar, Gwalior, 474001, MP, India.</li>
                        </ul>
                        <div className='text-primary fw-bold mt-3'>Phone Number:</div>
                        <ul>
                            <li>+91 9826243120</li>
                        </ul>
                        <div className='text-primary fw-bold mt-3'>Email Address:</div>
                        <ul>
                            <li>ppatch75@gmail.com</li>
                            <li>ecom@gmail.com</li>
                        </ul>
                        <div className='text-primary fw-bold mt-3'>Customer Support Hours:</div>
                        <ul>
                            <li>Monday to Friday: [9 AM - 6 PM]</li>
                            <li>Saturday: [10 AM - 4 PM]</li>
                            <li>Sunday: Closed</li>
                        </ul>
                    </div>
                    <div className="col-md-5">
                        <center>
                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3579.802756590408!2d78.16002757519874!3d26.203093877077205!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3976c51c5034a487%3A0x3bada0abbe472ad7!2sRajeev%20Plaza%2C%20Gwalior!5e0!3m2!1sen!2sin!4v1724740495904!5m2!1sen!2sin" width="300" height="250" style={{border: 0}} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                        </center>
                    </div>
                    <div className="col-md-1"></div>
                </div>
            </div>
            <BottomNavigation renderNavCart={renderNavCart} setRenderNavCart={setRenderNavCart} renderNavWishlist={renderNavWishlist} setRenderNavWishlist={setRenderNavWishlist} />
        </>
    )
}

export default ContactUs