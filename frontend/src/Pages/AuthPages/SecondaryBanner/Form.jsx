/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import AdminNavbar from '../../../Components/Layout/AdminNavbar'
import AdminBottomNavigation from '../../../Components/Layout/AdminBottomNavigation'
import { Button } from '@mui/material'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2';
import FullPageLoader from '../../../Components/Loaders/FullPageLoader'
import AdminAuth from '../../../Components/Authentication/AdminAuth'
import { createSecondaryBanner, resetSecondaryBannerState } from '../../../Features/SecondaryBanner/SecondaryBannerSlice'

const SecondaryBannerForm = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const fields = {
        secondaryBannerImages: [],
    }

    const [fullPageLoading, setFullPageLoading] = useState(true)
    const [data, setData] = useState(fields)

    const { secondaryBanners, responseStatus, responseMessage } = useSelector(state => state.secondaryBanners)

    const handleSecondaryBannerImages = (e) => {
        setData({
            ...data,
            secondaryBannerImages: [...e.target.files]
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        
        setFullPageLoading(true)

        const formdata = new FormData()
        data?.secondaryBannerImages.forEach((file, index) => {
            formdata.append('secondaryBannerImages', file);
        });

        dispatch(createSecondaryBanner(formdata))
    }

    useEffect(()=>{
        setTimeout(() => {
            setFullPageLoading(false)
        }, 1000);
        window.scrollTo(0, 0)
    },[])

    useEffect(()=>{
        if(responseStatus == 'success' && (responseMessage == 'Secondary Banner created successfully')){
            setFullPageLoading(false)
            Swal.fire({
                icon: "success",
                title: "Congrats",
                text: responseMessage
            });
            setTimeout(() => {
                dispatch(resetSecondaryBannerState())
                navigate('/ecom-project/secondary-banner')
            }, 1000);
        }
        if(responseStatus == 'rejected' && responseMessage != '' && responseMessage != null){
            setFullPageLoading(false)
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: responseMessage
            });
            setTimeout(() => {
                dispatch(resetSecondaryBannerState())
                navigate('/ecom-project/secondary-banner')
            }, 1000);
        }
    },[secondaryBanners, responseStatus, responseMessage])

    return (
        <>
            <AdminAuth />
            { fullPageLoading && <FullPageLoader /> }
            <AdminNavbar />
            <div className="container mt-5">
                <br /><br /><br /><br />
                <div className="custom-box-shadow p-3">
                    <h6>ADD SECONDARY BANNER IMAGES</h6>
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <small className='text-red'><i className="fa-solid fa-triangle-exclamation"></i> Select each File of maximum 10MB and each file must have size ratio 996 pixel horizontally and 397 pixel vertically.</small>
                            <div className="col-md-4 mb-3 mt-2">
                                <div className="row">
                                    <div className="col-md-12">
                                        <small className='fw-bold text-secondary'>Secondary Banner Images<span className='text-red'>*</span></small> <span style={{ fontSize: '10px' }}>(Select multiple)</span>
                                        <input 
                                            type="file"
                                            className='form-control' 
                                            onChange={handleSecondaryBannerImages} 
                                            multiple
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-8"></div>
                            <div className="col-md-12 mt-3">
                                <Button type='submit' variant="contained" className='px-4 bg-button-primary' size='small'><SaveOutlinedIcon fontSize='small' />&nbsp;&nbsp;SAVE</Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <AdminBottomNavigation />
        </>
    )
}

export default SecondaryBannerForm