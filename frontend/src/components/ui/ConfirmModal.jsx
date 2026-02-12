// region imports
import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";
// endregion

/**
 * ConfirmModal - A reusable confirmation dialog
 * 
 * @param {Boolean} show - Whether to show the modal
 * @param {Function} onClose - Callback when modal is closed
 * @param {Function} onConfirm - Callback when confirmed
 * @param {String} title - Modal title
 * @param {String} message - Confirmation message
 * @param {String} confirmText - Text for confirm button
 * @param {String} cancelText - Text for cancel button
 * @param {String} variant - Button variant (danger, primary, warning)
 */
const ConfirmModal = ({
  show = false,
  onClose = () => {},
  onConfirm = () => {},
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "OK",
  cancelText = "Cancel",
  variant = "danger",
}) => {
  if (!show) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="modal-backdrop fade show" 
        style={{ zIndex: 1050 }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        style={{ zIndex: 1055 }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg">
            {/* Header */}
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title fw-bold d-flex align-items-center">
                <FaExclamationTriangle 
                  className={`me-2 text-${variant}`} 
                  size={20} 
                />
                {title}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              />
            </div>

            {/* Body */}
            <div className="modal-body pt-2">
              <p className="text-muted mb-0">{message}</p>
            </div>

            {/* Footer */}
            <div className="modal-footer border-0 pt-0">
              <button
                type="button"
                className="btn btn-light rounded-pill px-4"
                onClick={onClose}
              >
                {cancelText}
              </button>
              <button
                type="button"
                className={`btn btn-${variant} rounded-pill px-4`}
                onClick={handleConfirm}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// region exports
export default ConfirmModal;
// endregion
