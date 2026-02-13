// region imports
import React, { useState } from "react";
import { FaEllipsisV, FaEdit, FaTrash, FaUser, FaKey } from "react-icons/fa";
// endregion

// region component
const UserTable = ({
  users = [],
  onView = () => {},
  onEdit = () => {},
  onDelete = () => {},
  onPermissionChange = () => {},
  userRole = "EMPLOYEE",
}) => {
  // region state
  const [openDropdown, setOpenDropdown] = useState(null);
  // endregion

  // region handlers
  const toggleDropdown = (id = null) => {
    setOpenDropdown((prev) => (prev === id ? null : id));
  };

  const handleView = (user = {}) => {
    setOpenDropdown(null);
    onView(user);
  };

  const handleEdit = (user = {}) => {
    setOpenDropdown(null);
    onEdit(user);
  };

  const handleDelete = (id = "") => {
    setOpenDropdown(null);
    onDelete(id);
  };

  const handlePermission = (user = {}) => {
    setOpenDropdown(null);
    onPermissionChange(user);
  };
  // endregion

  // region ui
  return (
    <div className='table-responsive'>
      <table className='table table-hover align-middle mb-0'>
        <thead className='table-light'>
          <tr>
            <th className='ps-4'>Name</th>
            {userRole === "EMPLOYEE" && <th>Department</th>}
            <th>Email</th>
            <th>{userRole === "ADMIN" ? "Admin Code" : "Employee Code"}</th>
            <th>Phone</th>
            {userRole === "ADMIN" && <th>Permission</th>}
            <th className='pe-4 text-end'>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users?.length > 0 ? (
            users.map((user = {}) => {
              const id =
                userRole === "ADMIN"
                  ? user?.Admin_Id || ""
                  : user?.Employee_Id || "";

              return (
                <tr key={id}>
                  {/* Name (VIEW DETAILS) */}
                  <td className='ps-4'>
                    <div
                      role='button'
                      className='d-flex align-items-center'
                      style={{ cursor: "pointer" }}
                      onClick={() => handleView(user)}
                    >
                      <div
                        className='bg-light rounded-circle d-flex align-items-center justify-content-center me-2'
                        style={{ width: 32, height: 32 }}
                      >
                        <FaUser size={14} className='text-muted' />
                      </div>

                      <div>
                        <div className='fw-semibold text-dark'>
                          {user?.Name || ""}
                        </div>

                        {user?.Is_Active === 0 && (
                          <span className='badge bg-danger-subtle text-danger small'>
                            Inactive
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Department */}
                  {userRole === "EMPLOYEE" && (
                    <td className='small text-muted'>
                      {user?.Department || "—"}
                    </td>
                  )}

                  {/* Email */}
                  <td className='small'>{user?.Email || ""}</td>

                  {/* Code */}
                  <td className='small font-monospace text-muted'>
                    {userRole === "ADMIN"
                      ? user?.Admin_Code || ""
                      : user?.Employee_Code || ""}
                  </td>

                  {/* Phone */}
                  <td className='small text-muted'>{user?.Phone || "—"}</td>

                  {/* Permission */}
                  {userRole === "ADMIN" && (
                    <td>
                      <span
                        className={`badge ${
                          user?.Permissions === "GRANTED"
                            ? "bg-success"
                            : user?.Permissions === "REVOKED"
                              ? "bg-danger"
                              : "bg-secondary"
                        }`}
                      >
                        {user?.Permissions || "N/A"}
                      </span>
                    </td>
                  )}

                  {/* Actions */}
                  <td className='pe-4 text-end'>
                    <div className='position-static'>
                      <button
                        className='btn btn-light btn-sm rounded-circle'
                        onClick={() => toggleDropdown(id)}
                      >
                        <FaEllipsisV size={14} />
                      </button>

                      {openDropdown === id && (
                        <>
                          {/* backdrop */}
                          <div
                            className='position-fixed top-0 start-0 w-100 h-100 z-1'
                            onClick={() => setOpenDropdown(null)}
                          />

                          {/* dropdown */}
                          <ul className='dropdown-menu dropdown-menu-end show position-fixed z-3 shadow-sm'>
                            <li>
                              <button
                                className='dropdown-item d-flex align-items-center'
                                onClick={() => handleEdit(user)}
                              >
                                <FaEdit className='me-2 text-primary' />
                                Edit
                              </button>
                            </li>

                            {userRole === "ADMIN" && (
                              <li>
                                <button
                                  className='dropdown-item d-flex align-items-center'
                                  onClick={() => handlePermission(user)}
                                >
                                  <FaKey className='me-2 text-warning' />
                                  {user?.Permissions === "GRANTED"
                                    ? "Revoke"
                                    : "Grant"}{" "}
                                  Permission
                                </button>
                              </li>
                            )}

                            <li>
                              <button
                                className='dropdown-item d-flex align-items-center text-danger'
                                onClick={() => handleDelete(id)}
                              >
                                <FaTrash className='me-2' />
                                Delete
                              </button>
                            </li>
                          </ul>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={userRole === "ADMIN" ? 7 : 6}
                className='text-center py-4 text-muted'
              >
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
  // endregion
};
// endregion

// region exports
export default UserTable;
// endregion
