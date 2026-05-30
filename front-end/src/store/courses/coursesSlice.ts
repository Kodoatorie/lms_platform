import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Course, ApiError } from '../../types';
import apiClient from '../../lib/api/client';

interface CoursesState {
  items: Course[];
  currentCourse: Course | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CoursesState = {
  items: [],
  currentCourse: null,
  isLoading: false,
  error: null,
};

// ─── Fetch all courses ───────────────────────────────────────────────────────
export const fetchCourses = createAsyncThunk<Course[], void, { rejectValue: ApiError }>(
  'courses/fetchCourses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<Course[]>('/courses');
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { error: 'Failed to fetch courses' });
    }
  }
);

// ─── Fetch single course ─────────────────────────────────────────────────────
export const fetchCourseById = createAsyncThunk<Course, number, { rejectValue: ApiError }>(
  'courses/fetchCourseById',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<Course>(`/courses/${courseId}`);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { error: 'Failed to fetch course' });
    }
  }
);

// ─── Create course ───────────────────────────────────────────────────────────
export const createCourse = createAsyncThunk<
  Course,
  { title: string; description: string },
  { rejectValue: ApiError }
>(
  'courses/createCourse',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<Course>('/courses', payload);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { error: 'Failed to create course' });
    }
  }
);

// ─── Update course ───────────────────────────────────────────────────────────
export const updateCourse = createAsyncThunk<
  Course,
  { id: number; title: string; description: string },
  { rejectValue: ApiError }
>(
  'courses/updateCourse',
  async ({ id, ...payload }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch<Course>(`/courses/${id}`, payload);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { error: 'Failed to update course' });
    }
  }
);

// ─── Delete course ───────────────────────────────────────────────────────────
export const deleteCourse = createAsyncThunk<number, number, { rejectValue: ApiError }>(
  'courses/deleteCourse',
  async (courseId, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/courses/${courseId}`);
      return courseId;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { error: 'Failed to delete course' });
    }
  }
);

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    clearCurrentCourse(state) {
      state.currentCourse = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ── fetchCourses ──
      .addCase(fetchCourses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.error || 'Failed to fetch courses';
      })
      // ── fetchCourseById ──
      .addCase(fetchCourseById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCourse = action.payload;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.error || 'Failed to fetch course';
      })
      // ── createCourse ──
      .addCase(createCourse.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items.push(action.payload);
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.error || 'Failed to create course';
      })
      // ── updateCourse ──
      .addCase(updateCourse.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCourse = action.payload;
        const idx = state.items.findIndex((c) => c.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.error || 'Failed to update course';
      })
      // ── deleteCourse ──
      .addCase(deleteCourse.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter((c) => c.id !== action.payload);
        if (state.currentCourse?.id === action.payload) {
          state.currentCourse = null;
        }
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.error || 'Failed to delete course';
      });
  },
});

export const { clearCurrentCourse, clearError } = coursesSlice.actions;
export default coursesSlice.reducer;