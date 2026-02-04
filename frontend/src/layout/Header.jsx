// region imports
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
// endregion

const Header = () => {
  // region hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state?.auth?.user || null);
  // endregion

  // region handleLogout
  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to logout?")) {
      return;}
    dispatch(logout());
    navigate("/login");
  };
  // endregion

  const isAdmin = ["ADMIN", "SUPER_ADMIN"].includes(user?.Role);
  const isSuperAdmin = user?.Role === "SUPER_ADMIN";

  return (
    <header className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Employee Management
        </Link>

        <div className="collapse navbar-collapse justify-content-end">
          <ul className="navbar-nav d-flex align-items-center gap-2">
            
            {/* Add Employee — Admin only */}
            {isAdmin && (
              <>
                <li className="nav-item">
                <Link to="/employees" className="nav-link text-light">
                  Employees
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/employees/create" className="nav-link text-light">
                  Add Employee
                </Link>
              </li>
              </>
            
            )}

        
            {/* Create Admin — Super Admin only */}
            {isSuperAdmin && (
              <li className="nav-item">
                <Link to="/create-admin" className="nav-link text-light">
                  Create Admin
                </Link>
              </li>
            )}

            {/* Profile — Admin only */}
              <li className="nav-item">
                <Link to="/me" className="nav-link text-light">
                  My Profile
                </Link>
              </li>
    

            {/* Logout */}
            {user && (
              <li className="nav-item">
                <button
                  className="btn btn-outline-light btn-sm"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
};

// region exports
export default Header;
// endregion
