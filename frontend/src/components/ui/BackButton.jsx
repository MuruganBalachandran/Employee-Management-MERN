// region imports
import React from "react";
import { useNavigate } from "react-router-dom";
// endregion

// region component
const BackButton = ({ to = -1, text = "Back", className = "" }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(to);
  };

  return (
    <button
      type='button'
      className={`btn btn-outline-secondary ${className}`}
      onClick={handleClick}
    >
      &#8592; {text}
    </button>
  );
};
// endregion

// region exports
export default BackButton;
// endregion
