// region imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchEmployees,
  fetchEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../../services/";
import { showToast } from "../../features";
// endregion

// region initialState
const initialState = {
  // Normalized state: id => employee object
  byId: {},
  // List of employee IDs in order
  allIds: [],
  // Single employee being viewed
  currentEmployee: null,
  // Pagination info
  pagination: {
    skip: 0,
    limit: 5,
    total: 0,
    currentPage: 1,
  },
  // Filters for current list
  filters: {
    search: "",
    department: "",
  },
  // UI state
  loading: false,
  currentEmployeeLoading: false,
  error: null,
};
// endregion

// region Async Thunks

// region getEmployees
// region getEmployees
export const getEmployees = createAsyncThunk(
  "employees/getEmployees",
  async (
    {
      page = 1,
      limit = 5,
      search = "",
      department = "",
      ignoreFilters = false,
    } = {},
    { rejectWithValue } = {},
  ) => {
    try {
      const res = await fetchEmployees({
        page,
        limit,
        search,
        department,
        ignoreFilters,
      });
      return {
        items: res?.data?.data?.employees || [],
        count: res?.data?.data?.total || 0,
      };
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to fetch employees",
      );
    }
  },
);

// endregion

// region getEmployee
export const getEmployee = createAsyncThunk(
  "employees/getEmployee",
  async (id = null, { rejectWithValue } = {}) => {
    /* Fetch single employee by ID */
    try {
      const res = await fetchEmployeeById(id || null);
      // Controller sends: { data: employeeObject }
      return res?.data?.data || null;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to fetch employee",
      );
    }
  },
);
// endregion

// region addEmployee
export const addEmployee = createAsyncThunk(
  "employees/addEmployee",
  async (data = {}, { rejectWithValue, dispatch } = {}) => {
    /* Add a new employee */
    try {
      const res = await createEmployee(data || {});
      dispatch(showToast({ message: "Employee added!", type: "success" }));
      return res?.data?.data || {};
    } catch (err) {
      const backend = err?.response?.data || {};
      const message = backend?.message || err?.message || "Failed to add employee";

      // If message is an object (validation errors), reject with fieldErrors
      if (message && typeof message === "object") {
        return rejectWithValue({
          fieldErrors: message,
          message: "Validation failed",
        });
      }

      // Ensure toast message is a string
      const toastMsg = typeof message === "string" ? message : "Add failed";
      dispatch(showToast({ message: toastMsg, type: "error" }));
      
      return rejectWithValue(message);
    }
  },
);
// endregion

// region editEmployee
export const editEmployee = createAsyncThunk(
  "employees/editEmployee",
  async ({ id = null, data = {} } = {}, { rejectWithValue, dispatch }) => {
    /* Update existing employee */
    try {
      const res = await updateEmployee(id || null, data || {});
      return res?.data?.data || null;
    } catch (err) {
      const backend = err?.response?.data || {};
      const message = backend?.message || "Failed to update employee";

      // Validation errors
      if (message && typeof message === "object") {
        return rejectWithValue({
          fieldErrors: message,
          message: "Validation failed",
        });
      }

      dispatch(showToast({ message: typeof message === 'string' ? message : "Update failed", type: "error" }));
      return rejectWithValue(message);
    }
  },
);
// endregion

// region removeEmployee
export const removeEmployee = createAsyncThunk(
  "employees/removeEmployee",
  async (id = null, { rejectWithValue, dispatch }) => {
    /* Delete employee */
    try {
      await deleteEmployee(id || null);
      return id || null;
    } catch (err) {
      const backend = err?.response?.data || {};
      const message = backend?.message || err?.message || "Failed to delete employee";
      dispatch(showToast({ message: typeof message === 'string' ? message : "Delete failed", type: "error" }));
      return rejectWithValue(message);
    }
  },
);
// endregion

