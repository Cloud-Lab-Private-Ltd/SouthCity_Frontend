import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "../config/apiconfig";

// Async thunk to fetch all ledgers
export const AllLedgersGet = createAsyncThunk(
  "AllLedgersGet",
  async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/sch/ledgers`,
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
  }
);

// Async thunk to fetch student ledger data
export const StudentLedgerGet = createAsyncThunk(
  "StudentLedgerGet",
  async (studentId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/sch/ledger/student/${studentId}`,
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
  }
);

// Async thunk to fetch payment history for a voucher
export const VoucherPaymentHistoryGet = createAsyncThunk(
  "VoucherPaymentHistoryGet",
  async (voucherId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/sch/ledger/voucher/${voucherId}/payments`,
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
  }
);

// Create the ledger slice
export const LedgerSlice = createSlice({
  name: "LedgerData",
  initialState: {
    studentLedger: null,
    voucherPayments: [],
    allLedgers: [],
    loading: false,
    paymentsLoading: false,
    allLedgersLoading: false,
    error: null,
    paymentsError: null,
    allLedgersError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle StudentLedgerGet states
      .addCase(StudentLedgerGet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(StudentLedgerGet.fulfilled, (state, action) => {
        state.loading = false;
        state.studentLedger = action.payload;
      })
      .addCase(StudentLedgerGet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Handle VoucherPaymentHistoryGet states
      .addCase(VoucherPaymentHistoryGet.pending, (state) => {
        state.paymentsLoading = true;
        state.paymentsError = null;
      })
      .addCase(VoucherPaymentHistoryGet.fulfilled, (state, action) => {
        state.paymentsLoading = false;
        state.voucherPayments = action.payload;
      })
      .addCase(VoucherPaymentHistoryGet.rejected, (state, action) => {
        state.paymentsLoading = false;
        state.paymentsError = action.error.message;
      })
      
      // Handle AllLedgersGet states
      .addCase(AllLedgersGet.pending, (state) => {
        state.allLedgersLoading = true;
        state.allLedgersError = null;
      })
      .addCase(AllLedgersGet.fulfilled, (state, action) => {
        state.allLedgersLoading = false;
        state.allLedgers = action.payload;
      })
      .addCase(AllLedgersGet.rejected, (state, action) => {
        state.allLedgersLoading = false;
        state.allLedgersError = action.error.message;
      });
  },
});

export default LedgerSlice.reducer;
