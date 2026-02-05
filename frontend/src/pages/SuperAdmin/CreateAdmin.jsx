// region imports
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Input, Loader, PasswordRules } from "../../components";
import { createNewAdmin, selectSuperAdminLoading } from "../../features";
import {
  nameValidation,
  emailValidation,
  passwordValidation,
} from "../../validations/authValidation";
// endregion

// region component
const CreateAdmin = () => {
  // region hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectSuperAdminLoading) || false;
  // endregion

  // region form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [age, setAge] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  // endregion

  // region handlers
  const handleNameChange = (e) => {
    const value = e?.target?.value || "";
    setName(value);
    setFormErrors((prev) => ({ ...prev, name: nameValidation(value) }));
  };

  const handleEmailChange = (e) => {
    const value = e?.target?.value || "";
    setEmail(value);
    setFormErrors((prev) => ({
      ...prev,
      email: emailValidation(value, "admin"),
    }));
  };

  const handlePasswordChange = (e) => {
    const value = e?.target?.value || "";
    setPassword(value);

    setFormErrors((prev) => ({ ...prev, password: passwordValidation(value) }));

    if (confirmPassword && value !== confirmPassword) {
      setFormErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
    } else {
      setFormErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e?.target?.value || "";
    setConfirmPassword(value);

    if (value !== password) {
      setFormErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
    } else {
      setFormErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }
  };

  const handleAgeChange = (e) => {
    const value = e?.target?.value || "";
    setAge(value);
    setFormErrors((prev) => ({
      ...prev,
      age: !value || Number(value) < 18 ? "Age must be at least 18" : "",
    }));
  };
  // endregion

  // region handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const errors = {
      name: nameValidation(name),
      email: emailValidation(email, "admin"),
      password: passwordValidation(password),
      confirmPassword: !confirmPassword
        ? "Confirm Password is required"
        : password !== confirmPassword
          ? "Passwords do not match"
          : "",
    };

    const filteredErrors = Object.fromEntries(
      Object.entries(errors).filter(([_, value]) => value),
    );

    if (Object.keys(filteredErrors).length > 0) {
      setFormErrors(filteredErrors);
      return;
    }

    try {
      await dispatch(
        createNewAdmin({
          name,
          email,
          password,
          age: Number(age) || 0,
        }),
      ).unwrap();

      setSuccess("Admin created successfully!");

      // Reset form
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setAge("");
      setFormErrors({});

      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err || "Failed to create admin");
      // Toast already handled by thunk
    }
  };
  // endregion

  // region render
  return (
    <div className='auth-page d-flex justify-content-center align-items-center min-vh-100 p-3'>
      {loading && <Loader fullScreen text='Creating Admin...' />}

      <form
        className='auth-form card p-4 shadow-sm w-100'
        style={{ maxWidth: "500px" }}
        onSubmit={handleSubmit}
        noValidate
      >
        <h2 className='mb-4 text-center'>Create New Admin</h2>

        {success && (
          <div className='alert alert-success' role='alert'>
            {success}
          </div>
        )}
        {/* name */}
        <Input
          label='Name'
          value={name}
          onChange={handleNameChange}
          error={formErrors?.name}
          placeholder='Admin Name'
        />
        {/*email  */}
        <Input
          label='Email (@spanadmin.com)'
          type='email'
          value={email}
          onChange={handleEmailChange}
          error={formErrors?.email}
          placeholder='admin@spanadmin.com'
        />
        {/* password */}

        <Input
          label='Password'
          type='password'
          value={password}
          onChange={handlePasswordChange}
          error={formErrors?.password}
          placeholder='Enter a strong password'
        />
        {/* password */}
        <PasswordRules password={password} />
        {/* confirm password */}
        <Input
          label='Confirm Password'
          type='password'
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          error={formErrors?.confirmPassword}
          placeholder='Confirm password'
        />

        <button type='submit' className='btn btn-primary w-100 mt-3'>
          Create Admin
        </button>
      </form>
    </div>
  );
  // endregion
};
// endregion

// region exports
export default CreateAdmin;
// endregion
