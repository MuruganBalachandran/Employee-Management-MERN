// region imports
import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectEmployeeFilters } from "../../features/employees/employeeSelectors";
import { setFilters } from "../../features/employees/employeeSlice";
import { VALID_DEPARTMENTS } from "../../validations/employeeValidation";
// endregion

// region EmployeeFilters component
const EmployeeFilters = ({ onFilter = () => {} }) => {
  const dispatch = useDispatch();
  const filters = useSelector(selectEmployeeFilters);

  // local state to hold inputs before applying
  const [localSearch, setLocalSearch] = useState(filters?.search || "");
  const [localDepartment, setLocalDepartment] = useState(filters?.department || "");

  // keep latest onFilter reference
  const onFilterRef = useRef(onFilter);
  useEffect(() => {
    onFilterRef.current = onFilter;
  }, [onFilter]);

  // handle input changes
  const handleSearchChange = (value) => setLocalSearch(value);
  const handleDepartmentChange = (value) => setLocalDepartment(value);

  // Apply filters
  const handleApply = () => {
    dispatch(setFilters({ search: localSearch, department: localDepartment }));
    onFilterRef.current?.({ search: localSearch, department: localDepartment });
  };

  // Clear filters
  const handleClear = () => {
    setLocalSearch("");
    setLocalDepartment("");
    dispatch(setFilters({ search: "", department: "" }));
    onFilterRef.current?.({ search: "", department: "" });
  };

  // show buttons only if any filter is set
  const hasFilter = localSearch !== "" || localDepartment !== "";

  return (
    <div className="d-flex gap-2 align-items-center mb-3 flex-wrap">
      {/* search input */}
      <input
        type="text"
        className="form-control"
        placeholder="Search by name..."
        value={localSearch}
        onChange={(e) => handleSearchChange(e?.target?.value || "")}
      />

      {/* department select */}
      <select
        className="form-select"
        value={localDepartment}
        onChange={(e) => handleDepartmentChange(e?.target?.value || "")}
      >
        <option value="">All Departments</option>
        {VALID_DEPARTMENTS?.map?.((dept) => (
          <option key={dept} value={dept}>
            {dept}
          </option>
        ))}
      </select>

      {/* Apply & Clear buttons */}
      {hasFilter && (
        <>
          <button className="btn btn-primary" onClick={handleApply}>
            Apply
          </button>
          <button className="btn btn-secondary" onClick={handleClear}>
            Clear
          </button>
        </>
      )}
    </div>
  );
};
// endregion

// region exports
export default EmployeeFilters;
// endregion
