/* eslint-disable no-redeclare */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode"

const baseURL = process.env.REACT_APP_BACKEND_URL;

const initialState = {
    orders: [],
    responseStatus: "",
    responseMessage: "",
};

export const createOrder = createAsyncThunk(
    "orders/createOrder",
    async (order, { rejectWithValue }) => {
        try {
            const token = Cookies.get("ecomProjectLoggedInUserToken");
            const decodedData = jwtDecode(token);
            const user_id = decodedData?.id;

            const response = await axios.post(`${baseURL}/place-order`, JSON.stringify(order), {
                headers: {
                    "x-authorization": `Bearer ${user_id}`,
                    "Content-Type": "application/json"
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const getAllUsersOrders = createAsyncThunk(
    "orders/getAllUsersOrders",
    async () => {
        try {
            const isExistFromAdmin = localStorage.getItem('/ecom-project/orders')
            const isExistSearchedKeyword = localStorage.getItem('/ecom-project/ordersSearchFilter')
            const isExistStatus = localStorage.getItem('/ecom-project/ordersSearchByStatus')
            
            if (isExistFromAdmin) {
                var pageObj = JSON.parse(isExistFromAdmin)
                var pageNumber = pageObj?.page 
            } else {
                var pageNumber = 1
            }

            if (isExistSearchedKeyword && isExistSearchedKeyword != '') {
                var searchedRecord = isExistSearchedKeyword
            } else {
                var searchedRecord = ''
            }

            if (isExistStatus) {
                var status = status
            } else {
                var status = ''
            }

            const token = Cookies.get("ecomProjectLoggedInUserToken");
            const decodedData = jwtDecode(token);
            const user_id = decodedData?.id;

            const response = await axios.get(`${baseURL}/get-all-users-orders`,
                {
                    headers: {
                        "x-authorization": `Bearer ${user_id}`,
                        "page-number": pageNumber,
                        "searched-record": searchedRecord,
                        "searched-status": status,
                    },
                });
            return response.data;
        } catch (error) {
            return error.response.data.message;
        }
    }
);

export const getAllOrders = createAsyncThunk(
    "orders/getAllOrders",
    async () => {
        try {
            const token = Cookies.get("ecomProjectLoggedInUserToken");
            const decodedData = jwtDecode(token);
            const user_id = decodedData?.id;

            const response = await axios.get(`${baseURL}/get-orders`,
                {
                    headers: {
                        "x-authorization": `Bearer ${user_id}`,
                    },
                });
            return response.data;
        } catch (error) {
            return error.response.data.message;
        }
    }
);

export const getOrders = createAsyncThunk(
    "orders/getOrders",
    async () => {
        try {
            const token = Cookies.get("ecomProjectLoggedInUserToken");
            const decodedData = jwtDecode(token);
            const user_id = decodedData?.id;

            const response = await axios.get(`${baseURL}/get-all-orders`,
                {
                    headers: {
                        "x-authorization": `Bearer ${user_id}`,
                    },
                });
            return response.data;
        } catch (error) {
            return error.response.data.message;
        }
    }
);

export const getUserAllOrders = createAsyncThunk(
    "products/getUserAllOrders",
    async (userId, { rejectWithValue }) => {
        try {
            const token = Cookies.get("ecomProjectLoggedInUserToken");
            const decodedData = jwtDecode(token);
            const user_id = decodedData?.id;

            const response = await axios.get(
                `${baseURL}/fetch-user-all-orders/${userId}`,{
                    headers: {
                        "x-authorization": `Bearer ${user_id}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return error.response.data.message;
        }
    }
);

export const getOrder = createAsyncThunk(
    "orders/getOrder",
    async (orderId, { rejectWithValue }) => {
        try {
            const token = Cookies.get("ecomProjectLoggedInUserToken");
            const decodedData = jwtDecode(token);
            const user_id = decodedData?.id;

            const response = await axios.get(
                `${baseURL}/get-order-detail/${orderId}`,
                {
                    headers: {
                        "x-authorization": `Bearer ${user_id}`,
                    },
                });
            return response.data;
        } catch (error) {
            return error.response.data.message;
        }
    }
);

export const updateOrderStatus = createAsyncThunk(
    "orders/updateOrderStatus",
    async (order, { rejectWithValue }) => {
        try {
            const token = Cookies.get("ecomProjectLoggedInUserToken");
            const decodedData = jwtDecode(token);
            const user_id = decodedData?.id;

            const response = await axios.post(`${baseURL}/update-order-status`, JSON.stringify(order), {
                headers: {
                    "x-authorization": `Bearer ${user_id}`,
                    "Content-Type": "application/json"
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const orderCancel = createAsyncThunk(
    "orders/orderCancel",
    async (order, { rejectWithValue }) => {
        try {
            const token = Cookies.get("ecomProjectLoggedInUserToken");
            const decodedData = jwtDecode(token);
            const user_id = decodedData?.id;

            const response = await axios.post(`${baseURL}/update-order-status`, JSON.stringify(order), {
                headers: {
                    "x-authorization": `Bearer ${user_id}`,
                    "Content-Type": "application/json"
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const orderRefundRequest = createAsyncThunk(
    "orders/orderRefundRequest",
    async (order, { rejectWithValue }) => {
        try {
            const token = Cookies.get("ecomProjectLoggedInUserToken");
            const decodedData = jwtDecode(token);
            const user_id = decodedData?.id;

            const response = await axios.post(`${baseURL}/order-refund-request`, JSON.stringify(order), {
                headers: {
                    "x-authorization": `Bearer ${user_id}`,
                    "Content-Type": "application/json"
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const orderPaymentRefund = createAsyncThunk(
    "orders/orderPaymentRefund",
    async (order, { rejectWithValue }) => {
        try {
            const token = Cookies.get("ecomProjectLoggedInUserToken");
            const decodedData = jwtDecode(token);
            const user_id = decodedData?.id;

            const response = await axios.post(`${baseURL}/order-payment-refund`, JSON.stringify(order), {
                headers: {
                    "x-authorization": `Bearer ${user_id}`,
                    "Content-Type": "application/json"
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);


const ordersSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {
        resetOrderState: (state) => initialState,
    },
    extraReducers: (builder) => {
        // create reducers
        builder
        .addCase(createOrder.pending, (state) => {
            state.responseStatus = "pending";
        })
        .addCase(createOrder.fulfilled, (state) => {
            state.responseStatus = "success";
            state.responseMessage = "Order Placed Successfully";
        })
        .addCase(createOrder.rejected, (state, action) => {
            state.responseStatus = "rejected";
            state.responseMessage = action?.error?.message;
        });

        // get all users reducers
        builder
        .addCase(getAllUsersOrders.pending, (state) => {
            state.responseStatus = "pending";
        })
        .addCase(getAllUsersOrders.fulfilled, (state, action) => {
            state.orders = action.payload;
            state.responseStatus = "success";
            state.responseMessage = "Get All";
        })
        .addCase(getAllUsersOrders.rejected, (state, action) => {
            state.responseStatus = "rejected";
            state.responseMessage = action.payload;
        });

        // get all users reducers
        builder
        .addCase(getUserAllOrders.pending, (state) => {
            state.responseStatus = "pending";
        })
        .addCase(getUserAllOrders.fulfilled, (state, action) => {
            state.orders = action.payload;
            state.responseStatus = "success";
            state.responseMessage = "Get All";
        })
        .addCase(getUserAllOrders.rejected, (state, action) => {
            state.responseStatus = "rejected";
            state.responseMessage = action.payload;
        });

        // get all reducers
        builder
        .addCase(getOrders.pending, (state) => {
            state.responseStatus = "pending";
        })
        .addCase(getOrders.fulfilled, (state, action) => {
            state.orders = action.payload;
            state.responseStatus = "success";
            state.responseMessage = "Get All";
        })
        .addCase(getOrders.rejected, (state, action) => {
            state.responseStatus = "rejected";
            state.responseMessage = action.payload;
        });

        // get all reducers
        builder
        .addCase(getAllOrders.pending, (state) => {
            state.responseStatus = "pending";
        })
        .addCase(getAllOrders.fulfilled, (state, action) => {
            state.orders = action.payload;
            state.responseStatus = "success";
            state.responseMessage = "Get All";
        })
        .addCase(getAllOrders.rejected, (state, action) => {
            state.responseStatus = "rejected";
            state.responseMessage = action.payload;
        });

        // get reducers
        builder
        .addCase(getOrder.pending, (state) => {
            state.responseStatus = "pending";
        })
        .addCase(getOrder.fulfilled, (state, action) => {
            state.orders = action.payload;
            state.responseStatus = "success";
            state.responseMessage = "Get Single";
        })
        .addCase(getOrder.rejected, (state, action) => {
            state.responseStatus = "rejected";
            state.responseMessage = action.payload;
        });

        // update status reducers
        builder
        .addCase(updateOrderStatus.pending, (state) => {
            state.responseStatus = "pending";
        })
        .addCase(updateOrderStatus.fulfilled, (state) => {
            state.responseStatus = "success";
            state.responseMessage = "Order Status Updated Successfully";
        })
        .addCase(updateOrderStatus.rejected, (state, action) => {
            state.responseStatus = "rejected";
            state.responseMessage = action?.error?.message;
        });

        // order cancel reducers
        builder
        .addCase(orderCancel.pending, (state) => {
            state.responseStatus = "pending";
        })
        .addCase(orderCancel.fulfilled, (state) => {
            state.responseStatus = "success";
            state.responseMessage = "Order Cancelled Successfully";
        })
        .addCase(orderCancel.rejected, (state, action) => {
            state.responseStatus = "rejected";
            state.responseMessage = action?.error?.message;
        });

        // order refund reducers
        builder
        .addCase(orderRefundRequest.pending, (state) => {
            state.responseStatus = "pending";
        })
        .addCase(orderRefundRequest.fulfilled, (state) => {
            state.responseStatus = "success";
            state.responseMessage = "Order Refund Request Sent Successfully";
        })
        .addCase(orderRefundRequest.rejected, (state, action) => {
            state.responseStatus = "rejected";
            state.responseMessage = action?.error?.message;
        });

        // order refund reducers
        builder
        .addCase(orderPaymentRefund.pending, (state) => {
            state.responseStatus = "pending";
        })
        .addCase(orderPaymentRefund.fulfilled, (state) => {
            state.responseStatus = "success";
            state.responseMessage = "Payment Refund Proceed Successfully";
        })
        .addCase(orderPaymentRefund.rejected, (state, action) => {
            state.responseStatus = "rejected";
            state.responseMessage = action?.error?.message;
        });
    },
});

export const { resetOrderState } = ordersSlice.actions;
export default ordersSlice.reducer;