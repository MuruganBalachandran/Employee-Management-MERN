// region imports
import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAdmin } from "../../features";
// endregion

// region component
const Home = () => {
  const isAdmin = useSelector(selectIsAdmin);

  // Role-based titles and descriptions
  const title = isAdmin
    ? "Admin Control Panel"
    : "Employee Self-Service Portal";
  const description = isAdmin
    ? "Manage employees, control roles, monitor workforce data, and keep your organization structured and secure."
    : "View your profile, keep your information updated, and stay connected with your organization.";
  const subText = isAdmin
    ? "Add, update, and organize employee records with powerful administrative tools."
    : "Access your personal details, track your role, and manage your account easily.";

  // Cards data
  const dashboardCards = [
    {
      icon: "bi-people-fill",
      title: isAdmin ? "Employee Directory" : "My Profile",
      text: isAdmin
        ? "Access and manage a centralized directory of all employees with ease."
        : "View and maintain your personal and professional information.",
    },
    {
      icon: "bi-shield-lock-fill",
      title: "Secure Access",
      text: "Role-based access control ensures data security and privacy.",
    },
    {
      icon: "bi-speedometer2",
      title: isAdmin ? "Administrative Tools" : "Fast & Responsive",
      text: isAdmin
        ? "Powerful tools to manage workforce data efficiently."
        : "Built with modern technologies for a smooth and fast user experience.",
    },
    
  ];

  return (
    <div className='container mt-5'>
      <div className='text-center bg-light p-5 rounded shadow-sm'>
        <h1 className='display-4 text-primary'>{title}</h1>
        <p className='lead mt-3'>{description}</p>
        <hr className='my-4' />
        <p>{subText}</p>

        <Link
          className='btn btn-primary btn-lg mt-3'
          role='button'
          to={isAdmin ? "/employees" : "/me"}
        >
          {isAdmin ? "Manage Employees" : "View My Profile"}
        </Link>
      </div>

      {/* dashboard cards */}
      <div className='row mt-5'>
        {dashboardCards.map((card, index) => (
          <div className='col-md-4 mb-4' key={index}>
            <div className='card h-100 shadow-sm border-0'>
              {/* title and text */}
              <div className='card-body text-center'>
                <h5 className='card-title'>{card.title}</h5>
                <p className='card-text text-muted'>{card.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// endregion

// region exports
export default Home;
// endregion
