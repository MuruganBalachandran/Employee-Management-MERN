// region imports
// react
import React, { useState, useEffect } from "react";

// redux
import { useDispatch, useSelector } from "react-redux";

// icons
import { FaShieldAlt, FaPlus } from "react-icons/fa";

// notifications
import { toast } from "react-toastify";

// components
import {
  Filters,
  UserTable,
  Loader,
  Canvas,
  UserForm,
  ConfirmModal,
  ViewDetails,
  Pagination,
} from "../../components";

// redux features
import {
  getAdmins,
  removeAdmin,
  addAdmin,
  editAdmin,
  updateAdminPermission,
  selectAdmins,
  selectAdminsLoading,
  selectAdminsPagination,
  selectAdminsOverallTotal,
} from "../../features";

// utils
import { INITIAL_ADMIN_STATE } from "../../utils/constants";
import { validateField, validateForm } from "../../utils/validation";
import {
  formatDateForBackend,
  formatDateForInput,
} from "../../utils/formatters";

// services
import {
  checkEmailAvailability,
  checkAdminCodeAvailability,
} from "../../services/superAdminService";
// endregion

// region component
const Admins = () => {
  // region redux hooks
  // initialize redux dispatcher
  const dispatch = useDispatch();

  // read admins list from store
  const admins = useSelector(selectAdmins) || [];

  // read loading state
  const loading = useSelector(selectAdminsLoading) || false;

  // read pagination state
  const pagination = useSelector(selectAdminsPagination) || {};

  // normalize pagination values
  const page = pagination?.page || 1;
  const totalPages = pagination?.totalPages || 1;
  const overallTotal = useSelector(selectAdminsOverallTotal) || 0;

  // endregion

  // region table state
  // search input value
  const [searchTerm, setSearchTerm] = useState("");

  // debounced search value
  const [debouncedSearch, setDebouncedSearch] = useState("");
  // endregion

  // region canvas & view state
  // canvas visibility flag
  const [showCanvas, setShowCanvas] = useState(false);

  // edit mode flag
  const [isEdit, setIsEdit] = useState(false);

  // view mode flag
  const [isView, setIsView] = useState(false);

  // selected admin data for view
  const [viewData, setViewData] = useState(null);
  // endregion

  // region form state
  // admin form data
  const [formData, setFormData] = useState(INITIAL_ADMIN_STATE || {});

  // validation errors
  const [errors, setErrors] = useState({});

  // submit loading flag
  const [submitting, setSubmitting] = useState(false);
  // endregion

  // region delete modal state
  // delete confirmation modal flag
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // selected admin id for deletion
  const [adminToDelete, setAdminToDelete] = useState(null);
  // endregion

  // region permission modal state
  // permission confirmation modal flag
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  // selected admin for permission change
  const [adminToChangePermission, setAdminToChangePermission] = useState(null);
  // endregion

  // region effects
  // fetch admins on page or search change
  useEffect(() => {
    dispatch(
      getAdmins({
        page: page || 1,
        search: debouncedSearch || "",
      }),
    );
  }, [dispatch, page, debouncedSearch]);

  // debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm || "");
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // reset pagination on search update
  useEffect(() => {
    dispatch(
      getAdmins({
        page: 1,
        search: debouncedSearch || "",
      }),
    );
  }, [dispatch, debouncedSearch]);
  // endregion

  // region handlePageChange
  // handle pagination page change
  const handlePageChange = (newPage = 1) => {
    dispatch(
      getAdmins({
        page: newPage || 1,
        search: debouncedSearch || "",
      }),
    );
  };
  // endregion

  // region handleViewAdmin
  // open admin details in view mode
  const handleViewAdmin = (admin = {}) => {
    setIsView(true);
    setIsEdit(false);
    setViewData(admin || {});
    setShowCanvas(true);
  };
  // endregion

  // region handleInputChange
  // update form data on input change
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

    setErrors((prev) => {
      if (!prev?.[name]) return prev || {};
      const next = { ...(prev || {}) };
      delete next[name];
      return next;
    });

    if (name === "password" || name === "confirmPassword") {
      setErrors((prev) => {
        const next = { ...(prev || {}) };
        delete next.confirmPassword;
        return next;
      });
    }
  };
  // endregion

  // region handleBlur
  // validate field on blur and check availability
  const handleBlur = async (e = {}) => {
    const name = e?.target?.name || "";
    const value = e?.target?.value || "";

    const error = validateField(name, value, "ADMIN", null);

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

    if (name === "adminCode" && value && !isEdit) {
      const result = await checkAdminCodeAvailability(value || "");
      if (!result?.available) {
        setErrors((prev) => ({
          ...(prev || {}),
          adminCode: result?.message || "Admin code already exists",
        }));
      }
    }
  };
  // endregion

  // region handleOpenCreate
  // open create admin form
  const handleOpenCreate = () => {
    setIsView(false);
    setIsEdit(false);
    setViewData(null);
    setFormData(INITIAL_ADMIN_STATE || {});
    setErrors({});
    setShowCanvas(true);
  };
  // endregion

  // region handleOpenEdit
  // open edit admin form with existing data
  const handleOpenEdit = (admin = {}) => {
    setIsView(false);
    setIsEdit(true);
    setViewData(null);

    setFormData({
      ...(INITIAL_ADMIN_STATE || {}),
      name: admin?.Name || "",
      email: admin?.Email || "",
      age: admin?.Age?.toString?.() || "",
      phone: admin?.Phone || "",
      salary: admin?.Salary?.toString?.() || "",
      adminCode: admin?.Admin_Code || "",
      joiningDate: formatDateForInput(admin?.Joining_Date),
      isActive: admin?.Is_Active || 1,
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
  // endregion

  // region handleDelete
  // open delete confirmation modal
  const handleDelete = (id = "") => {
    setAdminToDelete(id || "");
    setShowDeleteModal(true);
  };
  // endregion

  // region confirmDelete
  // confirm admin deletion
  const confirmDelete = async () => {
    if (!adminToDelete) return;

    await dispatch(removeAdmin(adminToDelete || ""))?.unwrap?.();
    toast?.success?.("Admin deleted successfully");
    setAdminToDelete(null);
    setShowDeleteModal(false);
  };
  // endregion

  // region handlePermissionChange
  // open permission confirmation modal
  const handlePermissionChange = (admin = {}) => {
    setAdminToChangePermission(admin || {});
    setShowPermissionModal(true);
  };
  // endregion

  // region confirmPermissionChange
  // toggle admin permission
  const confirmPermissionChange = async () => {
    if (!adminToChangePermission) return;

    const permission =
      adminToChangePermission?.Permissions === "GRANTED"
        ? "REVOKED"
        : "GRANTED";

    await dispatch(
      updateAdminPermission({
        id: adminToChangePermission?.Admin_Id || "",
        permission,
      }),
    )?.unwrap?.();

    toast?.success?.("Permission updated successfully");
    setShowPermissionModal(false);
    setAdminToChangePermission(null);
  };
  // endregion

  // region handleSubmit
  // submit create or update admin
  const handleSubmit = async () => {
    const validationErrors = validateForm(formData || {}, "ADMIN", isEdit);

    if (Object.keys(validationErrors || {}).length > 0) {
      setErrors(validationErrors || {});
      toast?.error?.("Please fix the errors before submitting");
      return;
    }

    const payload = isEdit
      ? {
          name: formData?.name || "",
          age: formData?.age || "",
          phone: formData?.phone || "",
          salary: formData?.salary || "",
          isActive: formData?.isActive,
          address: formData?.address || {},
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
          address: formData?.address || {},
        };

    setSubmitting(true);

    try {
      if (isEdit) {
        await dispatch(
          editAdmin({
            id: formData?.adminId || "",
            data: payload,
          }),
        )?.unwrap?.();

        toast?.success?.("Admin updated successfully");
      } else {
        await dispatch(addAdmin(payload))?.unwrap?.();
        toast?.success?.("Admin created successfully");
      }

      setShowCanvas(false);
      setFormData(INITIAL_ADMIN_STATE || {});
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
          <FaShieldAlt className='me-2 text-primary' />
          Admin Management
        </h2>

        <button className='btn btn-primary' onClick={handleOpenCreate}>
          <FaPlus className='me-2' />
          Create Admin
        </button>
      </div>

      {/* filters */}
      {overallTotal > 0 && (
        <Filters search={searchTerm || ""} onSearchChange={setSearchTerm} />
      )}

      {/* table */}
      <div className='card mt-3'>
        {loading && <Loader text='Loading admins...' />}

        {!loading && overallTotal > 0 && (
          <UserTable
            users={admins || []}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
            onView={handleViewAdmin}
            onPermissionChange={handlePermissionChange}
            userRole='ADMIN'
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
          isView ? "Admin Details" : isEdit ? "Edit Admin" : "Create Admin"
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
                {submitting
                  ? "Saving..."
                  : isEdit
                    ? "Update Admin"
                    : "Create Admin"}
              </button>
            </div>
          )
        }
      >
        {isView && (
          <>
            <ViewDetails data={viewData || {}} userRole='ADMIN' />
            <div className='text-end mt-3'>
              <button
                className='btn btn-outline-primary'
                onClick={() => handleOpenEdit(viewData || {})}
              >
                Edit Admin
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
            userRole='ADMIN'
          />
        )}
      </Canvas>

      {/* delete modal */}
      <ConfirmModal
        show={showDeleteModal}
        onConfirm={confirmDelete}
        onClose={() => setShowDeleteModal(false)}
        title='Delete Admin'
        message='Are you sure?'
      />

      {/* permission modal */}
      <ConfirmModal
        show={showPermissionModal}
        onConfirm={confirmPermissionChange}
        onClose={() => setShowPermissionModal(false)}
        title='Change Permission'
        message='Confirm permission change?'
      />
    </div>
  );
  // endregion
};
// endregion

// region exports
export default Admins;
// endregion
