// // region imports
// import React from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { EmployeeForm, Loader, BackButton } from "../../components/";
// import { addEmployee, selectEmployeeLoading, showToast } from "../../features";
// // endregion

// // region CreateEmployee component
// const CreateEmployee = () => {
//   // region hooks
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const loading = useSelector(selectEmployeeLoading);
//   // endregion

//   // region handleSubmit
//   const handleSubmit = async (data = {}, setErrors = () => {}) => {
//     try {
//       //  dispatch add employee action
//       await dispatch(addEmployee(data)).unwrap();
//       dispatch(
//         showToast({
//           message: "Employee created successfully!",
//           type: "success",
//         }),
//       );
//       navigate("/employees");
//     } catch (err) {
//       // payload from rejectWithValue
//       const fieldErrors = err?.fieldErrors || {};
//       const errorMessage =
//         typeof err === "string"
//           ? err
//           : err?.message || "Failed to create employee";

//       setErrors(fieldErrors);

//       dispatch(
//         showToast({
//           message:
//             Object.keys(fieldErrors).length > 0
//               ? "Please fix the validation errors"
//               : errorMessage,
//           type: "error",
//         }),
//       );
//     }
//   };
//   // endregion

//   return (
//     <div className='container mt-4 pb-5'>
//       {/* Loader */}
//       {loading && <Loader fullScreen text='Creating employee...' />}

//       {/* Page heading */}
//       <div className='d-flex align-items-center gap-3 mb-4'>
//         <BackButton />
//         <h3 className='mb-0 fw-bold text-gradient'>Create New Employee</h3>
//       </div>

//       {/* Form card */}
//         <div className='card-body p-4'>
//           <EmployeeForm onSubmit={handleSubmit} />
//         </div>

//     </div>
//   );
// };
// // endregion

// // region exports
// export default CreateEmployee;
// // endregion


import React from 'react'

const CreateEmployee = () => {
  return (
    <div>
      
    </div>
  )
}

export default CreateEmployee
