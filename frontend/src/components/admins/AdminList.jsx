// region imports
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdmins,
  removeAdmin,
  selectAdmins,
  selectAdminsLoading,
  selectAdminsError,
} from "../../features";
import { Link } from "react-router-dom";
// endregion

// region AdminList component
const AdminList = () => {
  // hooks
  const dispatch = useDispatch();
  const admins = useSelector(selectAdmins);
  const loading = useSelector(selectAdminsLoading);
  const error = useSelector(selectAdminsError);

  // local state for pagination (simple client-side for now or prepare for server-side)
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // effects
  useEffect(() => {
    dispatch(fetchAdmins({ page, limit }));
  }, [dispatch, page, limit]);

  // handlers
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this admin?")) {
      dispatch(removeAdmin(id));
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>;
  if (error) return <div className="alert alert-danger mt-5">Error: {error}</div>;

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-white py-3">
        <h5 className="mb-0">Admin List</h5>
      </div>
      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Created At</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins?.length > 0 ? (
              admins.map((admin) => (
                <tr key={admin.Admin_Id}>
                  <td>{admin.Name}</td>
                  <td>{admin.Email}</td>
                  <td>{new Date(parseInt(admin.Created_At)).toLocaleDateString()}</td>
                  <td className="text-end">
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDelete(admin.Admin_Id)}
                      title="Delete Admin"
                    >
                      <i className="bi bi-trash"></i> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4 text-muted">
                  No admins found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
// endregion

// region exports
export default AdminList;
// endregion
