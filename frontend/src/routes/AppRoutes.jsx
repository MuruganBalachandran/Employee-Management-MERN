// region imports
import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

// selectors
import {
  selectIsAuthenticated,
  selectAuthLoading,
  selectIsAdmin,
  selectIsSuperAdmin,
} from "../features";

// pages
import {
  Login,
  Home,
  EmployeeView,
  CreateAdmin,
  ViewEmployees,
  NotFound,
  CreateEmployee,
  EditEmployee,
} from "../pages";

import MainLayout from "../layout/MainLayout";
// endregion

// region Protected Route
const ProtectedRoute = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};


// endregion

// // region Admin Route (Admin + Super Admin)
// const AdminRoute = () => {
//   const isAdmin = useSelector(selectIsAdmin);
//   const isSuperAdmin = useSelector(selectIsSuperAdmin);

//   return isAdmin || isSuperAdmin ? <Outlet /> : <Navigate to="/" replace />;
// };
// // endregion

// // region Super Admin Route
// const SuperAdminRoute = () => {
//   const isSuperAdmin = useSelector(selectIsSuperAdmin);

//   return isSuperAdmin ? <Outlet /> : <Navigate to="/" replace />;
// };
// // endregion

// region Public Route
const PublicRoute = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // If logged in, block login page
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Otherwise allow public pages (login)
  return <Outlet />;
};

// endregion

// region App Routes
const AppRoutes = () => {

    const loading = useSelector(selectAuthLoading);

  // Block routing until auth is resolved
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* Admin Routes */}
          {/* <Route element={<AdminRoute />}>
            <Route path="/employees" element={<ViewEmployees />} />
            <Route path="/employees/create" element={<CreateEmployee />} />
            <Route path="/employees/edit/:id" element={<EditEmployee />} />
            <Route path="/employees/view/:id" element={<EmployeeView />} />
          </Route> */}

          {/* Super Admin Routes */}
          {/* <Route element={<SuperAdminRoute />}>
            <Route path="/create-admin" element={<CreateAdmin />} />
          </Route> */}
        </Route>
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
// endregion

// region exports
export default AppRoutes;
// endregion
