// region imports
import { FaCheck, FaTimes } from "react-icons/fa";
import { passwordRules } from "../../validations/authValidation";
// endregion

// region PasswordRules component
const PasswordRules = ({ password = "" }) => {
  // region derive rules
  const rules = passwordRules(password ?? "") ?? {
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false,
  };
  // endregion

  // region Rule item sub-component
  const Rule = ({ valid = false, label = "" }) => {
    return (
      <div className='d-flex align-items-center mb-1'>
        {/* icon */}
        <span className='me-2' style={{ color: valid ? "#28a745" : "#dc3545" }}>
          {valid ? <FaCheck /> : <FaTimes />}
        </span>
        {/* text */}
        <span style={{ color: valid ? "#28a745" : "#dc3545" }}>
          {label ?? ""}
        </span>
      </div>
    );
  };
  // endregion

  // region render
  return (
    <div className='mt-2 small'>
      <Rule valid={rules?.length ?? false} label='At least 8 characters' />
      <Rule valid={rules?.lowercase ?? false} label='At least 1 lowercase' />
      <Rule valid={rules?.uppercase ?? false} label='At least 1 uppercase' />
      <Rule valid={rules?.number ?? false} label='At least 1 number' />
      <Rule
        valid={rules?.special ?? false}
        label='At least 1 special character'
      />
    </div>
  );
  // endregion
};
// endregion

// region exports
export default PasswordRules;
// endregion
