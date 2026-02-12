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

// fetch admins
export const getAdmins = createAsyncThunk(
  "superAdmin/getAdmins",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await fetchAdmins(params);
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to fetch admins"
      );
    }
  }
);

// create admin
export const addAdmin = createAsyncThunk(
  "superAdmin/addAdmin",
  async (data, { rejectWithValue }) => {
    try {
      return await createAdmin(data);
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to create admin"
      );
    }
  }
);

// update admin
export const editAdmin = createAsyncThunk(
  "superAdmin/editAdmin",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await updateAdmin(id, data);
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to update admin"
      );
    }
  }
);

// delete admin
export const removeAdmin = createAsyncThunk(
  "superAdmin/removeAdmin",
  async (id, { rejectWithValue }) => {
    try {
      await deleteAdmin(id);
      return id;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to delete admin"
      );
    }
  }
);

// change admin permission
export const updateAdminPermission = createAsyncThunk(
  "superAdmin/updateAdminPermission",
  async ({ id, permission }, { rejectWithValue }) => {
    try {
      return await changeAdminPermission(id, permission);
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message ||
          "Failed to update admin permission"
      );
    }
  }
);

// endregion

// region initial state
const initialState = {
  list: [],
  total: 0,
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

      // fetch admins
      .addCase(getAdmins.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAdmins.fulfilled, (state, action) => {
        state.list = action.payload?.admins || [];
        state.total = action.payload?.total || 0;
        state.loading = false;
      })
      .addCase(getAdmins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // create admin
      .addCase(addAdmin.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
        state.total += 1;
      })

      // update admin
      .addCase(editAdmin.fulfilled, (state, action) => {
        state.list = state.list.map((admin) =>
          admin._id === action.payload?._id
            ? action.payload
            : admin
        );
      })

      // delete admin
      .addCase(removeAdmin.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (admin) => admin._id !== action.payload
        );
        state.total -= 1;
      })

      // change permission
      .addCase(updateAdminPermission.fulfilled, (state, action) => {
        state.list = state.list.map((admin) =>
          admin._id === action.payload?._id
            ? action.payload
            : admin
        );
      });
  },
});
// endregion

// region exports
export const { clearSuperAdminError } =
  superAdminSlice.actions;

export default superAdminSlice.reducer;
// endregion
