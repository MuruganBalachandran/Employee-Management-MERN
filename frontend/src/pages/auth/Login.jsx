// region imports
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Input, Loader } from "../../components";
import { login, selectAuthLoading, showToast } from "../../features";

import {
  emailValidation,
  passwordValidation,
} from "../../validations/authValidation";
// endregion

// region component
const Login = () => {
  // region hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectAuthLoading);
  // endregion

  // region form state
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  // endregion

  // region handleChange
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    // Live validation
    let err = "";
    if (field === "email") {
      err = !value ? "Email is required" : emailValidation(value, "login");
    } else if (field === "password") {
      err = !value ? "Password is required" : passwordValidation(value);
    }

    setErrors((prev) => {
      const next = { ...prev };
      if (err) {
        next[field] = err;
      } else {
        delete next[field];
      }
      return next;
    });
  };
  // endregion

  // region handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {
      email: !form.email
        ? "Email is required"
        : emailValidation(form.email, "login"),
      password: !form.password
        ? "Password is required"
        : passwordValidation(form.password),
    };

    // Filter out fields with no errors
    const activeErrors = Object.keys(validationErrors).reduce((acc, key) => {
      if (validationErrors[key]) {
        acc[key] = validationErrors[key];
      }
      return acc;
    }, {});

    if (Object.keys(activeErrors).length > 0) {
      setErrors(activeErrors);
      return;
    }

    try {
      await dispatch(login(form)).unwrap();
      navigate("/");
    } catch (err) {
      const message = typeof err === "string" ? err : "Login failed!";
      dispatch(showToast({ message, type: "error" }));
    }
  };
  // endregion

  // region render
  return (
    <div className='auth-page d-flex justify-content-center align-items-center min-vh-100 p-3'>
      {loading && <Loader fullScreen text='Logging in...' />}
      {/* region form */}
      <form
        className='auth-form card p-4 shadow-sm w-100'
        style={{ maxWidth: "400px" }}
        onSubmit={handleSubmit}
        noValidate
      >
        <h2 className='mb-4 text-center'>Login</h2>
        {/* email field */}
        <Input
          label='Email'
          type='email'
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          error={errors.email}
          placeholder='Enter your email'
        />
        {/* password field */}
        <Input
          label='Password'
          type='password'
          value={form.password}
          onChange={(e) => handleChange("password", e.target.value)}
          error={errors.password}
          placeholder='Enter your password'
        />

        {/* login btn */}
        <button type='submit' className='btn btn-primary w-100 mt-3'>
          Login
        </button>
      </form>
    </div>
  );
};
// endregion

// region exports
export default Login;
// endregion
