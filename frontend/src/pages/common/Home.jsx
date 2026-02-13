// region imports
import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAdmin, selectIsSuperAdmin } from "../../features";
// endregion

// region component
const Home = () => {
  const isAdmin = useSelector(selectIsAdmin);
  const isSuperAdmin = useSelector(selectIsSuperAdmin);

  const title = isAdmin || isSuperAdmin
    ? "Management Dashboard"
    : "Employee Portal";

  const description = isAdmin || isSuperAdmin
    ? "Efficiently manage your workforce, oversee administrative tasks, and monitor organizational growth."
    : "Welcome back! Access your professional profile and stay updated with your organizational role.";

  return (
    <div className="d-flex flex-column align-items-center text-center mt-5">
      <h1 className="display-5 fw-bold my-5">{title}</h1>
      <p className="lead mb-4 w-75 mx-auto">{description}</p>
      <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
        <Link to="/profile" className="btn btn-outline-primary px-4 rounded-pill">
          Go to Profile
        </Link>
        {(isAdmin || isSuperAdmin) && (
          <Link to="/employees" className="btn btn-primary px-4 rounded-pill shadow-sm">
            Manage Directory
          </Link>
        )}
      </div>
    </div>
  );
};
// endregion

// region exports
export default Home;
// endregion
