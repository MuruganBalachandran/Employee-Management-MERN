// region imports
import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
// Selectors
import {
  selectIsAuthenticated,
  selectAuthChecked,
  selectIsAdmin,
  selectIsSuperAdmin,
} from "../features";

// Pages
import {
  Login,
  Home,
//   CreateEmployee,
//   EditEmployee,
  EmployeeView,
  MyProfile,
  EditProfile,
  CreateAdmin,
  ViewEmployees,
  NotFound,
} from "../pages";
import MainLayout from "../layout/MainLayout";
// endregion

// region Protected Route
const ProtectedRoute = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated) || false;
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' replace />;
};
// endregion

// Admin Route (includes Super Admin)
const AdminRoute = () => {
  const isAdmin = useSelector(selectIsAdmin) || false;
  const isSuperAdmin = useSelector(selectIsSuperAdmin) || false;
  return (isAdmin || isSuperAdmin) ? <Outlet /> : <Navigate to='/me' replace />;
};
// endregion

// region Super Admin Route
const SuperAdminRoute = () => {
  const isSuperAdmin = useSelector(selectIsSuperAdmin) || false;
  return isSuperAdmin ? <Outlet /> : <Navigate to='/' replace />;
};
// endregion

// region Public Route
const PublicRoute = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated) || false;
  return isAuthenticated ? <Navigate to='/me' replace /> : <Outlet />;
};
// endregion

// region App Routes
const AppRoutes = () => {
  const authChecked = useSelector(selectAuthChecked) || false;

  if (!authChecked) {
    return null;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicRoute />}>
        <Route path='/login' element={<Login />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          {/* Home */}
          <Route path='/' element={<Home />} />

          {/* Employee self profile */}
          <Route path='/me' element={<MyProfile />} />
          <Route path='/me/edit' element={<EditProfile />} />

          {/* Admin only */}
          <Route element={<AdminRoute />}>
            <Route path='/employees' element={<ViewEmployees />} />
            {/* CreateEmployee and EditEmployee routes removed as they are now modals in ViewEmployees */}
            <Route path='/employees/view/:id' element={<EmployeeView />} />
          </Route>

          {/* Super Admin only */}
          <Route element={<SuperAdminRoute />}>
            <Route path='/create-admin' element={<CreateAdmin />} />
          </Route>
        </Route>
      </Route>

      {/* Catch-all 404 */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
};
// endregion

// region exports
export default AppRoutes;
// endregion
