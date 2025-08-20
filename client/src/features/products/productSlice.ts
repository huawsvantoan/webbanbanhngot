import { createSlice, createAsyncThunk, PayloadAction, ActionReducerMapBuilder } from '@reduxjs/toolkit';
import productService, { Product, CreateProductData, UpdateProductData, PaginatedResponse } from '../../services/productService';

interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  total: number;
  limit: number;
}

const initialState: ProductState = {
  products: [],
  currentProduct: null,
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
  total: 0,
  limit: 12,
};

export const fetchProducts = createAsyncThunk<
  PaginatedResponse<Product>,
  { page?: number; limit?: number; search?: string; category?: number },
  { rejectValue: string }
>('products/fetchProducts', async (params, { rejectWithValue }) => {
  try {
    const { page = 1, limit = 12, search, category } = params;
    
    if (search) {
      return await productService.searchProducts(search, page, limit);
    } else if (category) {
      return await productService.getProductsByCategory(category, page, limit);
    } else {
      return await productService.getAllProducts(page, limit);
    }
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
  }
});

export const fetchProductById = createAsyncThunk<
  Product,
  number,
  { rejectValue: string }
>('products/fetchProductById', async (id: number, { rejectWithValue }) => {
  try {
    const product = await productService.getProductById(id);
    return product;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
  }
});

export const createProduct = createAsyncThunk<
  { message: string; productId: number },
  CreateProductData,
  { rejectValue: string }
>('products/createProduct', async (data: CreateProductData, { rejectWithValue }) => {
  try {
    const response = await productService.createProduct(data);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create product');
  }
});

export const updateProduct = createAsyncThunk<
  { message: string },
  UpdateProductData,
  { rejectValue: string }
>('products/updateProduct', async (data: UpdateProductData, { rejectWithValue }) => {
  try {
    const response = await productService.updateProduct(data);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update product');
  }
});

export const deleteProduct = createAsyncThunk<
  void,
  number,
  { rejectValue: string }
>('products/deleteProduct', async (id: number, { rejectWithValue }) => {
  try {
    await productService.deleteProduct(id);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
  }
});

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearCurrentProduct: (state: ProductState) => {
      state.currentProduct = null;
    },
    clearError: (state: ProductState) => {
      state.error = null;
    },
    setCurrentPage: (state: ProductState, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<ProductState>) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state: ProductState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state: ProductState, action: PayloadAction<PaginatedResponse<Product>>) => {
        state.loading = false;
        state.products = action.payload.data;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.limit = action.payload.limit;
      })
      .addCase(fetchProducts.rejected, (state: ProductState, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Product by ID
      .addCase(fetchProductById.pending, (state: ProductState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state: ProductState, action: PayloadAction<Product>) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state: ProductState, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Product
      .addCase(createProduct.pending, (state: ProductState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state: ProductState) => {
        state.loading = false;
        // Refresh the products list after creating a new product
        // The fetchProducts thunk will handle updating the state
      })
      .addCase(createProduct.rejected, (state: ProductState, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Product
      .addCase(updateProduct.pending, (state: ProductState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state: ProductState) => {
        state.loading = false;
        // Refresh the products list after updating a product
        // The fetchProducts thunk will handle updating the state
        state.currentProduct = null;
      })
      .addCase(updateProduct.rejected, (state: ProductState, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete Product
      .addCase(deleteProduct.pending, (state: ProductState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state: ProductState, action: PayloadAction<void, string, { arg: number }>) => {
        state.loading = false;
        // Refresh the products list after deleting a product
        // The fetchProducts thunk will handle updating the state
        if (state.currentProduct?.id === action.meta.arg) {
          state.currentProduct = null;
        }
      })
      .addCase(deleteProduct.rejected, (state: ProductState, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentProduct, clearError, setCurrentPage } = productSlice.actions;
export default productSlice.reducer; 