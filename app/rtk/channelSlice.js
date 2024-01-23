import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  channel: "",
};

const channelSlice = createSlice({
  name: "channel",
  initialState,
  reducers: {
    setChannel: (state, action) => {
      state.channel = action.payload;
    },
  },
});

export const { setChannel } = channelSlice.actions;

export default channelSlice.reducer;
