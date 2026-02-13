// region imports
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaShieldAlt, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";

import {
  Filters,
  UserTable,
  Loader,
  Canvas,
  UserForm,
  ConfirmModal,
  ViewDetails,
} from "../../components";

import {
  getAdmins,
  removeAdmin,
  addAdmin,
  editAdmin,
  updateAdminPermission,
  selectAdmins,
  selectAdminsLoading,
} from "../../features";

import { INITIAL_ADMIN_STATE } from "../../utils/constants";
import { validateField, validateForm } from "../../utils/validation";
import {
  formatDateForBackend,
  formatDateForInput,
} from "../../utils/formatters";
import {
  checkEmailAvailability,
  checkAdminCodeAvailability,
} from "../../services/superAdminService";

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

  // region delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);
  // endregion

  // region permission modal
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [adminToChangePermission, setAdminToChangePermission] = useState(null);
  // endregion

  // region view state
const [isView, setIsView] = useState(false);
const [viewData, setViewData] = useState(null);
// endregion



  // region effects
  useEffect(() => {
    dispatch(getAdmins({ search: debouncedSearch }));
  }, [dispatch, debouncedSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);
  // endregion

  // region view handler
const handleViewAdmin = (admin = {}) => {
  console.log("VIEW ADMIN:", admin);
  setIsView(true);
  setIsEdit(false);
  setViewData(admin);
  setShowCanvas(true);
};
// endregion


  // region handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value || "",
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value || "" }));
    }

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

    const error = validateField(name, value, "ADMIN", null);
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
  } else {
    setErrors((prev) => {
      const next = { ...prev };
      delete next.email;
      return next;
    });
  }
}


 if (name === "adminCode" && value && !isEdit) {
  const result = await checkAdminCodeAvailability(value);
  if (!result?.available) {
    setErrors((prev) => ({
      ...prev,
      adminCode: result?.message || "Admin code already exists",
    }));
  } else {
    setErrors((prev) => {
      const next = { ...prev };
      delete next.adminCode;
      return next;
    });
  }
}

  };

const handleOpenCreate = () => {
  setIsView(false); 
  setIsEdit(false);
  setViewData(null);
  setFormData(INITIAL_ADMIN_STATE);
  setErrors({});
  setShowCanvas(true);
};


  const handleOpenEdit = (admin = {}) => {
      setIsView(false);  
  setIsEdit(true);
  setViewData(null); 
    setFormData({
      ...INITIAL_ADMIN_STATE,
      name: admin?.Name || "",
      email: admin?.Email || "",
      age: admin?.Age?.toString() || "",
      phone: admin?.Phone || "",
      salary: admin?.Salary?.toString() || "",
      adminCode: admin?.Admin_Code || "",
      joiningDate: formatDateForInput(admin?.Joining_Date),
      isActive: admin?.Is_Active ?? 1,
      address: {
        line1: admin?.Address?.Line1 || "",
        line2: admin?.Address?.Line2 || "",
        city: admin?.Address?.City || "",
        state: admin?.Address?.State || "",
        zipCode: admin?.Address?.ZipCode || "",
      },
      adminId: admin?.Admin_Id || "",
    });
    setErrors({});
    setShowCanvas(true);
  };

  const handleDelete = (id = "") => {
    setAdminToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!adminToDelete) return;
    await dispatch(removeAdmin(adminToDelete)).unwrap();
    toast.success("Admin deleted successfully");
    setAdminToDelete(null);
  };

const confirmPermissionChange = async () => {
  if (!adminToChangePermission) return;

  const permission =
    adminToChangePermission?.Permissions === "GRANTED"
      ? "REVOKED"
      : "GRANTED";

  try {
    await dispatch(
      updateAdminPermission({
        id: adminToChangePermission?.Admin_Id,
        permission,
      }),
    ).unwrap();

    toast.success(`Permission ${permission.toLowerCase()} successfully`);
  } catch (err) {
    toast.error(err || "Failed to update permission");
  } finally {
    //  UX polish (match Employees-style cleanup)
    setShowPermissionModal(false);
    setAdminToChangePermission(null);
  }
};

