import { configureStore } from "@reduxjs/toolkit";
import ProfileSlice from "../features/ProfileSlice";
import GroupSlice from "../features/GroupApiSlice";

export const store = configureStore({
  reducer: {
    profiledata: ProfileSlice,
    groupdata: GroupSlice,
  },
  devTools: process.env.NODE_ENV !== "production",
});
