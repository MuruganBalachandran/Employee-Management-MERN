// region imports
import React from "react";
import { Link } from "react-router-dom";
// endregion

// region NotFound component
const NotFound = () => {
  return (
    <div className='d-flex flex-column justify-content-center align-items-center vh-100 text-center'>
      <h1 className='display-1 text-danger'>404</h1>
      <h2 className='mb-4'>Page Not Found</h2>
      <p className='mb-4'>Oops! The page you are looking for does not exist.</p>
      <Link to='/' className='btn btn-primary'>
        Go Back Home
      </Link>
    </div>
  );
};
// endregion

// region exports
export default NotFound;
// endregion
