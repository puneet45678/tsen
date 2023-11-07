import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cart",
    initialState: { cart: [], tierDetails: {} },
    reducers: {
        setCart: (state, action) => {
            return { ...state, cart: action.payload };
        },
        setTierDetails: (state, action) => {
            return { ...state, tierDetails: action.payload };
        },
    },
});

export const { setCart, setTierDetails } = cartSlice.actions;

export default cartSlice.reducer;
