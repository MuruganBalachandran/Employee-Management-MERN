// region imports
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Input from "../../components/UI/Input";
import Loader from "../../components/UI/Loader";

import { login } from "../../features/auth/authSlice";
import { selectAuthLoading } from "../../features/auth/authSelectors";
import { showToast } from "../../features/toast/toastSlice";
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState({});
  // endregion

  // region handle input changes with live validation
  const handleEmailChange = (e) => {
    const value = e?.target?.value || "";
    setEmail(value);
    setFormErrors((prev) => ({
      ...prev,
      email: !value ? "Email is required" : emailValidation(value, "login"),
    }));
  };

  const handlePasswordChange = (e) => {
    const value = e?.target?.value || "";
    setPassword(value);
    setFormErrors((prev) => ({
      ...prev,
      password: !value ? "Password is required" : passwordValidation(value),
    }));
  };
  // endregion

  // region handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {
      email: !email ? "Email is required" : emailValidation(email, "login"),
      password: !password
        ? "Password is required"
        : passwordValidation(password),
    };

    const filteredErrors = Object.fromEntries(
      Object.entries(errors).filter(([_, value]) => value),
    );

    if (Object.keys(filteredErrors).length > 0) {
      setFormErrors(filteredErrors);
      return;
    }

    try {
      const user = await dispatch(
        login({ email: email, password: password }),
      ).unwrap();

      setEmail("");
      setPassword("");
      setFormErrors({});

      // redirect based on role
      if (user?.Role === "EMPLOYEE") navigate("/me");
      else navigate("/");
    } catch (err) {
      dispatch(showToast({ message: err || "Login failed!", type: "error" }));
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
          value={email}
          onChange={handleEmailChange}
          error={formErrors?.email}
          placeholder='Enter your email'
        />
        {/* password field */}
        <Input
          label='Password'
          type='password'
          value={password}
          onChange={handlePasswordChange}
          error={formErrors?.password}
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
