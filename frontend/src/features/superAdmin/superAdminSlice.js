// region imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  changeAdminPermission,
} from "../../services";
// endregion

// region async thunks

// get admins
export const getAdmins = createAsyncThunk(
  "superAdmin/getAdmins",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await fetchAdmins(params || {});
      return response || { admins: [], total: 0 };
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to fetch admins"
      );
    }
  }
);

// add admin
export const addAdmin = createAsyncThunk(
  "superAdmin/addAdmin",
  async (data = {}, { rejectWithValue }) => {
    try {
      const response = await createAdmin(data || {});
      return response || null;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to create admin"
      );
    }
  }
);

// edit admin
export const editAdmin = createAsyncThunk(
  "superAdmin/editAdmin",
  async ({ id = "", data = {} }, { rejectWithValue }) => {
    try {
      const response = await updateAdmin(id || "", data || {});
      return response || null;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to update admin"
      );
    }
  }
);

// remove admin
export const removeAdmin = createAsyncThunk(
  "superAdmin/removeAdmin",
  async (id = "", { rejectWithValue }) => {
    try {
      await deleteAdmin(id || "");
      return id || "";
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to delete admin"
      );
    }
  }
);

// update admin permission
export const updateAdminPermission = createAsyncThunk(
  "superAdmin/updateAdminPermission",
  async ({ id = "", permission = "" }, { rejectWithValue }) => {
    try {
      const response = await changeAdminPermission(id || "", permission || "");
      return response || null;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to update admin permission"
      );
    }
  }
);

// endregion

// region initial state
const initialState = {
  list: [],
  total: 0,          // filtered total
  overallTotal: 0,  
  page: 1,
  limit: 5,
  totalPages: 1,
  loading: false,
  error: null,
};
// endregion

// region slice
const superAdminSlice = createSlice({
  name: "superAdmin",
  initialState,
  reducers: {
    clearSuperAdminError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // get admins
      .addCase(getAdmins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
  .addCase(getAdmins.fulfilled, (state, action) => {
  const payload = action.payload || {};

  state.list = payload.admins || [];
  state.total = payload.filteredTotal || 0;   
    state.overallTotal = action.payload?.overallTotal || 0; 
  state.page = payload.currentPage || 1;
  state.limit = payload.limit || state.limit;
  state.totalPages = payload.totalPages || 1;
  state.loading = false;
})

      .addCase(getAdmins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "";
      })

      // add admin (do NOT unshift — pagination safe)
      .addCase(addAdmin.fulfilled, (state) => {
        state.total += 1;
      })

      // edit admin
      .addCase(editAdmin.fulfilled, (state, action) => {
        const updated = action.payload || {};
        state.list = state.list.map((admin) =>
          admin.Admin_Id === updated.Admin_Id ? updated : admin
        );
      })

      // remove admin (pagination safe)
      .addCase(removeAdmin.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (admin) => admin.Admin_Id !== action.payload
        );
        state.total -= 1;

        state.totalPages = Math.max(
          1,
          Math.ceil(state.total / state.limit)
        );

        if (state.page > state.totalPages) {
          state.page = state.totalPages;
        }
      })

      // update permission
      .addCase(updateAdminPermission.fulfilled, (state, action) => {
        const updated = action.payload || {};
        state.list = state.list.map((admin) =>
          admin.Admin_Id === updated.Admin_Id ? updated : admin
        );
      });
  },
});
// endregion



// region exports
export const { clearSuperAdminError } = superAdminSlice.actions;
export default superAdminSlice.reducer;
// endregion
