/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode"
import { useNavigate } from 'react-router-dom';

const AdminAuth = () => {

    const navigate = useNavigate()

    useEffect(()=>{
        const token = Cookies.get('ecomProjectLoggedInUserToken')
        const userData = Cookies.get('ecomProjectLoggedInUser')

        if (!token || !userData) {
            navigate(-1)
        } else {
            const decodedData = jwtDecode(token)
            if (decodedData?.role != 'Admin') {
                navigate(-1)
            }
        }
    },[])

    return (
        <></>
    )
}

export default AdminAuth