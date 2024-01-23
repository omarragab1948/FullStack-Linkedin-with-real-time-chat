// store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import channelReducer from "./channelSlice";
import onlineUsersReducer from "./onlineUsersSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    channel: channelReducer,
    onlineUsers: onlineUsersReducer,
  },
});

export default store;
