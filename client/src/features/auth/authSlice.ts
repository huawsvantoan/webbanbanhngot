import { createSlice, createAsyncThunk, PayloadAction, ActionReducerMapBuilder } from '@reduxjs/toolkit';
import authService, { User, LoginData, RegisterData } from '../../services/authService';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  users: User[];
}

const initialState: AuthState = {
  user: authService.getCurrentUser(),
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
  users: [],
};

export const login = createAsyncThunk<
  { token: string; user: User },
  LoginData,
  { rejectValue: string }
>('auth/login', async (data: LoginData, { rejectWithValue }) => {
  try {
    const response = await authService.login(data);
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    return response;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Login failed');
  }
});

export const register = createAsyncThunk<
  void,
  RegisterData,
  { rejectValue: string }
>('auth/register', async (data: RegisterData, { rejectWithValue }) => {
  try {
    await authService.register(data);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Registration failed');
  }
});

export const getProfile = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>('auth/getProfile', async (_, { rejectWithValue }) => {
  try {
    const user = await authService.getProfile();
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to get profile');
  }
});

export const updateProfile = createAsyncThunk<
  void,
  Partial<User>,
  { rejectValue: string }
>('auth/updateProfile', async (data: Partial<User>, { rejectWithValue }) => {
  try {
    await authService.updateProfile(data);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
  }
});

export const fetchAllUsers = createAsyncThunk<
  User[],
  void,
  { rejectValue: string }
>('auth/fetchAllUsers', async (_, { rejectWithValue }) => {
  try {
    const users = await authService.getAllUsers();
    return users;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
  }
});

export const changePassword = createAsyncThunk<
  { message: string },
  { oldPassword: string; newPassword: string },
  { rejectValue: string }
>('auth/changePassword', async (data, { rejectWithValue }) => {
  try {
    const response = await authService.changePassword(data);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Đổi mật khẩu thất bại');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state: AuthState) => {
      state.user = null;
      state.token = null;
      state.error = null;
      authService.logout();
      console.log("Redux state after logout reducer:", state);
    },
    clearError: (state: AuthState) => {
      state.error = null;
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<AuthState>) => {
    builder
      // Login
      .addCase(login.pending, (state: AuthState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state: AuthState, action: PayloadAction<{ token: string; user: User }>) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state: AuthState, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(register.pending, (state: AuthState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state: AuthState) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state: AuthState, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get Profile
      .addCase(getProfile.pending, (state: AuthState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state: AuthState, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getProfile.rejected, (state: AuthState, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Profile
      .addCase(updateProfile.pending, (state: AuthState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state: AuthState) => {
        state.loading = false;
      })
      .addCase(updateProfile.rejected, (state: AuthState, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch All Users
      .addCase(fetchAllUsers.pending, (state: AuthState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state: AuthState, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state: AuthState, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Change Password
      .addCase(changePassword.pending, (state: AuthState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state: AuthState) => {
        state.loading = false;
      })
      .addCase(changePassword.rejected, (state: AuthState, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer; 