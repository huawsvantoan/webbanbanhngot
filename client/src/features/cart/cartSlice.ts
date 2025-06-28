import { createSlice, createAsyncThunk, PayloadAction, ActionReducerMapBuilder } from '@reduxjs/toolkit';
import cartService, { CartItem, AddToCartData } from '../../services/cartService';

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchCart = createAsyncThunk<
  CartItem[],
  void,
  { rejectValue: string }
>('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const items = await cartService.getCart();
    return items;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
  }
});

export const addToCart = createAsyncThunk<
  { message: string },
  AddToCartData,
  { rejectValue: string }
>('cart/addToCart', async (data: AddToCartData, { rejectWithValue, dispatch }) => {
  try {
    const response = await cartService.addToCart(data);
    // Refresh cart after adding item
    dispatch(fetchCart());
    return response;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to add item to cart');
  }
});

export const updateCartItem = createAsyncThunk<
  { message: string },
  { productId: number; quantity: number },
  { rejectValue: string }
>('cart/updateCartItem', async ({ productId, quantity }, { rejectWithValue, dispatch }) => {
  try {
    const response = await cartService.updateCartItem(productId, quantity);
    // Refresh cart after updating item
    dispatch(fetchCart());
    return response;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update cart item');
  }
});

export const removeFromCart = createAsyncThunk<
  { message: string },
  number,
  { rejectValue: string }
>('cart/removeFromCart', async (productId: number, { rejectWithValue, dispatch }) => {
  try {
    const response = await cartService.removeFromCart(productId);
    // Refresh cart after removing item
    dispatch(fetchCart());
    return response;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to remove item from cart');
  }
});

export const clearCart = createAsyncThunk<
  { message: string },
  void,
  { rejectValue: string }
>('cart/clearCart', async (_, { rejectWithValue, dispatch }) => {
  try {
    const response = await cartService.clearCart();
    // Refresh cart after clearing
    dispatch(fetchCart());
    return response;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to clear cart');
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearError: (state: CartState) => {
      state.error = null;
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<CartState>) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state: CartState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state: CartState, action: PayloadAction<CartItem[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state: CartState, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add to Cart
      .addCase(addToCart.pending, (state: CartState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state: CartState) => {
        state.loading = false;
      })
      .addCase(addToCart.rejected, (state: CartState, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Cart Item
      .addCase(updateCartItem.pending, (state: CartState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state: CartState) => {
        state.loading = false;
      })
      .addCase(updateCartItem.rejected, (state: CartState, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Remove from Cart
      .addCase(removeFromCart.pending, (state: CartState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state: CartState) => {
        state.loading = false;
      })
      .addCase(removeFromCart.rejected, (state: CartState, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Clear Cart
      .addCase(clearCart.pending, (state: CartState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state: CartState) => {
        state.loading = false;
      })
      .addCase(clearCart.rejected, (state: CartState, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = cartSlice.actions;
export default cartSlice.reducer; 