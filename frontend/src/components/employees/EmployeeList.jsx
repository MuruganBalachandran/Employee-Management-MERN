// region imports
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getEmployees,
  removeEmployee,
  setPage,
} from "../../features/employees/employeeSlice";
import {
  selectEmployees,
  selectEmployeeCount,
  selectEmployeeLoading,
  selectEmployeeError,
  selectCurrentPage,
  selectEmployeeFilters,
} from "../../features/employees/employeeSelectors";
import Loader from "../../components/UI/Loader";
import { showToast } from "../../features/toast/toastSlice";
import { useNavigate } from "react-router-dom";
import Pagination from "../ui/Pagination";
import { BsExclamationCircle } from "react-icons/bs";
// endregion

// region EmployeeList component
const EmployeeList = ({ onTotalUpdate = () => {} }) => {
  // region hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // endregion

  // region redux state
  const employees = useSelector(selectEmployees);
  const count = useSelector(selectEmployeeCount);
  const loading = useSelector(selectEmployeeLoading);
  const error = useSelector(selectEmployeeError);
  const page = useSelector(selectCurrentPage);
  const filters = useSelector(selectEmployeeFilters);
  // endregion

  const limit = 5;
  const totalPages = Math.ceil((count || 0) / limit);

  // region fetch employees on page/filters change
  useEffect(() => {
    dispatch(
      getEmployees({
        page,
        limit,
        search: filters?.search || "",
        department: filters?.department || "",
      }),
    )
      .unwrap()
      .then((res) => onTotalUpdate(res?.count || 0))
      .catch(() => onTotalUpdate(0));
  }, [dispatch, page, filters]);
  // endregion

  // region handlePageChange
  const handlePageChange = (newPage = 1) => {
    if (newPage < 1 || newPage > totalPages) return;
    dispatch(setPage(newPage));
  };
  // endregion

  // region delete
  const handleDelete = async (id = "") => {
    // acknowledge for dleete an employee
    if (!window.confirm("Are you sure you want to delete this employee?"))
      return;

    try {
      // remove employee
      await dispatch(removeEmployee(id)).unwrap();
      dispatch(
        showToast({
          message: "Employee deleted successfully",
          type: "success",
        }),
      );

      // Refresh current page
      dispatch(
        getEmployees({
          skip: (page - 1) * limit,
          limit,
          search: filters?.search || "",
          department: filters?.department || "",
        }),
      );
    } catch (err) {
      dispatch(
        showToast({
          message: err?.message || "Failed to delete employee",
          type: "error",
        }),
      );
    }
  };
  // endregion

  // region handleEdit
  const handleEdit = (emp = {}) => {
    navigate(`/employees/edit/${emp?._id || ""}`);
  };
  // endregion

  // region conditional UI states
  if (loading) {
    return <Loader fullScreen text='Loading employees...' />;
  }
  if (error) {
    return <div className='alert alert-danger'>{error}</div>;
  }
  if (!employees?.length)
    return (
      <div className='d-flex flex-column align-items-center justify-content-center text-center mt-5'>
        <BsExclamationCircle size={50} className='text-muted mb-3' />
        <h4 className='text-muted'>No employees found</h4>
        <p className='text-muted'></p>
      </div>
    );
  // endregion

  // region render
  return (
    <div className='container mt-4'>
      <h3>Employee List (Total: {count || 0})</h3>

      <table className='table table-bordered table-striped mt-3'>
        {/* table headers */}
        <thead className='thead-dark'>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Phone</th>
            <th>Address</th>
            <th className='text-center'>Actions</th>
          </tr>
        </thead>

        {/* table datas */}
        <tbody>
          {employees?.map((emp = {}) => (
            <tr key={emp?._id || Math.random()}>
              <td>{emp?.Name || "-"}</td>
              <td>{emp?.Email || "-"}</td>
              <td>{emp?.Department || "-"}</td>
              <td>{emp?.Phone || "-"}</td>
              <td>
                {emp?.Address?.Line1 || ""}
                {emp?.Address?.Line2 ? `, ${emp.Address.Line2}` : ""},{" "}
                {emp?.Address?.City || ""}, {emp?.Address?.State || ""} -{" "}
                {emp?.Address?.ZipCode || ""}
              </td>

              {/* action btns */}
              <td className='text-center'>
                <div className='d-inline-flex gap-2'>
                  <button
                    className='btn btn-sm btn-outline-info'
                    onClick={() => navigate(`/employees/view/${emp?._id}`)}
                  >
                    View
                  </button>
                  <button
                    className='btn btn-sm btn-outline-primary'
                    onClick={() => handleEdit(emp)}
                  >
                    Edit
                  </button>
                  <button
                    className='btn btn-sm btn-outline-danger'
                    onClick={() => handleDelete(emp?._id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* pagination */}
      <Pagination
        page={page || 1}
        totalPages={totalPages || 1}
        onPageChange={handlePageChange}
      />
    </div>
  );
  // endregion
};
// endregion

// region exports
export default EmployeeList;
// endregion
