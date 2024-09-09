/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import AdminNavbar from '../../../Components/Layout/AdminNavbar'
import AdminBottomNavigation from '../../../Components/Layout/AdminBottomNavigation'
import { Button, Checkbox, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import RichTextEditor from '../../../Components/InputComponents/RichTextEditor'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2';
import FullPageLoader from '../../../Components/Loaders/FullPageLoader'
import AdminAuth from '../../../Components/Authentication/AdminAuth'
import { createCategory, getCategories, getCategory, resetCategoryState, updateCategory } from '../../../Features/Category/CategorySlice'
import { createSubCategory, getSubCategory, resetSubCategoryState, updateSubCategory } from '../../../Features/SubCategory/SubCategorySlice'

const SubCategoryForm = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { id: updateId } = useParams()

    const fields = {
        subCategoryImage: '',
        subCategoryName: '',
        categoryId: '',
    }

    const [fullPageLoading, setFullPageLoading] = useState(true)
    const [data, setData] = useState(fields)
    const [categoryList, setCategoryList] = useState([])
    const [isUpdating, setIsUpdating] = useState(false)
    const [oldSubCategoryImage, setOldSubCategoryImage] = useState('')

    const { subCategories, responseStatus, responseMessage } = useSelector(state => state.subCategories)
    const { categories, responseStatus: categoryResponseStatus, responseMessage: categoryResponseMessage } = useSelector(state => state.categories)

    const fetchCategories = () => {
        setFullPageLoading(true)
        dispatch(getCategories())
    }

    const fetchSubCategory = (subCategoryId) => {
        setFullPageLoading(true)
        dispatch(getSubCategory(subCategoryId))
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
            if (data?.subCategoryImage) {
                formdata.append('subCategoryImage', data?.subCategoryImage)
            }
        } else {
            formdata.append('subCategoryImage', data?.subCategoryImage)
        }
        formdata.append('categoryId', data?.categoryId)
        formdata.append('subCategoryName', data?.subCategoryName)

        if (!isUpdating) {
            dispatch(createSubCategory(formdata))       
        } else {
            dispatch(updateSubCategory(formdata))       
        }
    }

    useEffect(()=>{
        setTimeout(() => {
            setFullPageLoading(false)
        }, 1000);
        window.scrollTo(0, 0)
        fetchCategories()
    },[])

    useEffect(()=>{
        if (updateId) {
            setIsUpdating(true)
            fetchSubCategory(updateId)
        }
    },[updateId])

    useEffect(()=>{
        if(responseStatus == 'success' && (responseMessage == 'Sub Category created successfully' || responseMessage == 'Sub Category updated successfully')){
            setFullPageLoading(false)
            Swal.fire({
                icon: "success",
                title: "Congrats",
                text: responseMessage
            });
            setTimeout(() => {
                dispatch(resetSubCategoryState())
                navigate('/ecom-project/sub-categories')
            }, 1000);
        }
        if(responseStatus == 'success' && responseMessage == 'Get Single'){
            setOldSubCategoryImage(subCategories?.data?.subCategoryImageUrl)
            setTimeout(() => {
                setData({
                    ...data,
                    subCategoryName: subCategories?.data?.subCategoryName,
                    categoryId: subCategories?.data?.categoryId,
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
                dispatch(resetSubCategoryState())
                navigate('/ecom-project/sub-categories')
            }, 1000);
        }
    },[subCategories, responseStatus, responseMessage])

    useEffect(()=>{
        if(categoryResponseStatus == 'success' && categoryResponseMessage == 'Get All'){
            setCategoryList(categories?.data)
            setTimeout(() => {
                setFullPageLoading(false)
            }, 1000);
        }
        if(categoryResponseStatus == 'rejected' && categoryResponseMessage != '' && categoryResponseMessage != null){
            setFullPageLoading(false)
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: categoryResponseMessage
            });
            setTimeout(() => {
                dispatch(resetCategoryState())
                navigate('/ecom-project/categories')
            }, 1000);
        }
    },[categories, categoryResponseStatus, categoryResponseMessage])

    return (
        <>
            <AdminAuth />
            { fullPageLoading && <FullPageLoader /> }
            <AdminNavbar />
            <div className="container mt-5">
                <br /><br /><br /><br />
                <div className="custom-box-shadow p-3">
                    <h6>ADD SUB CATEGORY</h6>
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6">
                                <TextField 
                                    id="outlined-basic" 
                                    label="Sub Category Name" 
                                    className='w-100 mb-3'
                                    size='small'
                                    variant="outlined"
                                    name='subCategoryName'
                                    value={data?.subCategoryName}
                                    onChange={handleInput}
                                    required 
                                />
                            </div>
                            <div className="col-md-6">
                                <FormControl fullWidth sx={{ mb: 3 }} size='small'>
                                    <InputLabel id="demo-simple-select-label">Category</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={data?.categoryId}
                                        label="Category"
                                        onChange={e=>{
                                            setData({
                                                ...data,
                                                categoryId: e.target.value
                                            })
                                        }}
                                    >
                                        {
                                            Array?.isArray(categoryList) && categoryList?.map((val,key)=>(
                                                <MenuItem key={key} value={val?._id}>{val?.categoryName}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                            </div>
                            <div className="col-md-6">
                                <small className='fw-bold text-secondary'>Sub Category Image<span className='text-red'>*</span></small> <span style={{ fontSize: '10px' }}>(Select one)</span>
                                <input 
                                    type="file"
                                    className='form-control'
                                    name='subCategoryImage'
                                    onChange={e=>{
                                        setData({
                                            ...data,
                                            subCategoryImage: e.target.files[0]
                                        })
                                    }} 
                                />
                                <small className='text-red'>Select File of maximum 10MB.</small>
                            </div>
                            <div className="col-md-6">
                                {
                                    isUpdating &&
                                    <img src={oldSubCategoryImage} style={{ maxHeight: '250px', maxWidth: '100%' }} alt={oldSubCategoryImage} />
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

export default SubCategoryForm