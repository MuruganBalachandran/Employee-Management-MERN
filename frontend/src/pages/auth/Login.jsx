// region imports
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Input, Loader } from "../../components";
import {
  login,
  selectAuthLoading,
  showToast,
} from "../../features";

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

    let err = "";

    if (field === "email") {
      err = !value
        ? "Email is required"
        : emailValidation(value, "login");
    }

    if (field === "password") {
      err = !value
        ? "Password is required"
        : passwordValidation(value);
    }

    setErrors((prev) => {
      const next = { ...prev };
      if (err) next[field] = err;
      else delete next[field];
      return next;
    });
  };
  // endregion

  // region handleSubmit
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

    const activeErrors = Object.fromEntries(
      Object.entries(validationErrors).filter(
        ([, value]) => value
      )
    );

    if (Object.keys(activeErrors).length > 0) {
      setErrors(activeErrors);
      return;
    }

    try {
      await dispatch(login(form)).unwrap();
      navigate("/", { replace: true });
    } catch (err) {
      dispatch(
        showToast({
          message:
            typeof err === "string"
              ? err
              : "Invalid email or password",
          type: "error",
        })
      );
    }
  };
  // endregion

  // region ui
  return (
    <div className="auth-page d-flex justify-content-center align-items-center min-vh-100 p-3">
      {loading && <Loader fullScreen text="Logging in..." />}

      <form
        className="auth-form card p-4 shadow-sm w-100"
        style={{ maxWidth: "400px" }}
        onSubmit={handleSubmit}
        noValidate
      >
        <h2 className="mb-4 text-center">Login</h2>

        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) =>
            handleChange("email", e.target.value)
          }
          error={errors.email}
          placeholder="Enter your email"
          disabled={loading}
        />

        <Input
          label="Password"
          type="password"
          value={form.password}
          onChange={(e) =>
            handleChange("password", e.target.value)
          }
          error={errors.password}
          placeholder="Enter your password"
          disabled={loading}
        />

        <button
          type="submit"
          className="btn btn-primary w-100 mt-3"
          disabled={loading}
        >
          Login
        </button>
      </form>
    </div>
  );
  // endregion
};
// endregion

// region exports
export default Login;
// endregion
