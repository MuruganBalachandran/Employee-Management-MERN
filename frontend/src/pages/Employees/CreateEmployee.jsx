// region imports
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {EmployeeForm,Loader} from "../../components/";
import { addEmployee,selectEmployeeLoading,showToast } from "../../features";
// endregion

// region CreateEmployee component
const CreateEmployee = () => {
  // region hooks
   const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectEmployeeLoading);
  // endregion

  // region handleSubmit
  const handleSubmit = async (data = {}, setErrors = () => {}) => {
    /* Create employee and handle backend validation errors */
    try {
      await dispatch(addEmployee(data || {})).unwrap();
      navigate("/employees");
    } catch (err) {
        const fieldErrors = err?.fieldErrors || {};
        setErrors(fieldErrors);
      // show error
      dispatch(
        showToast({
         message: Object.keys(fieldErrors).length > 0
        ? "Please fix the highlighted errors"
        : (err?.message || "Failed to create employee"),
      type: "error",
        }),
      );
    }
  };
  // endregion

  return (
    <div className='container mt-4'>
      {loading && <Loader fullScreen text='Creating employee...' />}
      <h3>Create Employee</h3>
      {/* form to create */}
      <EmployeeForm onSubmit={handleSubmit} />
    </div>
  );
};
// endregion

// region exports
export default CreateEmployee;
// endregion
