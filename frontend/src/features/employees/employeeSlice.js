// region imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchEmployees,
  fetchEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../../services";
// endregion

// region async thunks

// get employees
export const getEmployees = createAsyncThunk(
  "employees/getEmployees",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await fetchEmployees(params || {});
      return (
        response || {
          employees: [],
          filteredTotal: 0,
          overallTotal: 0,
          currentPage: 1,
          totalPages: 1,
          limit: 5,
        }
      );
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to fetch employees",
      );
    }
  },
);

// get employee
export const getEmployee = createAsyncThunk(
  "employees/getEmployee",
  async (id = "", { rejectWithValue }) => {
    try {
      const response = await fetchEmployeeById(id || "");
      return response || null;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to fetch employee",
      );
    }
  },
);

// add employee
export const addEmployee = createAsyncThunk(
  "employees/addEmployee",
  async (data = {}, { rejectWithValue }) => {
    try {
      const response = await createEmployee(data || {});
      return response || null;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to create employee",
      );
    }
  },
);

// edit employee
export const editEmployee = createAsyncThunk(
  "employees/editEmployee",
  async ({ id = "", data = {} }, { rejectWithValue }) => {
    try {
      const response = await updateEmployee(id || "", data || {});
      return response || null;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to update employee",
      );
    }
  },
);

// remove employee
export const removeEmployee = createAsyncThunk(
  "employees/removeEmployee",
  async (id = "", { rejectWithValue }) => {
    try {
      await deleteEmployee(id || "");
      return id || "";
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to delete employee",
      );
    }
  },
);

// endregion

// region initial state
const initialState = {
  list: [],
  selected: null,

  total: 0, // filteredTotal
  overallTotal: 0, // actual DB total

  page: 1,
  limit: 5,
  totalPages: 1,

  loading: false,
  error: null,
};
// endregion

// region slice
const employeeSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    clearSelectedEmployee: (state) => {
      state.selected = null;
    },
    clearEmployeeError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // get employees
      .addCase(getEmployees.pending, (state) => {
        state.loading = true;
      })
      .addCase(getEmployees.fulfilled, (state, action) => {
        const payload = action.payload || {};
      


        state.list = payload.employees || [];

        //  COUNTS
        state.total = payload.filteredTotal || 0;
        state.overallTotal = payload.overallTotal || 0;

        state.page = payload.currentPage || 1;
        state.limit = payload.limit || state.limit;
        state.totalPages = payload.totalPages || 1;

        state.loading = false;
      })
      .addCase(getEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "";
      })

      // get employee
      .addCase(getEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEmployee.fulfilled, (state, action) => {
        state.selected = action.payload || null;
        state.loading = false;
      })
      .addCase(getEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "";
      })

      // add employee
      .addCase(addEmployee.fulfilled, (state, action) => {
        if (action.payload) {
          state.list.unshift(action.payload);
          state.total += 1;
          state.overallTotal += 1;
        }
      })

      // edit employee
      .addCase(editEmployee.fulfilled, (state, action) => {
        const updated = action.payload || {};
        state.list = state.list.map((emp) =>
          emp.Employee_Id === updated.Employee_Id ? updated : emp,
        );
        if (state.selected?.Employee_Id === updated.Employee_Id) {
          state.selected = updated;
        }
      })

      // remove employee
      .addCase(removeEmployee.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (emp) => emp.Employee_Id !== action.payload,
        );

        state.total = Math.max(0, state.total - 1);
        state.overallTotal = Math.max(0, state.overallTotal - 1);
      });
  },
});
// endregion

// region exports
export const { clearSelectedEmployee, clearEmployeeError } =
  employeeSlice.actions;

export default employeeSlice.reducer;
// endregion
