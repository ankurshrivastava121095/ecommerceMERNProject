/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import Navbar from '../../../Components/Layout/Navbar';
import BottomNavigation from '../../../Components/Layout/BottomNavigation';
import FullPageLoader from '../../../Components/Loaders/FullPageLoader';
import Cookies from 'js-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import { Stepper, Step, StepLabel, Rating, Button, TextField, FormControl, InputLabel, Select, MenuItem, Checkbox } from '@mui/material';
import { getOrder, orderPaymentRefund, resetOrderState, updateOrderStatus } from '../../../Features/Order/OrderSlice';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import AdminAuth from '../../../Components/Authentication/AdminAuth';
import AdminNavbar from '../../../Components/Layout/AdminNavbar';

const steps = ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
const cancelledSteps = ['Order Placed', 'Processing', 'Cancelled'];
const refundSteps = ['Delivered', 'Refund Request', 'Proceed for Refund', 'Refund Completed'];
const refundCancelSteps = ['Delivered', 'Refund Request', 'Refund Cancelled'];

const OrderDetail = () => {

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
    const [orderCurrentStatus, setOrderCurrentStatus] = useState('')
    const [renderNavCart, setRenderNavCart] = useState(false);
    const [renderNavWishlist, setRenderNavWishlist] = useState(false);
    const [showBankDetailSection, setShowBankDetailSection] = useState(false)
    const [updateAll, setUpdateAll] = useState(0)
    const [activeStep, setActiveStep] = useState(0);

    const { orders, responseStatus: ordersResponseStatus, responseMessage: ordersResponseMessage } = useSelector(state => state.orders)

    const calculateListPrice = (price, discount) => {
        const listPrice = (price * 100 / (100 - discount))?.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
        return listPrice;
    }

    const formattedDate = (date) => {
        const formattedDate = new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        return formattedDate;
    }

    const fetchOrder = (orderId) => {
        setFullPageLoading(true)
        dispatch(getOrder(orderId))
    }

    const handleChangeStatus = () => {
        if (orderCurrentStatus != '') {
            setTimeout(() => {
                // if (orderCurrentStatus == 'orderPaymentRefund') {
                //     var orderStatusData = {
                //         paymentId: data?.paymentId,
                //         id: id
                //     }
                //     dispatch(orderPaymentRefund(orderStatusData)) 
                // } else {
                    var orderStatusData = {
                        mandateOrderId: data?.mandateOrderId,
                        orderStatus: orderCurrentStatus,
                        updateAll: updateAll,
                        id: id
                    }
                    dispatch(updateOrderStatus(orderStatusData)) 
                // }
            }, 500);
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: 'Order Status can not be empty'
            });
        }
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
            setActiveStep(1);
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
        if(ordersResponseStatus == 'success' && ordersResponseMessage == 'Order Status Updated Successfully'){
            Swal.fire({
                icon: "success",
                title: "Congrats",
                text: ordersResponseMessage
            });
            fetchOrder(id)
        }
        if(ordersResponseStatus == 'success' && ordersResponseMessage == 'Get Single'){
            setData(orders?.data)
            setOrderCurrentStatus(orders?.data?.status)
            setTimeout(() => {
                setFullPageLoading(false)
            }, 500)
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
            <AdminAuth />
            { fullPageLoading && <FullPageLoader /> }
            <AdminNavbar />
            <div className="container mt-5">
                <div className='row pt-5'>
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
                        {
                            data?.status == 'Refund Cancelled' ?
                            <Stepper activeStep={activeStep} alternativeLabel>
                                {refundCancelSteps.map((label, index) => (
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
                                    <small className='text-secondary fw-bold'>SSID: <span>STUSAS{data?.mandateOrderId}</span></small><br />
                                    <small className='text-secondary fw-bold'>Order ID: <span>{data?.orderId || '-'}</span></small><br />
                                    <small className='text-secondary fw-bold'>Payment ID: <span>{data?.paymentId || '-'}</span></small><br />
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
                                    <small className='text-secondary fw-bold'>Order Placed By</small>
                                    <div className='mt-1 fs-5 d-flex flex-nowrap align-items-center'>{data?.name}</div>
                                    <div className='d-flex flex-nowrap align-items-center'>{data?.email}</div>
                                    <div className='d-flex flex-nowrap align-items-center'>{data?.pincode}, {data?.city}, {data?.state}, {data?.country}</div>
                                    <div className='d-flex flex-nowrap align-items-center'>{data?.contactNumber}{data?.alternateNumber != '' && data?.alternateNumber && ','} {data?.alternateNumber}</div>
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
                                    <div><span className='text-secondary fw-bold'>Order Status:</span> <span className={`fw-bold ${data?.status == 'Delivered' ? 'text-success' : 'text-red'}`}>{data?.shipmentDate ? data?.status : `Cancelled, ${data?.status}`}</span></div>
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
                                <div className="col-md-8"></div>
                                {
                                    data?.status == 'Cancelled' ?
                                    <></>
                                    :
                                    <>
                                        <div className="col-md-6 mt-4">
                                            <h5 className='text-secondary'>Change Order Status:</h5>
                                            {/* <div className='d-flex align-items-center gap-1'>
                                                <Checkbox 
                                                    name='freeDelivery'
                                                    checked={ updateAll == 1 ? true : false}
                                                    onChange={(e)=>{
                                                        if (e.target.checked) {
                                                            setUpdateAll(1)
                                                        } else {
                                                            setUpdateAll(0)
                                                            
                                                        }
                                                    }}
                                                /> <span>Update All Product's Status of same SSID/Order ID.</span>
                                            </div> */}
                                            <FormControl fullWidth sx={{ mt: 2 }}>
                                                <InputLabel id="demo-simple-select-label">Order Status</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={orderCurrentStatus}
                                                    label="Age"
                                                    onChange={e => setOrderCurrentStatus(e.target.value)}
                                                >
                                                    <MenuItem value="Pending">Pending</MenuItem>
                                                    <MenuItem value="Shipped">Shipped</MenuItem>
                                                    <MenuItem value="Out for Delivery">Out for Delivery</MenuItem>
                                                    <MenuItem value="Delivered">Delivered</MenuItem>
                                                    <MenuItem value="Refund Request" disabled>Refund Request</MenuItem>
                                                    <MenuItem value="Proceed for Refund">Proceed for Refund</MenuItem>
                                                    <MenuItem value="Refund Completed">Refund Completed</MenuItem>
                                                </Select>
                                            </FormControl>
                                            <Button type='button' size='small' variant="contained" className='mt-3 rounded-5 w-100 bg-button-primary' onClick={handleChangeStatus}>Change Status</Button>
                                        </div>
                                        <div className="col-md-6"></div>
                                        <div className="col-md-12">
                                            <div className="row">
                                                <div className="col-md-4">
                                                    { data?.status == 'Refund Request' && <Button type='button' size='small' variant="contained" className='mt-3 rounded-5 w-100 bg-button-primary' onClick={()=>setShowBankDetailSection(true)}>Proceed for Return</Button> }
                                                </div>
                                            </div>
                                            {
                                                showBankDetailSection &&
                                                <div className='bg-white custom-box-shadow mt-4 p-3'>
                                                    <h6 className='text-secondary'>Bank Detail:</h6>
                                                    <form>
                                                        <TextField 
                                                            id="accountHolderName" 
                                                            label="Account Holder Name" 
                                                            size='small'
                                                            variant="outlined"
                                                            className='mb-3 w-100'
                                                            name='accountHolderName'
                                                            // value={loginData?.email}
                                                            // onChange={handleLoginInput}
                                                            required
                                                        />
                                                        <TextField 
                                                            id="bankAccount" 
                                                            label="Bank Account Number" 
                                                            size='small'
                                                            variant="outlined"
                                                            className='mb-3 w-100'
                                                            name='bankAccount'
                                                            // value={loginData?.email}
                                                            // onChange={handleLoginInput}
                                                            required
                                                        />
                                                        <TextField 
                                                            id="ifscCode" 
                                                            label="IFSC" 
                                                            size='small'
                                                            variant="outlined"
                                                            className='mb-3 w-100'
                                                            name='ifscCode'
                                                            // value={loginData?.email}
                                                            // onChange={handleLoginInput}
                                                            required
                                                        />
                                                        <Button type='submit' size='small' variant="contained" className='w-100 bg-button-primary'>Click to Submit for Order Return Request</Button>
                                                    </form>
                                                </div>
                                            }
                                            <div className="row">
                                                <div className="col-md-4">
                                                    { data?.status == 'Requested for Refund' && <Button type='button' size='small' variant="contained" className='mt-3 rounded-5' color='error'>Cancel Return</Button> }
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                }
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
        </>
    );
}

export default OrderDetail;