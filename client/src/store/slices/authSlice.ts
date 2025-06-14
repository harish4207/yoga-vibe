import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { auth } from '../../services/api';
import type { RootState } from '../index';
import type { User } from '../../types';
import type { AuthResponseFromServer } from '../../services/api';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface ProfileFormData {
  name: string;
  email: string;
  phone?: string;
  bio?: string;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const login = createAsyncThunk<AuthResponseFromServer, { email: string; password: string }>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await auth.login(credentials.email, credentials.password);
      if (!response.success) {
        throw new Error(response.message || 'Login failed');
      }
      localStorage.setItem('token', response.token);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const register = createAsyncThunk<AuthResponseFromServer, { name: string; email: string; password: string }>(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await auth.register(userData);
      if (!response.success) {
        throw new Error(response.message || 'Registration failed');
      }
      localStorage.setItem('token', response.token);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    await auth.logout();
    localStorage.removeItem('token');
  } catch (error) {
    console.error('Logout error:', error);
  }
});

export const getProfile = createAsyncThunk<User, void, { rejectValue: string }>(
  'auth/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      console.log('AuthSlice: Attempting to call auth.getCurrentUser()...');
      const user = await auth.getCurrentUser();
      return user;
    } catch (error: any) {
      console.error('AuthSlice: Error in getProfile thunk catch block:', error);
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to get profile');
    }
  }
);

export const updateProfile = createAsyncThunk<User, ProfileFormData, { rejectValue: string }>(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Object.entries(profileData).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value);
        }
      });
      const response = await auth.updateProfile(formData);
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to update profile');
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update profile');
    }
  }
);

export const uploadProfilePicture = createAsyncThunk<{ profilePicture: string }, FormData, { rejectValue: string }>(
  'auth/uploadProfilePicture',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await auth.uploadProfilePicture(formData);
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to upload profile picture');
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to upload profile picture');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        console.log('AuthSlice: Login fulfilled. Payload:', action.payload);
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        console.error('AuthSlice: Login rejected. Error:', action.payload);
        state.loading = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      // Get Profile
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        console.log('AuthSlice: getProfile fulfilled. Payload user:', action.payload);
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getProfile.rejected, (state, action) => {
        console.error('AuthSlice: getProfile rejected. Error:', action.payload);
        state.loading = false;
        state.error = action.payload as string;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem('token');
      })
      // Update Profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        if (state.user) {
          state.user = { 
            ...state.user, 
            ...action.payload, // Merge updated fields
            profilePicture: action.payload.profilePicture || action.payload.avatar || state.user.profilePicture, // Prioritize profilePicture, fallback to avatar
            avatar: undefined, // Clear avatar if it's just a temporary key
          }; 
        } else {
          state.user = action.payload; // If user was null, set it directly
        }
      })
      // Upload Profile Picture
      .addCase(uploadProfilePicture.fulfilled, (state, action) => {
        if (state.user) {
          state.user = { ...state.user, profilePicture: action.payload.profilePicture };
        }
      });
  },
});

export const { clearError } = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;
export default authSlice.reducer; 