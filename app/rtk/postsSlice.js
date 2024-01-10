// postsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllPosts } from "../services/apiHandler";

const initialState = {
  posts: [],
  status: "idle", // Can be 'idle', 'loading', 'succeeded', or 'failed'
  error: null,
};

export const fetchPosts = createAsyncThunk(
  "api/posts/getallposts",
  async () => {
    try {
      const response = await getAllPosts();
      console.log(response);
      return response.data; // Assuming your API returns an array of posts
    } catch (error) {
      throw error;
    }
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts = action.payload;
        console.log(action.payload);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default postsSlice.reducer;
