// region imports
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
// endregion

const MainLayout = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1 container py-4">
        {/* placeholder for child routes in React Router. */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

// region exports
export default MainLayout;
// endregion
