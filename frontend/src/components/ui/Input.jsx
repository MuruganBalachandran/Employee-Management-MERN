// region imports
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
// endregion

// region component
const Input = ({
  label = "",
  name = "",
  value = "",
  onChange = () => {},
  onBlur = () => {},
  type = "text",
  placeholder = "",
  error = "",
  disabled = false,
  required = false,
  icon = null,
  textarea = false,
  rows = 3,
  options = [],
  select = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  const togglePassword = () => setShowPassword((prev) => !prev);

  // Determine input type for password
  const inputType = isPassword && showPassword ? "text" : type;

  // Wrapper class for input group
  const inputClass = `form-control ${error ? "is-invalid" : ""}`;

  return (
    <div className='mb-3'>
      {/* Label */}
      {label && (
        <label htmlFor={name} className='form-label fw-semibold'>
          {label} {required && <span className='text-danger'>*</span>}
        </label>
      )}

      {/* Input Group */}
      <div className='input-group'>
        {/* Optional leading icon */}
        {icon && <span className='input-group-text'>{icon}</span>}

        {/* Render field based on type */}
        {textarea ? (
          <textarea
            id={name}
            name={name}
            value={value ?? ""}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            rows={rows}
            disabled={disabled}
            className={inputClass}
          />
        ) : select ? (
          <select
            id={name}
            name={name}
            value={value ?? ""}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            className={inputClass}
          >
            {options?.length === 0 && (
              <option value=''>Select an option</option>
            )}
            {options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={name}
            name={name}
            type={inputType}
            value={value ?? ""}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            className={inputClass}
          />
        )}

        {/* Password toggle */}
        {isPassword && (
          <span
            className='input-group-text cursor-pointer'
            onClick={togglePassword}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className='text-danger small lh-sm d-block mt-1'>{error}</div>
      )}
    </div>
  );
};
// endregion

// region exports
export default Input;
// endregion
