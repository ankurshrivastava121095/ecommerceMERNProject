/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode"

const baseURL = process.env.REACT_APP_BACKEND_URL;

const initialState = {
    wishlists: [],
    responseStatus: "",
    responseMessage: "",
};

export const createWishlist = createAsyncThunk(
    "wishlists/createWishlist",
    async (wishlist, { rejectWithValue }) => {
        try {
            const token = Cookies.get("ecomProjectLoggedInUserToken");
            const decodedData = jwtDecode(token);
            const user_id = decodedData?.id;

            const response = await axios.post(`${baseURL}/wishlist`, wishlist, {
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

export const getWishlists = createAsyncThunk(
    "wishlists/getWishlists",
    async () => {
        try {
            const token = Cookies.get("ecomProjectLoggedInUserToken");
            const decodedData = jwtDecode(token);
            const user_id = decodedData?.id;
            const response = await axios.get(`${baseURL}/wishlist`,
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

export const deleteWishlist = createAsyncThunk(
    "wishlists/deleteWishlist",
    async (wishlistId, { rejectWithValue }) => {
        try {
            const token = Cookies.get("ecomProjectLoggedInUserToken");
            const decodedData = jwtDecode(token);
            const user_id = decodedData?.id;

            const response = await axios.delete(
                `${baseURL}/wishlist/${wishlistId}`, {
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

const wishlistsSlice = createSlice({
    name: "wishlists",
    initialState,
    reducers: {
        resetWishlistState: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(createWishlist.pending, (state) => {
                state.responseStatus = "pending";
            })
            .addCase(createWishlist.fulfilled, (state) => {
                state.responseStatus = "success";
                state.responseMessage = "Item Added Successfully";
            })
            .addCase(createWishlist.rejected, (state, action) => {
                state.responseStatus = "rejected";
                state.responseMessage = action.payload;
            });

        builder
            .addCase(getWishlists.pending, (state) => {
                state.responseStatus = "pending";
            })
            .addCase(getWishlists.fulfilled, (state, action) => {
                state.wishlists = action.payload;
                state.responseStatus = "success";
                state.responseMessage = "Get All";
            })
            .addCase(getWishlists.rejected, (state, action) => {
                state.responseStatus = "rejected";
                state.responseMessage = action.payload;
            });

        builder
            .addCase(deleteWishlist.pending, (state) => {
                state.responseStatus = "pending";
            })
            .addCase(deleteWishlist.fulfilled, (state) => {
                state.responseStatus = "success";
                state.responseMessage = "Item removed successfully";
            })
            .addCase(deleteWishlist.rejected, (state, action) => {
                state.responseStatus = "rejected";
                state.responseMessage = action.payload;
            });
    },
});

export const { resetWishlistState } = wishlistsSlice.actions;
export default wishlistsSlice.reducer;