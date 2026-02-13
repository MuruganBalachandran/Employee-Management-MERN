// region imports
// react
import { useEffect, useState } from "react";

// redux
import { useDispatch, useSelector } from "react-redux";

// notifications
import { toast } from "react-toastify";

// components
import {
  Canvas,
  Filters,
  UserTable,
  ConfirmModal,
  Loader,
  ViewDetails,
  Pagination,
} from "../../components";
import UserForm from "../../components/forms/UserForm";

// redux features
import {
  getEmployees,
  addEmployee,
  editEmployee,
  removeEmployee,
  selectEmployees,
  selectEmployeesLoading,
  selectEmployeesPagination,
  selectEmployeesOverallTotal,
} from "../../features";

// utils
import { INITIAL_EMPLOYEE_STATE } from "../../utils/constants";
import { validateField, validateForm } from "../../utils/validation";
import {
  formatDateForBackend,
  formatDateForInput,
} from "../../utils/formatters";

// services
import {
  checkEmailAvailability,
  checkEmployeeCodeAvailability,
} from "../../services/employeeService";

// icons
import { FaUsers, FaPlus } from "react-icons/fa";
// endregion

// region component
const Employees = () => {
  // region redux hooks
  // initialize dispatch
  const dispatch = useDispatch();

  // read employees list
  const employees = useSelector(selectEmployees) || [];

  // read loading state
  const loading = useSelector(selectEmployeesLoading) || false;

  // read pagination data
  const pagination = useSelector(selectEmployeesPagination) || {};

  // normalize pagination values
  const page = pagination?.page || 1;
  const totalPages = pagination?.totalPages || 1;
  const overallTotal = useSelector(selectEmployeesOverallTotal) || 0;

  // endregion

  // region table state
  // search input value
  const [searchTerm, setSearchTerm] = useState("");

  // debounced search value
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // department filter
  const [department, setDepartment] = useState("");
  // endregion

  // region canvas and view state
  // canvas visibility
  const [showCanvas, setShowCanvas] = useState(false);

  // edit mode flag
  const [isEdit, setIsEdit] = useState(false);

  // view mode flag
  const [isView, setIsView] = useState(false);

  // selected view data
  const [viewData, setViewData] = useState(null);
  // endregion

  // region form state
  // form values
  const [formData, setFormData] = useState(INITIAL_EMPLOYEE_STATE || {});

  // validation errors
  const [errors, setErrors] = useState({});

  // submit loading state
  const [submitting, setSubmitting] = useState(false);
  // endregion

  // region delete modal state
  // delete modal visibility
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // selected employee id
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  // endregion

  // region effects
  // fetch employees on page, search or department change
  useEffect(() => {
    dispatch(
      getEmployees({
        page: page || 1,
        search: debouncedSearch || "",
        department: department || "",
      }),
    );
  }, [dispatch, page, debouncedSearch, department]);

  // debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm || "");
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // reset page when filters change
  useEffect(() => {
    dispatch(
      getEmployees({
        page: 1,
        search: debouncedSearch || "",
        department: department || "",
      }),
    );
  }, [dispatch, debouncedSearch, department]);
  // endregion

  // region handlers
  // handle pagination change
  const handlePageChange = (newPage = 1) => {
    dispatch(
      getEmployees({
        page: newPage || 1,
        search: debouncedSearch || "",
        department: department || "",
      }),
    );
  };

  // open view employee
  const handleViewEmployee = (employee = {}) => {
    setIsView(true);
    setIsEdit(false);
    setViewData(employee || {});
    setShowCanvas(true);
  };

  // handle input change
  const handleInputChange = (e = {}) => {
    const name = e?.target?.name || "";
    const value = e?.target?.value || "";

    if (name.includes(".")) {
      const parts = name.split(".");
      const parent = parts?.[0] || "";
      const child = parts?.[1] || "";

      setFormData((prev) => ({
        ...(prev || {}),
        [parent]: {
          ...(prev?.[parent] || {}),
          [child]: value || "",
        },
      }));
    } else {
      setFormData((prev) => ({
        ...(prev || {}),
        [name]: value || "",
      }));
    }

    if (errors?.[name]) {
      setErrors((prev) => {
        const next = { ...(prev || {}) };
        delete next[name];
        return next;
      });
    }
  };

  // handle field blur validation
  const handleBlur = async (e = {}) => {
    const name = e?.target?.name || "";
    const value = e?.target?.value || "";

    const error = validateField(name, value, "EMPLOYEE", null);

    if (error) {
      setErrors((prev) => ({
        ...(prev || {}),
        [name]: error,
      }));
      return;
    }

    if (name === "email" && value && !isEdit) {
      const result = await checkEmailAvailability(value || "");
      if (!result?.available) {
        setErrors((prev) => ({
          ...(prev || {}),
          email: result?.message || "Email already exists",
        }));
      }
    }

    if (name === "employeeCode" && value && !isEdit) {
      const result = await checkEmployeeCodeAvailability(value?.trim?.() || "");
      if (!result?.available) {
        setErrors((prev) => ({
          ...(prev || {}),
          employeeCode: result?.message || "Employee code already exists",
        }));
      }
    }
  };

  // open create employee
  const handleOpenCreate = () => {
    setIsView(false);
    setIsEdit(false);
    setViewData(null);
    setFormData(INITIAL_EMPLOYEE_STATE || {});
    setErrors({});
    setShowCanvas(true);
  };

  // open edit employee
  const handleOpenEdit = (employee = {}) => {
    setIsView(false);
    setIsEdit(true);
    setViewData(null);

    setFormData({
      ...(INITIAL_EMPLOYEE_STATE || {}),
      name: employee?.Name || "",
      email: employee?.Email || "",
      age: employee?.Age?.toString?.() || "",
      phone: employee?.Phone || "",
      department: employee?.Department || "",
      salary: employee?.Salary?.toString?.() || "",
      reportingManager: employee?.Reporting_Manager || "",
      employeeCode: employee?.Employee_Code || "",
      joiningDate: formatDateForInput(employee?.Joining_Date),
      isActive: employee?.Is_Active || 1,
      address: {
        line1: employee?.Address?.Line1 || "",
        line2: employee?.Address?.Line2 || "",
        city: employee?.Address?.City || "",
        state: employee?.Address?.State || "",
        zipCode: employee?.Address?.ZipCode || "",
      },
      employeeId: employee?.Employee_Id || "",
    });

    setErrors({});
    setShowCanvas(true);
  };

  // open delete modal
  const handleDelete = (id = "") => {
    setEmployeeToDelete(id || "");
    setShowDeleteModal(true);
  };

  // confirm delete
  const confirmDelete = async () => {
    if (!employeeToDelete) {
      return;
    }

    await dispatch(removeEmployee(employeeToDelete || ""))?.unwrap?.();
    toast?.success?.("Employee deleted successfully");
    setEmployeeToDelete(null);
    setShowDeleteModal(false);
  };

  // submit create or update
  const handleSubmit = async () => {
    if (Object.keys(errors || {}).length > 0) {
      toast?.error?.("Please fix the errors before submitting");
      return;
    }

    const validationErrors = validateForm(formData || {}, "EMPLOYEE", isEdit);

    if (Object.values(validationErrors || {}).some(Boolean)) {
      setErrors(validationErrors || {});
      return;
    }

    const payload = isEdit
      ? {
          name: formData?.name || "",
          age: formData?.age || "",
          phone: formData?.phone || "",
          department: formData?.department || "",
          salary: formData?.salary || "",
          reportingManager: formData?.reportingManager || "",
          address: formData?.address || {},
        }
      : {
          name: formData?.name || "",
          email: formData?.email || "",
          password: formData?.password || "",
          age: formData?.age || "",
          phone: formData?.phone || "",
          department: formData?.department || "",
          salary: formData?.salary || "",
          reportingManager: formData?.reportingManager || "",
          employeeCode: formData?.employeeCode || "",
          joiningDate: formatDateForBackend(formData?.joiningDate),
          address: formData?.address || {},
        };

    setSubmitting(true);

    try {
      if (isEdit) {
        await dispatch(
          editEmployee({
            id: formData?.employeeId || "",
            data: payload,
          }),
        )?.unwrap?.();

        toast?.success?.("Employee updated successfully");
      } else {
        await dispatch(addEmployee(payload))?.unwrap?.();
        toast?.success?.("Employee created successfully");
      }

      setShowCanvas(false);
      setFormData(INITIAL_EMPLOYEE_STATE || {});
    } finally {
      setSubmitting(false);
    }
  };
  // endregion

  // region ui
  return (
    <div className='py-4'>
      {/* header */}
      <div className='d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom'>
        <h2 className='fw-bold d-flex align-items-center'>
          <FaUsers className='me-2 text-primary' />
          Employees
        </h2>

        <button className='btn btn-primary' onClick={handleOpenCreate}>
          <FaPlus className='me-2' />
          Add Employee
        </button>
      </div>

      {/* filters */}
      {overallTotal > 0 && (
        <Filters
          search={searchTerm || ""}
          onSearchChange={setSearchTerm}
          selectedDepartment={department || ""}
          onDepartmentChange={setDepartment}
          showDepartment
        />
      )}

      {/* table */}
      <div className='card mt-3'>
        {loading && <Loader text='Loading employees...' />}

        {!loading && overallTotal > 0 && (
          <UserTable
            users={employees || []}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
            onView={handleViewEmployee}
            userRole='EMPLOYEE'
          />
        )}

        {!loading && overallTotal === 0 && (
          <div className='text-center py-5 text-muted'>
            No employees available.
          </div>
        )}
      </div>

      {/* pagination */}
      {overallTotal > 0 && (
        <div className='d-flex justify-content-end mt-4'>
          <Pagination
            page={page || 1}
            totalPages={totalPages || 1}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* canvas */}
      <Canvas
        show={showCanvas}
        onClose={() => {
          setShowCanvas(false);
          setIsView(false);
          setViewData(null);
        }}
        title={
          isView
            ? "Employee Details"
            : isEdit
              ? "Edit Employee"
              : "Create Employee"
        }
        size='xl'
        footer={
          !isView && (
            <div className='d-flex justify-content-end gap-2'>
              <button
                className='btn btn-primary'
                onClick={handleSubmit}
                disabled={submitting || Object.keys(errors || {}).length > 0}
              >
                {submitting ? "Saving..." : isEdit ? "Update" : "Create"}
              </button>
            </div>
          )
        }
      >
        {isView && (
          <>
            <ViewDetails data={viewData || {}} userRole='EMPLOYEE' />

            <div className='text-end mt-3'>
              <button
                className='btn btn-outline-primary'
                onClick={() => handleOpenEdit(viewData || {})}
              >
                Edit Employee
              </button>
            </div>
          </>
        )}

        {!isView && (
          <UserForm
            formData={formData || {}}
            onChange={handleInputChange}
            onBlur={handleBlur}
            errors={errors || {}}
            isEdit={isEdit}
            userRole='EMPLOYEE'
          />
        )}
      </Canvas>

      {/* delete modal */}
      <ConfirmModal
        show={showDeleteModal}
        onConfirm={confirmDelete}
        onClose={() => setShowDeleteModal(false)}
        title='Delete Employee'
        message='Are you sure?'
      />
    </div>
  );
  // endregion
};
// endregion

// region exports
export default Employees;
// endregion
