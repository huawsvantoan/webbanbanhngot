import { createSlice, createAsyncThunk, PayloadAction, ActionReducerMapBuilder } from '@reduxjs/toolkit';
import productService, { Product, CreateProductData, UpdateProductData } from '../../services/productService';

interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
}

const initialState: ProductState = {
  products: [],
  currentProduct: null,
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
};

export const fetchProducts = createAsyncThunk<
  Product[],
  { page?: number; limit?: number; search?: string; category?: number },
  { rejectValue: string }
>('products/fetchProducts', async (params, { rejectWithValue }) => {
  try {
    let products: Product[] = [];
    if (params.search) {
      products = await productService.searchProducts(params.search);
    } else if (params.category) {
      products = await productService.getProductsByCategory(params.category);
    } else {
      products = await productService.getAllProducts();
    }
    return products;
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
      .addCase(fetchProducts.fulfilled, (state: ProductState, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.products = action.payload;
        state.totalPages = Math.ceil(action.payload.length / 10); // Assuming 10 items per page
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
        state.products = [];
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
        state.products = [];
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
        state.products = state.products.filter(p => p.id !== action.meta.arg);
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