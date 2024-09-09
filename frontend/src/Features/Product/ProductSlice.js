/* eslint-disable no-redeclare */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode"

const baseURL = process.env.REACT_APP_BACKEND_URL;

const initialState = {
    products: [],
    responseStatus: "",
    responseMessage: "",
};

export const createProduct = createAsyncThunk(
    "products/createProduct",
    async (product, { rejectWithValue }) => {
        try {
            const token = Cookies.get("ecomProjectLoggedInUserToken");
            const decodedData = jwtDecode(token);
            const user_id = decodedData?.id;

            const response = await axios.post(`${baseURL}/product`, product, {
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

export const getProducts = createAsyncThunk(
    "products/getProducts",
    async () => {
        try {
            const isExist = localStorage.getItem('/all-products')
            const isExistFromAdmin = localStorage.getItem('/ecom-project/products')
            const isExistSearchedKeyword = localStorage.getItem('/ecom-project/ordersSearchFilter')
            
            if (isExist) {
                var pageObj = JSON.parse(isExist)
                var pageNumber = pageObj?.page 
            } else {
                var pageNumber = 1
            }
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

            const response = await axios.get(`${baseURL}/product`,{
                headers: {
                    "page-number": pageNumber,
                    "searched-record": searchedRecord,
                },
            });
            return response.data;
        } catch (error) {
            return error.response.data.message;
        }
    }
);

export const getBestSellingProducts = createAsyncThunk(
    "products/getBestSellingProducts",
    async () => {
        try {
            const isExist = localStorage.getItem('/all-products')
            const isExistFromAdmin = localStorage.getItem('/ecom-project/products')
            const isExistSearchedKeyword = localStorage.getItem('/ecom-project/ordersSearchFilter')
            
            if (isExist) {
                var pageObj = JSON.parse(isExist)
                var pageNumber = pageObj?.page 
            } else {
                var pageNumber = 1
            }
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

            const response = await axios.get(`${baseURL}/best-selling-products`,{
                headers: {
                    "page-number": pageNumber,
                    "searched-record": searchedRecord,
                },
            });
            return response.data;
        } catch (error) {
            return error.response.data.message;
        }
    }
);

export const getProduct = createAsyncThunk(
    "products/getProduct",
    async (productId, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${baseURL}/product/${productId}`
            );
            return response.data;
        } catch (error) {
            return error.response.data.message;
        }
    }
);

export const getCategoryProduct = createAsyncThunk(
    "products/getCategoryProduct",
    async (categoryId, { rejectWithValue }) => {
        try {
            const isExist = localStorage.getItem('/all-products')

            if (isExist) {
                var pageObj = JSON.parse(isExist)
                var pageNumber = pageObj?.page 
            } else {
                var pageNumber = 1
            }

            const response = await axios.get(
                `${baseURL}/category-product/${categoryId}`,{
                    headers: {
                        "page-number": pageNumber,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return error.response.data.message;
        }
    }
);

export const getSubCategoryProduct = createAsyncThunk(
    "products/getSubCategoryProduct",
    async (subCategoryId, { rejectWithValue }) => {
        try {
            const isExist = localStorage.getItem('/all-products')

            if (isExist) {
                var pageObj = JSON.parse(isExist)
                var pageNumber = pageObj?.page 
            } else {
                var pageNumber = 1
            }

            const response = await axios.get(
                `${baseURL}/sub-category-product/${subCategoryId}`,{
                    headers: {
                        "page-number": pageNumber,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return error.response.data.message;
        }
    }
);

export const updateProduct = createAsyncThunk(
    "products/updateProduct",
    async (product, { rejectWithValue }) => {
        try {
            const token = Cookies.get("ecomProjectLoggedInUserToken");
            const decodedData = jwtDecode(token);
            const user_id = decodedData?.id;
            
            const response = await axios.put(
                `${baseURL}/product/${product.get('id')}`,
                product,
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

export const deleteProduct = createAsyncThunk(
    "products/deleteProduct",
    async (productId, { rejectWithValue }) => {
        try {
            const token = Cookies.get("ecomProjectLoggedInUserToken");
            const decodedData = jwtDecode(token);
            const user_id = decodedData?.id;

            const response = await axios.delete(
                `${baseURL}/product/${productId}`,{
                    headers: {
                        "x-authorization": `Bearer ${user_id}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            return response.data;
        } catch (error) {
            return error.response.data.message;
        }
    }
);


const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        resetProductState: (state) => initialState,
    },
    extraReducers: (builder) => {
        // create reducers
        builder
        .addCase(createProduct.pending, (state) => {
            state.responseStatus = "pending";
        })
        .addCase(createProduct.fulfilled, (state) => {
            state.responseStatus = "success";
            state.responseMessage = "Product created successfully";
        })
        .addCase(createProduct.rejected, (state, action) => {
            state.responseStatus = "rejected";
            state.responseMessage = action?.error?.message;
        });

        // get all reducers
        builder
        .addCase(getProducts.pending, (state) => {
            state.responseStatus = "pending";
        })
        .addCase(getProducts.fulfilled, (state, action) => {
            state.products = action.payload;
            state.responseStatus = "success";
            state.responseMessage = "Get All";
        })
        .addCase(getProducts.rejected, (state, action) => {
            state.responseStatus = "rejected";
            state.responseMessage = action.payload;
        });

        // get all best selling reducers
        builder
        .addCase(getBestSellingProducts.pending, (state) => {
            state.responseStatus = "pending";
        })
        .addCase(getBestSellingProducts.fulfilled, (state, action) => {
            state.products = action.payload;
            state.responseStatus = "success";
            state.responseMessage = "Get All Best Selling Products";
        })
        .addCase(getBestSellingProducts.rejected, (state, action) => {
            state.responseStatus = "rejected";
            state.responseMessage = action.payload;
        });

        // get reducers
        builder
        .addCase(getProduct.pending, (state) => {
            state.responseStatus = "pending";
        })
        .addCase(getProduct.fulfilled, (state, action) => {
            state.products = action.payload;
            state.responseStatus = "success";
            state.responseMessage = "Get Single";
        })
        .addCase(getProduct.rejected, (state, action) => {
            state.responseStatus = "rejected";
            state.responseMessage = action.payload;
        });

        // get category wise reducers
        builder
        .addCase(getCategoryProduct.pending, (state) => {
            state.responseStatus = "pending";
        })
        .addCase(getCategoryProduct.fulfilled, (state, action) => {
            state.products = action.payload;
            state.responseStatus = "success";
            state.responseMessage = "Get All Category Wise";
        })
        .addCase(getCategoryProduct.rejected, (state, action) => {
            state.responseStatus = "rejected";
            state.responseMessage = action.payload;
        });

        // get sub category wise reducers
        builder
        .addCase(getSubCategoryProduct.pending, (state) => {
            state.responseStatus = "pending";
        })
        .addCase(getSubCategoryProduct.fulfilled, (state, action) => {
            state.products = action.payload;
            state.responseStatus = "success";
            state.responseMessage = "Get All Sub Category Wise";
        })
        .addCase(getSubCategoryProduct.rejected, (state, action) => {
            state.responseStatus = "rejected";
            state.responseMessage = action.payload;
        });

        // update reducers
        builder
        .addCase(updateProduct.pending, (state) => {
            state.responseStatus = "pending";
        })
        .addCase(updateProduct.fulfilled, (state, action) => {
            if (Array.isArray(state.products)) {
            state.products = state.products.map((product) =>
                product.id === action.payload._id ? action.payload : product
            );
            } else {
            state.products = action.payload;
            }
            state.responseStatus = "success";
            state.responseMessage = "Product updated successfully";
        })
        .addCase(updateProduct.rejected, (state, action) => {
            state.responseStatus = "rejected";
            state.responseMessage = action.payload;
        });

         // delete reducers
        builder
        .addCase(deleteProduct.pending, (state) => {
            state.responseStatus = "pending";
        })
        .addCase(deleteProduct.fulfilled, (state) => {
            state.responseStatus = "success";
            state.responseMessage = "Product deleted successfully";
        })
        .addCase(deleteProduct.rejected, (state, action) => {
            state.responseStatus = "rejected";
            state.responseMessage = action.payload;
        });
    },
});

export const { resetProductState } = productsSlice.actions;
export default productsSlice.reducer;
