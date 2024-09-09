/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode"

const baseURL = process.env.REACT_APP_BACKEND_URL;

const initialState = {
  loading: false,
  userInfo: 
    Cookies.get('ecomProjectLoggedInUser')
    ? 
    { token: Cookies.get('ecomProjectLoggedInUserToken') }
    : null,
  error: null,
  success: null,
  message: null,
};

export const registerUser = createAsyncThunk(
    "auth/register",
    async (user, { rejectWithValue }) => {
        try {
            const config = {
                headers: {
                "Content-Type": "application/json",
                },
            };
            await axios.post(`${baseURL}/register`, user, config);
        } catch (error) {
            // return custom error message from backend if present
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(error.message);
            }
        }
    }
);

export const userLogin = createAsyncThunk(
    "auth/login",
    async (user, { rejectWithValue }) => {
        try {
            // configure header's Content-Type as JSON
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };
            const data = await axios.post(`${baseURL}/login`, user, config);
            return data;
        } catch (error) {
            // return custom error message from API if any
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(error.message);
            }
        }
    }
);

export const userLogout = createAsyncThunk("auth/logout", async () => {
    try {
        const response = await axios.get(`${baseURL}/logout`);
        return response.data;
    } catch (error) {
        return error.response.data.message;
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        resetAuthState: (state) => initialState,
    },
    extraReducers: (builder) => {
        // login user
        builder
        .addCase(userLogin.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(userLogin.fulfilled, (state, { payload }) => {
            state.loading = false;
            if (payload.data.token) {
                const decodedData = jwtDecode(payload.data.token);
                state.userInfo = decodedData;
                Cookies.set('ecomProjectLoggedInUser',JSON.stringify(decodedData), { expires: 7 })
                Cookies.set('ecomProjectLoggedInUserToken',payload.data.token, { expires: 7 })
                state.message = "Logged In";
            } else {
                state.message = payload.data.message;
            }
            state.success = true;
        })
        .addCase(userLogin.rejected, (state, { payload }) => {
            state.loading = false;
            state.error = payload;
            state.success = false;
            state.message = payload;
        });

        // logout user
        builder
        .addCase(userLogout.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(userLogout.fulfilled, (state, { payload }) => {
            Cookies.remove('ecomProjectLoggedInUser')
            Cookies.remove('ecomProjectLoggedInUserToken')
            state.loading = false;
            state.userInfo = null;
            state.success = true;
            state.message = "Logged Out";
            state.error = null;
        })
        .addCase(userLogout.rejected, (state, { payload }) => {
            state.loading = false;
            state.error = payload;
        });

        // register user reducer
        builder
        .addCase(registerUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(registerUser.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.success = true;
            state.message = "Registered Successfully";
        })
        .addCase(registerUser.rejected, (state, { payload }) => {
            state.loading = false;
            state.error = payload;
            state.message = payload;
        });
    },
});

export const { resetAuthState } = authSlice.actions;
export default authSlice.reducer;
