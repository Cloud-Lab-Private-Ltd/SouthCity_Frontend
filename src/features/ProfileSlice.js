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

export const StudentGet = createAsyncThunk("StudentGet", async () => {
  const token = localStorage.getItem("token");
  const studentId = localStorage.getItem("userId");
  try {
    const response = await fetch(
      `${BASE_URL}/api/v1/sch/students/${studentId}`,
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

export const VoucherGet = createAsyncThunk("VoucherGet", async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(
      `${BASE_URL}/api/v1/sch/user/vouchers`,
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
    student: [],
    vouchers: [],
    loading: false,
    studentLoading: false,
    voucherLoading: false,
    error: null,
    studentError: null,
    voucherError: null,
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
      })
      // Student API cases
      .addCase(StudentGet.pending, (state) => {
        state.studentLoading = true;
      })
      .addCase(StudentGet.fulfilled, (state, action) => {
        state.studentLoading = false;
        state.student = action.payload;
      })
      .addCase(StudentGet.rejected, (state, action) => {
        state.studentLoading = false;
        state.studentError = action.error.message;
      })
      .addCase(VoucherGet.pending, (state) => {
        state.voucherLoading = true;
      })
      .addCase(VoucherGet.fulfilled, (state, action) => {
        state.voucherLoading = false;
        state.vouchers = action.payload;
      })
      .addCase(VoucherGet.rejected, (state, action) => {
        state.voucherLoading = false;
        state.voucherError = action.error.message;
      })
  },
});

export default ProfileSlice.reducer;
