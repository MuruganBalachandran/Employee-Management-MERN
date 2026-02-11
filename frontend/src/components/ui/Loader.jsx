// region imports
import React from "react";
// endregion

// region component
const Loader = ({
  size = "medium", // small | medium | large
  text = "",
  fullScreen = false,
} = {}) => {
  // Determine spinner size
  const spinnerSize =
    size === "small"
      ? "spinner-border-sm"
      : size === "large"
        ? "spinner-border-lg"
        : "";

  // Fullscreen styles
  const fullScreenStyles = fullScreen
    ? {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(255,255,255,0.7)",
        zIndex: 1050,
      }
    : {};

  return (
    <div
      className={`d-flex flex-column justify-content-center align-items-center`}
      style={fullScreenStyles}
    >
      {/* Spinner */}
      <div
        className={`spinner-border text-primary ${spinnerSize}`}
        role='status'
      >
        <span className='visually-hidden'>Loading...</span>
      </div>

      {/* Optional loading text */}
      {text && (
        <p className='mt-3 text-muted fw-medium small text-center'>{text}</p>
      )}
    </div>
  );
};
// endregion

// region exports
export default Loader;
// endregion
