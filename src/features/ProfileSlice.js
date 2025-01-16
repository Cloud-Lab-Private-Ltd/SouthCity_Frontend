import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "../config/apiconfig";

export const ProfileGet = createAsyncThunk("ProfileGet", async (userId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(
      `${BASE_URL}/api/v1/sch/members/${userId}`,
      {
        headers: {
          "x-access-token": token,
        },
      }
    );
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
});


export const ProfileSlice = createSlice({
  name: "ProfileData",
  initialState: {
    profile: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(ProfileGet.pending, (state) => {
        state.loading = true;
      })
      .addCase(ProfileGet.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(ProfileGet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default ProfileSlice.reducer;
