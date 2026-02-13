// region imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchActivityLogs,
  deleteActivityLog,
} from "../../services";
// endregion

// region async thunks

// get activity logs
export const getActivityLogs = createAsyncThunk(
  "activityLogs/getActivityLogs",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await fetchActivityLogs(params || {});
      return response || { logs: [], total: 0 };
    } catch (err) {
      // return error
      return rejectWithValue(err?.response?.data?.message || "Failed to fetch activity logs");
    }
  }
);

// remove activity log
export const removeActivityLog = createAsyncThunk(
  "activityLogs/removeActivityLog",
  async (id = "", { rejectWithValue }) => {
    try {
      await deleteActivityLog(id || "");
      return id || "";
    } catch (err) {
      // return error
      return rejectWithValue(err?.response?.data?.message || "Failed to delete activity log");
    }
  }
);

// endregion

// region initial state
const initialState = {
  list: [],
  total: 0,
  overallTotal: 0,   // actual DB total
  skip: 0,
  limit: 10,
  currentPage: 1,
  totalPages: 1,
  loading: false,
  error: null,
};
// endregion

// region slice
const activityLogSlice = createSlice({
  name: "activityLogs",
  initialState,
  reducers: {
    clearActivityLogError: (state) => {
      // clear error
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // get activity logs
      .addCase(getActivityLogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(getActivityLogs.fulfilled, (state, action) => {
        const payload = action.payload || {};
        state.list = payload.logs || [];
       state.total = payload.total || 0;
state.overallTotal = payload.overallTotal || payload.total || 0;


        state.skip = payload.skip || 0;
        state.limit = payload.limit || 10;
        state.currentPage = payload.currentPage || 1;
        state.totalPages = payload.totalPages || 1;
        state.loading = false;
      })
      .addCase(getActivityLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "";
      })

      // delete activity log
      .addCase(removeActivityLog.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (log) => log.Log_Id !== action.payload
        );
        state.total -= 1;
      });
  },
});
// endregion

// region exports
export const { clearActivityLogError } = activityLogSlice.actions;
export default activityLogSlice.reducer;
// endregion
