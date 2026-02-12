// region imports
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaEllipsisV, FaEdit, FaTrash, FaUser, FaInfoCircle, FaKey } from "react-icons/fa";
// endregion

/**
 * UserTable - A reusable table for displaying Admins and Employees
 * 
 * @param {Array} users - Array of user data objects
 * @param {Function} onEdit - Callback when edit option is clicked
 * @param {Function} onDelete - Callback when delete option is clicked
 * @param {Function} onPermissionChange - Callback when permission change is clicked (admins only)
 * @param {String} userRole - Role filter (ADMIN/EMPLOYEE) to show correct codes
 * @param {String} viewPathBase - Base path for the clickable name link
 */
const UserTable = ({
  users = [],
  onEdit = () => {},
  onDelete = () => {},
  onPermissionChange = () => {},
  userRole = "EMPLOYEE",
  viewPathBase = "/profile",
}) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  // region empty state
  if (!users?.length) {
    return (
      <div className='text-center py-5'>
        <FaInfoCircle size={40} className='text-muted mb-3' />
        <p className='text-muted'>No entries found matching your criteria.</p>
      </div>
    );
  }
  // endregion

  // region handlers
  const toggleDropdown = (userId) => {
    setOpenDropdown(openDropdown === userId ? null : userId);
  };

  const handleEdit = (user) => {
    setOpenDropdown(null);
    onEdit(user);
  };

  const handleDelete = (userId) => {
    setOpenDropdown(null);
    onDelete(userId);
  };

  const handlePermissionChange = (user) => {
    setOpenDropdown(null);
    onPermissionChange(user);
  };
  // endregion

  // region ui
  return (
    <div className='table-responsive' style={{ overflow: 'visible' }}>
      <table className='table table-hover align-middle border-top mb-0'>
        <thead className='table-light'>
          <tr>
            <th className='ps-4'>Name</th>
            <th>Department</th>
            <th>Email</th>
            <th>{userRole === "ADMIN" ? "Admin Code" : "Employee Code"}</th>
            <th>Phone</th>
            {userRole === "ADMIN" && <th>Permission</th>}
            <th className='pe-4 text-end'>Actions</th>
          </tr>
        </thead>
        <tbody className='border-top-0'>
          {users.map((user) => {
            // Determine the correct ID based on role
            const userId = userRole === "ADMIN" ? user.Admin_Id : user.Employee_Id;
            const isOpen = openDropdown === userId;
            
            return (
              <tr key={userId}>
                <td className='ps-4'>
                  <Link
                    to={`${viewPathBase}/${userId}`}
                    className='text-decoration-none d-flex align-items-center'
                  >
                    <div 
                      className='bg-light rounded-circle p-2 me-2 d-flex align-items-center justify-content-center' 
                      style={{ width: "32px", height: "32px" }}
                    >
                      <FaUser className='text-muted' size={14} />
                    </div>
                    <div>
                      <span className='fw-semibold text-dark d-block'>{user.Name}</span>
                      {user.Is_Active === 0 && (
                        <span className='badge bg-light text-danger border border-danger p-0 px-1' style={{ fontSize: '0.65rem' }}>
                          Inactive
                        </span>
                      )}
                    </div>
                  </Link>
                </td>
                <td>
                  <span className='small text-muted'>{user.Department || "N/A"}</span>
                </td>
                <td className='small'>{user.Email}</td>
                <td>
                  <span className='small font-monospace text-muted'>
                    {userRole === "ADMIN" ? user.Admin_Code : user.Employee_Code}
                  </span>
                </td>
                <td className='small text-muted text-nowrap'>
                  {user.Phone || "N/A"}
                </td>
                {userRole === "ADMIN" && (
                  <td>
                    <span className={`badge ${user.Permissions === 'GRANTED' ? 'bg-success' : 'bg-danger'}`}>
                      {user.Permissions || 'N/A'}
                    </span>
                  </td>
                )}
                <td className='pe-4 text-end'>
                  <div className='dropdown position-relative'>
                    <button
                      className='btn btn-light btn-sm border-0 rounded-circle'
                      type='button'
                      onClick={() => toggleDropdown(userId)}
                      style={{ width: "32px", height: "32px" }}
                    >
                      <FaEllipsisV size={14} className='text-muted' />
                    </button>
                    {isOpen && (
                      <>
                        <div 
                          className='position-fixed top-0 start-0 w-100 h-100' 
                          style={{ zIndex: 1000 }}
                          onClick={() => setOpenDropdown(null)}
                        />
                        <ul 
                          className='dropdown-menu dropdown-menu-end shadow border-0 py-2 show position-absolute'
                          style={{ zIndex: 1001 }}
                        >
                          <li>
                            <button
                              className='dropdown-item d-flex align-items-center py-2'
                              onClick={() => handleEdit(user)}
                            >
                              <FaEdit className='me-2 text-primary' size={14} />
                              Edit details
                            </button>
                          </li>
                          {userRole === "ADMIN" && (
                            <>
                              <li className='dropdown-divider opacity-50'></li>
                              <li>
                                <button
                                  className='dropdown-item d-flex align-items-center py-2'
                                  onClick={() => handlePermissionChange(user)}
                                >
                                  <FaKey className='me-2 text-warning' size={14} />
                                  {user.Permissions === 'GRANTED' ? 'Revoke' : 'Grant'} Permission
                                </button>
                              </li>
                            </>
                          )}
                          <li className='dropdown-divider opacity-50'></li>
                          <li>
                            <button
                              className='dropdown-item d-flex align-items-center py-2 text-danger'
                              onClick={() => handleDelete(userId)}
                            >
                              <FaTrash className='me-2' size={14} />
                              Delete user
                            </button>
                          </li>
                        </ul>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
  // endregion
};

// region exports
export default UserTable;
// endregion
