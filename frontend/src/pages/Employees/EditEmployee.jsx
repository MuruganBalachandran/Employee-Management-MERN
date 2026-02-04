// region imports
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentEmployee,
  selectCurrentEmployeeLoading,
  selectEmployeeError,
} from "../../features/employees/employeeSelectors";
import { getEmployee, editEmployee } from "../../features/employees/employeeSlice";
import EmployeeForm from "../../components/employees/EmployeeForm";
import { showToast } from "../../features/toast/toastSlice";
import BackButton from "../../components/ui/BackButton";
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
    if (!currentEmployee && !currentEmployeeLoading) {
      dispatch(getEmployee(id || ""))
        .unwrap()
        .catch((err) =>
          dispatch(
            showToast({
              message: err?.message || "Failed to load employee",
              type: "error",
            })
          )
        );
    }
  }, [dispatch, id, currentEmployee, currentEmployeeLoading]);
  // endregion

  // region handleUpdate
  const handleUpdate = async (updatedData = {}) => {
    try {
      // Update employee details
      await dispatch(editEmployee({ id, data: updatedData })).unwrap();

      dispatch(
        showToast({
          message: "Employee updated successfully",
          type: "success",
        })
      );

      navigate("/employees");
    } catch (err) {
      dispatch(
        showToast({
          message: err?.message || "Failed to update employee",
          type: "error",
        })
      );
    }
  };
  // endregion

  if (currentEmployeeLoading || !currentEmployee)
    return <div>Loading employee...</div>;

  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      {/* back button */}
      <BackButton />
      <h3>Edit Employee</h3>
      {/* form to edit employee */}
      <EmployeeForm initialData={currentEmployee} onSubmit={handleUpdate} />
    </div>
  );
};
// endregion

// region exports
export default EditEmployee;
// endregion
