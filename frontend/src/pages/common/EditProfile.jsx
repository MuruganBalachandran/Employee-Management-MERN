// region imports
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BackButton, EmployeeForm } from "../../components";
import { showToast, updateMyProfile, selectUser } from "../../features";

// endregion

// region component
const EditProfile = () => {
  // region hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  // endregion

  // region submit handler
  const handleSubmit = async (data = {}, setErrors = () => {}) => {
    try {
      // prepare payload
      const cleanData = {
        name: data?.name?.trim(),
        age: data?.age ? Number(data?.age) : undefined,
        phone: data?.phone?.trim(),
        address: data?.address,
      };

      // update profile
      await dispatch(updateMyProfile(cleanData)).unwrap();

      // success toast & redirect
      dispatch(
        showToast({ message: "Profile updated" || "", type: "success" }),
      );
      navigate("/me" || "/");
    } catch (err) {
      // set field errors
      setErrors(err?.fieldErrors || {});

      // error toast
      dispatch(
        showToast({
          message: err?.message || "Update failed",
          type: "error",
        }),
      );
    }
  };
  // endregion

  // region render
  return (
    <div className='container mt-4'>
      {/* header */}
      <div className='d-flex align-items-center gap-3 mb-2'>
        <BackButton />
        <h3>{"Edit Profile" || ""}</h3>
      </div>

      {/* form to edit profile */}
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
