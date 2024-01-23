import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUser } from "../services/apiHandler";

const initialState = {
  user: null,
  status: "idle",
  error: null,
};

export const login = createAsyncThunk("auth/users/getuser", async () => {
  try {
    const response = await getUser();
    return response.data;
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
