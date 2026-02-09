// region imports
import React from "react";
import AdminList from "../../components/admins/AdminList";
// endregion

// region ViewAdmins Page
const ViewAdmins = () => {
  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col">
          <h2>Manage Admins</h2>
          <p className="text-muted">View and manage system administrators.</p>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <AdminList />
        </div>
      </div>
    </div>
  );
};
// endregion

// region exports
export default ViewAdmins;
// endregion
