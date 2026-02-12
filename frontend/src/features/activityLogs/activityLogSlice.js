// region imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchActivityLogs,
  deleteActivityLog,
} from "../../services";
// endregion

// region async thunks

// fetch activity logs
export const getActivityLogs = createAsyncThunk(
  "activityLogs/getActivityLogs",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await fetchActivityLogs(params);
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message ||
          "Failed to fetch activity logs"
      );
    }
  }
);

// delete activity log
export const removeActivityLog = createAsyncThunk(
  "activityLogs/removeActivityLog",
  async (id, { rejectWithValue }) => {
    try {
      await deleteActivityLog(id);
      return id;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message ||
          "Failed to delete activity log"
      );
    }
  }
);

// endregion

// region initial state
const initialState = {
  list: [],
  total: 0,
  skip: 0,
  limit: 20,
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
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // fetch activity logs
      .addCase(getActivityLogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(getActivityLogs.fulfilled, (state, action) => {
        state.list = action.payload?.logs || [];
        state.total = action.payload?.total || 0;
        state.skip = action.payload?.skip || 0;
        state.limit = action.payload?.limit || 20;
        state.currentPage =
          action.payload?.currentPage || 1;
        state.totalPages =
          action.payload?.totalPages || 1;
        state.loading = false;
      })
      .addCase(getActivityLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // delete activity log
      .addCase(removeActivityLog.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (log) => log._id !== action.payload
        );
        state.total -= 1;
      });
  },
});
// endregion

// region exports
export const { clearActivityLogError } =
  activityLogSlice.actions;

export default activityLogSlice.reducer;
// endregion
