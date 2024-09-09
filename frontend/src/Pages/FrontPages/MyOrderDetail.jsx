/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import Navbar from '../../Components/Layout/Navbar';
import BottomNavigation from '../../Components/Layout/BottomNavigation';
import FullPageLoader from '../../Components/Loaders/FullPageLoader';
import Cookies from 'js-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import { Stepper, Step, StepLabel, Typography, Box, Rating, Button, TextField, Modal } from '@mui/material';
import { getOrder, orderCancel, orderRefundRequest, resetOrderState } from '../../Features/Order/OrderSlice';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import HelpIcon from '@mui/icons-material/Help';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';


const steps = ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
const cancelledSteps = ['Order Placed', 'Processing', 'Cancelled'];
const refundSteps = ['Delivered', 'Refund Request', 'Proceed for Refund', 'Refund Completed'];

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 300,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
}

const MyOrderDetail = () => {

    function loadScript(src) {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    }

    const navigate = useNavigate();
    const dispatch = useDispatch()
    const { id } = useParams()

    const [fullPageLoading, setFullPageLoading] = useState(true);
    const [data, setData] = useState()
    const [orderReturnData, setOrderReturnData] = useState({
        id,
        orderStatus: 'Refund Request',
        upiForRefund: '',
        bankAccountHolderNameForRefund: '',
        bankAccountNumberForRefund: '',
        bankAccountIfscForRefund: '',
        bankName: '',
        bankBranchName: '',
        bankFullAddress: '',
        bankCity: '',
        bankDistrict: '',
        refundAmount: ''
    })
    const [showOrderCancelConfirmModal, setShowOrderCancelConfirmModal] = useState(false)
    const [renderNavCart, setRenderNavCart] = useState(false);
    const [renderNavWishlist, setRenderNavWishlist] = useState(false);
    const [showBankDetailSection, setShowBankDetailSection] = useState(false)
    const [refundSelection, setRefundSelection] = useState('bank')
    const [canReturn, setCanReturn] = useState(false)
    const [bankFound, setBankFound] = useState(false)
    const [activeStep, setActiveStep] = useState(0);

    const { orders, responseStatus: ordersResponseStatus, responseMessage: ordersResponseMessage } = useSelector(state => state.orders)

    const calculateListPrice = (price, discount) => {
        const listPrice = (price * 100 / (100 - discount))?.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
        return listPrice;
    }

    const fetchOrder = (orderId) => {
        setFullPageLoading(true)
        dispatch(getOrder(orderId))
    }

    const formattedDate = (date) => {
        const formattedDate = new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        return formattedDate;
    }

    const handleRefundSelection = (refundType) => {
        setRefundSelection(refundType)
        if (refundType == 'bank') {
            setOrderReturnData({
                ...orderReturnData,
                upiForRefund: ''
            })
        } else {
            setOrderReturnData({
                ...orderReturnData,
                bankAccountHolderNameForRefund: '',
                bankAccountHolderNameForRefund: '',
                bankAccountNumberForRefund: '',
                bankAccountIfscForRefund: '',
                bankName: '',
                bankBranchName: '',
                bankFullAddress: '',
                bankCity: '',
                bankDistrict: '',
            })
        }
    }

    const handleOrderCancel = () => {
        const orderCancellationData = {
            orderStatus: 'Cancelled',
            id,
            mandateOrderId: '',
            updateAll: 0
        }
        setTimeout(() => {
            setShowOrderCancelConfirmModal(false)
            if (data?.paymentStatus != 'Paid') {
                setFullPageLoading(true)
                dispatch(orderCancel(orderCancellationData))
            } else {
                setShowBankDetailSection(true)
            }
        }, 500)
    }

    const handleSearchBank = () => {
        setTimeout(async () => {
            setFullPageLoading(true)
            try {
                const response = await axios.get(`https://ifsc.razorpay.com/${orderReturnData?.bankAccountIfscForRefund}`);
                setOrderReturnData({
                    ...orderReturnData,
                    bankName: response?.data?.BANK,
                    bankBranchName: response?.data?.BRANCH,
                    bankFullAddress: response?.data?.ADDRESS,
                    bankCity: response?.data?.CITY,
                    bankDistrict: response?.data?.DISTRICT,
                    refundAmount: data?.price * data?.quantitySelected
                })
                setBankFound(true)
                setFullPageLoading(false)
            } catch (err) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: 'Invalid IFSC code or data not found'
                });
                setFullPageLoading(false)
            }
        }, 500)
    }

    const handleOrderReturn = (e) => {
        e.preventDefault()

        setTimeout(() => {
            setFullPageLoading(true)
            dispatch(orderRefundRequest(orderReturnData))
        }, 500)
    }

    async function displayRazorpay() {
        setFullPageLoading(true)

        const res = await loadScript(
          'https://checkout.razorpay.com/v1/checkout.js'
        );
    
        if (!res) {
          alert('Razorpay SDK failed to load. Are you online?');
          return;
        }
    
        const result = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/payment/initiate`,{ amount: data?.grandTotal});
    
        if (!result) {
          alert('Server error. Are you online?');
          return;
        }

        setFullPageLoading(false)
    
        const { amount, id: order_id, currency } = result.data;
    
        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY_ID,
          amount: amount.toString(),
          currency: currency,
          name: 'Ecommerce Project',
          description: 'Test Transaction',
          image:  '/logoFinal.png',
          order_id: order_id,
          handler: async function (response) {
            const data = {
              orderCreationId: order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            };
    
            const result = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/payment/callback`, data);
            // const orderData 
            // dispatch(createOrder())
    
            alert(result.data.msg);
        },
          prefill: {
            name: data?.billingAddressName,
            email: data?.billingAddressEmail,
            contact: data?.billingAddressContactNumber,
          },
          notes: {
            address: 'CITY CENTER GWALIOR',
          },
          theme: {
            color: '#61dafb',
          },
        };
    
        const paymentObject = new window.Razorpay(options);
        // paymentObject.on("payment.failed", function (response) {
        //     alert(response.error.code);
        //     alert(response.error.description);
        //     alert(response.error.source);
        //     alert(response.error.step);
        //     alert(response.error.reason);
        //     alert(response.error.metadata.order_id);
        //     alert(response.error.metadata.payment_id);
        //   })
        paymentObject.open();
    }

    useEffect(() => {
        const user = Cookies.get('ecomProjectLoggedInUser');
        const token = Cookies.get('ecomProjectLoggedInUserToken');

        if (!user || !token) {
            navigate('/login');
        } else {
            if (id) {
                fetchOrder(id)
            }
        }

        setTimeout(() => {
            setFullPageLoading(false);
        }, 1000);
    }, []);

    useEffect(()=>{
        if (data?.status == 'Pending') {
            setActiveStep(1);
        }
        if (data?.status == 'Shipped') {
            setActiveStep(2);
        }
        if (data?.status == 'Out for Delivery') {
            setActiveStep(3);
        }
        if (data?.status == 'Delivered') {
            setActiveStep(4);
        }
        if (data?.status == 'Cancelled') {
            setActiveStep(2);
        }
        if (data?.status == 'Refund Request') {
            setActiveStep(1);
        }
        if (data?.status == 'Proceed for Refund') {
            setActiveStep(2);
        }
        if (data?.status == 'Refund Cancelled') {
            setActiveStep(2);
        }
        if (data?.status == 'Refund Completed') {
            setActiveStep(3);
        }
    },[data])

    useEffect(()=>{
        if(ordersResponseStatus == 'success' && ordersResponseMessage == 'Get Single'){
            setData(orders?.data)

            const currentDate = new Date();
            const deliveredDate = new Date(orders?.data?.deliveredDate);
            const timeDifference = Number(currentDate) - Number(deliveredDate);
            const dayDifference = timeDifference / (1000 * 3600 * 24);
            const shouldReturn = dayDifference <= 8
            
            if (shouldReturn) {
                setCanReturn(true)
            } else {
                setCanReturn(false)
            }
            
            setTimeout(() => {
                setFullPageLoading(false)
            }, 500)
        }
        if(ordersResponseStatus == 'success' && ordersResponseMessage == 'Order Status Updated Successfully'){
            Swal.fire({
                icon: "success",
                title: "Congrats",
                text: ordersResponseMessage
            });
            fetchOrder(id)
        }
        if(ordersResponseStatus == 'success' && ordersResponseMessage == 'Order Refund Request Sent Successfully'){
            setShowBankDetailSection(false)
            setOrderReturnData({
                ...orderReturnData,
                bankAccountHolderNameForRefund: '',
                bankAccountNumberForRefund: '',
                bankAccountIfscForRefund: '',
                bankName: '',
                bankBranchName: '',
                bankFullAddress: '',
                bankCity: '',
                bankDistrict: '',
            })
            navigate(-1)
            Swal.fire({
                icon: "success",
                title: "Congrats",
                text: ordersResponseMessage
            });
            fetchOrder(id)
        }
        if(ordersResponseStatus == 'success' && ordersResponseMessage == 'Order Cancelled Successfully'){
            Swal.fire({
                icon: "success",
                title: "Congrats",
                text: ordersResponseMessage
            });
            fetchOrder(id)
        }
        if(ordersResponseStatus == 'rejected' && ordersResponseMessage != '' && ordersResponseMessage != null){
            setFullPageLoading(false)
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: ordersResponseMessage
            });
            setTimeout(() => {
                dispatch(resetOrderState())
            }, 1000);
        }
    },[orders, ordersResponseStatus, ordersResponseMessage])

    return (
        <>
            {fullPageLoading && <FullPageLoader />}
            <Navbar renderNavCart={renderNavCart} setRenderNavCart={setRenderNavCart} renderNavWishlist={renderNavWishlist} setRenderNavWishlist={setRenderNavWishlist} />
            <div className="container mt-4">
                <center>
                    <div className='text-primary mt-3 fs-4 fw-bold'>Welcome to Ecommerce Project</div>
                    <div className='mt-1 site-content'>
                        Your ultimate destination for exquisite art and unique decor pieces. Our collection is meticulously curated to inspire and transform your living spaces with creativity and elegance. We believe that every home should reflect the personality and taste of its owner, and our wide range of products is designed to do just that.

                        From stunning paintings and sculptures to innovative decor accessories, our offerings are a perfect blend of artistry and craftsmanship. Each piece in our collection is selected for its quality and uniqueness, ensuring that you find something truly special for your home.

                        Whether you are looking to add a touch of sophistication to your living room, bring warmth to your bedroom, or make a bold statement in your office, Ecommerce Project has something for every style and space. We are dedicated to helping you create an environment that not only looks beautiful but also feels like home.

                        Discover the joy of decorating with our diverse range of products and let your decor journey begin. Shop now and transform your space into a haven of beauty and inspiration.
                    </div>
                </center>
                <div className='row mt-3'>
                    <h3 className='text-primary text-center mb-3'>
                        <img src="/logoFinal2.png" style={{ height: '25px' }} alt="/logoFinal2.png" /> Order Detail
                    </h3>
                    <div className="col-md-12 mt-3 px-0">
                        {
                            data?.status == 'Pending' || data?.status == 'Shipped' || data?.status == 'Out for Delivery' || data?.status == 'Delivered' ?
                            <Stepper activeStep={activeStep} alternativeLabel>
                                {steps.map((label, index) => (
                                    <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                            : ''
                        }
                        {
                            data?.status == 'Cancelled' ?
                            <Stepper activeStep={activeStep} alternativeLabel>
                                {cancelledSteps.map((label, index) => (
                                    <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                            : ''
                        }
                        {
                            data?.status == 'Refund Request' || data?.status == 'Proceed for Refund' || data?.status == 'Refund Completed' ?
                            <Stepper activeStep={activeStep} alternativeLabel>
                                {refundSteps.map((label, index) => (
                                    <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                            : ''
                        }
                        
                        <div className="p-4">
                            <div className="row">
                                <div className='mb-3'>
                                    <small className='text-secondary fw-bold'>SSID: <span>STUSAS{data?.mandateOrderId}</span></small>
                                    {data?.orderId && <small className='text-secondary fw-bold'>Order ID: <span>{data?.orderId}</span></small>}
                                </div>
                                <div className="col-md-9 mb-4">
                                    <h3 role='button' className='text-primary' onClick={()=>navigate(`/product-detail/${data?.productId}`)}>{data?.productName}</h3>
                                    <div className='fs-3'>₹{data?.price} <span className='fs-6 text-red fw-bold'>{data?.discount}% OFF</span></div>
                                    <div>Qty: {data?.quantitySelected}</div>
                                </div>
                                <div className="col-md-3">
                                    <img role='button' src={data?.productImageUrl} className='w-100' alt={data?.productImageUrl} onClick={()=>navigate(`/product-detail/${data?.productId}`)} />
                                    <div className="row mt-4">
                                        <center>
                                            <small className='text-secondary fw-bold'>Rate this Product</small><br />
                                            <Rating 
                                                name="simple-controlled" 
                                                value={null} 
                                                onChange={()=>navigate(`/product-detail/${data?.productId}`)}
                                            />
                                        </center>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-4">
                                <div className="col-md-4">
                                    <small className='text-secondary fw-bold'>Billing Address</small>
                                    <div className='mt-1 fs-5 d-flex flex-nowrap align-items-center'>{data?.billingAddressName}</div>
                                    <div className='d-flex flex-nowrap align-items-top'>{data?.billingAddressFullAddress}</div>
                                    <div className='d-flex flex-nowrap align-items-center'>{data?.billingAddressPincode}, {data?.billingAddressCity}, {data?.billingAddressState}, {data?.billingAddressCountry}</div>
                                    <div className='d-flex flex-nowrap align-items-center'>{data?.billingAddressEmail}</div>
                                    <div className='d-flex flex-nowrap align-items-center'>{data?.billingAddressContactNumber}{data?.billingAddressAlternateNumber != '' && data?.billingAddressAlternateNumber && ','} {data?.billingAddressAlternateNumber}</div>
                                </div>
                                <div className="col-md-8"></div>
                            </div>
                            <div className="row mt-4">
                                <div className="col-md-4">
                                    <table className='table table-bordered table-hover'>
                                        <tr>
                                            <th className='py-2 text-secondary'>List Price</th>
                                            <td className='py-2'>₹{calculateListPrice(data?.price, data?.discount)}</td>
                                        </tr>
                                        <tr>
                                            <th className='py-2 text-secondary'>Discount</th>
                                            <td className='py-2'>{data?.discount}%</td>
                                        </tr>
                                        <tr>
                                            <th className='py-2 text-secondary'>Selling Price</th>
                                            <th className='py-2'>₹{data?.price}</th>
                                        </tr>
                                        <tr>
                                            <th className='py-2'>Grand Total</th>
                                            <th className='py-2'>₹{data?.grandTotal}</th>
                                        </tr>
                                    </table>
                                    {
                                        data?.status == 'Cancelled' ?
                                        <>
                                            <div className='text-red fw-bold fs-4'>Order Cancelled</div>
                                            <div><span className='text-secondary fw-bold'>Payment Status:</span> <span className={`fw-bold ${data?.paymentStatus == 'Yet to Pay' ? 'text-red' : 'text-success'}`}>{data?.paymentStatus == 'Yet to Pay' ? 'Not Paid' : data?.paymentStatus}</span></div>
                                        </>
                                        :
                                        <div><span className='text-secondary fw-bold'>Payment Status:</span> <span className={`fw-bold ${data?.paymentStatus == 'Yet to Pay' ? 'text-red' : 'text-success'}`}>{data?.paymentStatus}</span></div>
                                    }
                                    <div>
                                        <div className='fs-4 text-secondary fw-bold mt-4'>Order Summary:</div>
                                        <div>Order Placed on: {formattedDate(data?.createdAt)}</div>
                                        { data?.shipmentDate && <div>Shipment Date: {formattedDate(data?.shipmentDate)}</div> }
                                        { data?.cancelledDate && <div className='text-red fw-bold'>Order Cancellation Date: {formattedDate(data?.cancelledDate)}</div> }
                                        { data?.outForDeliveryDate && <div>Out for Delivery Date: {formattedDate(data?.outForDeliveryDate)}</div> }
                                        { data?.deliveredDate && <div className='text-success fw-bold'>Delivered Date: {formattedDate(data?.deliveredDate)}</div> }
                                        {
                                            data?.shipmentDate ?
                                            <>
                                                { data?.refundRequestDate && <div className='text-red fw-bold'>Refund Request Date: {formattedDate(data?.refundRequestDate)}</div> }
                                                { data?.refundCancelDate && <div>Refund Cancel Date: {formattedDate(data?.refundCancelDate)}</div> }
                                                { data?.proceedForRefundDate && <div>Refund Proceed Date: {formattedDate(data?.proceedForRefundDate)}</div> }
                                                { data?.refundCompletedDate && <div className='text-success fw-bold'>Refund Completed Date: {formattedDate(data?.refundCompletedDate)}</div> }
                                            </>
                                            :
                                            <>
                                                { data?.refundRequestDate && <div className='text-red fw-bold'>Cancelled, Refund Request Date: {formattedDate(data?.refundRequestDate)}</div> }
                                                { data?.refundCancelDate && <div>Cancelled, Refund Cancel Date: {formattedDate(data?.refundCancelDate)}</div> }
                                                { data?.proceedForRefundDate && <div>Cancelled, Refund Proceed Date: {formattedDate(data?.proceedForRefundDate)}</div> }
                                                { data?.refundCompletedDate && <div className='text-success fw-bold'>Cancelled, Refund Completed Date: {formattedDate(data?.refundCompletedDate)}</div> }
                                            </>
                                        }
                                    </div>
                                    {
                                        data?.status == 'Refund Request' || data?.status == 'Procedd for Refund' || data?.status == 'Refund Completed' ?
                                        <>
                                            <div>
                                                <div className='fs-4 text-secondary fw-bold mt-4'>Order Return Summary:</div>
                                                { data?.upiForRefund && <div>UPI ID: {data?.upiForRefund}</div> }
                                                { data?.bankAccountHolderNameForRefund ?
                                                    <>
                                                        <div>Account Holder Name: {data?.bankAccountHolderNameForRefund}</div> 
                                                        <div>Account Number: {data?.bankAccountNumberForRefund}</div> 
                                                        <div>IFSC Code: {data?.bankAccountIfscForRefund}</div> 
                                                        <div>Bank Name: {data?.bankName}</div> 
                                                        <div>Bank Branch: {data?.bankBranchName}</div> 
                                                        <div>Bank Full Address: {data?.bankFullAddress}</div> 
                                                        <div>Bank City: {data?.bankCity}</div> 
                                                        <div>Bank District: {data?.bankDistrict}</div> 
                                                    </>
                                                    : ''
                                                }
                                                { data?.refundAmount && <div>Refund Amount: {data?.refundAmount}/-</div> }
                                                { data?.refundRequestDate && <div>Refund Request Date: {formattedDate(data?.refundRequestDate)}</div> }
                                                { data?.refundCancelDate && <div>Refund Cancel Date: {formattedDate(data?.refundCancelDate)}</div> }
                                                { data?.proceedForRefundDate && <div>Refund Proceed Date: {formattedDate(data?.proceedForRefundDate)}</div> }
                                                { data?.refundCompletedDate && <div className='text-success fw-bold'>Refund Completed Date: {formattedDate(data?.refundCompletedDate)}</div> }
                                            </div>
                                        </>
                                        : ''
                                        
                                    }
                                </div>
                                <div className="col-md-12">
                                    <div className="row">
                                        <div className="col-md-4">
                                            { (data?.status == 'Pending' || data?.status == 'Shipped') && data?.paymentStatus == 'Yet to Pay' ? <Button type='button' size='small' variant="contained" className='mt-3 rounded-5 w-100 bg-button-primary' onClick={displayRazorpay}>Pay Now ₹{data?.grandTotal}</Button> : ''}
                                        </div>
                                        <div className="col-md-4">
                                            { data?.status == 'Pending' && <Button type='button' size='small' variant="contained" className='mt-3 rounded-5 w-100' color='error' onClick={()=>setTimeout(() => {
                                                setShowOrderCancelConfirmModal(true)
                                            }, 500)}>Cancel Order</Button>}
                                        </div>
                                        <div className="col-md-2"></div>
                                        <div className="col-md-6">
                                            { data?.status == 'Delivered' && canReturn && data?.returnAndRefund == 1 && 
                                                <>
                                                    <div className='text-red fw-bold mt-4'>You can return order within <i className="fa-solid fa-truck-fast"></i> 7 days after the delivery date.</div>
                                                    <Button type='button' size='small' variant="contained" className='mt-1 rounded-5 w-100 bg-button-primary' onClick={()=>setShowBankDetailSection(true)}>Return Order&nbsp;&nbsp;<i className="fa-solid fa-rotate-left fa-flip-horizontal"></i></Button> 
                                                </>
                                            }
                                        </div>
                                        <div className="col-md-8"></div>
                                    </div>
                                    {
                                        showBankDetailSection &&
                                        <div className="row">
                                            <div className="col-md-8">
                                                <div className='d-flex flex-nowrap align-items-center mt-3'>
                                                    <Button type='button' size='small' variant={refundSelection == 'bank' ? 'contained' : 'outlined'} className={`w-100 rounded-0 ${refundSelection == 'bank' ? 'bg-button-primary' : 'border-primary text-primary'}`} onClick={()=>handleRefundSelection('bank')}>Receive in Bank</Button> 
                                                    <Button type='button' size='small' variant={refundSelection == 'upi' ? 'contained' : 'outlined'} className={`w-100 rounded-0 ${refundSelection == 'upi' ? 'bg-button-primary' : 'border-primary text-primary'}`} onClick={()=>handleRefundSelection('upi')}>Receive via UPI</Button>
                                                </div>
                                            </div>
                                            <div className="col-md-4"></div>
                                            <div className="col-md-4">
                                                {
                                                    refundSelection == 'bank' &&
                                                    <>
                                                        <div className='bg-white custom-box-shadow mt-2 p-3'>
                                                            <h6 className='text-secondary'>Your Bank Details:</h6>
                                                            <form>
                                                                <TextField 
                                                                    id="bankAccountHolderNameForRefund" 
                                                                    label="Account Holder Name" 
                                                                    size='small'
                                                                    variant="outlined"
                                                                    className='mb-3 w-100'
                                                                    name='bankAccountHolderNameForRefund'
                                                                    value={orderReturnData?.bankAccountHolderNameForRefund}
                                                                    onChange={(e)=>{
                                                                        setOrderReturnData({
                                                                            ...orderReturnData,
                                                                            bankAccountHolderNameForRefund: e.target.value
                                                                        })
                                                                    }}
                                                                    required
                                                                />
                                                                <TextField 
                                                                    id="bankAccountNumberForRefund" 
                                                                    label="Bank Account Number" 
                                                                    size='small'
                                                                    variant="outlined"
                                                                    className='mb-3 w-100'
                                                                    name='bankAccountNumberForRefund'
                                                                    value={orderReturnData?.bankAccountNumberForRefund}
                                                                    onChange={(e)=>{
                                                                        setOrderReturnData({
                                                                            ...orderReturnData,
                                                                            bankAccountNumberForRefund: e.target.value
                                                                        })
                                                                    }}
                                                                    required
                                                                />
                                                                <TextField 
                                                                    id="bankAccountIfscForRefund" 
                                                                    label="IFSC" 
                                                                    size='small'
                                                                    variant="outlined"
                                                                    className='mb-1 w-100'
                                                                    name='bankAccountIfscForRefund'
                                                                    value={orderReturnData?.bankAccountIfscForRefund}
                                                                    onChange={(e)=>{
                                                                        setOrderReturnData({
                                                                            ...orderReturnData,
                                                                            bankAccountIfscForRefund: e.target.value
                                                                        })
                                                                    }}
                                                                    required
                                                                />
                                                                {
                                                                    !bankFound ? '' :
                                                                    <><small className='text-secondary ps-2'>{orderReturnData?.bankName}, {orderReturnData?.bankBranchName}, {orderReturnData?.bankCity}, {orderReturnData?.bankDistrict}</small></>
                                                                }
                                                                {
                                                                    !bankFound ?
                                                                    <Button type='button' size='small' variant="contained" className='w-100 bg-button-primary mt-3' onClick={handleSearchBank}>Search Bank</Button>
                                                                    :
                                                                    <Button type='submit' size='small' variant="contained" className='w-100 bg-button-primary' onClick={handleOrderReturn}>Submit Refund Request</Button>
                                                                }
                                                            </form>
                                                        </div>
                                                    </>
                                                }
                                            </div>
                                            <div className="col-md-4">
                                                {
                                                    refundSelection == 'upi' &&
                                                    <>
                                                        <div className='bg-white custom-box-shadow mt-2 p-3'>
                                                            <h6 className='text-secondary'>Your UPI ID:</h6>
                                                            <form>
                                                                <TextField 
                                                                    id="upiForRefund" 
                                                                    label="UPI ID" 
                                                                    size='small'
                                                                    variant="outlined"
                                                                    className='mb-3 w-100'
                                                                    name='upiForRefund'
                                                                    value={orderReturnData?.upiForRefund}
                                                                    onChange={(e)=>{
                                                                        setOrderReturnData({
                                                                            ...orderReturnData,
                                                                            upiForRefund: e.target.value
                                                                        })
                                                                    }}
                                                                    required
                                                                />
                                                                <Button type='submit' size='small' variant="contained" className='w-100 bg-button-primary' onClick={handleOrderReturn}>Submit Refund Request</Button>
                                                            </form>
                                                        </div>
                                                    </>
                                                }
                                            </div>
                                        </div>
                                    }
                                    <div className="row">
                                        <div className="col-md-4">
                                            { data?.status == 'Requested for Refund' && <Button type='button' size='small' variant="contained" className='mt-3 rounded-5' color='error'>Cancel Return</Button> }
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 mt-5">
                                    <HelpIcon /> For any query, You can contact us via below button.
                                    <Button type='button' size='small' variant="contained" className='w-100 rounded-5 bg-button-primary mt-1' onClick={()=>setTimeout(() => {
                                        navigate('/contact-us')
                                    }, 500)}><HeadsetMicIcon fontSize='small' />&nbsp;&nbsp;Contact Us</Button>
                                </div>
                                <div className="col-md-6"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mt-3">
                    <h3 className='text-primary text-center mb-3'><img src="/logoFinal2.png" style={{ height: '25px' }} alt="/logoFinal2.png" /> Services</h3>
                    <div className="col-md-4">
                        <Button type='button' className='w-100 py-3 px-2 mb-3 border-primary text-primary' variant="outlined" size='small'>
                            <center>
                                <img src="/uniqueProducts.png" style={{ height: '100px' }} alt="/uniqueProducts.png"/>
                                <div className='text-center fs-5'>Unique & Genuine Products</div>
                            </center>
                        </Button>
                    </div>
                    <div className="col-md-4">
                        <Button type='button' className='w-100 py-3 px-2 mb-3 border-primary text-primary' variant="outlined" size='small'>
                            <center>
                                <img src="/homeDeliveryService.png" style={{ height: '100px' }} alt="/homeDeliveryService.png"/>
                                <div className='text-center fs-5'>Quick Home Delivery</div>
                            </center>
                        </Button>
                    </div>
                    <div className="col-md-4">
                        <Button type='button' className='w-100 py-3 px-2 mb-3 border-primary text-primary' variant="outlined" size='small'>
                            <center>
                                <img src="/openBoxDeliveryService.png" style={{ height: '100px' }} alt="/openBoxDeliveryService.png"/>
                                <div className='text-center fs-5'>Open Box Delivery</div>
                            </center>
                        </Button>
                    </div>
                </div>
            </div>
            <BottomNavigation renderNavCart={renderNavCart} setRenderNavCart={setRenderNavCart} renderNavWishlist={renderNavWishlist} setRenderNavWishlist={setRenderNavWishlist} />

            {/* Order Cancel Modal */}
            <Modal
                open={showOrderCancelConfirmModal}
                onClose={()=>setShowOrderCancelConfirmModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        <center><ReportProblemIcon sx={{ fontSize: '80px' }} color='error' /></center>
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <center><div>Are you sure, You want to Cancel this Order ?</div></center>
                        <div className='d-flex align-items-center justify-content-center gap-3 mt-3'>
                            <Button type='button' size='small' variant="contained" className='rounded-5 px-4' color='error' onClick={()=>setTimeout(() => {
                                setShowOrderCancelConfirmModal(false)
                            }, 500)}>No</Button>
                            <Button type='button' size='small' variant="contained" className='rounded-5 px-4 bg-button-primary' onClick={handleOrderCancel}>Yes</Button>
                        </div>
                    </Typography>
                </Box>
            </Modal>
        </>
    );
}

export default MyOrderDetail;