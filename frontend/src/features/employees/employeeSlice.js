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

// fetch employees (list)
export const getEmployees = createAsyncThunk(
  "employees/getEmployees",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await fetchEmployees(params);
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to fetch employees"
      );
    }
  }
);

// fetch single employee
export const getEmployee = createAsyncThunk(
  "employees/getEmployee",
  async (id, { rejectWithValue }) => {
    try {
      return await fetchEmployeeById(id);
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to fetch employee"
      );
    }
  }
);

// create employee
export const addEmployee = createAsyncThunk(
  "employees/addEmployee",
  async (data, { rejectWithValue }) => {
    try {
      return await createEmployee(data);
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to create employee"
      );
    }
  }
);

// update employee
export const editEmployee = createAsyncThunk(
  "employees/editEmployee",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await updateEmployee(id, data);
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to update employee"
      );
    }
  }
);

// delete employee
export const removeEmployee = createAsyncThunk(
  "employees/removeEmployee",
  async (id, { rejectWithValue }) => {
    try {
      await deleteEmployee(id);
      return id;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to delete employee"
      );
    }
  }
);

// endregion

// region initial state
const initialState = {
  list: [],
  selected: null,
  total: 0,
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

      // list employees
      .addCase(getEmployees.pending, (state) => {
        state.loading = true;
      })
      .addCase(getEmployees.fulfilled, (state, action) => {
        state.list = action.payload?.employees || [];
        state.total = action.payload?.total || 0;
        state.loading = false;
      })
      .addCase(getEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // get employee
      .addCase(getEmployee.pending, (state) => {
        state.loading = true;
      })
      .addCase(getEmployee.fulfilled, (state, action) => {
        state.selected = action.payload;
        state.loading = false;
      })
      .addCase(getEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // create employee
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
        state.total += 1;
      })

      // update employee
      .addCase(editEmployee.fulfilled, (state, action) => {
        state.list = state.list.map((emp) =>
          emp._id === action.payload?._id ? action.payload : emp
        );
        if (state.selected?._id === action.payload?._id) {
          state.selected = action.payload;
        }
      })

      // delete employee
      .addCase(removeEmployee.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (emp) => emp._id !== action.payload
        );
        state.total -= 1;
      });
  },
});
// endregion

// region exports
export const {
  clearSelectedEmployee,
  clearEmployeeError,
} = employeeSlice.actions;

export default employeeSlice.reducer;
// endregion
