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

export const fetchCourses = createAsyncThunk<Course[], string | undefined, { rejectValue: ApiError }>(
    'courses/fetchCourses',
    async (search, { rejectWithValue }) => {
        try {
            const params = search ? { params: { search } } : {};
            const response = await apiClient.get<Course[]>('/courses', params);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data || { error: 'Failed to fetch courses' });
        }
    }
);

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

export const createCourse = createAsyncThunk<Course, { title: string; description: string }, { rejectValue: ApiError }>(
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

export const updateCourse = createAsyncThunk<Course, { id: number; title: string; description: string }, { rejectValue: ApiError }>(
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
        clearCurrentCourse(state) { state.currentCourse = null; },
        clearError(state) { state.error = null; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCourses.pending, (s) => { s.isLoading = true; s.error = null; })
            .addCase(fetchCourses.fulfilled, (s, a) => { s.isLoading = false; s.items = a.payload; })
            .addCase(fetchCourses.rejected, (s, a) => { s.isLoading = false; s.error = a.payload?.error || 'Failed'; })

            .addCase(fetchCourseById.pending, (s) => { s.isLoading = true; s.error = null; })
            .addCase(fetchCourseById.fulfilled, (s, a) => { s.isLoading = false; s.currentCourse = a.payload; })
            .addCase(fetchCourseById.rejected, (s, a) => { s.isLoading = false; s.error = a.payload?.error || 'Failed'; })

            .addCase(createCourse.pending, (s) => { s.isLoading = true; s.error = null; })
            .addCase(createCourse.fulfilled, (s, a) => { s.isLoading = false; s.items.push(a.payload); })
            .addCase(createCourse.rejected, (s, a) => { s.isLoading = false; s.error = a.payload?.error || 'Failed'; })

            .addCase(updateCourse.pending, (s) => { s.isLoading = true; s.error = null; })
            .addCase(updateCourse.fulfilled, (s, a) => {
                s.isLoading = false; s.currentCourse = a.payload;
                const i = s.items.findIndex((c) => c.id === a.payload.id);
                if (i !== -1) s.items[i] = a.payload;
            })
            .addCase(updateCourse.rejected, (s, a) => { s.isLoading = false; s.error = a.payload?.error || 'Failed'; })

            .addCase(deleteCourse.pending, (s) => { s.isLoading = true; s.error = null; })
            .addCase(deleteCourse.fulfilled, (s, a) => {
                s.isLoading = false;
                s.items = s.items.filter((c) => c.id !== a.payload);
                if (s.currentCourse?.id === a.payload) s.currentCourse = null;
            })
            .addCase(deleteCourse.rejected, (s, a) => { s.isLoading = false; s.error = a.payload?.error || 'Failed'; });
    },
});

export const { clearCurrentCourse, clearError } = coursesSlice.actions;
export default coursesSlice.reducer;