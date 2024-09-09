/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode"

const baseURL = process.env.REACT_APP_BACKEND_URL;

const initialState = {
    subCategories: [],
    responseStatus: "",
    responseMessage: "",
};

export const createSubCategory = createAsyncThunk(
    "subCategories/createSubCategory",
    async (subCategory, { rejectWithValue }) => {
        try {
            const token = Cookies.get("ecomProjectLoggedInUserToken");
            const decodedData = jwtDecode(token);
            const user_id = decodedData?.id;

            const response = await axios.post(`${baseURL}/sub-category`, subCategory, {
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

export const getSubCategories = createAsyncThunk(
    "subCategories/getSubCategories",
    async () => {
        try {
            const response = await axios.get(`${baseURL}/sub-category`);
            return response.data;
        } catch (error) {
            return error.response.data.message;
        }
    }
);

export const getSubCategoriesByCategory = createAsyncThunk(
    "subCategories/getSubCategoriesBy",
    async (categoryId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${baseURL}/sub-category-by-category-id/${categoryId}`);
            return response.data;
        } catch (error) {
            return error.response.data.message;
        }
    }
);

export const getSubCategory = createAsyncThunk(
    "subCategories/getSubCategory",
    async (subCategoryId, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${baseURL}/sub-category/${subCategoryId}`
            );
            return response.data;
        } catch (error) {
            return error.response.data.message;
        }
    }
);

export const updateSubCategory = createAsyncThunk(
    "categories/updateSubCategory",
    async (subCategory, { rejectWithValue }) => {
        try {
            const token = Cookies.get("ecomProjectLoggedInUserToken");
            const decodedData = jwtDecode(token);
            const user_id = decodedData?.id;
            
            const response = await axios.put(
                `${baseURL}/sub-category/${subCategory.get('id')}`,
                subCategory,
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

export const deleteSubCategory = createAsyncThunk(
    "subCategories/deleteSubCategory",
    async (subCategoryId, { rejectWithValue }) => {
        try {
            const response = await axios.delete(
                `${baseURL}/sub-category/${subCategoryId}`
            );
            return response.data;
        } catch (error) {
            return error.response.data.message;
        }
    }
);


const subCategoriesSlice = createSlice({
    name: "subCategories",
    initialState,
    reducers: {
        resetSubCategoryState: (state) => initialState,
    },
    extraReducers: (builder) => {
        // create reducers
        builder
        .addCase(createSubCategory.pending, (state) => {
            state.responseStatus = "pending";
        })
        .addCase(createSubCategory.fulfilled, (state) => {
            state.responseStatus = "success";
            state.responseMessage = "Sub Category created successfully";
        })
        .addCase(createSubCategory.rejected, (state, action) => {
            state.responseStatus = "rejected";
            state.responseMessage = action?.error?.message;
        });

        // get all reducers
        builder
        .addCase(getSubCategories.pending, (state) => {
            state.responseStatus = "pending";
        })
        .addCase(getSubCategories.fulfilled, (state, action) => {
            state.subCategories = action.payload;
            state.responseStatus = "success";
            state.responseMessage = "Get All";
        })
        .addCase(getSubCategories.rejected, (state, action) => {
            state.responseStatus = "rejected";
            state.responseMessage = action.payload;
        });

        // get reducers
        builder
        .addCase(getSubCategory.pending, (state) => {
            state.responseStatus = "pending";
        })
        .addCase(getSubCategory.fulfilled, (state, action) => {
            state.subCategories = action.payload;
            state.responseStatus = "success";
            state.responseMessage = "Get Single";
        })
        .addCase(getSubCategory.rejected, (state, action) => {
            state.responseStatus = "rejected";
            state.responseMessage = action.payload;
        });

        // get by category id reducers
        builder
        .addCase(getSubCategoriesByCategory.pending, (state) => {
            state.responseStatus = "pending";
        })
        .addCase(getSubCategoriesByCategory.fulfilled, (state, action) => {
            state.subCategories = action.payload;
            state.responseStatus = "success";
            state.responseMessage = "Get All";
        })
        .addCase(getSubCategoriesByCategory.rejected, (state, action) => {
            state.responseStatus = "rejected";
            state.responseMessage = action.payload;
        });

        // update reducers
        builder
        .addCase(updateSubCategory.pending, (state) => {
            state.responseStatus = "pending";
        })
        .addCase(updateSubCategory.fulfilled, (state, action) => {
            if (Array.isArray(state.subCategories)) {
            state.subCategories = state.subCategories.map((subCategory) =>
                subCategory.id === action.payload._id ? action.payload : subCategory
            );
            } else {
            state.subCategories = action.payload;
            }
            state.responseStatus = "success";
            state.responseMessage = "Sub Category updated successfully";
        })
        .addCase(updateSubCategory.rejected, (state, action) => {
            state.responseStatus = "rejected";
            state.responseMessage = action.payload;
        });

         // delete reducers
        builder
        .addCase(deleteSubCategory.pending, (state) => {
            state.responseStatus = "pending";
        })
        .addCase(deleteSubCategory.fulfilled, (state) => {
            state.responseStatus = "success";
            state.responseMessage = "Sub Category deleted successfully";
        })
        .addCase(deleteSubCategory.rejected, (state, action) => {
            state.responseStatus = "rejected";
            state.responseMessage = action.payload;
        });
    },
});

export const { resetSubCategoryState } = subCategoriesSlice.actions;
export default subCategoriesSlice.reducer;