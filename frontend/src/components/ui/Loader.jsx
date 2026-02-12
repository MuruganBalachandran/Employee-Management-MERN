// region imports
import React from "react";
import { ClipLoader } from "react-spinners";
// endregion

// region component
const Loader = ({
  size = 35,
  color = "#0d6efd",
  text = "",
  fullScreen = false,
} = {}) => {
  // region styles
  const containerStyles = fullScreen
    ? {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(255,255,255,0.8)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }
    : {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      };
  // endregion

  // region ui
  return (
    <div style={containerStyles}>
      <ClipLoader color={color} size={size} />
      {text && (
        <p
          className='mt-3 text-muted fw-medium'
          style={{ fontSize: "14px", margin: 0 }}
        >
          {text}
        </p>
      )}
    </div>
  );
  // endregion
};
// endregion

// region exports
export default Loader;
// endregion
