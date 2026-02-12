// region imports
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaShieldAlt, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import { Filters, UserTable, Loader, Canvas, UserForm, ConfirmModal } from "../../components";
import {
  getAdmins,
  removeAdmin,
  addAdmin,
  editAdmin,
  selectAdmins,
  selectAdminsLoading,
} from "../../features";
import { INITIAL_ADMIN_STATE } from "../../utils/constants";
import { validateField, validateForm } from "../../utils/validation";
import { formatDateForBackend, formatDateForInput } from "../../utils/formatters";
import { checkEmailAvailability, checkAdminCodeAvailability } from "../../services/superAdminService";
// endregion

// region component
const Admins = () => {
  // region hooks
  const dispatch = useDispatch();
  const admins = useSelector(selectAdmins);
  const loading = useSelector(selectAdminsLoading);
  // endregion

  // region table state
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  // endregion

  // region form state
  const [showCanvas, setShowCanvas] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState(INITIAL_ADMIN_STATE);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  // endregion

  // region delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);
  // endregion

  // region permission modal state
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [adminToChangePermission, setAdminToChangePermission] = useState(null);
  // endregion

  // region effects
  // fetch admins initially and on search change
  useEffect(() => {
    dispatch(getAdmins({ search: debouncedSearch }));
  }, [dispatch, debouncedSearch]);

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
    const error = validateField(name, value, "ADMIN", null);
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

    if (name === "adminCode" && value && !isEdit) {
      try {
        const result = await checkAdminCodeAvailability(value);
        if (!result.available) {
          setErrors(prev => ({
            ...prev,
            adminCode: result.message || "Admin code already exists"
          }));
        } else {
          // Clear error if available
          setErrors(prev => {
            const next = { ...prev };
            delete next.adminCode;
            return next;
          });
        }
      } catch (err) {
        console.error("Admin code check error:", err);
      }
    }
  };

  const handleOpenCreate = () => {
    setIsEdit(false);
    setFormData(INITIAL_ADMIN_STATE);
    setErrors({});
    setShowCanvas(true);
  };

  const handleOpenEdit = (admin) => {
    setIsEdit(true);
    // Map Pascal_Case from DB to camelCase for form
    setFormData({
      ...INITIAL_ADMIN_STATE,
      name: admin.Name || "",
      email: admin.Email || "",
      age: admin.Age?.toString() || "",
      phone: admin.Phone || "",
      department: admin.Department || "",
      salary: admin.Salary?.toString() || "",
      adminCode: admin.Admin_Code || "",
      joiningDate: formatDateForInput(admin.Joining_Date),
      isActive: admin.Is_Active ?? 1,
      permissions: admin.Permissions || "GRANTED",
      address: {
        line1: admin.Address?.Line1 || "",
        line2: admin.Address?.Line2 || "",
        city: admin.Address?.City || "",
        state: admin.Address?.State || "",
        zipCode: admin.Address?.ZipCode || "",
      },
      adminId: admin.Admin_Id
    });
    setErrors({});
    setShowCanvas(true);
  };

  const handleDelete = (id) => {
    setAdminToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!adminToDelete) return;
    
    try {
      await dispatch(removeAdmin(adminToDelete)).unwrap();
      toast.success("Admin deleted successfully");
    } catch (err) {
      toast.error(err || "Failed to delete admin");
    } finally {
      setAdminToDelete(null);
    }
  };

  const handlePermissionChange = (admin) => {
    setAdminToChangePermission(admin);
    setShowPermissionModal(true);
  };

  const confirmPermissionChange = async () => {
    if (!adminToChangePermission) return;

    const newPermission = adminToChangePermission.Permissions === 'GRANTED' ? 'REVOKED' : 'GRANTED';
    
    try {
      const adminId = adminToChangePermission.Admin_Id;
      
      // Prepare admin data with toggled permission
      const updatedData = {
        name: adminToChangePermission.Name,
        email: adminToChangePermission.Email,
        age: adminToChangePermission.Age,
        phone: adminToChangePermission.Phone,
        department: adminToChangePermission.Department,
        salary: adminToChangePermission.Salary,
        adminCode: adminToChangePermission.Admin_Code,
        joiningDate: formatDateForBackend(adminToChangePermission.Joining_Date),
        isActive: adminToChangePermission.Is_Active,
        permissions: newPermission,
        address: {
          line1: adminToChangePermission.Address?.Line1 || "",
          line2: adminToChangePermission.Address?.Line2 || "",
          city: adminToChangePermission.Address?.City || "",
          state: adminToChangePermission.Address?.State || "",
          zipCode: adminToChangePermission.Address?.ZipCode || "",
        }
      };

      await dispatch(editAdmin({ id: adminId, data: updatedData })).unwrap();
      toast.success(`Permission ${newPermission.toLowerCase()} successfully`);
    } catch (err) {
      toast.error(err || "Failed to change permission");
    } finally {
      setAdminToChangePermission(null);
    }
  };

  const handleSubmit = async () => {
    // Client-side validation
    const validationErrors = validateForm(formData, "ADMIN", isEdit);
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
        await dispatch(editAdmin({ id: formData.adminId, data: submissionData })).unwrap();
        toast.success("Admin updated successfully");
        setShowCanvas(false);
        setFormData(INITIAL_ADMIN_STATE);
      } else {
        await dispatch(addAdmin(submissionData)).unwrap();
        toast.success("Admin created successfully");
        setShowCanvas(false);
        setFormData(INITIAL_ADMIN_STATE);
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
        if (err.adminCode) backendErrors.adminCode = err.adminCode;
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
          setErrors(prev => ({ ...prev, adminCode: "Admin code already exists" }));
        } else {
          toast.error(errorMsg || "Operation failed");
        }
      }
    } finally {
      setSubmitting(false);
    }
  };
  // endregion

  return (
    <div className='py-4'>
      {/* Page Header */}
      <div className='d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom'>
        <div>
          <h2 className='fw-bold mb-1 d-flex align-items-center'>
            <FaShieldAlt className='me-2 text-primary' size={24} />
            Admin Management
          </h2>
          <p className='text-muted small mb-0'>Control administrative access and system permissions.</p>
        </div>
        <button 
          className='btn btn-primary rounded-pill px-4 shadow-sm d-flex align-items-center'
          onClick={handleOpenCreate}
        >
          <FaPlus className='me-2' size={14} />
          Create Admin
        </button>
      </div>

      {/* Filters */}
      <div className='mb-4'>
        <Filters
          search={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder='Search admins by name or email...'
        />
      </div>

      {/* Main Content */}
      <div className='card border-0 shadow-sm rounded-4'>
        <div className='card-body p-0'>
          {loading && !admins.length ? (
            <div className='py-5 text-center'>
              <Loader text='Loading admins...' />
            </div>
          ) : (
            <UserTable
              users={admins}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
              onPermissionChange={handlePermissionChange}
              userRole='ADMIN'
              viewPathBase='/profile'
            />
          )}
        </div>
      </div>

      {/* Create/Edit Canvas */}
      <Canvas
        show={showCanvas}
        onClose={() => setShowCanvas(false)}
        title={isEdit ? "Edit Admin" : "Create New Admin"}
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
                isEdit ? "Update Admin" : "Create Admin"
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
          userRole='ADMIN'
        />
      </Canvas>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Admin"
        message="Are you sure you want to delete this admin account? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />

      {/* Permission Change Confirmation Modal */}
      <ConfirmModal
        show={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
        onConfirm={confirmPermissionChange}
        title={`${adminToChangePermission?.Permissions === 'GRANTED' ? 'Revoke' : 'Grant'} Permission`}
        message={`Are you sure you want to ${adminToChangePermission?.Permissions === 'GRANTED' ? 'revoke' : 'grant'} permission for ${adminToChangePermission?.Name}?`}
        confirmText={adminToChangePermission?.Permissions === 'GRANTED' ? 'Revoke' : 'Grant'}
        cancelText="Cancel"
        variant={adminToChangePermission?.Permissions === 'GRANTED' ? 'danger' : 'primary'}
      />
    </div>
  );
};
// endregion

// region exports
export default Admins;
// endregion
