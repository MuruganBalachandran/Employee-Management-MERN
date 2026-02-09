// region imports
import React from "react";
// endregion

// region Modal component
const Modal = ({
  isOpen = false,
  onClose = () => {},
  title = "Modal",
  children = null,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className='modal show d-block'
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      tabIndex='-1'
    >
      <div className='modal-dialog modal-lg'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title'>{title}</h5>
            <button
              type='button'
              className='btn-close'
              onClick={onClose}
              aria-label='Close'
            ></button>
          </div>
          <div className='modal-body'>{children}</div>
        </div>
      </div>
    </div>
  );
};
// endregion

// region exports
export default Modal;
// endregion
