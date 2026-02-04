// region imports
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideToast } from "../../features/toast/toastSlice";
import { selectToastData } from "../../features/toast/toastSelectors";
import {
  FiCheckCircle,
  FiAlertCircle,
  FiInfo,
  FiAlertTriangle,
} from "react-icons/fi";
// endregion

// region component
const Toaster = ({ duration = 3000 }) => {
  // region hooks
  const dispatch = useDispatch();
  const { message, type, visible } = useSelector(selectToastData);
  // endregion

  // region auto-hide effect
  useEffect(() => {
    if (!visible) return;

    // set timeout to auto-hide toast
    const timer = setTimeout(() => {
      dispatch(hideToast());
    }, duration || 3000);

    return () => clearTimeout(timer);
  }, [visible, duration, dispatch]);
  // endregion

  // region guard
  if (!visible || !message) {
    return null;}
  // endregion

  // region styles mapping
  const getToastConfig = (toastType="") => {
    switch (toastType) {
      case "success":
        return { icon: <FiCheckCircle size={20} />, bgClass: "bg-success" };
      case "error":
        return { icon: <FiAlertCircle size={20} />, bgClass: "bg-danger" };
      case "warning":
        return { icon: <FiAlertTriangle size={20} />, bgClass: "bg-warning" };
      case "info":
      default:
        return { icon: <FiInfo size={20} />, bgClass: "bg-primary" };
    }
  };

  const { icon="", bgClass="" } = getToastConfig(type || "info");
  // endregion

  // region render
  return (
    <div
      className="toast-container position-fixed top-0 end-0 p-3"
      style={{ zIndex: 1055 }}
    >
      <div
        className={`toast show align-items-center text-white border-0 shadow-lg ${bgClass}`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="d-flex">
          {/* icon + message*/}
          <div className="toast-body d-flex align-items-center gap-2">
            {icon}
            <span className="fw-semibold">{message}</span>
          </div>
          {/* button to hide */}
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            onClick={() => dispatch(hideToast())}
            aria-label="Close"
          ></button>
        </div>
      </div>
    </div>
  );
};
// endregion

// region exports
export default Toaster;
// endregion
