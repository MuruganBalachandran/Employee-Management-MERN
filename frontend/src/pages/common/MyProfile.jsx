// region imports
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { selectUser, fetchCurrentUser } from "../../features";
import { ProfileDetails } from "../../components";
import { FaEdit } from "react-icons/fa";
// endregion

// region component
const MyProfile = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const loading = useSelector((state) => state?.auth?.loading);

  // Fetch complete profile data on mount
  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* header row */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0 fw-bold">My Profile</h4>

        <Link 
          to="/me/edit" 
          className="btn btn-primary d-flex align-items-center gap-2 px-3"
        >
          <FaEdit />
          <span>Edit Profile</span>
        </Link>
      </div>

      {/* profile details */}
      <ProfileDetails user={user} showMeta={false} />
    </div>
  );
};
// endregion

// region exports
export default MyProfile;
// endregion
