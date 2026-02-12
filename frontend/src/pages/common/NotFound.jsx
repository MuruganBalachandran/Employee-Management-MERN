// region imports
import React from "react";
import { Link } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";
// endregion

// region NotFound component
const NotFound = () => {
  return (
    <div className='d-flex flex-column justify-content-center align-items-center py-5 text-center mt-5'>
      <div className='bg-light rounded-circle p-4 mb-4 shadow-sm'>
        <FaExclamationTriangle size={60} className='text-warning' />
      </div>
      <h1 className='display-4 fw-bold'>404</h1>
      <h2 className='text-muted mb-4'>Page Not Found</h2>
      <p className='mb-4 text-muted mx-auto' style={{ maxWidth: "400px" }}>
        Oops! The page you are looking for does not exist or has been moved.
      </p>
      <Link to='/' className='btn btn-primary btn-lg rounded-pill px-5 shadow-sm'>
        Back to Dashboard
      </Link>
    </div>
  );
};
// endregion

// region exports
export default NotFound;
// endregion
