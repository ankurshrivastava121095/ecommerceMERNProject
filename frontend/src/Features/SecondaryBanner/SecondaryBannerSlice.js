/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode"

const baseURL = process.env.REACT_APP_BACKEND_URL;

const initialState = {
    secondaryBanners: [],
    responseStatus: "",
    responseMessage: "",
};

export const createSecondaryBanner = createAsyncThunk(
    "secondaryBanners/createSecondaryBanner",
    async (secondaryBanner, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${baseURL}/secondary-banner`, secondaryBanner);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const getSecondaryBanners = createAsyncThunk(
    "secondaryBanners/getSecondaryBanners",
    async () => {
        try {
            const response = await axios.get(`${baseURL}/secondary-banner`);
            return response.data;
        } catch (error) {
            return error.response.data.message;
        }
    }
);

export const deleteSecondaryBanner = createAsyncThunk(
    "secondaryBanners/deleteSecondaryBanner",
    async (secondaryBannerId, { rejectWithValue }) => {
        try {
            const token = Cookies.get("ecomProjectLoggedInUserToken");
            const decodedData = jwtDecode(token);
            const user_id = decodedData?.id;

            const response = await axios.delete(
                `${baseURL}/secondary-banner/${secondaryBannerId}`, {
                    headers: {
                        "x-authorization": `Bearer ${user_id}`,
                        "Content-Type": "multipart-formdata"
                    },
                }
            );
            return response.data;
        } catch (error) {
            return error.response.data.message;
        }
    }
);


const secondaryBannersSlice = createSlice({
    name: "secondaryBanners",
    initialState,
    reducers: {
        resetSecondaryBannerState: (state) => initialState,
    },
    extraReducers: (builder) => {
        // create reducers
        builder
        .addCase(createSecondaryBanner.pending, (state) => {
            state.responseStatus = "pending";
        })
        .addCase(createSecondaryBanner.fulfilled, (state) => {
            state.responseStatus = "success";
            state.responseMessage = "Secondary Banner created successfully";
        })
        .addCase(createSecondaryBanner.rejected, (state, action) => {
            state.responseStatus = "rejected";
            state.responseMessage = action?.error?.message;
        });

        // get all reducers
        builder
        .addCase(getSecondaryBanners.pending, (state) => {
            state.responseStatus = "pending";
        })
        .addCase(getSecondaryBanners.fulfilled, (state, action) => {
            state.secondaryBanners = action.payload;
            state.responseStatus = "success";
            state.responseMessage = "Get All";
        })
        .addCase(getSecondaryBanners.rejected, (state, action) => {
            state.responseStatus = "rejected";
            state.responseMessage = action.payload;
        });

         // delete reducers
        builder
        .addCase(deleteSecondaryBanner.pending, (state) => {
            state.responseStatus = "pending";
        })
        .addCase(deleteSecondaryBanner.fulfilled, (state) => {
            state.responseStatus = "success";
            state.responseMessage = "Secondary Banner deleted successfully";
        })
        .addCase(deleteSecondaryBanner.rejected, (state, action) => {
            state.responseStatus = "rejected";
            state.responseMessage = action.payload;
        });
    },
});

export const { resetSecondaryBannerState } = secondaryBannersSlice.actions;
export default secondaryBannersSlice.reducer;