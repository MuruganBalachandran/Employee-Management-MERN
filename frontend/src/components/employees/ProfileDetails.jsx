// region imports
import React from "react";
// endregion

// region helper
const formatDate = (date = "") => {
  if (!date) return "-";
  const d = new Date(date);
  return isNaN(d) ? "-" : d.toLocaleString();
};
// endregion

// region component
const ProfileDetails = ({ 
  user = {}, 
  showMeta = false,
 }) => {
  if (!user?._id) return <div className="p-4">No data found.</div>;

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        {/* name */}
        <div className="row mb-2">
          <div className="col-sm-3 fw-bold">Name</div>
          <div className="col-sm-9">{user?.Name || "-"}</div>
        </div>

        {/* email */}
        <div className="row mb-2">
          <div className="col-sm-3 fw-bold">Email</div>
          <div className="col-sm-9">{user?.Email || "-"}</div>
        </div>

        {/* phone */}
        <div className="row mb-2">
          <div className="col-sm-3 fw-bold">Phone</div>
          <div className="col-sm-9">{user?.Phone || "-"}</div>
        </div>

        <hr />

        {/* address */}
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



        {/* meta */}
        {
          showMeta && (
<>
        <hr />
    <div className="row mb-2">
          <div className="col-sm-3 fw-bold">User ID</div>
          <div className="col-sm-9">{user?._id}</div>
        </div>
        <div className="row mb-2">
          <div className="col-sm-3 fw-bold">Created</div>
          <div className="col-sm-9">{formatDate(user?.Created_At)}</div>
        </div>
        <div className="row mb-2">
          <div className="col-sm-3 fw-bold">Updated</div>
          <div className="col-sm-9">{formatDate(user?.Updated_At)}</div>
        </div>  
</>
          )
        }
    
      </div>
    </div>
  );
};
// endregion

// region exports
export default ProfileDetails;
// endregion
