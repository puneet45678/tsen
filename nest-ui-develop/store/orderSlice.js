import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "user",
  initialState: { orders: [], tierDetails: {} },
  reducers: {
    setOrder: (state, action) => {
      return { ...state, orders: action.payload };
    },
    setTierDetails: (state, action) => {
      return { ...state, tierDetails: action.payload };
    },
    setCampaignDetails: (state, action) => {
      return { ...state, campaignDetails: action.payload };
    },
  },
});

export const { setOrder, setTierDetails, setCampaignDetails } =
  orderSlice.actions;

export default orderSlice.reducer;
