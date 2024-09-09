/* eslint-disable no-unused-vars */
import { Button, TextField } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <>
            <div className='w-100 bg-footer footer'>
                <div className="container">
                    <div className="row py-5">
                        <div className="col-md-5">
                            <img src="/logoFinal2.png" className='w-50' alt="/logoFinal2.png" />
                            <div style={{ fontWeight: 'bold', fontSize: '35px', color: '#22696b' }}>Ecommerce Project</div>
                            <br />
                            <div className='pe-5 mt-4'><small>Discover the joy of decorating with our diverse range of products and let your decor journey begin.</small></div>
                        </div>
                        <div className="col-md-4">
                            <h5>Our Services</h5>
                            <div className='pe-3'>
                                <ul>
                                    <li><Link to='/privacy-policy' className='text-dark text-decoration-none'>Privacy Policy <i className="fa-solid fa-turn-down fa-rotate-270 fa-xs"></i></Link></li>
                                    <li><Link to='/shipping-and-delivery' className='text-dark text-decoration-none'>Shipping & Delivery Policy <i className="fa-solid fa-turn-down fa-rotate-270 fa-xs"></i></Link></li>
                                    <li><Link to='/terms-and-condition' className='text-dark text-decoration-none'>Terms & Condition <i className="fa-solid fa-turn-down fa-rotate-270 fa-xs"></i></Link></li>
                                    <li><Link to='/return-and-refund-policy' className='text-dark text-decoration-none'>Return & Refund Policy <i className="fa-solid fa-turn-down fa-rotate-270 fa-xs"></i></Link></li>
                                    <li><Link to='/contact-us' className='text-dark text-decoration-none'>Contact Us <i className="fa-solid fa-turn-down fa-rotate-270 fa-xs"></i></Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <h5 className=''>Contact Us</h5>
                            <div className='pe-3'>
                                <ul>
                                    <li><i className="fa-solid fa-location-dot"></i> Rajiv Plaza, Jayandraganj, Lashkar, Gwalior, 474001, MP, India.</li>
                                    <li><i className="fa-solid fa-phone"></i> +91 9826243120</li>
                                    <li><i className="fa-solid fa-envelope"></i> ppatch75@gmail.com</li>
                                    <li><i className="fa-solid fa-envelope"></i> ecom@gmail.com</li>
                                </ul>
                            </div>
                            <h5 className='mt-4'>Customer Support Hours:</h5>
                            <div className='pe-3'>
                                <ul>
                                    <li><i className="fa-solid fa-location-dot"></i> Rajiv Plaza, Jayandraganj, Lashkar, Gwalior, 474001, MP, India.</li>
                                    <li>Monday to Friday: [9 AM - 6 PM]</li>
                                    <li>Saturday: [10 AM - 4 PM]</li>
                                    <li>Sunday: Closed</li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-md-12">
                            <hr />
                            <div style={{ fontSize: '12px' }}>&copy; All rights reserved, Ecommerce Project, {new Date().getFullYear()}</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Footer