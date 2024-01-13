// authSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUser, signIn } from "../services/apiHandler"; // Assuming you have an API service function

const initialState = {
  user: null,
  status: "idle", // idle | loading | succeeded | failed
  error: null,
};

export const login = createAsyncThunk("auth/users/getuser", async () => {
  try {
    const response = await getUser();
    return response.data; // Assuming the API response has a 'data' field containing user information
  } catch (error) {
    throw error;
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
