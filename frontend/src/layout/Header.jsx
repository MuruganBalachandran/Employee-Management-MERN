// region imports
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/";
import { FaUsers } from "react-icons/fa";
import {
  selectUser,
  selectIsAdmin,
  selectIsSuperAdmin,
} from "../features/auth";

// endregion

// region components
const Header = () => {
  //  hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const isAdmin = useSelector(selectIsAdmin);
  const isSuperAdmin = useSelector(selectIsSuperAdmin);
  // region handleLogout
  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    dispatch(logout());
    navigate("/login");
  };
  // endregion

  return (
    //  navbar
    <header className='navbar navbar-expand-lg navbar-dark bg-primary sticky-top'>
      <div className='container'>
        {/* Logo with icon */}
        <Link className='navbar-brand fw-bold d-flex align-items-center' to='/'>
          {/* Icon logo */}
          <FaUsers size={24} className='me-2' />
          Employee Management
        </Link>

        {/* Hamburger menu for mobile */}
        <button
          className='navbar-toggler'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#navbarNav'
          aria-controls='navbarNav'
          aria-expanded='false'
          aria-label='Toggle navigation'
        >
          {/* Default Bootstrap icon */}
          <span className='navbar-toggler-icon'></span>
        </button>

        {/* Collapsible navbar content */}
        <div
          className='collapse navbar-collapse justify-content-end'
          id='navbarNav'
        >
          <ul className='navbar-nav align-items-center gap-2'>
            {/* Admin links */}
            {isAdmin && (
              <>
                <li className='nav-item'>
                  <Link to='/employees' className='nav-link text-light'>
                    Employees
                  </Link>
                </li>
                {/* Add Employee link removed (use modal in ViewEmployees) */}
              </>
            )}

            {/* Super Admin link */}
            {isSuperAdmin && (
              <li className='nav-item'>
                <Link to='/create-admin' className='nav-link text-light'>
                  Create Admin
                </Link>
              </li>
            )}

            {/* Profile link - Only for Employees */}
            {!isAdmin && (
              <li className='nav-item'>
                <Link to='/me' className='nav-link text-light'>
                  My Profile
                </Link>
              </li>
            )}

            {/* Logout button */}
            {user && (
              <li className='nav-item'>
                <button
                  className='btn btn-outline-light btn-sm'
                  onClick={handleLogout}
                  title='Logout'
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
// endregion

// region exports
export default Header;
// endregion
