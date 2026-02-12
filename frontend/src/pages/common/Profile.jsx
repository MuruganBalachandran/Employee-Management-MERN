// region imports
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUserCircle, FaEnvelope, FaIdBadge, FaSignOutAlt } from "react-icons/fa";
import { logout, selectUser } from "../../features";
import { ConfirmModal } from "../../components";
// endregion

// region component
const Profile = () => {
  // region hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  // endregion

  // region logout modal state
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  // endregion

  // region handleLogout
  const handleLogout = () => {
    setShowLogoutModal(true);
  };

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
  // endregion

  // region ui
  if (!user) return null;

  return (
    <div className='py-5'>
      <div className='row justify-content-center'>
        <div className='col-md-7 col-lg-5'>
          {/* Profile Card */}
          <div className='card border-0 shadow-sm rounded-4 overflow-hidden'>
            {/* Header / Banner area */}
            <div className='bg-primary py-5 text-center'>
              <div className='bg-white rounded-circle d-inline-flex p-2 shadow-sm mb-2'>
                <FaUserCircle size={80} className='text-primary' />
              </div>
              <h3 className='text-white fw-bold mb-0'>{user.Name}</h3>
              <p className='text-white-50 small mb-0'>{user.Role}</p>
            </div>

            <div className='card-body p-4 p-md-5'>
              <div className='mb-4'>
                <h6 className='text-uppercase text-muted fw-bold small mb-3 border-bottom pb-2'>Account Information</h6>
                
                <div className='d-flex align-items-start mb-3'>
                  <div className='bg-light rounded p-2 me-3'>
                    <FaEnvelope className='text-primary' />
                  </div>
                  <div>
                    <label className='text-muted small d-block'>Email Address</label>
                    <span className='fw-semibold'>{user.Email}</span>
                  </div>
                </div>

                <div className='d-flex align-items-start mb-3'>
                  <div className='bg-light rounded p-2 me-3'>
                    <FaIdBadge className='text-primary' />
                  </div>
                  <div>
                    <label className='text-muted small d-block'>User ID</label>
                    <span className='fw-semibold text-break'>{user.User_Id}</span>
                  </div>
                </div>
              </div>

              <div className='d-grid pt-3'>
                <button
                  className='btn btn-outline-danger btn-lg rounded-pill shadow-sm d-flex align-items-center justify-content-center'
                  onClick={handleLogout}
                >
                  <FaSignOutAlt className='me-2' />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        show={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
        title="Sign Out"
        message="Are you sure you want to sign out of your account?"
        confirmText="Sign Out"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
  // endregion
};
// endregion

// region exports
export default Profile;
// endregion