const handlePermissionChange = (admin = {}) => {
  setAdminToChangePermission(admin);
  setShowPermissionModal(true);
};



  const handleSubmit = async () => {
    const validationErrors = validateForm(formData, "ADMIN", isEdit);
    if (Object.values(validationErrors).some(Boolean)) {
      setErrors(validationErrors);
      return;
    }

    const payload = isEdit
      ? {
          name: formData?.name || "",
          age: formData?.age || "",
          phone: formData?.phone || "",
          salary: formData?.salary || "",
          isActive: formData?.isActive,
          address: formData?.address,
        }
      : {
          name: formData?.name || "",
          email: formData?.email || "",
          password: formData?.password || "",
          age: formData?.age || "",
          phone: formData?.phone || "",
          salary: formData?.salary || "",
          adminCode: formData?.adminCode || "",
          joiningDate: formatDateForBackend(formData?.joiningDate),
          address: formData?.address,
        };

    setSubmitting(true);
    try {
      if (isEdit) {
        await dispatch(
          editAdmin({ id: formData?.adminId, data: payload }),
        ).unwrap();
        toast.success("Admin updated successfully");
      } else {
        await dispatch(addAdmin(payload)).unwrap();
        toast.success("Admin created successfully");
      }
      setShowCanvas(false);
      setFormData(INITIAL_ADMIN_STATE);
    } finally {
      setSubmitting(false);
    }
  };
  // endregion

  return (
    <div className='py-4'>
      <div className='d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom'>
        <h2 className='fw-bold d-flex align-items-center'>
          <FaShieldAlt className='me-2 text-primary' /> Admin Management
        </h2>
        <button className='btn btn-primary' onClick={handleOpenCreate}>
          <FaPlus className='me-2' /> Create Admin
        </button>
      </div>

      <Filters search={searchTerm} onSearchChange={setSearchTerm} />

      <div className='card mt-3'>
        {loading ? (
          <Loader text='Loading admins...' />
        ) : (
          <UserTable
            users={admins}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
              onView={handleViewAdmin} 
            onPermissionChange={handlePermissionChange}
            userRole='ADMIN'
          />
        )}
      </div>

    {/* Create/Edit Canvas */}
<Canvas
  show={showCanvas}
  onClose={() => {
    setShowCanvas(false);
    setIsView(false);
    setViewData(null);
  }}
  title={
    isView
      ? "Admin Details"
      : isEdit
      ? "Edit Admin"
      : "Create Admin"
  }
  size="xl"
  footer={
    !isView && (
      <div className="d-flex justify-content-end gap-2">
        <button
          className="btn btn-light rounded-pill px-4"
          onClick={() => setShowCanvas(false)}
          disabled={submitting}
        >
          Cancel
        </button>

        <button
          className="btn btn-primary rounded-pill px-4"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" />
              Saving...
            </>
          ) : isEdit ? (
            "Update Admin"
          ) : (
            "Create Admin"
          )}
        </button>
      </div>
    )
  }
>
  {isView ? (
    <>
      <ViewDetails
        data={viewData}
        userRole="ADMIN"
      />

      {/* UX polish: edit from view */}
      <div className="text-end mt-3">
        <button
          className="btn btn-outline-primary rounded-pill px-4"
          onClick={() => handleOpenEdit(viewData)}
        >
          Edit Admin
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
      userRole="ADMIN"
    />
  )}
</Canvas>


      <ConfirmModal
        show={showDeleteModal}
        onConfirm={confirmDelete}
        onClose={() => setShowDeleteModal(false)}
        title='Delete Admin'
        message='Are you sure?'
      />

      <ConfirmModal
        show={showPermissionModal}
        onConfirm={confirmPermissionChange}
        onClose={() => setShowPermissionModal(false)}
        title='Change Permission'
        message='Confirm permission change?'
      />
    </div>
  );
};
// endregion

export default Admins;
