// region imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createAdmin, deleteAdmin } from "../../services/";
import { showToast } from "../../features";
// endregion

// region async thunks
export const createNewAdmin = createAsyncThunk(
  "superAdmin/createAdmin",
  async (data = {}, { dispatch, rejectWithValue }) => {
    try {
      const res = await createAdmin(data || {});
      dispatch(showToast({ message: "Admin created successfully!", type: "success" }));
      return res || null;
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to create admin";
      dispatch(showToast({ message, type: "error" }));
      return rejectWithValue(message);
    }
  }
);



// Optional: For future use if admin deletion UI is added
export const removeAdmin = createAsyncThunk(
  "superAdmin/removeAdmin",
  async (id = "", { dispatch, rejectWithValue }) => {
    try {
      await deleteAdmin(id || "");
      dispatch(showToast({ message: "Admin removed successfully", type: "success" }));
      return id;
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to delete admin";
      dispatch(showToast({ message, type: "error" }));
      return rejectWithValue(message);
    }
  }
);
// endregion

// region slice
const superAdminSlice = createSlice({
  name: "superAdmin",
  initialState: {
    loading: false,
    error: null,

  },
  reducers: {
    clearSuperAdminError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // region createAdmin cases
      .addCase(createNewAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewAdmin.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createNewAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error";
      })
      // endregion

      // region removeAdmin cases
      .addCase(removeAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeAdmin.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(removeAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error";
      });
      // endregion
      // endregion
  },
});
// endregion

// region exports
export const { clearSuperAdminError } = superAdminSlice.actions || {};
export default superAdminSlice.reducer;
// endregion
