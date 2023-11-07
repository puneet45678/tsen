import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getCurrentUser = async (userId) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/api/v1/current-user`,
    { withCredentials: true }
  );
  console.log("res.data ", res.data);
  return res.data;
};

export const getCurrentUserThunk = createAsyncThunk(
  "counter/getCurrentUser",
  getCurrentUser
);

const userSlice = createSlice({
  name: "user",
  initialState: {},
  reducers: {
    changeUser: (state, action) => {
      return action.payload;
    },
    clearUser: () => {
      return {};
    },
    addSignUpData: (state, action) => {
      return {
        ...state,
        username: action.payload.username,
        accountInformation: {
          ...state.accountInformation,
          fullName: action.payload.fullName,
          phoneNumber: action.payload.phoneNumber,
        },
      };
    },
    updateAccountInformation: (state, action) => ({
      ...state,
      accountInformation: action.payload,
    }),
    changeProfilePicture: (state, action) => {
      return {
        ...state,
        displayInformation: {
          ...state.displayInformation,
          profilePicture: action.payload,
        },
      };
    },
    changeCoverPicture: (state, action) => {
      return {
        ...state,
        displayInformation: {
          ...state.displayInformation,
          coverPicture: action.payload,
        },
      };
    },
    updateDisplayInformation: (state, action) => ({
      ...state,
      displayInformation: { ...state.displayInformation, ...action.payload },
    }),
    updateUserStatus: (state, action) => ({
      ...state,
      status: action.payload,
    }),
  },
  extraReducers(builder) {
    builder.addCase(getCurrentUserThunk.fulfilled, (state, action) => {
      // console.log("got payload thunk", action.payload);
      return action.payload;
    });
  },
});

export const isLoggedIn = (state) => {
  if (
    state.user.email === undefined ||
    state.user.email === null ||
    state.user.email == ""
  ) {
    return false;
  }
  return true;
};

export const {
  changeUser,
  clearUser,
  addSignUpData,
  updateAccountInformation,
  updateDisplayInformation,
  changeCoverPicture,
  changeProfilePicture,
  updateUserStatus,
} = userSlice.actions;

export default userSlice;
