// region imports
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import EmployeeForm from "../../components/employees/EmployeeForm";
import { showToast } from "../../features/toast/toastSlice";
import { updateMyProfile } from "../../features/auth/authSlice";
// endregion

// region component
const EditProfile = () => {
  // region hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state?.auth?.user) || {};
  // endregion

  // region submit handler
  const handleSubmit = async (data = {}, setErrors = () => {}) => {
    try {
      // prepare payload
      const cleanData = {
        name: data?.name || "",
        phone: data?.phone || "",
        address: data?.address || {},
      };

      // update profile
      await dispatch(updateMyProfile(cleanData)).unwrap();

      // success toast + redirect
      dispatch(showToast({ message: "Profile updated" || "", type: "success" }));
      navigate("/me" || "/");
    } catch (err) {
      // set field errors
      setErrors(err?.fieldErrors || {});

      // error toast
      dispatch(
        showToast({
          message: err?.message || "Update failed",
          type: "error",
        })
      );
    }
  };
  // endregion

  // region render
  return (
    <div className="container mt-4">
      <h3>{"Edit Profile" || ""}</h3>

      <EmployeeForm
        initialData={user}
        onSubmit={handleSubmit}
        hideCredentials={true || false}
      />
    </div>
  );
  // endregion
};

// region exports
export default EditProfile;
// endregion
