/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode"

const baseURL = process.env.REACT_APP_BACKEND_URL;

const initialState = {
    carts: [],
    responseStatus: "",
    responseMessage: "",
};

export const createCart = createAsyncThunk(
    "carts/createCart",
    async (cart, { rejectWithValue }) => {
        try {
            const token = Cookies.get("ecomProjectLoggedInUserToken");
            const decodedData = jwtDecode(token);
            const user_id = decodedData?.id;
            
            const response = await axios.post(`${baseURL}/cart`, cart, {
                headers: {
                    "x-authorization": `Bearer ${user_id}`,
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const getCarts = createAsyncThunk(
    "carts/getCarts",
    async () => {
        try {
            const token = Cookies.get("ecomProjectLoggedInUserToken");
            const decodedData = jwtDecode(token);
            const user_id = decodedData?.id;

            const response = await axios.get(`${baseURL}/cart`,
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

export const updateCart = createAsyncThunk(
    "carts/updateCart",
    async (updateData, { rejectWithValue }) => {
        try {
            const data  ={
                counterType: updateData?.counterType,
            }
            const token = Cookies.get("ecomProjectLoggedInUserToken");
            const decodedData = jwtDecode(token);
            const user_id = decodedData?.id;

            const response = await axios.put(
                `${baseURL}/cart/${updateData.cartId}`,data,
                {
                    headers: {
                        "x-authorization": `Bearer ${user_id}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const removeItem = createAsyncThunk(
    "carts/removeItem",
    async (cartId, { rejectWithValue }) => {
        try {
            const token = Cookies.get("ecomProjectLoggedInUserToken");
            const decodedData = jwtDecode(token);
            const user_id = decodedData?.id;

            const response = await axios.delete(
                `${baseURL}/cart/${cartId}`,
                {
                    headers: {
                        "x-authorization": `Bearer ${user_id}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const clearCart = createAsyncThunk(
    "carts/clearCart",
    async (_, { rejectWithValue }) => {
        try {
            const token = Cookies.get("ecomProjectLoggedInUserToken");
            const decodedData = jwtDecode(token);
            const user_id = decodedData?.id;

            const response = await axios.delete(`${baseURL}/clear-cart`, {
                headers: {
                    "x-authorization": `Bearer ${user_id}`,
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

const cartsSlice = createSlice({
    name: "carts",
    initialState,
    reducers: {
        resetCartState: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(createCart.pending, (state) => {
                state.responseStatus = "pending";
            })
            .addCase(createCart.fulfilled, (state) => {
                state.responseStatus = "success";
                state.responseMessage = "Product Added in Cart successfully";
            })
            .addCase(createCart.rejected, (state, action) => {
                state.responseStatus = "rejected";
                state.responseMessage = action.payload;
            });

        builder
            .addCase(getCarts.pending, (state) => {
                state.responseStatus = "pending";
            })
            .addCase(getCarts.fulfilled, (state, action) => {
                state.carts = action.payload;
                state.responseStatus = "success";
                state.responseMessage = "Get All";
            })
            .addCase(getCarts.rejected, (state, action) => {
                state.responseStatus = "rejected";
                state.responseMessage = action.payload;
            });

        builder
            .addCase(updateCart.pending, (state) => {
                state.responseStatus = "pending";
            })
            .addCase(updateCart.fulfilled, (state, action) => {
                // if (Array.isArray(state.carts)) {
                //     state.carts = state.carts.map((cart) =>
                //         cart.id === action.payload._id ? action.payload : cart
                //     );
                // } else {
                //     state.carts = action.payload;
                // }
                state.responseStatus = "success";
                state.responseMessage = "Cart updated successfully";
            })
            .addCase(updateCart.rejected, (state, action) => {
                state.responseStatus = "rejected";
                state.responseMessage = action.payload;
            });

        builder
            .addCase(removeItem.pending, (state) => {
                state.responseStatus = "pending";
            })
            .addCase(removeItem.fulfilled, (state) => {
                state.responseStatus = "success";
                state.responseMessage = "Item removed successfully";
            })
            .addCase(removeItem.rejected, (state, action) => {
                state.responseStatus = "rejected";
                state.responseMessage = action.payload;
            });
        builder
            .addCase(clearCart.pending, (state) => {
                state.responseStatus = "pending";
            })
            .addCase(clearCart.fulfilled, (state) => {
                state.carts = [];
                state.responseStatus = "success";
                state.responseMessage = "Cart cleared successfully";
            })
            .addCase(clearCart.rejected, (state, action) => {
                state.responseStatus = "rejected";
                state.responseMessage = action.payload;
            });
    },
});

export const { resetCartState } = cartsSlice.actions;
export default cartsSlice.reducer;