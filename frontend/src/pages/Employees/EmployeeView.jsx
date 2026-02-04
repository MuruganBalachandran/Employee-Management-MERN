// region imports
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCurrentEmployee,
  selectCurrentEmployeeLoading,
  selectEmployeeFromNormalizedState,
} from "../../features/employees/employeeSelectors";
import { getEmployee } from "../../features/employees/employeeSlice";
import Loader from "../../components/UI/Loader";
import BackButton from "../../components/ui/BackButton";
// endregion


// region helper
const formatAddress = (address = null) => {
  if (!address) return "-";

  const parts = [
    address.Line1,
    address.Line2,
    address.City,
    address.State,
    address.ZipCode,
  ].filter(Boolean);

  return parts.join(", ") || "-";
};

const formatDate = (date = "") => {
  if (!date) return "-";

  const d = new Date(date);
  return isNaN(d) ? "-" : d.toLocaleString();
};
// endregion


// region EmployeeView
const EmployeeView = () => {
  const { id = "" } = useParams(); // default value
  const dispatch = useDispatch();

  const currentEmployee = useSelector(selectCurrentEmployee) || null;
  const currentEmployeeLoading = useSelector(selectCurrentEmployeeLoading) || false;

  // fallback from normalized state
  const employeeFromState = useSelector((state) =>
    selectEmployeeFromNormalizedState(state, id)
  ) || null;

  const employee = currentEmployee || employeeFromState;

  useEffect(() => {
    // fetch employee
    if ((!employee || employee._id !== id) && !currentEmployeeLoading && id) {
      dispatch(getEmployee(id));
    }
  }, [id, employee, currentEmployeeLoading, dispatch]);

  if (currentEmployeeLoading || !employee)
    return <Loader fullScreen text="Loading employee..." />;

  return (
    <>
      <BackButton />

      <div className="card p-4 shadow-sm">
        <h3>Employee Details</h3>

        {/* Basic info */}
        <div className="mt-3">
          <p><strong>Name:</strong> {employee?.Name || "-"}</p>
          <p><strong>Email:</strong> {employee?.Email || "-"}</p>
          <p><strong>Department:</strong> {employee?.Department || "-"}</p>
          <p><strong>Phone:</strong> {employee?.Phone || "-"}</p>

          {/* Address */}
          <p>
            <strong>Address (Brief):</strong>{" "}
            {employee?.Address
              ? `${employee.Address.City || "-"}, ${employee.Address.State || "-"}`
              : "-"}
            <br />
            <small className="text-muted">
              {formatAddress(employee?.Address)}
            </small>
          </p>

          {/* Other details */}
          <p><strong>Deleted:</strong> {employee?.Is_Deleted ? "Yes" : "No"}</p>
          <p><strong>Created At:</strong> {formatDate(employee?.Created_At)}</p>
          <p><strong>Updated At:</strong> {formatDate(employee?.Updated_At)}</p>
        </div>
      </div>
    </>
  );
};
// endregion


// region exports
export default EmployeeView;
// endregion
