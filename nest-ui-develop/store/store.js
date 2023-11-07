import { configureStore } from "@reduxjs/toolkit";
import counterSlice from "./counterSlice";
import sectionSlice from "./sectionSlice";
import userSlice from "./userSlice";
import searchSlice from "./searchSlice";
import campaignSlice from "./campaignSlice";
import indexSlice from "./indexSlice";
import orderSlice from "./orderSlice";
import cartSlice from "./cartSlice";
import modelSlice from "./modelSlice";

export default configureStore({
  reducer: {
    user: userSlice.reducer,
    counter: counterSlice,
    section: sectionSlice,
    index: indexSlice,
    search: searchSlice,
    campaign: campaignSlice,
    order: orderSlice,
    cart: cartSlice,
    model: modelSlice,
  },
});
