// region imports
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logout, selectUser } from "../../features";
import { ConfirmModal } from "../../components";
// endregion

// region component
const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => setShowLogoutModal(true);

  // logout
  const confirmLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (err) {
      console.error("Logout Error:", err || "");
      toast.error("Logout failed. Please try again.");
    }
  };

  if (!user) return null;

  return (
    <div className='container py-5'>
      <div className='row justify-content-center'>
        <div className='col-md-6 col-lg-4 text-center'>
          {/* Account Info */}
          <h3 className='mb-3'>{user.Name}</h3>
          <p className='mb-4'>{user.Email}</p>

          {/* Logout Button */}
          <button className='btn btn-danger w-100' onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        show={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
        title='Logout'
        message='Are you sure you want to  logout of your account?'
        confirmText='Logout'
        cancelText='Cancel'
        variant='danger'
      />
    </div>
  );
};
// endregion

// region exports
export default Profile;
// endregion
