/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode"

const baseURL = process.env.REACT_APP_BACKEND_URL;

const initialState = {
    categories: [],
    responseStatus: "",
    responseMessage: "",
};

export const createCategory = createAsyncThunk(
    "categories/createCategory",
    async (category, { rejectWithValue }) => {
        try {
            const token = Cookies.get("ecomProjectLoggedInUserToken");
            const decodedData = jwtDecode(token);
            const user_id = decodedData?.id;

            const response = await axios.post(`${baseURL}/category`, category, {
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

export const getCategories = createAsyncThunk(
    "categories/getCategories",
    async () => {
        try {
            const response = await axios.get(`${baseURL}/category`);
            return response.data;
        } catch (error) {
            return error.response.data.message;
        }
    }
);

export const fetchAllCategoryWithProducts = createAsyncThunk(
    "categories/fetchAllCategoryWithProducts",
    async () => {
        try {
            const response = await axios.get(`${baseURL}/fetch-all-category-with-products`);
            return response.data;
        } catch (error) {
            return error.response.data.message;
        }
    }
);

export const getCategory = createAsyncThunk(
    "categories/getCategory",
    async (categoryId, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${baseURL}/category/${categoryId}`
            );
            return response.data;
        } catch (error) {
            return error.response.data.message;
        }
    }
);

export const updateCategory = createAsyncThunk(
    "categories/updateCategory",
    async (category, { rejectWithValue }) => {
        try {
            const token = Cookies.get("ecomProjectLoggedInUserToken");
            const decodedData = jwtDecode(token);
            const user_id = decodedData?.id;
            
            const response = await axios.put(
                `${baseURL}/category/${category.get('id')}`,
                category,
                {
                    headers: {
                        "x-authorization": `Bearer ${user_id}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const deleteCategory = createAsyncThunk(
    "categories/deleteCategory",
    async (categoryId, { rejectWithValue }) => {
        try {
            const response = await axios.delete(
                `${baseURL}/category/${categoryId}`
            );
            return response.data;
        } catch (error) {
            return error.response.data.message;
        }
    }
);


const categoriesSlice = createSlice({
    name: "categories",
    initialState,
    reducers: {
        resetCategoryState: (state) => initialState,
    },
    extraReducers: (builder) => {
        // create reducers
        builder
        .addCase(createCategory.pending, (state) => {
            state.responseStatus = "pending";
        })
        .addCase(createCategory.fulfilled, (state) => {
            state.responseStatus = "success";
            state.responseMessage = "Category created successfully";
        })
        .addCase(createCategory.rejected, (state, action) => {
            state.responseStatus = "rejected";
            state.responseMessage = action?.error?.message;
        });

        // get all reducers
        builder
        .addCase(getCategories.pending, (state) => {
            state.responseStatus = "pending";
        })
        .addCase(getCategories.fulfilled, (state, action) => {
            state.categories = action.payload;
            state.responseStatus = "success";
            state.responseMessage = "Get All";
        })
        .addCase(getCategories.rejected, (state, action) => {
            state.responseStatus = "rejected";
            state.responseMessage = action.payload;
        });

        // get all reducers
        builder
        .addCase(fetchAllCategoryWithProducts.pending, (state) => {
            state.responseStatus = "pending";
        })
        .addCase(fetchAllCategoryWithProducts.fulfilled, (state, action) => {
            state.categories = action.payload;
            state.responseStatus = "success";
            state.responseMessage = "Get All Categories with their Products";
        })
        .addCase(fetchAllCategoryWithProducts.rejected, (state, action) => {
            state.responseStatus = "rejected";
            state.responseMessage = action.payload;
        });

        // get reducers
        builder
        .addCase(getCategory.pending, (state) => {
            state.responseStatus = "pending";
        })
        .addCase(getCategory.fulfilled, (state, action) => {
            state.categories = action.payload;
            state.responseStatus = "success";
            state.responseMessage = "Get Single";
        })
        .addCase(getCategory.rejected, (state, action) => {
            state.responseStatus = "rejected";
            state.responseMessage = action.payload;
        });

        // update reducers
        builder
        .addCase(updateCategory.pending, (state) => {
            state.responseStatus = "pending";
        })
        .addCase(updateCategory.fulfilled, (state, action) => {
            if (Array.isArray(state.categories)) {
            state.categories = state.categories.map((category) =>
                category.id === action.payload._id ? action.payload : category
            );
            } else {
            state.categories = action.payload;
            }
            state.responseStatus = "success";
            state.responseMessage = "Category updated successfully";
        })
        .addCase(updateCategory.rejected, (state, action) => {
            state.responseStatus = "rejected";
            state.responseMessage = action.payload;
        });

         // delete reducers
        builder
        .addCase(deleteCategory.pending, (state) => {
            state.responseStatus = "pending";
        })
        .addCase(deleteCategory.fulfilled, (state) => {
            state.responseStatus = "success";
            state.responseMessage = "Category deleted successfully";
        })
        .addCase(deleteCategory.rejected, (state, action) => {
            state.responseStatus = "rejected";
            state.responseMessage = action.payload;
        });
    },
});

export const { resetCategoryState } = categoriesSlice.actions;
export default categoriesSlice.reducer;