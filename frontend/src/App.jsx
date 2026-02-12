// region imports
import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AppRoutes from "./routes/AppRoutes";
import { loadUser } from "./features";
// endregion

// region main App component
const App = () => {
  const dispatch = useDispatch();

  // region component mount
  useEffect(() => {
    // try to load user from session (cookie based)
    dispatch(loadUser());
  }, [dispatch]);
  // endregion

  // region ui
  return (
    <Router>
      <div className='container-fluid p-0'>
        {/* Global Notifications */}
        <ToastContainer
          position='top-right'
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme='colored'
        />

        {/* App Content */}
        <AppRoutes />
      </div>
    </Router>
  );
  // endregion
};
// endregion

// region exports
export default App;
// endregion
