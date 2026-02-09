// region imports
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCurrentEmployee,
  selectCurrentEmployeeLoading,
  selectEmployeeFromNormalizedState,
  getEmployee,
} from "../../features";

import { Loader, BackButton, ProfileDetails } from "../../components";
// endregion

// region EmployeeView
const EmployeeView = () => {
  const { id = "" } = useParams();
  const dispatch = useDispatch();

  const currentEmployee = useSelector(selectCurrentEmployee) || null;
  const currentEmployeeLoading =
    useSelector(selectCurrentEmployeeLoading) || false;

  const employeeFromState =
    useSelector((state) => selectEmployeeFromNormalizedState(state, id)) ||
    null;

  const employee = currentEmployee || employeeFromState;

  useEffect(() => {
    if ((!employee || employee.Employee_Id !== id) && !currentEmployeeLoading && id) {
      dispatch(getEmployee(id));
    }
  }, [id, employee, currentEmployeeLoading, dispatch]);

  if (currentEmployeeLoading || !employee)
    return <Loader fullScreen text='Loading employee...' />;

return (
  <div className="container mt-4">
    {/* Header with back button and title */}
    <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap">
      <div className="d-flex align-items-center gap-3">
        <BackButton />
        <h4 className="mb-0">Employee Details</h4>
      </div>
    </div>

    {/* Employee details card */}
      <ProfileDetails
        user={employee}
        title="Employee Details"
        showMeta={true}
      />
  
  </div>
);

};
// endregion

// region exports
export default EmployeeView;
// endregion
