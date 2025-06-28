import { createSlice, createAsyncThunk, PayloadAction, ActionReducerMapBuilder } from '@reduxjs/toolkit';
import orderService, { Order, CreateOrderData } from '../../services/orderService';

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
};

export const fetchOrders = createAsyncThunk<
  Order[],
  void,
  { rejectValue: string }
>('orders/fetchOrders', async (_, { rejectWithValue }) => {
  try {
    const orders = await orderService.getUserOrders();
    return orders;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
  }
});

export const fetchAllOrders = createAsyncThunk<
  Order[],
  void,
  { rejectValue: string }
>('orders/fetchAllOrders', async (_, { rejectWithValue }) => {
  try {
    const orders = await orderService.getAllOrders();
    return orders;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
  }
});

export const fetchOrderById = createAsyncThunk<
  Order,
  number,
  { rejectValue: string }
>('orders/fetchOrderById', async (id: number, { rejectWithValue }) => {
  try {
    const order = await orderService.getOrderById(id);
    return order;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch order');
  }
});

export const createOrder = createAsyncThunk<
  Order,
  CreateOrderData,
  { rejectValue: string }
>('orders/createOrder', async (data: CreateOrderData, { rejectWithValue, dispatch }) => {
  try {
    const response = await orderService.createOrder(data);
    // Fetch the created order
    if (response.orderId) {
      const order = await orderService.getOrderById(response.orderId);
      // Refresh orders list after creating a new order
      dispatch(fetchOrders());
      return order;
    }
    throw new Error('Failed to create order');
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create order');
  }
});

export const updateOrderStatus = createAsyncThunk<
  Order,
  { orderId: number; status: Order['status'] },
  { rejectValue: string }
>('orders/updateOrderStatus', async ({ orderId, status }, { rejectWithValue, dispatch }) => {
  try {
    await orderService.updateOrderStatus(orderId, status);
    // Fetch the updated order
    const order = await orderService.getOrderById(orderId);
    // Refresh orders list after updating status
    dispatch(fetchOrders());
    return order;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update order status');
  }
});

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrentOrder: (state: OrderState) => {
      state.currentOrder = null;
    },
    clearError: (state: OrderState) => {
      state.error = null;
    },
    setCurrentPage: (state: OrderState, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<OrderState>) => {
    builder
      // Fetch Orders
      .addCase(fetchOrders.pending, (state: OrderState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state: OrderState, action: PayloadAction<Order[]>) => {
        state.loading = false;
        state.orders = action.payload;
        state.totalPages = Math.ceil(action.payload.length / 10); // Assuming 10 items per page
      })
      .addCase(fetchOrders.rejected, (state: OrderState, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch All Orders
      .addCase(fetchAllOrders.pending, (state: OrderState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state: OrderState, action: PayloadAction<Order[]>) => {
        state.loading = false;
        state.orders = action.payload;
        state.totalPages = Math.ceil(action.payload.length / 10); // Assuming 10 items per page
      })
      .addCase(fetchAllOrders.rejected, (state: OrderState, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Order by ID
      .addCase(fetchOrderById.pending, (state: OrderState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state: OrderState, action: PayloadAction<Order>) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state: OrderState, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Order
      .addCase(createOrder.pending, (state: OrderState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state: OrderState, action: PayloadAction<Order>) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.orders.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state: OrderState, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Order Status
      .addCase(updateOrderStatus.pending, (state: OrderState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state: OrderState, action: PayloadAction<Order>) => {
        state.loading = false;
        const index = state.orders.findIndex(order => order.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        if (state.currentOrder?.id === action.payload.id) {
          state.currentOrder = action.payload;
        }
      })
      .addCase(updateOrderStatus.rejected, (state: OrderState, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentOrder, clearError, setCurrentPage } = orderSlice.actions;
export default orderSlice.reducer; 