// region slice
const employeeSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    // region clearCurrentEmployee
    clearCurrentEmployee: (state = {}) => {
      /* Reset current employee state */
      state.currentEmployee = null;
      state.currentEmployeeLoading = false;
      state.error = null;
    },
    // endregion

    // region setFilters
    setFilters: (state = {}, action = {}) => {
      /* Update filter state */
      state.filters = {
        ...state?.filters,
        ...action?.payload,
      };
      // Reset to first page when filters change
      state.pagination.skip = 0;
      state.pagination.currentPage = 1;
    },
    // endregion

    // region setPage
    setPage: (state = {}, action = {}) => {
      /* Update current page */
      const page = action?.payload || 1;
      state.pagination.currentPage = page;
      state.pagination.skip = (page - 1) * state?.pagination?.limit;
    },
    // endregion

    // region clearError
    clearError: (state = {}) => {
      /* Clear error state */
      state.error = null;
    },
    // endregion
  },
  extraReducers: (builder) => {
    builder

      // region getEmployees reducers
      .addCase(getEmployees?.pending, (state = {}) => {
        /* Loading employees */
        state.loading = true;
        state.error = null;
      })
      .addCase(getEmployees?.fulfilled, (state = {}, action = {}) => {
        /* Employees fetched - normalize data */
        state.loading = false;
        const items = action?.payload?.items || [];
        const total = action?.payload?.count || 0;

        // Build normalized state
        state.byId = {};
        state.allIds = [];

        items.forEach((emp) => {
          if (emp?.Employee_Id) {
            state.byId[emp.Employee_Id] = emp;
            state.allIds.push(emp?.Employee_Id);
          }
        });

        // Update pagination
        state.pagination.total = total;
      })
      .addCase(getEmployees?.rejected, (state = {}, action = {}) => {
        /* Employees fetch failed */
        state.loading = false;
        state.error = action?.payload || "Unknown error";
      })
      // endregion

      // region getEmployee reducers
      .addCase(getEmployee?.pending, (state = {}) => {
        state.currentEmployeeLoading = true;
        state.error = null;
      })
      .addCase(getEmployee?.fulfilled, (state = {}, action = {}) => {
        state.currentEmployeeLoading = false;
        state.currentEmployee = action?.payload || null;
        // Also add to normalized state
        if (action?.payload?.Employee_Id) {
          state.byId[action.payload.Employee_Id] = action?.payload;
        }
      })
      .addCase(getEmployee?.rejected, (state = {}, action = {}) => {
        state.currentEmployeeLoading = false;
        state.error = action?.payload || "Unknown error";
      })
      // endregion

      // region addEmployee reducers
      .addCase(addEmployee?.pending, (state = {}) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addEmployee?.fulfilled, (state = {}, action = {}) => {
        state.loading = false;
        const employee = action?.payload || {};

        // Add to normalized state
        if (employee?.Employee_Id) {
          state.byId[employee.Employee_Id] = employee;
          // Add to front of list if not already present
          if (!state.allIds.includes(employee?.Employee_Id)) {
            state.allIds.unshift(employee?.Employee_Id);
          }
        }
      })
      .addCase(addEmployee?.rejected, (state = {}, action = {}) => {
        state.loading = false;
      })
      // endregion

      // region editEmployee reducers
      .addCase(editEmployee?.pending, (state = {}) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editEmployee?.fulfilled, (state = {}, action = {}) => {
        state.loading = false;
        const updatedEmp = action?.payload?.employee || action?.payload || null;

        if (updatedEmp?.Employee_Id) {
          // Update normalized state
          state.byId[updatedEmp.Employee_Id] = updatedEmp;
          // Update current employee if it's the same one
          if (state.currentEmployee?.Employee_Id === updatedEmp?.Employee_Id) {
            state.currentEmployee = updatedEmp;
          }
        }
      })
      .addCase(editEmployee?.rejected, (state = {}, action = {}) => {
        state.loading = false;
      })
      // endregion

      // region removeEmployee reducers
      .addCase(removeEmployee?.pending, (state = {}) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeEmployee?.fulfilled, (state = {}, action = {}) => {
        state.loading = false;
        const employeeId = action?.payload;

        // Remove from normalized state
        delete state.byId[employeeId];
        state.allIds = state?.allIds?.filter((id) => id !== employeeId);

        // Clear current employee if deleted
        if (state.currentEmployee?.Employee_Id === employeeId) {
          state.currentEmployee = null;
        }
      })
      .addCase(removeEmployee?.rejected, (state = {}, action = {}) => {
        state.loading = false;
        const payload = action?.payload;
        state.error = (typeof payload === "string" ? payload : payload?.message) || "Unknown error";
      });
    // endregion
  },
});
// endregion

// region exports
export const { clearCurrentEmployee, setFilters, setPage, clearError } =
  employeeSlice?.actions || {};
export default employeeSlice?.reducer;
// endregion
