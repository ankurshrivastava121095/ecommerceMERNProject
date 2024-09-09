/* eslint-disable no-redeclare */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode"

const baseURL = process.env.REACT_APP_BACKEND_URL;

const initialState = {
    users: [],
    responseStatus: "",
    responseMessage: "",
};

export const getUser = createAsyncThunk(
    "users/getUser",
    async () => {
        try {
            const token = Cookies.get("ecomProjectLoggedInUserToken");
            const decodedData = jwtDecode(token);
            const user_id = decodedData?.id;

            const response = await axios.get(`${baseURL}/fetch-user`,
                {
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

export const changeUserStatus = createAsyncThunk(
    "products/changeUserStatus",
    async (userId, { rejectWithValue }) => {
        try {
            const token = Cookies.get("ecomProjectLoggedInUserToken");
            const decodedData = jwtDecode(token);
            const user_id = decodedData?.id;

            const response = await axios.get(
                `${baseURL}/change-user-status/${userId}`,{
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

export const getAllUsers = createAsyncThunk(
    "users/getAllUsers",
    async () => {
        try {
            const isExistFromAdmin = localStorage.getItem('/ecom-project/users')
            const isExistSearchedKeyword = localStorage.getItem('/ecom-project/ordersSearchFilter')

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

            const token = Cookies.get("ecomProjectLoggedInUserToken");
            const decodedData = jwtDecode(token);
            const user_id = decodedData?.id;

            const response = await axios.get(`${baseURL}/fetch-all-users`,
                {
                    headers: {
                        "x-authorization": `Bearer ${user_id}`,
                        "page-number": pageNumber,
                        "searched-record": searchedRecord,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return error.response.data.message;
        }
    }
);

export const updateUser = createAsyncThunk(
    "users/updateUser",
    async (user, { rejectWithValue }) => {
        try {
            const token = Cookies.get("ecomProjectLoggedInUserToken");
            const decodedData = jwtDecode(token);
            const user_id = decodedData?.id;

            const response = await axios.put(
                `${baseURL}/update-user`,
                user,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
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


const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        resetUserState: (state) => initialState,
    },
    extraReducers: (builder) => {
        // get all reducers
        builder
        .addCase(getUser.pending, (state) => {
            state.responseStatus = "pending";
        })
        .addCase(getUser.fulfilled, (state, action) => {
            state.users = action.payload;
            state.responseStatus = "success";
            state.responseMessage = "Get User Detail";
        })
        .addCase(getUser.rejected, (state, action) => {
            state.responseStatus = "rejected";
            state.responseMessage = action.payload;
        });
      
        // get all reducers
        builder
        .addCase(getAllUsers.pending, (state) => {
            state.responseStatus = "pending";
        })
        .addCase(getAllUsers.fulfilled, (state, action) => {
            state.users = action.payload;
            state.responseStatus = "success";
            state.responseMessage = "Get All";
        })
        .addCase(getAllUsers.rejected, (state, action) => {
            state.responseStatus = "rejected";
            state.responseMessage = action.payload;
        });

        // change status reducers
        builder
        .addCase(changeUserStatus.pending, (state) => {
            state.responseStatus = "pending";
        })
        .addCase(changeUserStatus.fulfilled, (state, action) => {
            state.responseStatus = "success";
            state.responseMessage = "User status changed successfully";
        })
        .addCase(changeUserStatus.rejected, (state, action) => {
            state.responseStatus = "rejected";
            state.responseMessage = action.payload;
        });

        // update reducers
        builder
        .addCase(updateUser.pending, (state) => {
            state.responseStatus = "pending";
        })
        .addCase(updateUser.fulfilled, (state, action) => {
            if (Array.isArray(state.users)) {
            state.users = state.users.map((user) =>
                user.id === action.payload._id ? action.payload : user
            );
            } else {
            state.users = action.payload;
            }
            state.responseStatus = "success";
            state.responseMessage = "Your Details Updated Successfully";
        })
        .addCase(updateUser.rejected, (state, action) => {
            state.responseStatus = "rejected";
            state.responseMessage = action.payload;
        });
    },
});

export const { resetUserState } = usersSlice.actions;
export default usersSlice.reducer;