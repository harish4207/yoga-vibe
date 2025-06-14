import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { YogaClass } from '../../types/index';
import { classes as apiClasses } from '../../services/api';
import type { RootState } from '../index';
import { toast } from 'react-toastify';

interface ClassState {
  classes: YogaClass[];
  classDetail: YogaClass | null;
  loading: boolean;
  error: string | null;
}

const initialState: ClassState = {
  classes: [],
  classDetail: null,
  loading: false,
  error: null,
};

export const fetchClasses = createAsyncThunk(
  'classes/fetchClasses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClasses.getAllClasses();
      return response.data.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch classes.');
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch classes.');
    }
  }
);

export const fetchClassById = createAsyncThunk(
  'classes/fetchClassById',
  async (classId: string, { rejectWithValue }) => {
    try {
      const response = await apiClasses.getClassById(classId);
      return response.data.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch class details.');
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch class details.');
    }
  }
);

const classSlice = createSlice({
  name: 'classes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClasses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = action.payload;
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchClassById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClassById.fulfilled, (state, action) => {
        state.loading = false;
        state.classDetail = action.payload;
      })
      .addCase(fetchClassById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default classSlice.reducer; 