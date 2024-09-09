/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode"

const baseURL = process.env.REACT_APP_BACKEND_URL;

const initialState = {
    ratings: [],
    responseStatus: "",
    responseMessage: "",
};

export const createRating = createAsyncThunk(
    "ratings/createRating",
    async (rating, { rejectWithValue }) => {
        try {
            const token = Cookies.get("ecomProjectLoggedInUserToken");
            const decodedData = jwtDecode(token);
            const user_id = decodedData?.id;

            const response = await axios.post(`${baseURL}/rating`, rating, {
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

export const getRatings = createAsyncThunk(
    "ratings/getRatings",
    async () => {
        try {
            const token = Cookies.get("ecomProjectLoggedInUserToken");
            const decodedData = jwtDecode(token);
            const user_id = decodedData?.id;

            const response = await axios.get(`${baseURL}/rating`,
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

export const getRating = createAsyncThunk(
    "ratings/getRating",
    async (ratingId, { rejectWithValue }) => {
        try {
            const token = Cookies.get("ecomProjectLoggedInUserToken");
            const decodedData = jwtDecode(token);
            const user_id = decodedData?.id;

            const response = await axios.get(
                `${baseURL}/rating/${ratingId}`,
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


const ratingsSlice = createSlice({
    name: "ratings",
    initialState,
    reducers: {
        resetRatingState: (state) => initialState,
    },
    extraReducers: (builder) => {
        // create reducers
        builder
        .addCase(createRating.pending, (state) => {
            state.responseStatus = "pending";
        })
        .addCase(createRating.fulfilled, (state) => {
            state.responseStatus = "success";
            state.responseMessage = "Rating sent successfully";
        })
        .addCase(createRating.rejected, (state, action) => {
            state.responseStatus = "rejected";
            state.responseMessage = action?.error?.message;
        });

        // get all reducers
        builder
        .addCase(getRatings.pending, (state) => {
            state.responseStatus = "pending";
        })
        .addCase(getRatings.fulfilled, (state, action) => {
            state.ratings = action.payload;
            state.responseStatus = "success";
            state.responseMessage = "Get All";
        })
        .addCase(getRatings.rejected, (state, action) => {
            state.responseStatus = "rejected";
            state.responseMessage = action.payload;
        });

        // get reducers
        builder
        .addCase(getRating.pending, (state) => {
            state.responseStatus = "pending";
        })
        .addCase(getRating.fulfilled, (state, action) => {
            state.ratings = action.payload;
            state.responseStatus = "success";
            state.responseMessage = "Get Single";
        })
        .addCase(getRating.rejected, (state, action) => {
            state.responseStatus = "rejected";
            state.responseMessage = action.payload;
        });
    },
});

export const { resetRatingState } = ratingsSlice.actions;
export default ratingsSlice.reducer;