// region imports
import React, { useEffect, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import { Offcanvas } from "bootstrap";
// endregion

/**
 * Canvas - A reusable Bootstrap Offcanvas component
 * 
 * @param {Boolean} show - Whether to show the canvas
 * @param {Function} onClose - Callback when canvas is closed
 * @param {String} title - Header title
 * @param {ReactNode} children - Body content
 * @param {ReactNode} footer - Optional footer content
 * @param {String} placement - start, end, top, bottom
 * @param {String} size - sm, md, lg, xl (custom sizes if needed)
 */
const Canvas = ({
  show = false,
  onClose = () => {},
  title = "Header",
  children = null,
  footer = null,
  placement = "end",
  size = "md",
}) => {
  const canvasRef = useRef(null);
  const bsCanvas = useRef(null);

  // region effects
  useEffect(() => {
    if (canvasRef.current) {
      bsCanvas.current = new Offcanvas(canvasRef.current);
      
      canvasRef.current.addEventListener('hidden.bs.offcanvas', () => {
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
    xl: { width: "75vw" }, // 3/4 of full width
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
      <div className='offcanvas-header border-bottom bg-light'>
        <h5 className='offcanvas-title fw-bold text-dark'>{title}</h5>
        <button
          type='button'
          className='btn btn-light btn-sm rounded-circle d-flex align-items-center justify-content-center'
          onClick={() => bsCanvas.current?.hide()}
          style={{ width: "32px", height: "32px" }}
        >
          <FaTimes size={14} className='text-muted' />
        </button>
      </div>

      <div className='offcanvas-body h-100 py-4'>
        {children}
      </div>

      {footer && (
        <div className='offcanvas-footer border-top p-3 bg-light'>
          {footer}
        </div>
      )}
    </div>
  );
  // endregion
};

// region exports
export default Canvas;
// endregion
