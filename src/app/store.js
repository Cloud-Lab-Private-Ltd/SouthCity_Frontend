import { configureStore } from "@reduxjs/toolkit";
import ProfileSlice from "../features/ProfileSlice";
import GroupSlice from "../features/GroupApiSlice";
import LedgerSlice from "../features/LedgerApiSlice";

export const store = configureStore({
  reducer: {
    profiledata: ProfileSlice,
    groupdata: GroupSlice,
    ledgerdata: LedgerSlice,
  },
  devTools: process.env.NODE_ENV !== "production",
});
