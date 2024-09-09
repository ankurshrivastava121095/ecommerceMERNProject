/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import AdminNavbar from '../../../Components/Layout/AdminNavbar'
import AdminBottomNavigation from '../../../Components/Layout/AdminBottomNavigation'
import { Button } from '@mui/material'
import CategoryIcon from '@mui/icons-material/Category';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';
import AdminAuth from '../../../Components/Authentication/AdminAuth';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { getAllOrders, resetOrderState } from '../../../Features/Order/OrderSlice';
import FullPageLoader from '../../../Components/Loaders/FullPageLoader';
import dayjs from 'dayjs';

const DashboardIndex = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [fullPageLoading, setFullPageLoading] = useState(true)
    const [list, setList] = useState([])
    const [totalGrandTotal, setTotalGrandTotal] = useState(0);
    const [totalQuantitySelected, setTotalQuantitySelected] = useState(0);
    const [totalCancelledGrandTotal, setTotalCancelledGrandTotal] = useState(0);
    const [totalCancelledQuantitySelected, setTotalCancelledQuantitySelected] = useState(0);
    const [totalRefundCompletedGrandTotal, setTotalRefundCompletedGrandTotal] = useState(0);
    const [totalRefundCompletedQuantitySelected, setTotalRefundCompletedQuantitySelected] = useState(0);

    const { orders, responseStatus, responseMessage } = useSelector(state => state.orders)

    const calculateDeliveredTotals = (ordersList) => {
        // delivered
        const deliveredOrders = ordersList?.filter(order => order?.status === 'Delivered');
        const totals = deliveredOrders?.reduce(
            (acc, order) => {
                acc.grandTotalSum += parseFloat(order.grandTotal) || 0;
                acc.quantitySum += parseInt(order.quantitySelected) || 0;
                return acc;
            },
            { grandTotalSum: 0, quantitySum: 0 }
        );
        setTotalGrandTotal(totals.grandTotalSum);
        setTotalQuantitySelected(totals.quantitySum);

        // cancelled
        const cancelledOrders = ordersList?.filter(order => order?.status === 'Cancelled');
        const totalCancels = cancelledOrders?.reduce(
            (acc, order) => {
                acc.grandTotalSum += parseFloat(order.grandTotal) || 0;
                acc.quantitySum += parseInt(order.quantitySelected) || 0;
                return acc;
            },
            { grandTotalSum: 0, quantitySum: 0 }
        );
        setTotalCancelledGrandTotal(totalCancels.grandTotalSum);
        setTotalCancelledQuantitySelected(totalCancels.quantitySum);

        // refund completed
        const refundCompletedOrders = ordersList?.filter(order => order?.status === 'Refund Completed');
        const totalRefundCompleted = refundCompletedOrders?.reduce(
            (acc, order) => {
                acc.grandTotalSum += parseFloat(order.grandTotal) || 0;
                acc.quantitySum += parseInt(order.quantitySelected) || 0;
                return acc;
            },
            { grandTotalSum: 0, quantitySum: 0 }
        );
        setTotalRefundCompletedGrandTotal(totalRefundCompleted.grandTotalSum);
        setTotalRefundCompletedQuantitySelected(totalRefundCompleted.quantitySum);
    };

    useEffect(() => {
        dispatch(getAllOrders());
    }, [dispatch]);

    useEffect(()=>{
        if(responseStatus == 'success' && responseMessage == 'Get All'){
            setList(orders?.data)
            calculateDeliveredTotals(orders?.data);
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
            { fullPageLoading && <FullPageLoader /> }
            <AdminAuth />
            <AdminNavbar />
            <div className="container mt-5" style={{ minHeight: '50vh' }}>
                <div className="row pt-5">
                    <div className="col-md-3">
                        <Button type='button' className='mb-2 w-100 py-3 border-primary text-primary' variant="outlined" onClick={()=>navigate('/ecom-project/products')}>
                            <CategoryIcon />&nbsp;&nbsp;<span>Products</span>
                        </Button>
                    </div>
                    <div className="col-md-3">
                        <Button type='button' className='mb-2 w-100 py-3 border-primary text-primary' variant="outlined" onClick={()=>navigate('/ecom-project/orders')}>
                            <AddShoppingCartIcon />&nbsp;&nbsp;<span>New Orders</span>
                        </Button>
                    </div>
                    <div className="col-md-3">
                        <Button type='button' className='mb-2 w-100 py-3 border-primary text-primary' variant="outlined" onClick={()=>navigate('/ecom-project/orders')}>
                            <ProductionQuantityLimitsIcon />&nbsp;&nbsp;<span>Pending Orders</span>
                        </Button>
                    </div>
                    <div className="col-md-3">
                        <Button type='button' className='mb-2 w-100 py-3 border-primary text-primary' variant="outlined" onClick={()=>navigate('/ecom-project/orders')}>
                            <ShoppingCartIcon />&nbsp;&nbsp;<span>Completed Orders</span>
                        </Button>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-lg-4 col-md-12">
                        <Button type='button' className='mb-2 w-100 py-3 border-primary text-primary' variant="outlined">
                            <div>
                                <div className='d-flex flex-wrap align-items-end justify-content-center gap-4'>
                                    <div>
                                        <div style={{ fontSize: '25px' }}>{totalQuantitySelected}</div>
                                        <div style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>Total Products Sold</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '25px' }}>₹{totalGrandTotal?.toFixed(2)}</div>
                                        <div style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>Total Collection</div>
                                    </div>
                                </div><br />
                                <span className='fw-bold' style={{ fontSize: '18px' }}>Total Delivered Products</span>
                            </div>
                        </Button>
                    </div>
                    <div className="col-lg-4 col-md-12">
                        <Button type='button' className='mb-2 w-100 py-3 border-primary text-primary' variant="outlined">
                            <div>
                                <div className='d-flex flex-wrap align-items-end justify-content-center gap-4'>
                                    <div>
                                        <div style={{ fontSize: '25px' }}>{totalCancelledQuantitySelected}</div>
                                        <div style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>Total Products Cancelled</div>
                                    </div>
                                    <div>
                                        <div className='text-red' style={{ fontSize: '25px' }}>₹{totalCancelledGrandTotal?.toFixed(2)}</div>
                                        <div style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>Total Cancelled</div>
                                    </div>
                                </div><br />
                                <span className='fw-bold text-red' style={{ fontSize: '18px' }}>Total Cancelled Products</span>
                            </div>
                        </Button>
                    </div>
                    <div className="col-lg-4 col-md-12">
                        <Button type='button' className='mb-2 w-100 py-3 border-primary text-primary' variant="outlined">
                            <div>
                                <div className='d-flex flex-wrap align-items-end justify-content-center gap-4'>
                                    <div>
                                        <div style={{ fontSize: '25px' }}>{totalRefundCompletedQuantitySelected}</div>
                                        <div style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>Total Products Returned</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '25px' }}>₹{totalRefundCompletedGrandTotal?.toFixed(2)}</div>
                                        <div style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>Total Amount</div>
                                    </div>
                                </div><br />
                                <span className='fw-bold' style={{ fontSize: '18px' }}>Total Refunds Completed</span>
                            </div>
                        </Button>
                    </div>
                </div>
            </div>
            <AdminBottomNavigation />
        </>
    )
}

export default DashboardIndex