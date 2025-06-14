import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { YogaClass } from '../../types';
import { classes as apiClasses } from '../../services/api';
import type { RootState } from '../index';
import { toast } from 'react-toastify';

interface ClassState {
  classes: YogaClass[];
  currentClass: YogaClass | null;
  loading: boolean;
  error: string | null;
}

const initialState: ClassState = {
  classes: [],
  currentClass: null,
  loading: false,
  error: null,
};

export const fetchClasses = createAsyncThunk('classes/fetchAll', async (params?: any) => {
  const response = await apiClasses.getAll(params);
  return response.data;
});

export const fetchClassById = createAsyncThunk('classes/fetchById', async (id: string) => {
  const response = await apiClasses.getById(id);
  return response.data;
});

export const createClass = createAsyncThunk(
  'classes/createClass',
  async (classData: any, { rejectWithValue }) => {
    try {
      const response = await apiClasses.create(classData);

      if (!response.success) {
        throw new Error(response.message || 'Failed to create class');
      }

      toast.success('Class created successfully!');
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create class');
      return rejectWithValue(error.response?.data?.message || 'Failed to create class');
    }
  }
);

export const updateClass = createAsyncThunk(
  'classes/updateClass',
  async ({ id, classData }: { id: string; classData: any }, { rejectWithValue }) => {
    try {
      const response = await apiClasses.update(id, classData);

      if (!response.success) {
        throw new Error(response.message || 'Failed to update class');
      }

      toast.success('Class updated successfully!');
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update class');
      return rejectWithValue(error.response?.data?.message || 'Failed to update class');
    }
  }
);

export const deleteClass = createAsyncThunk(
  'classes/deleteClass',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiClasses.delete(id);

      if (!response.success) {
        throw new Error(response.message || 'Failed to delete class');
      }

      toast.success('Class deleted successfully!');
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete class');
      return rejectWithValue(error.response?.data?.message || 'Failed to delete class');
    }
  }
);

export const enrollInClass = createAsyncThunk(
  'classes/enrollInClass',
  async (classId: string, { rejectWithValue }) => {
    try {
      const response = await apiClasses.enroll(classId);

      if (!response.success) {
        throw new Error(response.message || 'Failed to enroll in class');
      }

      toast.success('Successfully enrolled in class!');
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to enroll in class');
      return rejectWithValue(error.response?.data?.message || 'Failed to enroll in class');
    }
  }
);

export const unenrollFromClass = createAsyncThunk(
  'classes/unenrollFromClass',
  async (classId: string, { rejectWithValue }) => {
    try {
      const response = await apiClasses.unenroll(classId);

      if (!response.success) {
        throw new Error(response.message || 'Failed to unenroll from class');
      }

      toast.success('Successfully unenrolled from class!');
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to unenroll from class');
      return rejectWithValue(error.response?.data?.message || 'Failed to unenroll from class');
    }
  }
);

const classSlice = createSlice({
  name: 'classes',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentClass: (state) => {
      state.currentClass = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Classes
      .addCase(fetchClasses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = action.payload.data;
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch classes';
      })
      // Fetch Class by ID
      .addCase(fetchClassById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClassById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentClass = action.payload.data;
      })
      .addCase(fetchClassById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch class';
      })
      // Create Class
      .addCase(createClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createClass.fulfilled, (state, action) => {
        state.loading = false;
        state.classes.push(action.payload.data);
      })
      .addCase(createClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create class';
      })
      // Update Class
      .addCase(updateClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateClass.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.classes.findIndex((c) => c._id === action.payload.data._id);
        if (index !== -1) {
          state.classes[index] = action.payload.data;
        }
        if (state.currentClass?._id === action.payload.data._id) {
          state.currentClass = action.payload.data;
        }
      })
      .addCase(updateClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update class';
      })
      // Delete Class
      .addCase(deleteClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteClass.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = state.classes.filter((c) => c._id !== action.payload.data._id);
        if (state.currentClass?._id === action.payload.data._id) {
          state.currentClass = null;
        }
      })
      .addCase(deleteClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete class';
      })
      // Enroll in Class
      .addCase(enrollInClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(enrollInClass.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentClass?._id === action.payload.data._id) {
          state.currentClass = action.payload.data;
        }
      })
      .addCase(enrollInClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to enroll in class';
      })
      // Unenroll from Class
      .addCase(unenrollFromClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unenrollFromClass.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentClass?._id === action.payload.data._id) {
          state.currentClass = action.payload.data;
        }
      })
      .addCase(unenrollFromClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to unenroll from class';
      });
  },
});

export const { clearError, clearCurrentClass } = classSlice.actions;
export default classSlice.reducer; 