// region imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginUser,
  logoutUser,
  getCurrentUser,
  editCurrentUser,
} from "../../services/";
import { showToast } from "../../features";
// endregion

// region initial state
//  load user from storage
const loadUserFromStorage = () => {
  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON?.parse(storedUser) : null;
  } catch (error) {
    console.error("Failed to parse user from storage", error);
    return null;
  }
};
const userFromStorage = loadUserFromStorage();

// inittaks data
const initialState = {
  user: userFromStorage,
  loading: false,
  error: null,
  isAuthenticated: !!userFromStorage,
  authChecked: !!userFromStorage,
};
// endregion

// region login async thunk
export const login = createAsyncThunk(
  "auth/login",
  async (credentials = {}, { dispatch, rejectWithValue }) => {
    try {
      const res = await loginUser(credentials || {});
      const token = res?.token || "";
      const user = res?.user || null;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
      }

      dispatch(
        showToast({ message: "Logged in successfully!", type: "success" }),
      );
      return user;
    } catch (err) {
      const message = err?.response?.data?.message || "Login failed";
      dispatch(showToast({ message, type: "error" }));
      return rejectWithValue(message);
    }
  },
);
// endregion

// region logout
export const logout = createAsyncThunk(
  "auth/logout",
  async (_ = null, { dispatch, rejectWithValue }) => {
    try {
      await logoutUser();
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      dispatch(showToast({ message: "Logged out", type: "info" }));
      return null;
    } catch (err) {
      const message = err?.response?.data?.message || "Logout failed";
      dispatch(showToast({ message, type: "error" }));
      return rejectWithValue(message);
    }
  },
);
// endregion

// region fetchCurrentUser
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_ = null, { rejectWithValue }) => {
    try {
      const res = await getCurrentUser();
      return res || null;
    } catch (err) {
      return rejectWithValue?.(
        err?.response?.data?.message || "Failed to fetch user",
      );
    }
  },
);
// endregion

// region update profile
export const updateMyProfile = createAsyncThunk(
  "auth/updateMyProfile",
  async (data = {}, { rejectWithValue }) => {
    try {
      const res = await editCurrentUser(data);
      return res || {};
    } catch (err) {
      const backend = err?.response?.data;

      if (backend?.error && typeof backend?.error === "object") {
        return rejectWithValue({
          fieldErrors: backend?.error,
          message: "Validation failed",
        });
      }

      return rejectWithValue({
        message: backend?.message || err?.message || "Update failed",
      });
    }
  },
);
// endregion

// region slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state = {}) => {
      state.error = null;
    },
    setAuthChecked: (state = {}) => {
      state.authChecked = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // region login cases
      .addCase(login?.pending, (state = {}) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login?.fulfilled, (state = {}, action = {}) => {
        state.loading = false;
        state.user = action?.payload || null;
        state.isAuthenticated = !!action?.payload;
      })
      .addCase(login?.rejected, (state = {}, action = {}) => {
        state.loading = false;
        state.error = action?.payload || "Unknown error";
        state.isAuthenticated = false;
      })
      // endregion

      // region logout cases
      .addCase(logout?.pending, (state = {}) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout?.fulfilled, (state = {}) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logout?.rejected, (state = {}, action = {}) => {
        state.loading = false;
        state.error = action?.payload || "Unknown error";
      })
      // endregion

      // region fetch current user
      .addCase(fetchCurrentUser?.pending, (state = {}) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser?.fulfilled, (state = {}, action = {}) => {
        state.loading = false;
        state.user = action?.payload || null;
        state.isAuthenticated = !!action?.payload;
        state.authChecked = true;
        if (action?.payload) {
          localStorage.setItem("user", JSON.stringify(action.payload));
        }
      })
      .addCase(fetchCurrentUser?.rejected, (state = {}, action = {}) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action?.payload || "Unknown error";
        state.authChecked = true;
        localStorage.removeItem("user");
      })
      // endregion

      // region update profile cases
      .addCase(updateMyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(updateMyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    // endregion
  },
});
// endregion

// region exports
export const { clearAuthError, setAuthChecked } = authSlice?.actions || {};
export default authSlice?.reducer;
// endregion
