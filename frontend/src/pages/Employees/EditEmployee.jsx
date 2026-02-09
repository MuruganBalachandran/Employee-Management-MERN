// region imports
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentEmployee,
  selectCurrentEmployeeLoading,
  selectEmployeeError,
  getEmployee,
  editEmployee,
  showToast,
} from "../../features";
import { EmployeeForm, BackButton } from "../../components";
// endregion

// region EditEmployee component
const EditEmployee = () => {
  // region hooks
  const { id = "" } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentEmployee = useSelector(selectCurrentEmployee);
  const currentEmployeeLoading = useSelector(selectCurrentEmployeeLoading);
  const error = useSelector(selectEmployeeError);
  // endregion

  // region fetchEmployee
  useEffect(() => {
    // Fetch employee details by ID
    if ((!currentEmployee || currentEmployee.Employee_Id !== id) && !currentEmployeeLoading) {
      dispatch(getEmployee(id || ""))
        .unwrap()
        .catch((err) =>
          dispatch(
            showToast({
              message: err?.message || "Failed to load employee",
              type: "error",
            }),
          ),
        );
    }
  }, [dispatch, id, currentEmployee, currentEmployeeLoading]);
  // endregion

  // region handleUpdate
  const handleUpdate = async (updatedData = {}) => {
    try {
      // Update employee details
      await dispatch(editEmployee({ id, data: updatedData })).unwrap();
      navigate("/employees");
    } catch (err) {
      dispatch(
        showToast({
          message: err?.message || "Failed to update employee",
          type: "error",
        }),
      );
    }
  };
  // endregion

  if (currentEmployeeLoading || !currentEmployee) {
    return <div>Loading employee...</div>;
  }

  if (error) {
    return <div className='alert alert-danger'>{error}</div>;
  }

  return (
    <div className='container mt-4'>
          <div className="d-flex align-items-center gap-3 mb-2">
      <BackButton />
      <h3>Edit Employee</h3>
      </div>
      {/* back button */}

      {/* form to edit employee */}
      <EmployeeForm initialData={currentEmployee} onSubmit={handleUpdate} />
    </div>
  );
};
// endregion

// region exports
export default EditEmployee;
// endregion
