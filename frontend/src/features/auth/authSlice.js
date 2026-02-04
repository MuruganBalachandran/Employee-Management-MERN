// region imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginUser,
  logoutUser,
  // registerUser,
  getCurrentUser,
  editCurrentUser,
} from "../../services/authService";
import { showToast } from "../toast/toastSlice";
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

// region async thunks
// region login
export const login = createAsyncThunk(
  "auth/login",
  async (credentials = {}, { dispatch, rejectWithValue }) => {
    /* Attempt user login and store token */
    try {
      const res = await loginUser(credentials || {});
      const token = res?.data?.data?.token || "";
      const user = res?.data?.data?.user || null;

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
    /* Logout user and clear token */
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
    /* Fetch logged-in user from backend */
    try {
      const res = await getCurrentUser();
      return res?.data?.data?.user || null;
    } catch (err) {
      return rejectWithValue?.(
        err?.response?.data?.message || "Failed to fetch user",
      );
    }
  },
);
// endregion

export const updateMyProfile = createAsyncThunk(
  "auth/updateMyProfile",
  async (data = {}, { rejectWithValue }) => {
    try {
      const res = await editCurrentUser(data);
      return res?.data?.data || res?.data || {};
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
    // region clearAuthError
    clearAuthError: (state = {}) => {
      /* Clear authentication error */
      state.error = null;
    },
    // endregion

    // region setAuthChecked
    setAuthChecked: (state = {}) => {
      /* Mark auth check as completed */
      state.authChecked = true;
    },
    // endregion
  },
  extraReducers: (builder) => {
    builder

      // region login reducers
      .addCase(login?.pending, (state = {}) => {
        /* Login loading start */
        state.loading = true;
        state.error = null;
      })
      .addCase(login?.fulfilled, (state = {}, action = {}) => {
        /* Login success */
        state.loading = false;
        state.user = action?.payload || null;
        state.isAuthenticated = !!action?.payload;
      })
      .addCase(login?.rejected, (state = {}, action = {}) => {
        /* Login failed */
        state.loading = false;
        state.error = action?.payload || "Unknown error";
        state.isAuthenticated = false;
      })
      // endregion

      // region logout reducers
      .addCase(logout?.pending, (state = {}) => {
        /* Logout loading start */
        state.loading = true;
        state.error = null;
      })
      .addCase(logout?.fulfilled, (state = {}) => {
        /* Logout success */
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logout?.rejected, (state = {}, action = {}) => {
        /* Logout failed */
        state.loading = false;
        state.error = action?.payload || "Unknown error";
      })
      // endregion

      // region fetchCurrentUser reducers
      .addCase(fetchCurrentUser?.pending, (state = {}) => {
        /* Fetch user loading */
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser?.fulfilled, (state = {}, action = {}) => {
        /* Fetch user success */
        state.loading = false;
        state.user = action?.payload || null;
        state.isAuthenticated = !!action?.payload;
        state.authChecked = true;
        if (action?.payload) {
          localStorage.setItem("user", JSON.stringify(action.payload));
        }
      })
      .addCase(fetchCurrentUser?.rejected, (state = {}, action = {}) => {
        /* Fetch user failed */
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action?.payload || "Unknown error";
        state.authChecked = true;
        localStorage.removeItem("user"); // Clear stale user data if fetch fails
      })
      // endregion

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
  },
});
// endregion

// region exports
export const { clearAuthError, setAuthChecked } = authSlice?.actions || {};
export default authSlice?.reducer;
// endregion
