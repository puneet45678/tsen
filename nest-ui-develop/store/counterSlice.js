import { createSlice } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
  name: "counter",
  initialState: {
    value: 0,
    email: "dhruvmuthria@gmail.com",
    username: "dhruv",
    displayPic: {},
    coverPic: {},
    tierPic: {},
    data: {},
  },
  reducers: {
    changeDisplayPic: (state, action) => {
      state.displayPic = action.payload;
    },
    changeCoverPic: (state, action) => {
      state.coverPic = action.payload;
    },
  },
});

export const { changeCoverPic, changeDisplayPic } = counterSlice.actions;

export default counterSlice.reducer;
