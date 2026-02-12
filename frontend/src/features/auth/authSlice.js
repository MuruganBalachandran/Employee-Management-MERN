// region imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, logoutUser, getCurrentUser } from "../../services";
// endregion

// region async thunks

// load user on app start / refresh
export const loadUser = createAsyncThunk(
  "auth/loadUser",
  async (_, { rejectWithValue }) => {
    try {
      const user = await getCurrentUser(); // GET /auth/profile
      return user;
    } catch {
      // IMPORTANT: 401 is NORMAL when not logged in
      return rejectWithValue(null);
    }
  },
);

// login
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await loginUser(credentials); // POST /auth/login
      return res?.user;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Login failed");
    }
  },
);

// logout
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logoutUser(); // POST /auth/logout
      return true;
    } catch {
      return rejectWithValue(null);
    }
  },
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
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // LOAD USER
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(loadUser.rejected, (state) => {
        // 🔑 THIS IS THE MOST IMPORTANT PART
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
      })

      // LOGIN
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // LOGOUT
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
