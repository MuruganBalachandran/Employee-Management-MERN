// region imports
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { Input, Loader } from "../../components";
import { login, selectAuthLoading } from "../../features";

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

  // region state
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  // endregion

  // region handlers
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    let error = "";

    if (field === "email") {
      error = !value ? "Email is required" : emailValidation(value, "login");
    }

    if (field === "password") {
      error = !value ? "Password is required" : passwordValidation(value);
    }

    setErrors((prev) => {
      const next = { ...prev };
      if (error) next[field] = error;
      else delete next[field];
      return next;
    });
  };

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
      Object.entries(validationErrors).filter(([, value]) => value),
    );

    if (Object.keys(activeErrors).length > 0) {
      setErrors(activeErrors);
      return;
    }

    try {
      await dispatch(login(form)).unwrap();
      toast.success("Logged in successfully!");
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Login Error:", err);
      toast.error(typeof err === "string" ? err : "Invalid email or password");
    }
  };
  // endregion

  // region config
  const inputFields = [
    {
      label: "Email Address",
      type: "email",
      name: "email",
      placeholder: "name@company.com",
      autoComplete: "email",
    },
    {
      label: "Password",
      type: "password",
      name: "password",
      placeholder: "Enter your password",
      autoComplete: "current-password",
    },
  ];
  // endregion

  // region ui
  return (
    <div className=' d-flex align-items-center justify-content-center min-vh-100 bg-light px-3'>
      {loading && <Loader fullScreen text='Logging in...' />}

      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-12 col-sm-10 col-md-6 col-lg-4'>
            <form
              className='card border-0 shadow-sm rounded-4 p-4'
              onSubmit={handleSubmit}
              noValidate
            >
              <div className='text-center mb-4'>
                <h4 className='fw-bold mb-1'>Welcome Back</h4>
                <p className='text-muted small mb-0'>Login to your account</p>
              </div>

              {inputFields.map((field) => (
                <Input
                  key={field.name}
                  label={field.label}
                  type={field.type}
                  value={form[field.name]}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  error={errors[field.name]}
                  placeholder={field.placeholder}
                  autoComplete={field.autoComplete}
                  disabled={loading}
                  required
                />
              ))}

              <button
                type='submit'
                className='btn btn-primary btn-lg w-100 mt-3 rounded-pill'
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
  // endregion
};
// endregion

// region exports
export default Login;
// endregion
