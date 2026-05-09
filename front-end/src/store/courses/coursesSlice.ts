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

const coursesSlice = createSlice({
 name: 'courses',
 initialState,
 reducers: {
 clearCurrentCourse(state) {
 state.currentCourse = null;
 }
 },
 extraReducers: (builder) => {
 builder
 // Fetch Courses
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
 // Fetch Single Course
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
 });
 },
});

export const { clearCurrentCourse } = coursesSlice.actions;
export default coursesSlice.reducer;
