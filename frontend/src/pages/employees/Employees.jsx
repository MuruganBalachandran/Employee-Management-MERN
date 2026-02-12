// region imports
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

// components
import { Canvas, Filters, Pagination, UserTable, ConfirmModal, Loader } from "../../components";
import UserForm from "../../components/forms/UserForm";

// redux
import { getEmployees, addEmployee, editEmployee, removeEmployee, selectEmployees, selectEmployeesLoading } from "../../features";

// utils
import { INITIAL_EMPLOYEE_STATE } from "../../utils/constants";
import { validateField, validateForm } from "../../utils/validation";
import { formatDateForBackend, formatDateForInput } from "../../utils/formatters";
import { checkEmailAvailability, checkEmployeeCodeAvailability } from "../../services/employeeService";

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

  // region form state
  const [showCanvas, setShowCanvas] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState(INITIAL_EMPLOYEE_STATE);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  // endregion

  // region delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  // endregion

  // region effects
  // fetch employees initially and on filter change
  useEffect(() => {
    dispatch(getEmployees({ search: debouncedSearch, department }));
  }, [dispatch, debouncedSearch, department]);

  // debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);
  // endregion

  // region handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested address fields
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error for the field as user types
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleBlur = async (e) => {
    const { name, value } = e.target;
    
    // First do client-side validation
    const error = validateField(name, value, "EMPLOYEE", null);
    if (error) {
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
      return;
    }

    // Then do async backend validation for unique fields
    if (name === "email" && value && !isEdit) {
      try {
        const result = await checkEmailAvailability(value);
        if (!result.available) {
          setErrors(prev => ({
            ...prev,
            email: result.message || "Email already exists"
          }));
        } else {
          // Clear error if available
          setErrors(prev => {
            const next = { ...prev };
            delete next.email;
            return next;
          });
        }
      } catch (err) {
        console.error("Email check error:", err);
      }
    }

    if (name === "employeeCode" && value && !isEdit) {
      try {
        const result = await checkEmployeeCodeAvailability(value);
        if (!result.available) {
          setErrors(prev => ({
            ...prev,
            employeeCode: result.message || "Employee code already exists"
          }));
        } else {
          // Clear error if available
          setErrors(prev => {
            const next = { ...prev };
            delete next.employeeCode;
            return next;
          });
        }
      } catch (err) {
        console.error("Employee code check error:", err);
      }
    }
  };

  const handleOpenCreate = () => {
    setIsEdit(false);
    setFormData(INITIAL_EMPLOYEE_STATE);
    setErrors({});
    setShowCanvas(true);
  };

  const handleOpenEdit = (employee) => {
    setIsEdit(true);
    // Map Pascal_Case from DB to camelCase for form
    setFormData({
      ...INITIAL_EMPLOYEE_STATE,
      name: employee.Name || "",
      email: employee.Email || "",
      age: employee.Age?.toString() || "",
      phone: employee.Phone || "",
      department: employee.Department || "",
      salary: employee.Salary?.toString() || "",
      reportingManager: employee.Reporting_Manager || "",
      employeeCode: employee.Employee_Code || "",
      joiningDate: formatDateForInput(employee.Joining_date),
      isActive: employee.Is_Active ?? 1,
      address: {
        line1: employee.Address?.Line1 || "",
        line2: employee.Address?.Line2 || "",
        city: employee.Address?.City || "",
        state: employee.Address?.State || "",
        zipCode: employee.Address?.ZipCode || "",
      },
      employeeId: employee.Employee_Id
    });
    setErrors({});
    setShowCanvas(true);
  };

  const handleDelete = (id) => {
    setEmployeeToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!employeeToDelete) return;
    
    try {
      await dispatch(removeEmployee(employeeToDelete)).unwrap();
      toast.success("Employee deleted successfully");
    } catch (err) {
      toast.error(err || "Failed to delete employee");
    } finally {
      setEmployeeToDelete(null);
    }
  };

  const handleSubmit = async () => {
    // Client-side validation
    const validationErrors = validateForm(formData, "EMPLOYEE", isEdit);
    if (Object.values(validationErrors).some(err => err)) {
      setErrors(validationErrors);
      return;
    }

    // Prepare data (convert date for backend)
    const submissionData = {
      ...formData,
      joiningDate: formatDateForBackend(formData.joiningDate)
    };

    setSubmitting(true);
    try {
      if (isEdit) {
        await dispatch(editEmployee({ id: formData.employeeId, data: submissionData })).unwrap();
        toast.success("Employee updated successfully");
        setShowCanvas(false);
        setFormData(INITIAL_EMPLOYEE_STATE);
      } else {
        await dispatch(addEmployee(submissionData)).unwrap();
        toast.success("Employee created successfully");
        setShowCanvas(false);
        setFormData(INITIAL_EMPLOYEE_STATE);
      }
    } catch (err) {
      // Parse backend errors
      let backendErrors = {};
      let errorMsg = "";

      // Check if error is an object with field-specific errors
      if (typeof err === 'object' && err !== null && !Array.isArray(err)) {
        // Backend returned validation errors as object
        backendErrors = err;
        
        // Map common field names
        if (err.email) backendErrors.email = err.email;
        if (err.employeeCode) backendErrors.employeeCode = err.employeeCode;
        if (err.password) backendErrors.password = err.password;
        if (err.name) backendErrors.name = err.name;
        if (err.phone) backendErrors.phone = err.phone;
        
        setErrors(prev => ({ ...prev, ...backendErrors }));
      } else {
        // Error is a string message
        errorMsg = err?.toString() || "";
        
        if (errorMsg.toLowerCase().includes("email")) {
          setErrors(prev => ({ ...prev, email: "Email already registered" }));
        } else if (errorMsg.toLowerCase().includes("code")) {
          setErrors(prev => ({ ...prev, employeeCode: "Employee code already exists" }));
        } else {
          toast.error(errorMsg || "Operation failed");
        }
      }
    } finally {
      setSubmitting(false);
    }
  };
  // endregion

  // region ui
  return (
    <div className='py-4'>
      {/* Page Header */}
      <div className='d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom'>
        <div>
          <h2 className='fw-bold mb-1 d-flex align-items-center'>
            <FaUsers className='me-2 text-primary' size={24} />
            Employees
          </h2>
          <p className='text-muted small mb-0'>Manage and view all employee records in the system.</p>
        </div>
        <button 
          className='btn btn-primary rounded-pill px-4 shadow-sm d-flex align-items-center'
          onClick={handleOpenCreate}
        >
          <FaPlus className='me-2' size={14} />
          Add Employee
        </button>
      </div>

      {/* Filters */}
      <div className='mb-4'>
        <Filters
          search={searchTerm}
          onSearchChange={setSearchTerm}
          selectedDepartment={department}
          onDepartmentChange={setDepartment}
          showDepartment={true}
          placeholder='Search by name, email, or employee code...'
        />
      </div>

      {/* Main Content */}
      <div className='card border-0 shadow-sm rounded-4'>
        <div className='card-body p-0'>
          {loading && !employees.length ? (
            <div className='py-5'>
              <Loader text='Loading employees...' />
            </div>
          ) : (
            <UserTable
              users={employees}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
              userRole='EMPLOYEE'
              viewPathBase='/profile'
            />
          )}
        </div>
      </div>

      {/* Create/Edit Canvas */}
      <Canvas
        show={showCanvas}
        onClose={() => setShowCanvas(false)}
        title={isEdit ? "Edit Employee" : "Add New Employee"}
        size='xl'
        footer={
          <div className='d-flex justify-content-end gap-2'>
            <button
              className='btn btn-light rounded-pill px-4'
              onClick={() => setShowCanvas(false)}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              className='btn btn-primary rounded-pill px-4'
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className='spinner-border spinner-border-sm me-2' role='status' aria-hidden='true'></span>
                  Saving...
                </>
              ) : (
                isEdit ? "Update Employee" : "Create Employee"
              )}
            </button>
          </div>
        }
      >
        <UserForm
          formData={formData}
          onChange={handleInputChange}
          onBlur={handleBlur}
          errors={errors}
          isEdit={isEdit}
          userRole='EMPLOYEE'
        />
      </Canvas>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Employee"
        message="Are you sure you want to delete this employee? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};
// endregion

// region exports
export default Employees;
// endregion
