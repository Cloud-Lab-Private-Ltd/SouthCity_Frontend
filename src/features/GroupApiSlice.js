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

export const CoursesGet = createAsyncThunk("CoursesGet", async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${BASE_URL}/api/v1/sch/courses`, {
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

export const BatchesGet = createAsyncThunk("BatchesGet", async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${BASE_URL}/api/v1/sch/batches`, {
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

export const StudentsGet = createAsyncThunk("StudentsGet", async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${BASE_URL}/api/v1/sch/students`, {
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

export const VouchersGet = createAsyncThunk("VouchersGet", async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${BASE_URL}/api/v1/sch/vouchers`, {
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

export const ActionLogsGet = createAsyncThunk("ActionLogsGet", async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${BASE_URL}/api/v1/sch/actionLog`, {
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

export const PermissionsGet = createAsyncThunk("PermissionsGet", async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${BASE_URL}/api/v1/sch/permissions`, {
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

export const NotificationsGet = createAsyncThunk("NotificationsGet", async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${BASE_URL}/api/v1/sch/getNotification`, {
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

export const TrashedStudentsGet = createAsyncThunk("TrashedStudentsGet", async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${BASE_URL}/api/v1/sch/student-trash`, {
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

export const FeesGet = createAsyncThunk("FeesGet", async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${BASE_URL}/api/v1/sch/fees/list`, {
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
    courses: [],
    batches: [],
    students: [],
    vouchers: [],
    actionLogs: [],
    permissionsList: [],
    notifications: [],
    trashedStudents: [],
    fees: [],
    feesLoading: false,
    trashedStudentsLoading: false,
    notificationLoading: false,
    permissionsLoading: false,
    actionLogLoading: false,
    voucherLoading: false,
    studentLoading: false,
    batchLoading: false,
    courseLoading: false,
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
      })
      .addCase(CoursesGet.pending, (state) => {
        state.courseLoading = true;
      })
      .addCase(CoursesGet.fulfilled, (state, action) => {
        state.courseLoading = false;
        state.courses = action.payload;
      })
      .addCase(CoursesGet.rejected, (state, action) => {
        state.courseLoading = false;
        state.error = action.error.message;
      })
      .addCase(BatchesGet.pending, (state) => {
        state.batchLoading = true;
      })
      .addCase(BatchesGet.fulfilled, (state, action) => {
        state.batchLoading = false;
        state.batches = action.payload;
      })
      .addCase(BatchesGet.rejected, (state, action) => {
        state.batchLoading = false;
        state.error = action.error.message;
      })
      .addCase(StudentsGet.pending, (state) => {
        state.studentLoading = true;
      })
      .addCase(StudentsGet.fulfilled, (state, action) => {
        state.studentLoading = false;
        state.students = action.payload;
      })
      .addCase(StudentsGet.rejected, (state, action) => {
        state.studentLoading = false;
        state.error = action.error.message;
      })
      .addCase(VouchersGet.pending, (state) => {
        state.voucherLoading = true;
      })
      .addCase(VouchersGet.fulfilled, (state, action) => {
        state.voucherLoading = false;
        state.vouchers = action.payload;
      })
      .addCase(VouchersGet.rejected, (state, action) => {
        state.voucherLoading = false;
        state.error = action.error.message;
      })
      .addCase(ActionLogsGet.pending, (state) => {
        state.actionLogLoading = true;
      })
      .addCase(ActionLogsGet.fulfilled, (state, action) => {
        state.actionLogLoading = false;
        state.actionLogs = action.payload;
      })
      .addCase(ActionLogsGet.rejected, (state, action) => {
        state.actionLogLoading = false;
        state.error = action.error.message;
      })
      .addCase(PermissionsGet.pending, (state) => {
        state.permissionsLoading = true;
      })
      .addCase(PermissionsGet.fulfilled, (state, action) => {
        state.permissionsLoading = false;
        state.permissionsList = action.payload;
      })
      .addCase(PermissionsGet.rejected, (state, action) => {
        state.permissionsLoading = false;
        state.error = action.error.message;
      })
      .addCase(NotificationsGet.pending, (state) => {
        state.notificationLoading = true;
      })
      .addCase(NotificationsGet.fulfilled, (state, action) => {
        state.notificationLoading = false;
        state.notifications = action.payload;
      })
      .addCase(NotificationsGet.rejected, (state, action) => {
        state.notificationLoading = false;
        state.error = action.error.message;
      })
      .addCase(TrashedStudentsGet.pending, (state) => {
        state.trashedStudentsLoading = true;
      })
      .addCase(TrashedStudentsGet.fulfilled, (state, action) => {
        state.trashedStudentsLoading = false;
        state.trashedStudents = action.payload;
      })
      .addCase(TrashedStudentsGet.rejected, (state, action) => {
        state.trashedStudentsLoading = false;
        state.error = action.error.message;
      })
      .addCase(FeesGet.pending, (state) => {
        state.feesLoading = true;
      })
      .addCase(FeesGet.fulfilled, (state, action) => {
        state.feesLoading = false;
        state.fees = action.payload;
      })
      .addCase(FeesGet.rejected, (state, action) => {
        state.feesLoading = false;
        state.error = action.error.message;
      })
  },
});

export default GroupSlice.reducer;
