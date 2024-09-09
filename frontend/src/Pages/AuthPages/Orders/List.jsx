/* eslint-disable no-redeclare */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import AdminNavbar from '../../../Components/Layout/AdminNavbar'
import AdminBottomNavigation from '../../../Components/Layout/AdminBottomNavigation'
import { Avatar, Button, ButtonGroup, IconButton, Switch, TextField, Tooltip } from '@mui/material'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import SearchIcon from '@mui/icons-material/Search';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import InfoIcon from '@mui/icons-material/Info';
import { useDispatch, useSelector } from 'react-redux'
import Swal from 'sweetalert2';
import FullPageLoader from '../../../Components/Loaders/FullPageLoader'
import { getProducts, resetProductState } from '../../../Features/Product/ProductSlice'
import AdminAuth from '../../../Components/Authentication/AdminAuth'
import { getAllUsersOrders, getOrders, resetOrderState } from '../../../Features/Order/OrderSlice'


const OrderList = () => {
    
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { pathname } = useLocation()

    const [fullPageLoading, setFullPageLoading] = useState(true)
    const [list, setList] = useState([])
    const [viewType, setViewType] = useState('All')
    const [currentPage, setCurrentPage] = useState(1)
    const [searchedRecord, setSearchedRecord] = useState('')

    const filterTabs = [ { tab: 'All' }, { tab: 'Pending' }, { tab: 'Cancelled' }, { tab: 'Shipped' }, { tab: 'Out for Delivery' }, { tab: 'Delivered' }, { tab: 'Refund Request' }, { tab: 'Proceed for Refund' }, { tab: 'Refund Completed' } ]

    const { orders, responseStatus, responseMessage } = useSelector(state => state.orders)

    const handleSearchFilter = () => {
        setFullPageLoading(true)
        localStorage.setItem(`${pathname}SearchFilter`, searchedRecord)
        localStorage.removeItem(pathname)
        localStorage.setItem(pathname, JSON.stringify({ page: 1 }))
        dispatch(getAllUsersOrders());
    }

    const searchByStatus = (status) => {
        setFullPageLoading(true)
        setViewType(status)
        if (status == 'All') {
            var statusToSend = ''
        } else {
            var statusToSend = status
        }
        localStorage.removeItem(`${pathname}SearchByStatus`)
        localStorage.setItem(`${pathname}SearchByStatus`, status)
        dispatch(getAllUsersOrders());
    }

    useEffect(()=>{
        setTimeout(() => {
            setFullPageLoading(false)
        }, 1000);
        window.scrollTo(0, 0)

        localStorage.removeItem(pathname)
        localStorage.removeItem(`${pathname}SearchFilter`)
        localStorage.removeItem(`${pathname}SearchByStatus`)
    },[])

    useEffect(() => {
        dispatch(getAllUsersOrders());
    }, [dispatch]);

    useEffect(()=>{
        if(responseStatus == 'success' && responseMessage == 'Get All'){
            setList(orders?.data)
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
                dispatch(resetOrderState())
                navigate('/ecom-project/orders')
            }, 1000);
        }
    },[orders, responseStatus, responseMessage])

    return (
        <>
            <AdminAuth />
            { fullPageLoading && <FullPageLoader /> }
            <AdminNavbar />
            <div className="container mt-5">
                <div className="row pt-5">
                    <div className="col-md-12">
                        <div className='d-flex align-items-center justify-content-between mb-3'>
                            <h6>ORDER LIST</h6>
                        </div>
                        <div className='bg-white p-3 custom-box-shadow'>
                            <div className='d-flex flex-wrap align-items-center gap-2 my-2'>
                                {
                                    filterTabs?.map((val,key)=>(
                                        <Button key={key} type='button' size='small' variant={viewType == val?.tab ? 'contained' : 'outlined'} className={`px-3 rounded-5 ${viewType == val?.tab ? 'bg-button-primary' : 'border-primary text-primary'}`} onClick={()=>searchByStatus(val?.tab)}>{val?.tab}</Button>
                                    ))
                                }
                            </div>
                            <TextField
                                type='search' 
                                id="outlined-basic" 
                                label="Search here" 
                                className='w-100 mb-3'
                                sx={{ maxWidth: '300px' }}
                                onChange={e => setSearchedRecord(e.target.value)}
                                value={searchedRecord}
                                size='small'
                                variant="standard"
                                InputProps={{
                                    endAdornment: (
                                        <SearchIcon sx={{ cursor: 'pointer' }} onClick={handleSearchFilter} />
                                    ),
                                }}
                            />
                            <div style={{ overflowX: 'auto' }}>
                                <table className='table table-bordered table-hover'>
                                    <thead>
                                        <th className='p-2 text-nowrap'>#</th>
                                        <th className='p-2 text-nowrap'></th>
                                        <th className='p-2 text-nowrap'>MANDATE ORDER ID</th>
                                        <th className='p-2 text-nowrap'>ORDER ID</th>
                                        <th className='p-2 text-nowrap'>PAYMENT ID</th>
                                        <th className='p-2 text-nowrap'>BILLING NAME</th>
                                        <th className='p-2 text-nowrap'>BILLING NUMBER</th>
                                        <th className='p-2 text-nowrap'>PRODUCT</th>
                                        <th className='p-2 text-nowrap'>PRICE</th>
                                        <th className='p-2 text-nowrap'>DISCOUNT</th>
                                        <th className='p-2 text-nowrap'>QTY</th>
                                        <th className='p-2 text-nowrap'>FREE DELIVERY</th>
                                        <th className='p-2 text-nowrap'>OPEN BOX DELIVERY</th>
                                        <th className='p-2 text-nowrap'>RETURN & REFUND</th>
                                        <th className='p-2 text-nowrap'>PAYMENT STATUS</th>
                                        <th className='p-2 text-nowrap'>PAYMENT MODE</th>
                                        <th className='p-2 text-nowrap'>ORDER STATUS</th>
                                        <th className='p-2 text-nowrap'>ACTION</th>
                                    </thead>
                                    <tbody>
                                        {
                                            Array?.isArray(list) && list?.map((val,key)=>(
                                                <tr key={key} className={viewType != 'All' ? val?.status == viewType ? '' : 'd-none' : ''}>
                                                    <td className='p-2 text-nowrap'>{key+1}.</td>
                                                    <td className='p-2 text-nowrap'>
                                                        <Link to={`/ecom-project/order-detail/${val?.orderUniqueId}`} className='text-decoration-none text-primary fw-bold'>
                                                            <Avatar
                                                                alt={val?.productImageUrl}
                                                                src={val?.productImageUrl}
                                                                sx={{ width: 50, height: 50 }}
                                                            />
                                                        </Link>
                                                    </td>
                                                    <td className='p-2 text-nowrap'>STUSAS{val?.mandateOrderId}</td>
                                                    <td className='p-2 text-nowrap'>{val?.orderId || '-'}</td>
                                                    <td className='p-2 text-nowrap'>{val?.paymentId || '-'}</td>
                                                    <td className='p-2 text-nowrap fw-bold text-primary' role='button' onClick={()=>navigate(`/ecom-project/order-detail/${val?.orderUniqueId}`)}>{val?.billingAddressName}</td>
                                                    <td className='p-2 text-nowrap fw-bold text-primary' role='button' onClick={()=>navigate(`/ecom-project/order-detail/${val?.orderUniqueId}`)}>{val?.billingAddressContactNumber}</td>
                                                    <td className='p-2 text-nowrap'><Link to={`/ecom-project/order-detail/${val?.orderUniqueId}`} className='text-decoration-none text-primary fw-bold'>{val?.productName}</Link></td>
                                                    <td className='p-2 text-nowrap'>{val?.price}/-</td>
                                                    <td className='p-2 text-nowrap'>{val?.discount}%</td>
                                                    <td className='p-2 text-nowrap'>{val?.quantitySelected}</td>
                                                    <td className='p-2 text-nowrap'><span className={`badge ${val?.freeDelivery == 1 ? 'bg-button-primary' : 'text-bg-secondary'} px-4 py-1`}>{val?.freeDelivery == 1 ? 'Yes' : 'No'}</span></td>
                                                    <td className='p-2 text-nowrap'><span className={`badge ${val?.openBoxDelivery == 1 ? 'bg-button-primary' : 'text-bg-secondary'} px-4 py-1`}>{val?.openBoxDelivery == 1 ? 'Yes' : 'No'}</span></td>
                                                    <td className='p-2 text-nowrap'><span className={`badge ${val?.returnAndRefund == 1 ? 'bg-button-primary' : 'text-bg-secondary'} px-4 py-1`}>{val?.returnAndRefund == 1 ? 'Yes' : 'No'}</span></td>
                                                    <td className='p-2 text-nowrap'>{val?.paymentStatus == 'Yet to Pay' && val?.status == 'Cancelled' ? <><span className='text-red fw-bold'>Not Paid</span></> : val?.paymentStatus == 'Paid' || val?.paymentStatus == 'Refund Completed' ? <><span className='text-success fw-bold'>{val?.paymentStatus}</span></> : <><span className='text-secondary fw-bold'>{val?.paymentStatus}</span></>}</td>
                                                    <td className='p-2 text-nowrap'>{val?.paymentMode}</td>
                                                    <td className='p-2 text-nowrap'><span className={`fw-bold text-${val?.status == 'Pending' || val?.status == 'Shipped' || val?.status == 'Out for Delivery' || val?.status == 'Proceed for Refund' ? 'secondary' : val?.status == 'Cancelled' || val?.status == 'Refund Request' ? 'red' : 'success'}`}>{val?.shipmentDate ? val?.status : val?.status == 'Cancelled' || val?.status == 'Pending' ? val?.status : `Cancelled, ${val?.status}`}</span></td>
                                                    <td className='p-2 text-nowrap'>
                                                        <Tooltip title="Detail" onClick={()=>setTimeout(() => {
                                                            navigate(`/ecom-project/order-detail/${val?.orderUniqueId}`)
                                                        }, 500)}>
                                                            <IconButton>
                                                                <InfoIcon fontSize='small' className='text-primary' />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <div className='d-flex justify-content-between'>
                                <div>&nbsp;</div>
                                <div>
                                    <ButtonGroup variant="outlined" className='mt-1' aria-label="Basic button group">
                                        <Button sx={{ width: '60px' }} className='border-primary text-primary' onClick={()=>{
                                            const isPathExist = localStorage.getItem(pathname)
                                            if (isPathExist) {
                                                localStorage.removeItem(pathname)
                                            }
                                            const newPage = currentPage - 1
                                            setCurrentPage(currentPage - 1)
                                            localStorage.setItem(pathname, JSON.stringify({ page: newPage }))
                                            setFullPageLoading(true)
                                            dispatch(getAllUsersOrders())
                                        }} disabled={ currentPage == 1 ? true : false }><ChevronLeftIcon /></Button>
                                        <Button sx={{ width: '60px' }} className='border-primary text-primary'>{currentPage}</Button>
                                        <Button sx={{ width: '60px' }} className='border-primary text-primary' onClick={()=>{
                                            const isPathExist = localStorage.getItem(pathname)
                                            if (isPathExist) {
                                                localStorage.removeItem(pathname)
                                            }
                                            const newPage = currentPage + 1
                                            setCurrentPage(currentPage + 1)
                                            localStorage.setItem(pathname, JSON.stringify({ page: newPage }))
                                            setFullPageLoading(true)
                                            dispatch(getAllUsersOrders())
                                        }} disabled={ orders?.totalRecords <= 12 * currentPage ? true : false }><ChevronRightIcon /></Button>
                                    </ButtonGroup>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AdminBottomNavigation />
        </>
    )
}

export default OrderList