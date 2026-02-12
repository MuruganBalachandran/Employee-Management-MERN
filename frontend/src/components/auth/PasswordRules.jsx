// region imports
import { FaCheck, FaTimes } from "react-icons/fa";
import { passwordRules } from "../../validations/authValidation";
// endregion

// region PasswordRules component
const PasswordRules = ({ password = "" }) => {
  // region derive rules
  const rules = passwordRules(password || "") || {
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false,
  };
  // endregion

  // region Rule item configuration
  const ruleItems = [
    { key: "length", label: "At least 8 characters" },
    { key: "lowercase", label: "At least 1 lowercase" },
    { key: "uppercase", label: "At least 1 uppercase" },
    { key: "number", label: "At least 1 number" },
    { key: "special", label: "At least 1 special character" },
  ];
  // endregion

  // region Rule item component
  const Rule = ({ valid = false, label = "" }) => (
    <div className='d-flex align-items-center mb-1'>
      <span className='me-2' style={{ color: valid ? "#28a745" : "#dc3545" }}>
        {valid ? <FaCheck /> : <FaTimes />}
      </span>
      <span style={{ color: valid ? "#28a745" : "#dc3545" }}>{label}</span>
    </div>
  );
  // endregion

  // region ui
  return (
    <div className='mt-2 small'>
      {ruleItems.map((item) => (
        <Rule
          key={item.key}
          valid={rules?.[item.key] || false}
          label={item.label}
        />
      ))}
    </div>
  );
  // endregion
};
// endregion

// region exports
export default PasswordRules;
// endregion
