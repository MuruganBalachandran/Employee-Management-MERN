// region imports
import React, { useEffect, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import { Offcanvas } from "bootstrap";
// endregion

// region component
const Canvas = ({
  show = false,
  onClose = () => {},
  title = "Header",
  children = null,
  footer = null,
  placement = "end",
  size = "md",
}) => {
  // region refs
  const canvasRef = useRef(null);
  const bsCanvas = useRef(null);
  // endregion

  // region effects
  useEffect(() => {
    if (canvasRef.current) {
      bsCanvas.current = new Offcanvas(canvasRef.current);

      canvasRef.current.addEventListener("hidden.bs.offcanvas", () => {
        onClose();
      });
    }

    return () => {
      if (bsCanvas.current) {
        bsCanvas.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (bsCanvas.current) {
      if (show) {
        bsCanvas.current.show();
      } else {
        bsCanvas.current.hide();
      }
    }
  }, [show]);
  // endregion

  // region styles
  const sizeStyles = {
    sm: { width: "400px" },
    md: { width: "600px" },
    lg: { width: "800px" },
    xl: { width: "75vw" },
  };
  // endregion

  // region ui
  return (
    <div
      className={`offcanvas offcanvas-${placement} border-0 shadow`}
      tabIndex='-1'
      ref={canvasRef}
      style={sizeStyles[size] || sizeStyles.md}
    >
      {/* header */}
      <div className='offcanvas-header border-bottom bg-light'>
        <h5 className='offcanvas-title fw-bold text-dark'>{title}</h5>

        {/* close button */}
        <button
          type='button'
          className='btn btn-light btn-sm rounded-circle d-flex align-items-center justify-content-center'
          onClick={() => bsCanvas.current?.hide()}
          style={{ width: "32px", height: "32px" }}
        >
          <FaTimes size={14} className='text-muted' />
        </button>
      </div>

      {/* body */}
      <div className='offcanvas-body h-100 py-4'>{children}</div>

      {/* footer */}
      {footer && (
        <div className='offcanvas-footer border-top p-3 bg-light'>{footer}</div>
      )}
    </div>
  );
  // endregion
};
// endregion

// region exports
export default Canvas;
// endregion
