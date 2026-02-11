// region imports
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentEmployee,
  selectCurrentEmployeeLoading,
  selectEmployeeLoading,
  selectEmployeeError,
  getEmployee,
  editEmployee,
  clearCurrentEmployee,
  showToast,
} from "../../features";
import { EmployeeForm, BackButton, Loader } from "../../components";
// endregion

// region EditEmployee component
const EditEmployee = () => {
  // hooks
  const { id = "" } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // selectors
  const currentEmployee = useSelector(selectCurrentEmployee);
  const fetching = useSelector(selectCurrentEmployeeLoading);
  const updating = useSelector(selectEmployeeLoading);
  const error = useSelector(selectEmployeeError);

  useEffect(() => {
    if ((!currentEmployee || currentEmployee.Employee_Id !== id) && !fetching) {
      // fecth currenr employee by id
      dispatch(getEmployee(id))
        .unwrap()
        .catch((err) => {
          const message =
            typeof err === "string"
              ? err
              : err?.message || "Failed to load employee";
          dispatch(showToast({ message, type: "error" }));
        });
    }

    return () => {
      // when unmount
      dispatch(clearCurrentEmployee());
    };
  }, [dispatch, id]);

  const handleUpdate = async (updatedData = {}, setErrors = () => {}) => {
    try {
      // dispatch edit employee with updated data
      await dispatch(editEmployee({ id, data: updatedData })).unwrap();
      dispatch(
        showToast({
          message: "Employee updated successfully!",
          type: "success",
        }),
      );
      navigate("/employees");
    } catch (err) {
      // field errors
      const fieldErrors = err?.fieldErrors || {};
      const message =
        typeof err === "string"
          ? err
          : err?.message || "Failed to update employee";

      setErrors(fieldErrors);
      // send errir toast
      dispatch(
        showToast({
          message:
            Object.keys(fieldErrors).length > 0
              ? "Please fix the validation errors"
              : message,
          type: "error",
        }),
      );
    }
  };

  // loading
  if (fetching && !currentEmployee) {
    return <Loader fullScreen text='Fetching employee details...' />;
  }

  // when error
  if (error && !currentEmployee) {
    return (
      <div className='container mt-5 text-center'>
        <div className='alert alert-danger shadow-sm border-0'>{error}</div>
        <BackButton />
      </div>
    );
  }

  return (
    <div className='container mt-4 pb-5'>
      {/* update ui loader */}
      {updating && <Loader fullScreen text='Updating employee...' />}

      {/* header */}
      <div className='d-flex align-items-center gap-3 mb-4'>
        <BackButton />
        <h3 className='mb-0 fw-bold text-gradient'>Edit Employee Details</h3>
      </div>

      {/* employe for to edit employee */}
      <div className='card-body p-4'>
        <EmployeeForm initialData={currentEmployee} onSubmit={handleUpdate} />
      </div>
    </div>
  );
};
// endregion

// region exports
export default EditEmployee;
// endregion
