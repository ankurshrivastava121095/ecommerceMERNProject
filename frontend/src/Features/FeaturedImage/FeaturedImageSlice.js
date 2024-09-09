/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode"

const baseURL = process.env.REACT_APP_BACKEND_URL;

const initialState = {
    featuredImages: [],
    responseStatus: "",
    responseMessage: "",
};

export const getFeaturedImage = createAsyncThunk(
    "featuredImages/getFeaturedImage",
    async (productId, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${baseURL}/featured-image/${productId}`
            );
            return response.data;
        } catch (error) {
            return error.response.data.message;
        }
    }
);

const featuredImagesSlice = createSlice({
    name: "featuredImages",
    initialState,
    reducers: {
        resetFeaturedImageState: (state) => initialState,
    },
    extraReducers: (builder) => {
        // get reducers
        builder
        .addCase(getFeaturedImage.pending, (state) => {
            state.responseStatus = "pending";
        })
        .addCase(getFeaturedImage.fulfilled, (state, action) => {
            state.featuredImages = action.payload;
            state.responseStatus = "success";
            state.responseMessage = "Get All";
        })
        .addCase(getFeaturedImage.rejected, (state, action) => {
            state.responseStatus = "rejected";
            state.responseMessage = action.payload;
        });
    },
});

export const { resetFeaturedImageState } = featuredImagesSlice.actions;
export default featuredImagesSlice.reducer;