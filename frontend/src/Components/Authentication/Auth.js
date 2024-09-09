/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode"
import { useNavigate } from 'react-router-dom';

const Auth = () => {

    const navigate = useNavigate()

    useEffect(()=>{
        const token = Cookies.get('ecomProjectLoggedInUserToken')
        const userData = Cookies.get('ecomProjectLoggedInUser')

        if (!token || !userData) {
            navigate('/login')
        }
    },[])

    return (
        <></>
    )
}

export default Auth