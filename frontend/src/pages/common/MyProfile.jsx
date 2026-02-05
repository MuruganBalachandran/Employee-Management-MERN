// region imports
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectUser } from "../../features";
// endregion

// region component
const MyProfile = () => {
   const user = useSelector(selectUser);


  if (!user?._id) {
    return <div className='p-4'>No user data found.</div>;
  }

  return (
    <div className='container mt-4'>
      <div className='card shadow-sm'>
      <div className="card-body">
  <h4 className="card-title mb-4">My Profile</h4>
<div className="d-flex justify-content-end mb-3">
        <Link to="/me/edit" className="btn btn-outline-primary btn-sm">
              Edit Profile
            </Link> 
</div>
  <div className="row mb-2">
    <div className="col-sm-3 fw-bold">Name</div>
    <div className="col-sm-9">{user?.Name || "-"}</div>
  </div>

  <div className="row mb-2">
    <div className="col-sm-3 fw-bold">Email</div>
    <div className="col-sm-9">{user?.Email || "-"}</div>
  </div>

  <div className="row mb-2">
    <div className="col-sm-3 fw-bold">Role</div>
    <div className="col-sm-9 text-capitalize">{user?.Role || "-"}</div>
  </div>

  <div className="row mb-2">
    <div className="col-sm-3 fw-bold">Phone</div>
    <div className="col-sm-9">{user?.Phone || "-"}</div>
  </div>

  <hr />

  <div className="row mb-2">
    <div className="col-sm-3 fw-bold">Address Line 1</div>
    <div className="col-sm-9">{user?.Address?.Line1 || "-"}</div>
  </div>

  <div className="row mb-2">
    <div className="col-sm-3 fw-bold">Address Line 2</div>
    <div className="col-sm-9">{user?.Address?.Line2 || "-"}</div>
  </div>

  <div className="row mb-2">
    <div className="col-sm-3 fw-bold">City</div>
    <div className="col-sm-9">{user?.Address?.City || "-"}</div>
  </div>

  <div className="row mb-2">
    <div className="col-sm-3 fw-bold">State</div>
    <div className="col-sm-9">{user?.Address?.State || "-"}</div>
  </div>

  <div className="row mb-2">
    <div className="col-sm-3 fw-bold">ZIP Code</div>
    <div className="col-sm-9">{user?.Address?.ZipCode || "-"}</div>
  </div>

  <hr />

  <div className="row mb-2">
    <div className="col-sm-3 fw-bold">User ID</div>
    <div className="col-sm-9">{user?._id}</div>
  </div>

  <div className="row mb-2">
    <div className="col-sm-3 fw-bold">Created</div>
    <div className="col-sm-9">
      {user?.Created_At ? new Date(user.Created_At).toLocaleString() : "-"}
    </div>
  </div>

  <div className="row mb-2">
    <div className="col-sm-3 fw-bold">Updated</div>
    <div className="col-sm-9">
      {user?.Updated_At ? new Date(user.Updated_At).toLocaleString() : "-"}
    </div>
  </div>
</div>

      </div>
    </div>
  );
};
// endregion

export default MyProfile;
