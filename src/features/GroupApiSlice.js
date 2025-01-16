import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "../config/apiconfig";

export const GroupGet = createAsyncThunk("GroupGet", async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${BASE_URL}/api/v1/sch/groups`, {
      headers: {
        "x-access-token": token,
      },
    });
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
});

export const MembersGet = createAsyncThunk("MembersGet", async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${BASE_URL}/api/v1/sch/members`, {
      headers: {
        "x-access-token": token,
      },
    });
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
});

export const DegreeTypesGet = createAsyncThunk("DegreeTypesGet", async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${BASE_URL}/api/v1/sch/degree-types`, {
      headers: {
        "x-access-token": token,
      },
    });
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
});

export const StatusesGet = createAsyncThunk("StatusesGet", async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${BASE_URL}/api/v1/sch/statuses`, {
      headers: {
        "x-access-token": token,
      },
    });
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
});

export const GroupSlice = createSlice({
  name: "GroupData",
  initialState: {
    groups: [],
    members: [],
    degreeTypes: [], // Add this
    statuses: [],
    statusLoading: false,
    loading: false,
    groupLoading: false,
    memberLoading: false,
    degreeTypeLoading: false, // Add this
    error: null,

  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GroupGet.pending, (state) => {
        state.loading = true;
      })
      .addCase(GroupGet.fulfilled, (state, action) => {
        state.loading = false;
        state.groups = action.payload;
      })
      .addCase(GroupGet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(MembersGet.pending, (state) => {
        state.memberLoading = true;
      })
      .addCase(MembersGet.fulfilled, (state, action) => {
        state.memberLoading = false;
        state.members = action.payload;
      })
      .addCase(MembersGet.rejected, (state, action) => {
        state.memberLoading = false;
        state.error = action.error.message;
      })
      .addCase(DegreeTypesGet.pending, (state) => {
        state.degreeTypeLoading = true;
      })
      .addCase(DegreeTypesGet.fulfilled, (state, action) => {
        state.degreeTypeLoading = false;
        state.degreeTypes = action.payload;
      })
      .addCase(DegreeTypesGet.rejected, (state, action) => {
        state.degreeTypeLoading = false;
        state.error = action.error.message;
      })
      .addCase(StatusesGet.pending, (state) => {
        state.statusLoading = true;
      })
      .addCase(StatusesGet.fulfilled, (state, action) => {
        state.statusLoading = false;
        state.statuses = action.payload;
      })
      .addCase(StatusesGet.rejected, (state, action) => {
        state.statusLoading = false;
        state.error = action.error.message;
      });
  },
});

export default GroupSlice.reducer;
