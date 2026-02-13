// region imports
// react
import React from "react";

// router
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

// redux
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

// layout
import MainLayout from "../layout/MainLayout";
// endregion

// region ProtectedRoute
// allows access only to authenticated users
const ProtectedRoute = () => {
  // read authentication state
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // render outlet if authenticated, otherwise redirect to login
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' replace />;
};
// endregion

// region AdminRoute
// allows access to Admin and Super Admin users
const AdminRoute = () => {
  // read role flags
  const isAdmin = useSelector(selectIsAdmin);
  const isSuperAdmin = useSelector(selectIsSuperAdmin);

  // read authentication state
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // redirect unauthenticated users
  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  // allow only admin roles
  return isAdmin || isSuperAdmin ? <Outlet /> : <Navigate to='/' replace />;
};
// endregion

// region SuperAdminRoute
// allows access only to Super Admin users
const SuperAdminRoute = () => {
  // read role flag
  const isSuperAdmin = useSelector(selectIsSuperAdmin);

  // read authentication state
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // redirect unauthenticated users
  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  // allow only super admin
  return isSuperAdmin ? <Outlet /> : <Navigate to='/' replace />;
};
// endregion

// region PublicRoute
// allows access only to non-authenticated users
const PublicRoute = () => {
  // read authentication state
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // redirect authenticated users to home
  return isAuthenticated ? <Navigate to='/' replace /> : <Outlet />;
};
// endregion

// region AppRoutes
const AppRoutes = () => {
  // region redux state
  // authentication initialization loading
  const authLoading = useSelector(selectAuthLoading) || false;

  // global api loading indicator
  const globalLoading = useSelector(selectGlobalLoading) || false;
  // endregion

  // region auth loading guard
  // block app rendering until auth is resolved
  if (authLoading) {
    return <Loader fullScreen text='Initializing session...' />;
  }
  // endregion

  // region ui
  return (
    <>
      {/* global loader overlay */}
      {globalLoading && <Loader fullScreen text='Processing...' />}

      <Routes>
        {/* public routes */}
        <Route element={<PublicRoute />}>
          <Route path='/login' element={<Login />} />
        </Route>

        {/* authenticated routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path='/' element={<Home />} />
            <Route path='/profile' element={<Profile />} />
          </Route>
        </Route>

        {/* admin routes */}
        <Route element={<AdminRoute />}>
          <Route element={<MainLayout />}>
            <Route path='/employees' element={<Employees />} />
          </Route>
        </Route>

        {/* super admin routes */}
        <Route element={<SuperAdminRoute />}>
          <Route element={<MainLayout />}>
            <Route path='/admins' element={<Admins />} />
            <Route path='/activity-logs' element={<ActivityLogs />} />
          </Route>
        </Route>

        {/* fallback route */}
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  );
  // endregion
};
// endregion

// region exports
export default AppRoutes;
// endregion
