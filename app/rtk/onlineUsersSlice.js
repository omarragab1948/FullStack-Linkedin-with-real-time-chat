const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  onlineUsers: [],
};

const onlineUsersSlice = createSlice({
  name: "onlineUsers",
  initialState,
  reducers: {
    addOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
  },
});
export const { addOnlineUsers } = onlineUsersSlice.actions;
export default onlineUsersSlice.reducer;
