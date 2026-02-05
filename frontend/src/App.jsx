// region imports
import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { useDispatch } from "react-redux";

import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "./components";
import { fetchCurrentUser, setAuthChecked } from "./features";
// endregion

// region main App component
const App = () => {
  const dispatch = useDispatch();

  // region component mount
  useEffect(() => {
    // get token from localStorage
    const token = localStorage?.getItem("token") ?? "";

    if (token) {
      // if token exists, fetch current user
      dispatch(fetchCurrentUser());
    } else {
      // if no token, mark auth as checked
      dispatch(setAuthChecked());
    }
  }, [dispatch]);
  // endregion

  return (
    <Router>
      <div className="container-fluid p-0">
        {/* Global toaster for notifications */}
        <Toaster />

        {/* Main app routes */}
        <AppRoutes />
      </div>
    </Router>
  );
};
// endregion

// region exports
export default App;
// endregion
