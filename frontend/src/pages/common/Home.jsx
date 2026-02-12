// region imports
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAdmin, selectIsSuperAdmin, selectUser } from "../../features";
import { FaUserCircle, FaUsers, FaTools, FaShieldAlt, FaHistory, FaCheckCircle } from "react-icons/fa";
// endregion

// region component
const Home = () => {
  // region hooks
  const isAdmin = useSelector(selectIsAdmin);
  const isSuperAdmin = useSelector(selectIsSuperAdmin);
  const user = useSelector(selectUser);
  // endregion

  // region content configuration
  const title = isAdmin || isSuperAdmin
    ? "Management Dashboard"
    : "Employee Portal";
    
  const description = isAdmin || isSuperAdmin
    ? "Efficiently manage your workforce, oversee administrative tasks, and monitor organizational growth."
    : "Welcome back! Access your professional profile and stay updated with your organizational role.";

  // Dashboard cards based on roles
  const dashboardCards = useMemo(() => {
    const cards = [];
    
    // Profile card (Visible to all)
    cards.push({
      to: "/profile",
      icon: <FaUserCircle size={32} className='text-primary mb-3' />,
      title: "My Profile",
    });

    // Employees card (Admin/SuperAdmin)
    if (isAdmin || isSuperAdmin) {
      cards.push({
        to: "/employees",
        icon: <FaUsers size={32} className='text-primary mb-3' />,
        title: "Employees",
      });
    }

    // Admins and Activity logs (SuperAdmin only)
    if (isSuperAdmin) {
      cards.push({
        to: "/admins",
        icon: <FaShieldAlt size={32} className='text-primary mb-3' />,
        title: "Admin Management",
      });
      cards.push({
        to: "/activity-logs",
        icon: <FaHistory size={32} className='text-primary mb-3' />,
        title: "Activity Logs",
      });
    }

    // Common info card (Not clickable)
    cards.push({
      icon: <FaCheckCircle size={32} className='text-success mb-3' />,
      title: "Secure Access",
    });

    return cards;
  }, [isAdmin, isSuperAdmin]);
  // endregion

  // region ui
  return (
    <div className='py-4'>
      {/* Hero Section */}
      <section className='text-center mb-5 py-5 border-bottom bg-white rounded-3 shadow-sm'>
        <div className='container'>
          <h1 className='display-5 fw-bold text-dark mb-3'>{title}</h1>
          <p className='lead text-muted mb-4 mx-auto' style={{ maxWidth: "700px" }}>
            {description}
          </p>
          <div className='d-flex justify-content-center gap-3'>
            <Link to='/profile' className='btn btn-outline-primary px-4 rounded-pill'>
              Go to Profile
            </Link>
            {(isAdmin || isSuperAdmin) && (
              <Link to='/employees' className='btn btn-primary px-4 rounded-pill shadow-sm'>
                Manage Directory
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Action Cards */}
      <div className='container'>
        <div className='row g-4 justify-content-center'>
          {dashboardCards.map((card, index) => (
            <div className='col-md-4 col-lg-3' key={index}>
              {card.to ? (
                <Link to={card.to} className='text-decoration-none'>
                  <div className='card h-100 border-0 shadow-sm transition-hover'>
                    <div className='card-body p-4 text-center d-flex flex-column align-items-center justify-content-center'>
                      {card.icon}
                      <h6 className='card-title fw-bold text-dark mb-0'>{card.title}</h6>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className='card h-100 border-0 shadow-sm'>
                  <div className='card-body p-4 text-center d-flex flex-column align-items-center justify-content-center'>
                    {card.icon}
                    <h6 className='card-title fw-bold text-dark mb-0'>{card.title}</h6>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  // endregion
};
// endregion

// region exports
export default Home;
// endregion
