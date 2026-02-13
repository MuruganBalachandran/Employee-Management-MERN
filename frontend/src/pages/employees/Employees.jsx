// region imports
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

// components
import {
  Canvas,
  Filters,
  UserTable,
  ConfirmModal,
  Loader,
  ViewDetails,
} from "../../components";
import UserForm from "../../components/forms/UserForm";

// redux
import {
  getEmployees,
  addEmployee,
  editEmployee,
  removeEmployee,
  selectEmployees,
  selectEmployeesLoading,
} from "../../features";

// utils
import { INITIAL_EMPLOYEE_STATE } from "../../utils/constants";
import { validateField, validateForm } from "../../utils/validation";
import {
  formatDateForBackend,
  formatDateForInput,
} from "../../utils/formatters";
import {
  checkEmailAvailability,
  checkEmployeeCodeAvailability,
} from "../../services/employeeService";

// icons
import { FaUsers, FaPlus } from "react-icons/fa";
// endregion

// region component
const Employees = () => {
  // region hooks
  const dispatch = useDispatch();
  const employees = useSelector(selectEmployees);
  const loading = useSelector(selectEmployeesLoading);
  // endregion

  // region table state
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [department, setDepartment] = useState("");
  // endregion

  // region form & view state
  const [showCanvas, setShowCanvas] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isView, setIsView] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [formData, setFormData] = useState(INITIAL_EMPLOYEE_STATE);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  // endregion

  // region delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  // endregion

  // region effects
  useEffect(() => {
    dispatch(getEmployees({ search: debouncedSearch, department }));
  }, [dispatch, debouncedSearch, department]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);
  // endregion

  // region view handler
  const handleViewEmployee = (employee = {}) => {
    setIsView(true);
    setIsEdit(false);
    setViewData(employee);
    setShowCanvas(true);
  };
  // endregion

  // region handlers
  const handleInputChange = (e = {}) => {
    const { name = "", value = "" } = e.target || {};

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev?.[parent] || {}),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors?.[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleBlur = async (e = {}) => {
    const { name = "", value = "" } = e.target || {};

    const error = validateField(name, value, "EMPLOYEE", null);
    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
      return;
    }

    if (name === "email" && value && !isEdit) {
      const result = await checkEmailAvailability(value);
      if (!result?.available) {
        setErrors((prev) => ({
          ...prev,
          email: result?.message || "Email already exists",
        }));
      }
    }

    if (name === "employeeCode" && value && !isEdit) {
      const result = await checkEmployeeCodeAvailability(value);
      if (!result?.available) {
        setErrors((prev) => ({
          ...prev,
          employeeCode: result?.message || "Employee code already exists",
        }));
      }
    }
  };

  const handleOpenCreate = () => {
    setIsView(false);
    setIsEdit(false);
    setViewData(null);
    setFormData(INITIAL_EMPLOYEE_STATE);
    setErrors({});
    setShowCanvas(true);
  };

  const handleOpenEdit = (employee = {}) => {
    setIsView(false);
    setIsEdit(true);
    setViewData(null);

    setFormData({
      ...INITIAL_EMPLOYEE_STATE,
      name: employee?.Name || "",
      email: employee?.Email || "",
      age: employee?.Age?.toString() || "",
      phone: employee?.Phone || "",
      department: employee?.Department || "",
      salary: employee?.Salary?.toString() || "",
      reportingManager: employee?.Reporting_Manager || "",
      employeeCode: employee?.Employee_Code || "",
      joiningDate: formatDateForInput(employee?.Joining_date),
      isActive: employee?.Is_Active ?? 1,
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

  const handleDelete = (id = "") => {
    setEmployeeToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!employeeToDelete) return;
    await dispatch(removeEmployee(employeeToDelete)).unwrap();
    toast.success("Employee deleted successfully");
    setEmployeeToDelete(null);
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm(formData, "EMPLOYEE", isEdit);
    if (Object.values(validationErrors).some(Boolean)) {
      setErrors(validationErrors);
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
          editEmployee({ id: formData?.employeeId, data: payload }),
        ).unwrap();
        toast.success("Employee updated successfully");
      } else {
        await dispatch(addEmployee(payload)).unwrap();
        toast.success("Employee created successfully");
      }
      setShowCanvas(false);
      setFormData(INITIAL_EMPLOYEE_STATE);
    } finally {
      setSubmitting(false);
    }
  };
  // endregion

  // region ui
  return (
    <div className='py-4'>
      {/* Header */}
      <div className='d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom'>
        <h2 className='fw-bold d-flex align-items-center'>
          <FaUsers className='me-2 text-primary' /> Employees
        </h2>
        <button className='btn btn-primary' onClick={handleOpenCreate}>
          <FaPlus className='me-2' /> Add Employee
        </button>
      </div>

      <Filters
        search={searchTerm}
        onSearchChange={setSearchTerm}
        selectedDepartment={department}
        onDepartmentChange={setDepartment}
        showDepartment
      />

      <div className='card mt-3'>
        {loading ? (
          <Loader text='Loading employees...' />
        ) : (
          <UserTable
            users={employees}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
            onView={handleViewEmployee}
            userRole='EMPLOYEE'
          />
        )}
      </div>

      {/* Canvas */}
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
                className='btn btn-light'
                onClick={() => setShowCanvas(false)}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                className='btn btn-primary'
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? "Saving..." : isEdit ? "Update" : "Create"}
              </button>
            </div>
          )
        }
      >
        {isView ? (
          <>
            <ViewDetails data={viewData} userRole='EMPLOYEE' />
            <div className='text-end mt-3'>
              <button
                className='btn btn-outline-primary'
                onClick={() => handleOpenEdit(viewData)}
              >
                Edit Employee
              </button>
            </div>
          </>
        ) : (
          <UserForm
            formData={formData}
            onChange={handleInputChange}
            onBlur={handleBlur}
            errors={errors}
            isEdit={isEdit}
            userRole='EMPLOYEE'
          />
        )}
      </Canvas>

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

export default Employees;
