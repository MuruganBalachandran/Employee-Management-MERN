// region imports
import React, { useMemo } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

// components
import { Loader } from "../components";

// selectors
import {
  selectIsAuthenticated,
  selectAuthLoading,
  selectGlobalLoading,
  selectIsAdmin,
  selectIsSuperAdmin,
} from "../features";

// pages
import {
  Login,
  Home,
  Profile,
  NotFound,
  Employees,
  Admins,
  ActivityLogs,
} from "../pages";

import MainLayout from "../layout/MainLayout";
// endregion

// region Route Guards

/**
 * ProtectedRoute - General authenticated access
 */
const ProtectedRoute = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

/**
 * AdminRoute - Accessible by Admin or Super Admin
 */
const AdminRoute = () => {
  const isAdmin = useSelector(selectIsAdmin);
  const isSuperAdmin = useSelector(selectIsSuperAdmin);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return (isAdmin || isSuperAdmin) ? <Outlet /> : <Navigate to="/" replace />;
};

/**
 * SuperAdminRoute - Accessible ONLY by Super Admin
 */
const SuperAdminRoute = () => {
  const isSuperAdmin = useSelector(selectIsSuperAdmin);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return isSuperAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

/**
 * PublicRoute - Only for non-authenticated users (e.g. Login)
 */
const PublicRoute = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};

// endregion

// region App Routes
const AppRoutes = () => {
  // region hooks
  const authLoading = useSelector(selectAuthLoading);
  const globalLoading = useSelector(selectGlobalLoading);
  // endregion

  // region loading state
  if (authLoading) {
    return <Loader fullScreen text='Initializing session...' />;
  }
  // endregion

  // region ui
  return (
    <>
      {/* Global Overlay Loader */}
      {globalLoading && <Loader fullScreen text='Processing...' />}

      <Routes>
        {/* Public Routes (Login) */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Protected Routes (Everyone Authenticated) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Admin Routes (Admin + Super Admin) */}
        <Route element={<AdminRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/employees" element={<Employees />} />
          </Route>
        </Route>

        {/* Super Admin Routes (Only Super Admin) */}
        <Route element={<SuperAdminRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/admins" element={<Admins />} />
            <Route path="/activity-logs" element={<ActivityLogs />} />
          </Route>
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
  // endregion
};
// endregion

// region exports
export default AppRoutes;
// endregion
