// region imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchActivityLogs, deleteActivityLog } from "../../services";
// endregion

// region async thunks

// get activity logs
export const getActivityLogs = createAsyncThunk(
  "activityLogs/getActivityLogs",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await fetchActivityLogs(params || {});
      return (
        response || {
          logs: [],
          filteredTotal: 0,
          overallTotal: 0,
          currentPage: 1,
          totalPages: 1,
          limit: 10,
          skip: 0,
        }
      );
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to fetch activity logs",
      );
    }
  },
);

// remove activity log
export const removeActivityLog = createAsyncThunk(
  "activityLogs/removeActivityLog",
  async (id = "", { rejectWithValue }) => {
    try {
      await deleteActivityLog(id || "");
      return id || "";
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to delete activity log",
      );
    }
  },
);
// endregion

// region initial state
const initialState = {
  list: [],
  total: 0, //  filteredTotal
  overallTotal: 0, //  actual DB total
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
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch logs
      .addCase(getActivityLogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(getActivityLogs.fulfilled, (state, action) => {


        const payload = action.payload || {};

        console.log("payload:", payload);


        state.list = payload.logs || [];

      state.total = payload.filteredTotal || 0;
state.overallTotal = payload.overallTotal || 0;


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

      // delete log
      .addCase(removeActivityLog.fulfilled, (state, action) => {
        state.list = state.list.filter((log) => log.Log_Id !== action.payload);

        //  update both counts safely
        state.total = Math.max(0, state.total - 1);
        state.overallTotal = Math.max(0, state.overallTotal - 1);
      });
  },
});
// endregion

// region exports
export const { clearActivityLogError } = activityLogSlice.actions;
export default activityLogSlice.reducer;
// endregion
