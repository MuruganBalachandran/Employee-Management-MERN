// region imports
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BsExclamationCircle } from "react-icons/bs";

import {
  getEmployees,
  removeEmployee,
  addEmployee,
  editEmployee,
  setPage,
  selectEmployees,
  selectEmployeeCount,
  selectEmployeeLoading,
  selectEmployeeError,
  selectCurrentPage,
  selectEmployeeFilters,
  showToast,
} from "../../features";

import { Loader, Pagination, Modal, EmployeeForm } from "../../components";
import { FaEye, FaPen, FaTrash, FaPlus } from "react-icons/fa";

// endregion

// region EmployeeList component
const EmployeeList = ({ onTotalUpdate = () => {} }) => {
  // region hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showModal, setShowModal] = React.useState(false);
  const [currentEmployee, setCurrentEmployee] = React.useState(null);
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

  // region modal handlers
  const handleOpenCreateModal = () => {
    setCurrentEmployee(null);
    setShowModal(true);
  };

  const handleOpenEditModal = (emp = {}) => {
    setCurrentEmployee(emp);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentEmployee(null);
  };

  const handleModalSubmit = async (data = {}, setErrors = () => {}) => {
    try {
      if (currentEmployee) {
        // Edit mode
        await dispatch(
          editEmployee({ id: currentEmployee.Employee_Id, data })
        ).unwrap();
        dispatch(showToast({ message: "Employee updated!", type: "success" }));
      } else {
        // Create mode
        await dispatch(addEmployee(data)).unwrap();
        // showToast is handled in slice/thunk for addEmployee usually, or here.
        // Slice says: dispatch(showToast({ message: "Employee added!", type: "success" }));
      }
      handleCloseModal();
      // Refresh list
      dispatch(
        getEmployees({
          page,
          limit,
          search: filters?.search || "",
          department: filters?.department || "",
        })
      );
    } catch (err) {
      if (err?.fieldErrors) {
        setErrors(err.fieldErrors);
      } else if (typeof err === "string") {
        // Map common backend string errors to fields for better UX
        if (err.includes("Employee Code already exists")) {
          setErrors({ employeeCode: "Employee Code already exists" });
        } else if (err.includes("Email already registered")) {
          setErrors({ email: "Email already registered" });
        }
      }
      // Toast is now handled by the thunks themselves to ensure consistency.
      // We only catch here to setErrors or perform other UI cleanup.
    }
  };
  // endregion

  const isFiltered = filters?.search || filters?.department;

  // region conditional UI states
  // Only show full-screen loader on initial fetch (no data)
  if (loading && !employees?.length && !isFiltered) {
    return <Loader fullScreen text='Loading employees...' />;
  }
  // endregion

  return (
    // region container
    <div className='container mt-4'>
      {/* Global alert for list fetching errors */}
      {error && !showModal && <div className='alert alert-danger d-flex align-items-center' role='alert'>
        <BsExclamationCircle className="me-2" />
        {error}
      </div>}
      {/* Heading with total employees and Add button */}
      {(employees?.length > 0 || isFiltered) && (
        <div className="d-flex justify-content-between align-items-center mb-3">
          {employees?.length > 0 ? <h3 className='mb-0'>Employee List (Total: {count})</h3> : <div></div>}
          <button className="btn btn-primary" onClick={handleOpenCreateModal}>
            <FaPlus className="me-2" /> Add Employee
          </button>
        </div>
      )}

      {!employees?.length ? (
        isFiltered ? (
           <div className='d-flex flex-column align-items-center justify-content-center text-center mt-5 p-5'>
             <BsExclamationCircle size={50} className='text-muted mb-3' />
             <h4 className='text-muted'>No matching employees found</h4>
           </div>
        ) : (
          <div className='d-flex flex-column align-items-center justify-content-center text-center mt-5 p-5 border rounded bg-light'>
            <BsExclamationCircle size={50} className='text-muted mb-3' />
            <h4 className='text-muted'>No employees found</h4>
            <p className='text-muted'>Create an employee to get started.</p>
            <button className="btn btn-primary mt-3" onClick={handleOpenCreateModal}>
              <FaPlus className="me-2" /> Add Employee
            </button>
          </div>
        )
      ) : (
        <>
          {/* Responsive table wrapper */}
          <div className='table-responsive'>
            <table className='table table-hover table-bordered align-middle'>
              {/* Table headers */}
              <thead className='table-light'>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th className='text-center'>Actions</th>
                </tr>
              </thead>

              {/* Table data rows */}
              <tbody>
                {employees?.map((emp = {}) => (
                  <tr key={emp?.Employee_Id || Math.random()}>
                    <td>{emp?.Name || "-"}</td>
                    <td>{emp?.Email || "-"}</td>
                    <td>{emp?.Department || "-"}</td>
                    <td>{emp?.Phone || "-"}</td>
                    <td>
                      {/* Address formatting */}
                      {[emp?.Address?.Line1, emp?.Address?.Line2]
                        .filter(Boolean)
                        .join(", ")}
                      {emp?.Address?.City ? `, ${emp.Address.City}` : ""}
                      {emp?.Address?.State ? `, ${emp.Address.State}` : ""}
                      {emp?.Address?.ZipCode ? ` - ${emp.Address.ZipCode}` : ""}
                    </td>

                    {/* Action icons */}
                    <td className='text-center'>
                      <div className='d-flex justify-content-center gap-2 flex-nowrap'>
                        {/* View */}
                        <div
                          className='d-flex align-items-center justify-content-center border rounded p-1'
                          style={{ width: 28, height: 28, cursor: "pointer" }}
                          title='View'
                          onClick={() => navigate(`/employees/view/${emp?.Employee_Id}`)}
                        >
                          <FaEye size={14} className='text-info' />
                        </div>

                        {/* Edit */}
                        <div
                          className='d-flex align-items-center justify-content-center border rounded p-1'
                          style={{ width: 28, height: 28, cursor: "pointer" }}
                          title='Edit'
                          onClick={() => handleOpenEditModal(emp)}
                        >
                          <FaPen size={14} className='text-primary' />
                        </div>

                        {/* Delete */}
                        <div
                          className='d-flex align-items-center justify-content-center border rounded p-1'
                          style={{ width: 28, height: 28, cursor: "pointer" }}
                          title='Delete'
                          onClick={() => handleDelete(emp?.Employee_Id)}
                        >
                          <FaTrash size={14} className='text-danger' />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination
            page={page || 1} // default to page 1
            totalPages={totalPages || 1} // default to 1 page
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={currentEmployee ? "Edit Employee" : "Create Employee"}
      >
        <EmployeeForm
          initialData={currentEmployee || {}}
          onSubmit={handleModalSubmit}
          hideCredentials={false}
        />
      </Modal>
    </div>
    // endregion
  );
};

// region exports
export default EmployeeList;
// endregion
