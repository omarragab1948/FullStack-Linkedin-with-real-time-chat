// postsSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllPosts } from "../services/apiHandler";

// Async thunk to fetch all posts
export const fetchPosts = createAsyncThunk(
  "/api/posts/getallposts",
  async () => {
    const response = await getAllPosts();
    return response.data; // Assuming API returns an object with a 'data' property
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    status: "idle", // 'idle', 'loading', 'succeeded', 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default postsSlice.reducer;
