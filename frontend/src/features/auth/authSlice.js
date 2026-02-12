// region imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, logoutUser, getCurrentUser } from "../../services";
// endregion

// region async thunks

// load user
export const loadUser = createAsyncThunk(
  "auth/loadUser",
  async (_, { rejectWithValue }) => {
    try {
      const user = await getCurrentUser();
      return user || null;
    } catch {
      // return null
      return rejectWithValue(null);
    }
  }
);

// login
export const login = createAsyncThunk(
  "auth/login",
  async (credentials = {}, { rejectWithValue }) => {
    try {
      const res = await loginUser(credentials || {});
      return res?.user || null;
    } catch (err) {
      // return error
      return rejectWithValue(err?.response?.data?.message || "Login failed");
    }
  }
);

// logout
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logoutUser();
      return true;
    } catch {
      // return null
      return rejectWithValue(null);
    }
  }
);

// endregion

// region initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};
// endregion

// region slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthState: (state) => {
      // clear state
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // load user
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload || null;
        state.isAuthenticated = !!action.payload;
        state.loading = false;
      })
      .addCase(loadUser.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
      })

      // login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload || null;
        state.isAuthenticated = !!action.payload;
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload || "";
        state.loading = false;
      })

      // logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
      });
  },
});
// endregion

// region exports
export const { clearAuthState } = authSlice.actions;
export default authSlice.reducer;
// endregion
