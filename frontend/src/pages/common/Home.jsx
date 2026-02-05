// region imports
import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAdmin } from "../../features";
// endregion

// region component
const Home = () => {
  const isAdmin = useSelector(selectIsAdmin);

  // region role based content
  const title = isAdmin
    ? "Admin Control Panel"
    : "Employee Self-Service Portal";

  const description = isAdmin
    ? "Manage employees, control roles, monitor workforce data, and keep your organization structured and secure."
    : "View your profile, keep your information updated, and stay connected with your organization.";

  const subText = isAdmin
    ? "Add, update, and organize employee records with powerful administrative tools."
    : "Access your personal details, track your role, and manage your account easily.";
  // endregion

  return (
    <div className="container mt-5">
      <div className="jumbotron text-center bg-light p-5 rounded shadow-sm">
        <h1 className="display-4 text-primary">{title}</h1>

        <p className="lead mt-3">{description}</p>

        <hr className="my-4" />

        <p>{subText}</p>

        {isAdmin ? (
          <Link className="btn btn-primary btn-lg mt-3" role="button" to="/employees">
            Manage Employees
          </Link>
        ) : (
          <Link className="btn btn-primary btn-lg mt-3" role="button" to="/me">
            View My Profile
          </Link>
        )}
      </div>

      <div className="row mt-5">
        <div className="col-md-4 mb-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body text-center">
              <div className="mb-3 text-primary">
                <i className="bi bi-people-fill fs-1"></i>
              </div>
              <h5 className="card-title">
                {isAdmin ? "Employee Directory" : "My Profile"}
              </h5>
              <p className="card-text text-muted">
                {isAdmin
                  ? "Access and manage a centralized directory of all employees with ease."
                  : "View and maintain your personal and professional information."}
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body text-center">
              <div className="mb-3 text-primary">
                <i className="bi bi-shield-lock-fill fs-1"></i>
              </div>
              <h5 className="card-title">Secure Access</h5>
              <p className="card-text text-muted">
                Role-based access control ensures data security and privacy.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body text-center">
              <div className="mb-3 text-primary">
                <i className="bi bi-speedometer2 fs-1"></i>
              </div>
              <h5 className="card-title">
                {isAdmin ? "Administrative Tools" : "Fast & Responsive"}
              </h5>
              <p className="card-text text-muted">
                {isAdmin
                  ? "Powerful tools to manage workforce data efficiently."
                  : "Built with modern technologies for a smooth and fast user experience."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
// endregion

// region exports
export default Home;
// endregion
