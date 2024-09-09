/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode"

const baseURL = process.env.REACT_APP_BACKEND_URL;

const initialState = {
    forgetPasswords: [],
    responseStatus: "",
    responseMessage: "",
};

export const sendOtp = createAsyncThunk(
    "forgetPasswords/sendOtp",
    async (forgetPassword, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${baseURL}/send-forget-password-otp`, forgetPassword);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const verifyOtp = createAsyncThunk(
    "forgetPasswords/verifyOtp",
    async (forgetPassword, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${baseURL}/verify-forget-password-otp`, forgetPassword);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const resetPassword = createAsyncThunk(
    "forgetPasswords/resetPassword",
    async (forgetPassword, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${baseURL}/reset-password`, forgetPassword);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);


const forgetPasswordsSlice = createSlice({
    name: "forgetPasswords",
    initialState,
    reducers: {
        resetForgetPasswordState: (state) => initialState,
    },
    extraReducers: (builder) => {
        // send otp reducers
        builder
        .addCase(sendOtp.pending, (state) => {
            state.responseStatus = "pending";
        })
        .addCase(sendOtp.fulfilled, (state, action) => {
            state.responseStatus = "success";
            state.forgetPasswords = action.payload;
            state.responseMessage = "OTP Sent Successfully";
        })
        .addCase(sendOtp.rejected, (state, action) => {
            state.responseStatus = "rejected";
            state.responseMessage = action?.error?.message;
        });
      
        // verify otp reducers
        builder
        .addCase(verifyOtp.pending, (state) => {
            state.responseStatus = "pending";
        })
        .addCase(verifyOtp.fulfilled, (state) => {
            state.responseStatus = "success";
            state.responseMessage = "OTP Verified Successfully";
        })
        .addCase(verifyOtp.rejected, (state, action) => {
            state.responseStatus = "rejected";
            state.responseMessage = action?.error?.message;
        });
      
        // reset password reducers
        builder
        .addCase(resetPassword.pending, (state) => {
            state.responseStatus = "pending";
        })
        .addCase(resetPassword.fulfilled, (state) => {
            state.responseStatus = "success";
            state.responseMessage = "Password Changed Successfully";
        })
        .addCase(resetPassword.rejected, (state, action) => {
            state.responseStatus = "rejected";
            state.responseMessage = action?.error?.message;
        });
    },
});

export const { resetForgetPasswordState } = forgetPasswordsSlice.actions;
export default forgetPasswordsSlice.reducer;