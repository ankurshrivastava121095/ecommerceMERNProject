/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode"

const baseURL = process.env.REACT_APP_BACKEND_URL;

const initialState = {
    mainBanners: [],
    responseStatus: "",
    responseMessage: "",
};

export const createMainBanner = createAsyncThunk(
    "mainBanners/createMainBanner",
    async (mainBanner, { rejectWithValue }) => {
        try {
            const token = Cookies.get("ecomProjectLoggedInUserToken");
            const decodedData = jwtDecode(token);
            const user_id = decodedData?.id;

            const response = await axios.post(`${baseURL}/main-banner`, mainBanner, {
                headers: {
                    "x-authorization": `Bearer ${user_id}`,
                    "Content-Type": "multipart-formdata"
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const getMainBanners = createAsyncThunk(
    "mainBanners/getMainBanners",
    async () => {
        try {
            const response = await axios.get(`${baseURL}/main-banner`);
            return response.data;
        } catch (error) {
            return error.response.data.message;
        }
    }
);

export const deleteMainBanner = createAsyncThunk(
    "mainBanners/deleteMainBanner",
    async (mainBannerId, { rejectWithValue }) => {
        try {
            const token = Cookies.get("ecomProjectLoggedInUserToken");
            const decodedData = jwtDecode(token);
            const user_id = decodedData?.id;

            const response = await axios.delete(
                `${baseURL}/main-banner/${mainBannerId}`, {
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


const mainBannersSlice = createSlice({
    name: "mainBanners",
    initialState,
    reducers: {
        resetMainBannerState: (state) => initialState,
    },
    extraReducers: (builder) => {
        // create reducers
        builder
        .addCase(createMainBanner.pending, (state) => {
            state.responseStatus = "pending";
        })
        .addCase(createMainBanner.fulfilled, (state) => {
            state.responseStatus = "success";
            state.responseMessage = "Main Banner created successfully";
        })
        .addCase(createMainBanner.rejected, (state, action) => {
            state.responseStatus = "rejected";
            state.responseMessage = action?.error?.message;
        });

        // get all reducers
        builder
        .addCase(getMainBanners.pending, (state) => {
            state.responseStatus = "pending";
        })
        .addCase(getMainBanners.fulfilled, (state, action) => {
            state.mainBanners = action.payload;
            state.responseStatus = "success";
            state.responseMessage = "Get All";
        })
        .addCase(getMainBanners.rejected, (state, action) => {
            state.responseStatus = "rejected";
            state.responseMessage = action.payload;
        });

         // delete reducers
        builder
        .addCase(deleteMainBanner.pending, (state) => {
            state.responseStatus = "pending";
        })
        .addCase(deleteMainBanner.fulfilled, (state) => {
            state.responseStatus = "success";
            state.responseMessage = "Main Banner deleted successfully";
        })
        .addCase(deleteMainBanner.rejected, (state, action) => {
            state.responseStatus = "rejected";
            state.responseMessage = action.payload;
        });
    },
});

export const { resetMainBannerState } = mainBannersSlice.actions;
export default mainBannersSlice.reducer;