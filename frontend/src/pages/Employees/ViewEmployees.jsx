// // region imports
// import React from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   selectEmployeeCount,
//   selectEmployeeFilters,
//   setFilters,
// } from "../../features/";
// import { EmployeeFilters, EmployeeList } from "../../components/";
// // endregion

// // region component
// const ViewEmployees = () => {
//   // region hooks
//   const dispatch = useDispatch();
//   const count = useSelector(selectEmployeeCount) || 0;
//   const filters = useSelector(selectEmployeeFilters) || {};
//   // endregion

//   // region handlers
//   const handleFilter = (newFilters = {}) => {
//     try {
//       dispatch(setFilters(newFilters || {}));
//     } catch (err) {
//       console.log(err);
//     }
//   };
//   // endregion

//   //  derived filters
//   const showFilters = count > 0 || filters?.search || filters?.department;

//   // region render
//   return (
//     <div className='container mt-4'>
//       <h3>Employees</h3>

//       {/* Show filters */}
//       {showFilters && <EmployeeFilters onFilter={handleFilter} />}

//       {/* Employee list */}
//       <EmployeeList />
//     </div>
//   );
// };
// // endregion

// // region exports
// export default ViewEmployees;
// // endregion


import React from 'react'

const ViewEmployees = () => {
  return (
    <div>
      
    </div>
  )
}

export default ViewEmployees
