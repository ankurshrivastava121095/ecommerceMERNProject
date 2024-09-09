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
import { createProduct, getProduct, resetProductState, updateProduct } from '../../../Features/Product/ProductSlice'
import AdminAuth from '../../../Components/Authentication/AdminAuth'
import { getCategories, resetCategoryState } from '../../../Features/Category/CategorySlice'
import { getSubCategoriesByCategory, resetSubCategoryState } from '../../../Features/SubCategory/SubCategorySlice'

const ProductForm = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { id: updateId } = useParams()

    const fields = {
        categoryId: '',
        subCategoryId: '',
        productImage: '',
        featuredImages: [],
        shortDescription: '',
        detailedDescription: '',
        deliveryPolicy: '',
        returnPolicy: '',
        productName: '',
        price: '',
        discount: '',
        availableQuantity: '',
        freeDelivery: 0,
        openBoxDelivery: 0,
        returnAndRefund: 0,
    }

    const [fullPageLoading, setFullPageLoading] = useState(true)
    const [data, setData] = useState(fields)
    const [categoryList, setCategoryList] = useState([])
    const [subCategoryList, setSubCategoryList] = useState([])
    const [isUpdating, setIsUpdating] = useState(false)
    const [shortDescription, setShortDescription] = useState('')
    const [detailedDescription, setDetailedDescription] = useState('')
    const [deliveryPolicy, setDeliveryPolicy] = useState('')
    const [returnPolicy, setReturnPolicy] = useState('')
    const [oldProductImage, setOldProductImage] = useState('')
    const [oldProductVideo, setOldProductVideo] = useState('')
    const [oldFeaturedImages, setOldFeaturedImages] = useState([])

    const { products, responseStatus, responseMessage } = useSelector(state => state.products)
    const { categories, responseStatus: categoryResponseStatus, responseMessage: categoryResponseMessage } = useSelector(state => state.categories)
    const { subCategories, responseStatus: subCategoryResponseStatus, responseMessage: subCategoryResponseMessage } = useSelector(state => state.subCategories)

    const fetchProduct = (productId) => {
        setFullPageLoading(true)
        dispatch(getProduct(productId))
    }

    const fetchCategories = () => {
        setFullPageLoading(true)
        dispatch(getCategories());
    }

    const fetchSubCategoriesByCategory = (categoryId) => {
        setFullPageLoading(true)
        dispatch(getSubCategoriesByCategory(categoryId));
    }

    const handleInput = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }

    const handleFeaturedImages = (e) => {
        setData({
            ...data,
            featuredImages: [...e.target.files]
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        
        setFullPageLoading(true)

        const formdata = new FormData()
        if (isUpdating) {
            formdata.append('id', updateId)
        }
        if (isUpdating) {
            if (data?.productImage) {
                formdata.append('productImage', data?.productImage)
            }
            if (data?.productVideo) {
                formdata.append('productVideo', data?.productVideo)
            }
            if (data?.featuredImages?.length > 0) {
                data?.featuredImages.forEach((file, index) => {
                    formdata.append('featuredImages', file);
                });
            }
        } else {
            formdata.append('productImage', data?.productImage)
            formdata.append('productVideo', data?.productVideo)
            data?.featuredImages.forEach((file, index) => {
                formdata.append('featuredImages', file);
            });
        }
        formdata.append('categoryId', data?.categoryId)
        formdata.append('subCategoryId', data?.subCategoryId)
        formdata.append('productName', data?.productName)
        formdata.append('shortDescription', !isUpdating ? data?.shortDescription : shortDescription)
        formdata.append('detailedDescription', !isUpdating ? data?.detailedDescription : detailedDescription)
        formdata.append('price', data?.price)
        formdata.append('discount', data?.discount)
        formdata.append('availableQuantity', data?.availableQuantity)
        formdata.append('freeDelivery', data?.freeDelivery)
        formdata.append('openBoxDelivery', data?.openBoxDelivery)
        formdata.append('returnAndRefund', data?.returnAndRefund)
        formdata.append('deliveryPolicy', !isUpdating ? data?.deliveryPolicy : deliveryPolicy)
        formdata.append('returnPolicy', !isUpdating ? data?.returnPolicy : returnPolicy)

        if (!isUpdating) {
            dispatch(createProduct(formdata))       
        } else {
            dispatch(updateProduct(formdata))       
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
        if (updateId && categories?.data?.length > 0) {
            setIsUpdating(true)
            fetchProduct(updateId)
        }
    },[updateId, categories])

    useEffect(()=>{
        if(responseStatus == 'success' && (responseMessage == 'Product created successfully' || responseMessage == 'Product updated successfully')){
            setFullPageLoading(false)
            Swal.fire({
                icon: "success",
                title: "Congrats",
                text: responseMessage
            });
            setTimeout(() => {
                dispatch(resetProductState())
                navigate('/ecom-project/products')
            }, 1000);
        }
        if(responseStatus == 'success' && responseMessage == 'Get Single'){
            setShortDescription(products?.data?.shortDescription)
            setDetailedDescription(products?.data?.detailedDescription)
            setDeliveryPolicy(products?.data?.deliveryPolicy)
            setReturnPolicy(products?.data?.returnPolicy)
            setOldProductImage(products?.data?.productImageUrl)
            setOldProductVideo(products?.data?.productVideoUrl)
            setOldFeaturedImages(products?.data?.featuredImages)
            setTimeout(() => {
                setData({
                    ...data,
                    categoryId: products?.data?.categoryId,
                    subCategoryId: products?.data?.subCategoryId,
                    productName: products?.data?.productName,
                    price: products?.data?.price,
                    discount: products?.data?.discount,
                    availableQuantity: products?.data?.availableQuantity,
                    freeDelivery: products?.data?.freeDelivery,
                    openBoxDelivery: products?.data?.openBoxDelivery,
                    returnAndRefund: products?.data?.returnAndRefund,
                })
            }, 1000);
            setTimeout(() => {
                fetchSubCategoriesByCategory(products?.data?.categoryId)
            }, 1000);
            // setTimeout(() => {
            //     setFullPageLoading(false)
            // }, 1000);
        }
        if(responseStatus == 'rejected' && responseMessage != '' && responseMessage != null){
            setFullPageLoading(false)
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: responseMessage
            });
            setTimeout(() => {
                dispatch(resetProductState())
                navigate('/ecom-project/products')
            }, 1000);
        }
    },[products, responseStatus, responseMessage])

    useEffect(()=>{
        if(categoryResponseStatus == 'success' && categoryResponseMessage == 'Get All'){
            setCategoryList(categories?.data)
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
            }, 1000);
        }
    },[categories, categoryResponseStatus, categoryResponseMessage])

    useEffect(()=>{
        if(subCategoryResponseStatus == 'success' && subCategoryResponseMessage == 'Get All'){
            setSubCategoryList(subCategories?.data)
            setTimeout(() => {
                setFullPageLoading(false)
            }, 1000);
        }
        if(subCategoryResponseStatus == 'rejected' && subCategoryResponseMessage != '' && subCategoryResponseMessage != null){
            setFullPageLoading(false)
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: subCategoryResponseMessage
            });
            setTimeout(() => {
                dispatch(resetSubCategoryState())
                navigate('/ecom-project/sub-categories')
            }, 1000);
        }
    },[subCategories, subCategoryResponseStatus, subCategoryResponseMessage])

    return (
        <>
            <AdminAuth />
            { fullPageLoading && <FullPageLoader /> }
            <AdminNavbar />
            <div className="container mt-5">
                <br /><br /><br /><br />
                <div className="custom-box-shadow p-3">
                    <h6>ADD PRODUCT</h6>
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-4">
                                <TextField 
                                    id="outlined-basic" 
                                    label="Product Name" 
                                    className='w-100 mb-3'
                                    size='small'
                                    variant="outlined"
                                    name='productName'
                                    value={data?.productName}
                                    onChange={handleInput}
                                    required 
                                />
                            </div>
                            <div className="col-md-4">
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
                                            setFullPageLoading(true)
                                            dispatch(getSubCategoriesByCategory(e.target.value))
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
                            <div className="col-md-4">
                                <FormControl fullWidth sx={{ mb: 3 }} size='small' disabled={subCategoryList?.length > 0 ? false : true}>
                                    <InputLabel id="demo-simple-select-label">Sub Category</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={data?.subCategoryId}
                                        label="Sub Category"
                                        onChange={e=>{
                                            setData({
                                                ...data,
                                                subCategoryId: e.target.value
                                            })
                                        }}
                                    >
                                        {
                                            Array?.isArray(subCategoryList) && subCategoryList?.map((val,key)=>(
                                                <MenuItem key={key} value={val?._id}>{val?.subCategoryName}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                            </div>
                            <div className="col-md-4">
                                <TextField 
                                    type='number'
                                    id="outlined-basic" 
                                    label="Price" 
                                    className='w-100 mb-3'
                                    size='small'
                                    variant="outlined" 
                                    name='price'
                                    value={data?.price}
                                    onChange={handleInput}
                                    required 
                                />
                            </div>
                            <div className="col-md-4">
                                <TextField 
                                    type='number'
                                    id="outlined-basic" 
                                    label="Discount in %" 
                                    className='w-100 mb-3'
                                    size='small'
                                    variant="outlined" 
                                    name='discount'
                                    value={data?.discount}
                                    onChange={handleInput}
                                />
                            </div>
                            <div className="col-md-4">
                                <TextField 
                                    type='number'
                                    id="outlined-basic" 
                                    label="Available Qty" 
                                    className='w-100 mb-3'
                                    size='small'
                                    variant="outlined" 
                                    name='availableQuantity'
                                    value={data?.availableQuantity}
                                    onChange={handleInput}
                                    required 
                                />
                            </div>
                            <div className="col-md-6">
                                <small className='fw-bold text-secondary'>Short Description<span className='text-red'>*</span></small>
                                <RichTextEditor
                                    data={isUpdating ? shortDescription : data?.shortDescription} 
                                    onChange={(e)=>{
                                        setData({
                                            ...data,
                                            shortDescription: e
                                        })
                                        if (isUpdating) {
                                            setShortDescription(e)
                                        }
                                    }} 
                                />
                            </div>
                            <div className="col-md-6">
                                <small className='fw-bold text-secondary'>Detailed Description<span className='text-red'>*</span></small>
                                <RichTextEditor 
                                    data={isUpdating ? detailedDescription : data?.detailedDescription} 
                                    onChange={(e)=>{
                                        setData({
                                            ...data,
                                            detailedDescription: e
                                        })
                                        if (isUpdating) {
                                            setDetailedDescription(e)
                                        }
                                    }} 
                                />
                            </div>
                            <div className="col-md-3 my-3">
                                <small className='fw-bold text-secondary'>Product Image<span className='text-red'>*</span></small> <span style={{ fontSize: '10px' }}>(Select one)</span>
                                <input 
                                    type="file"
                                    className='form-control'
                                    name='productImage'
                                    onChange={e=>{
                                        setData({
                                            ...data,
                                            productImage: e.target.files[0]
                                        })
                                    }} 
                                />
                                <small className='text-red'>Select File of maximum 10MB and keep each file size ratio 1028 pixel horizontally and 110 pixel vertically for the better user experience.</small>
                                {
                                    isUpdating &&
                                    <img src={oldProductImage} className='w-100' alt={oldProductImage} />
                                }
                            </div>
                            <div className="col-md-9 my-3">
                                <div className="row">
                                    <div className="col-md-4">
                                        <small className='fw-bold text-secondary'>Featured Images<span className='text-red'>*</span></small> <span style={{ fontSize: '10px' }}>(Select multiple)</span>
                                        <input 
                                            type="file"
                                            className='form-control' 
                                            onChange={handleFeaturedImages} 
                                            multiple
                                        />
                                        <small className='text-red'>Select each File of maximum 10MB and keep each file size ratio 1028 pixel horizontally and 110 pixel vertically for the better user experience.</small>
                                    </div>
                                    <div className="col-md-8"></div>
                                </div>
                                <div className="row">
                                    {
                                        isUpdating && oldFeaturedImages?.length > 0 ?
                                            Array?.isArray(oldFeaturedImages) && oldFeaturedImages?.map((val,key)=>(
                                                <div key={key} className="col-md-3 mt-3">
                                                    <img src={val?.featuredImagesUrl} className='w-100' alt={val?.featuredImagesUrl} />
                                                </div>
                                            ))
                                        : ''
                                    }
                                </div>
                            </div>
                            {/* for video */}
                            <div className="col-md-6 my-3">
                                <small className='fw-bold text-secondary'>Product Video<span className='text-red'>*</span></small> <span style={{ fontSize: '10px' }}>(Select one)</span>
                                <input 
                                    type="file"
                                    className='form-control form-control-sm'
                                    name='productVideo'
                                    accept="video/*"
                                    onChange={e=>{
                                        setData({
                                            ...data,
                                            productVideo: e.target.files[0]
                                        })
                                    }} 
                                />
                                <small className='text-red'>Select File of maximum 100MB.</small>
                                {
                                    isUpdating && oldProductVideo &&
                                    <video className='w-100' controls>
                                        <source src={oldProductVideo} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                }
                            </div>
                            <div className="col-md-6"></div>
                            <div className="col-md-12">
                                <div className='d-flex align-items-center gap-5'>
                                    <div className='d-flex align-items-center gap-1'>
                                        <Checkbox 
                                            name='freeDelivery'
                                            checked={ data?.freeDelivery == 1 ? true : false}
                                            onChange={(e)=>setData({
                                                ...data,
                                                freeDelivery: e.target.checked ? 1 : 0
                                            })} 
                                        /> <span>Free Delivery</span>
                                    </div>
                                    <div className='d-flex align-items-center gap-1'>
                                        <Checkbox 
                                            name='openBoxDelivery' 
                                            checked={ data?.openBoxDelivery == 1 ? true : false}
                                            onChange={(e)=>setData({
                                                ...data,
                                                openBoxDelivery: e.target.checked ? 1 : 0
                                            })} 
                                        /> <span>Open Box Delivery</span>
                                    </div>
                                    <div className='d-flex align-items-center gap-1'>
                                        <Checkbox 
                                            name='returnAndRefund' 
                                            checked={ data?.returnAndRefund == 1 ? true : false}
                                            onChange={(e)=>setData({
                                                ...data,
                                                returnAndRefund: e.target.checked ? 1 : 0
                                            })} 
                                        /> <span>Return & Refund</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 mt-2">
                                <small className='fw-bold text-secondary'>Delivery Policy<span className='text-red'>*</span></small>
                                <RichTextEditor 
                                    data={isUpdating ? deliveryPolicy : data?.deliveryPolicy} 
                                    onChange={(e)=>{
                                        setData({
                                            ...data,
                                            deliveryPolicy: e
                                        })
                                        if (isUpdating) {
                                            setDeliveryPolicy(e)
                                        }
                                    }} 
                                />
                            </div>
                            <div className="col-md-6 mt-2">
                                <small className='fw-bold text-secondary'>Return Policy<span className='text-red'>*</span></small>
                                <RichTextEditor 
                                    data={isUpdating ? returnPolicy : data?.returnPolicy}
                                    onChange={(e)=>{
                                        setData({
                                            ...data,
                                            returnPolicy: e
                                        })
                                        if (isUpdating) {
                                            setReturnPolicy(e)
                                        }
                                    }} 
                                />
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

export default ProductForm