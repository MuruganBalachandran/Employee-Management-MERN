// region imports
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectEmployeeCount,
  selectEmployeeFilters,
  selectIsEmployeeListEmpty,
  setFilters,
} from "../../features/";
import { EmployeeFilters, EmployeeList } from "../../components/";
// endregion

// region component
const ViewEmployees = () => {
  // region hooks
  const dispatch = useDispatch();
  const count = useSelector(selectEmployeeCount) || 0;
  const filters = useSelector(selectEmployeeFilters) || {};
  const isListEmpty = useSelector(selectIsEmployeeListEmpty) || false;
  // endregion

  // region handlers
  const handleFilter = (newFilters = {}) => {
    // ensure object fallback
    dispatch(setFilters(newFilters || {}));
  };
  // endregion

  // region derived values
  // Show filters if - There are employees available, OR
  // - Filters are currently active (so user can clear them)
  const showFilters = count > 0 || filters?.search || filters?.department;
  // endregion

  // region render
  return (
    <div className='container mt-4'>
      <h3>Employees</h3>

      {/* Show filters if employees exist OR if filters are active */}
      {showFilters && <EmployeeFilters onFilter={handleFilter} />}

      {/* Show empty state if list is empty and no filters are active */}


      {/* Employee list */}
      <EmployeeList />
    </div>
  );
  // endregion
};
// endregion

// region exports
export default ViewEmployees;
// endregion
