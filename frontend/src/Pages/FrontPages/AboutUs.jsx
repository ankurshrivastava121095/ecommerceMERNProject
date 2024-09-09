/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import Navbar from '../../Components/Layout/Navbar'
import BottomNavigation from '../../Components/Layout/BottomNavigation';
import FullPageLoader from '../../Components/Loaders/FullPageLoader';

const AboutUs = () => {

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
                        <h4 className='text-primary text-center'>About Us</h4>
                        <div className='text-center'>
                            At Ecommerce Project, we believe that art and craftsmanship are not just about creating beautiful objects but about telling a story, evoking emotions, and inspiring creativity. We are a unique platform dedicated to offering exquisite epoxy jewelry, handcrafted furniture, and a wide range of artistic creations that reflect the fusion of traditional craftsmanship with modern design.
                        </div>
                        <div className='text-primary fw-bold mt-3'>Our Story</div>
                        <div>Ecommerce Project was born out of a passion for art, design, and the desire to bring something truly unique into people's lives. Our journey began with a simple idea: to create a space where art meets functionality, where every piece tells a story, and where every customer can find something that resonates with their personal style.</div>
                        
                        <div className='text-primary fw-bold mt-3'>Our Products</div>
                        <div>Our collection features a diverse range of products, each crafted with meticulous attention to detail. Whether it's our stunning epoxy jewelry, with its vibrant colors and intricate designs, or our one-of-a-kind furniture pieces that blend contemporary aesthetics with timeless craftsmanship, each item in our store is a testament to the dedication and skill of our artisans.</div>
                        <ul>
                            <li><span className='fw-bold'>Epoxy Jewelry:</span> Our epoxy jewelry collection is a celebration of color, texture, and form. Each piece is handcrafted, ensuring that no two items are exactly alike. From elegant necklaces and earrings to bold statement pieces, our jewelry is designed to make you feel special and stand out from the crowd.</li>
                            <li><span className='fw-bold'>Furniture:</span> Our furniture range is more than just functional; it's art you can live with. We combine the beauty of epoxy resin with wood, metal, and other materials to create furniture that is not only visually stunning but also built to last. Whether you're looking for a centerpiece for your living room or a unique piece of décor, our furniture collection has something to offer.</li>
                            <li><span className='fw-bold'>And More:</span> Beyond jewelry and furniture, we also offer a variety of other artistic creations, including home décor items, accessories, and custom pieces. Every product at Ecommerce Project is crafted with the same commitment to quality and originality.</li>
                        </ul>
                        
                        <div className='text-primary fw-bold mt-3'>Our Mission</div>
                        <div>Our mission is simple: to bring art into everyday life. We strive to create products that inspire, delight, and enrich the lives of our customers. We believe in the power of creativity and craftsmanship to transform spaces, uplift spirits, and create lasting memories.</div>
                        
                        <div className='text-primary fw-bold mt-3'>Why Choose Us?</div>
                        <ul>
                            <li><span className='fw-bold'>Unique Designs:</span> Our products are handcrafted and designed to be truly unique. When you buy from Ecommerce Project, you're not just buying a product; you're investing in a piece of art.</li>
                            <li><span className='fw-bold'>Quality Craftsmanship:</span> We are committed to the highest standards of quality. Every piece is carefully crafted using the finest materials and techniques.</li>
                            <li><span className='fw-bold'>Customer Satisfaction:</span> We value our customers and are dedicated to providing an exceptional shopping experience. From browsing our collections to receiving your order, we aim to make every step of the process seamless and enjoyable.</li>
                        </ul>

                        <div className='text-primary fw-bold mt-3'>Join Our Journey</div>
                        <div>We invite you to explore our collections and discover the perfect pieces that resonate with your style and personality. At Ecommerce Project, we believe that every piece has a story to tell – and we can't wait to be a part of yours.</div>
                        <br />
                        <div>Thank you for choosing Ecommerce Project. We look forward to being a part of your artistic journey.</div>
                    </div>
                </div>
            </div>
            <BottomNavigation renderNavCart={renderNavCart} setRenderNavCart={setRenderNavCart} renderNavWishlist={renderNavWishlist} setRenderNavWishlist={setRenderNavWishlist} />
        </>
    )
}

export default AboutUs