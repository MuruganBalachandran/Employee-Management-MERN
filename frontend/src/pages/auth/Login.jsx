// region imports
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { Input, Loader } from "../../components";
import { FaUsers } from "react-icons/fa";
import {
  login,
  selectAuthLoading,
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
    try {
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
    } catch (err) {
      console.error("handleChange Error:", err || "");
    }
  };
  // endregion

  // region handleSubmit
  const handleSubmit = async (e) => {
    try {
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

      await dispatch(login(form)).unwrap();
      toast.success("Logged in successfully!");
      navigate("/", { replace: true });
    } catch (err) {
      // log error
      console.error("Login Error:", err || "");
      toast.error(
        typeof err === "string" ? err : "Invalid email or password"
      );
    }
  };
  // endregion

  // region input fields configuration
  const inputFields = [
    {
      label: "Email",
      type: "email",
      name: "email",
      placeholder: "Enter your email",
    },
    {
      label: "Password",
      type: "password",
      name: "password",
      placeholder: "Enter your password",
    },
  ];
  // endregion

  // region ui
  return (
    <div className='auth-page d-flex justify-content-center align-items-center min-vh-100 bg-light p-3'>
      {loading && <Loader fullScreen text='Logging in...' />}

      <div className='w-100' style={{ maxWidth: "400px" }}>
        <div className='text-center mb-4'>
          <div className='bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2' style={{ width: "60px", height: "60px", shadow: "0 4px 10px rgba(13, 110, 253, 0.3)" }}>
            <FaUsers size={30} />
          </div>
          <h3 className='fw-bold text-dark'>Welcome Back</h3>
          <p className='text-muted small'>Please enter your credentials to continue</p>
        </div>

        <form
          className='auth-form card border-0 p-4 shadow-sm rounded-4'
          onSubmit={handleSubmit}
          noValidate
        >
          {inputFields.map((field) => (
            <Input
              key={field.name}
              label={field.label}
              type={field.type}
              value={form[field.name]}
              onChange={(e) => handleChange(field.name, e.target.value)}
              error={errors[field.name]}
              placeholder={field.placeholder}
              disabled={loading}
              required
            />
          ))}

          <button
            type='submit'
            className='btn btn-primary btn-lg w-100 mt-2 rounded-pill shadow-sm'
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className='text-center mt-4 text-muted small'>
          &copy; {new Date().getFullYear()} Employee Management System
        </p>
      </div>
    </div>
  );
  // endregion
};
// endregion

// region exports
export default Login;
// endregion
