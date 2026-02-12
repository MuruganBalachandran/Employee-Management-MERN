// region imports
import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaUsers } from "react-icons/fa";
import {
  selectUser,
  selectIsAdmin,
  selectIsSuperAdmin,
} from "../features";
// endregion

// region components
const Header = () => {
  // region hooks
  const user = useSelector(selectUser);
  const isAdmin = useSelector(selectIsAdmin);
  const isSuperAdmin = useSelector(selectIsSuperAdmin);
  // endregion

  // region nav links configuration
  const navLinks = [
    {
      to: "/employees",
      label: "Employees",
      show: user && (isAdmin || isSuperAdmin),
    },
    {
      to: "/admins",
      label: "Admins",
      show: user && isSuperAdmin,
    },
    {
      to: "/activity-logs",
      label: "Activity Logs",
      show: user && isSuperAdmin,
    },
    {
      to: "/profile",
      label: "Profile",
      show: !!user,
    },
  ];
  // endregion

  // region ui
  return (
    <header className='navbar navbar-expand-lg navbar-dark bg-primary sticky-top shadow-sm'>
      <div className='container'>
        {/* Logo */}
        <Link className='navbar-brand fw-bold d-flex align-items-center' to='/'>
          <FaUsers size={24} className='me-2' />
          Employee Management
        </Link>

        {/* Mobile Toggle */}
        <button
          className='navbar-toggler'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#navbarNav'
          aria-controls='navbarNav'
          aria-expanded='false'
          aria-label='Toggle navigation'
        >
          <span className='navbar-toggler-icon'></span>
        </button>

        {/* Nav Links */}
        <div
          className='collapse navbar-collapse justify-content-end'
          id='navbarNav'
        >
          <ul className='navbar-nav align-items-center gap-2'>
            {navLinks
              .filter((link) => link.show)
              .map((link) => (
                <li className='nav-item' key={link.to}>
                  <Link to={link.to} className='nav-link text-light px-3'>
                    {link.label}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </header>
  );
  // endregion
};
// endregion

// region exports
export default Header;
// endregion
