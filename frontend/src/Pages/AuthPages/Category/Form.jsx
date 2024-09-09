/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import AdminNavbar from '../../../Components/Layout/AdminNavbar'
import AdminBottomNavigation from '../../../Components/Layout/AdminBottomNavigation'
import { Button, Checkbox, TextField } from '@mui/material'
import RichTextEditor from '../../../Components/InputComponents/RichTextEditor'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2';
import FullPageLoader from '../../../Components/Loaders/FullPageLoader'
import AdminAuth from '../../../Components/Authentication/AdminAuth'
import { createCategory, getCategory, resetCategoryState, updateCategory } from '../../../Features/Category/CategorySlice'

const CategoryForm = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { id: updateId } = useParams()

    const fields = {
        categoryImage: '',
        categoryName: '',
    }

    const [fullPageLoading, setFullPageLoading] = useState(true)
    const [data, setData] = useState(fields)
    const [isUpdating, setIsUpdating] = useState(false)
    const [oldCategoryImage, setOldCategoryImage] = useState('')

    const { categories, responseStatus, responseMessage } = useSelector(state => state.categories)

    const fetchCategory = (categoryId) => {
        setFullPageLoading(true)
        dispatch(getCategory(categoryId))
    }

    const handleInput = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        
        setFullPageLoading(true)

        const formdata = new FormData()
        if (isUpdating) {
            formdata.append('id', updateId)
        }
        if (isUpdating) {
            if (data?.categoryImage) {
                formdata.append('categoryImage', data?.categoryImage)
            }
        } else {
            formdata.append('categoryImage', data?.categoryImage)
        }
        formdata.append('categoryName', data?.categoryName)

        if (!isUpdating) {
            dispatch(createCategory(formdata))       
        } else {
            dispatch(updateCategory(formdata))       
        }
    }

    useEffect(()=>{
        setTimeout(() => {
            setFullPageLoading(false)
        }, 1000);
        window.scrollTo(0, 0)
    },[])

    useEffect(()=>{
        if (updateId) {
            setIsUpdating(true)
            fetchCategory(updateId)
        }
    },[updateId])

    useEffect(()=>{
        if(responseStatus == 'success' && (responseMessage == 'Category created successfully' || responseMessage == 'Category updated successfully')){
            setFullPageLoading(false)
            Swal.fire({
                icon: "success",
                title: "Congrats",
                text: responseMessage
            });
            setTimeout(() => {
                dispatch(resetCategoryState())
                navigate('/ecom-project/categories')
            }, 1000);
        }
        if(responseStatus == 'success' && responseMessage == 'Get Single'){
            setOldCategoryImage(categories?.data?.categoryImageUrl)
            setTimeout(() => {
                setData({
                    ...data,
                    categoryName: categories?.data?.categoryName,
                })
            }, 1000);
            setTimeout(() => {
                setFullPageLoading(false)
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
                dispatch(resetCategoryState())
                navigate('/ecom-project/categories')
            }, 1000);
        }
    },[categories, responseStatus, responseMessage])

    return (
        <>
            <AdminAuth />
            { fullPageLoading && <FullPageLoader /> }
            <AdminNavbar />
            <div className="container mt-5">
                <br /><br /><br /><br />
                <div className="custom-box-shadow p-3">
                    <h6>ADD CATEGORY</h6>
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6">
                                <TextField 
                                    id="outlined-basic" 
                                    label="Category Name" 
                                    className='w-100 mb-3'
                                    size='small'
                                    variant="outlined"
                                    name='categoryName'
                                    value={data?.categoryName}
                                    onChange={handleInput}
                                    required 
                                />
                            </div>
                            <div className="col-md-6"></div>
                            <div className="col-md-6">
                                <small className='fw-bold text-secondary'>Category Image<span className='text-red'>*</span></small> <span style={{ fontSize: '10px' }}>(Select one)</span>
                                <input 
                                    type="file"
                                    className='form-control'
                                    name='categoryImage'
                                    onChange={e=>{
                                        setData({
                                            ...data,
                                            categoryImage: e.target.files[0]
                                        })
                                    }} 
                                />
                                <small className='text-red'>Select File of maximum 10MB.</small>
                            </div>
                            <div className="col-md-6">
                                {
                                    isUpdating &&
                                    <img src={oldCategoryImage} style={{ maxHeight: '250px', maxWidth: '100%' }} alt={oldCategoryImage} />
                                }
                            </div>
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

export default CategoryForm