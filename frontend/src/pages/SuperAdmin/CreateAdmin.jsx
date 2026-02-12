// // region imports
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { Input, Loader, PasswordRules } from "../../components";
// import { createNewAdmin, selectSuperAdminLoading } from "../../features";
// import {
//   nameValidation,
//   emailValidation,
//   passwordValidation,
// } from "../../validations/authValidation";
// // endregion

// // region component
// const CreateAdmin = () => {
//   // region hooks
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const loading = useSelector(selectSuperAdminLoading) || false;
//   // endregion

//   // region form state
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const [formErrors, setFormErrors] = useState({});
//   const [success, setSuccess] = useState("");
//   const [error, setError] = useState("");
//   // endregion

//   // region live field validation
//   const validateField = (field, value) => {
//     switch (field) {
//       case "name":
//         return nameValidation(value);
//       case "email":
//         return emailValidation(value, "admin");
//       case "password":
//         return passwordValidation(value);
//       case "confirmPassword":
//         return value !== form.password ? "Passwords do not match" : "";
//       default:
//         return "";
//     }
//   };
//   // endregion

//   // region handle input change
//   const handleChange = (field) => (e) => {
//     const value = e?.target?.value || "";
//     const errorMsg = validateField(field, value);

//     setForm((prev) => ({ ...prev, [field]: value }));
//     setFormErrors((prev) => {
//       const next = { ...prev };
//       if (errorMsg) next[field] = errorMsg;
//       else delete next[field];
//       return next;
//     });
//   };
//   // endregion

//   // region submit validation
//   const validateForm = () => {
//     const errors = {};

//     Object.keys(form).forEach((key) => {
//       const err = validateField(key, form[key]);
//       if (err) errors[key] = err;
//     });

//     return errors;
//   };
//   // endregion

//   // region handle submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     const errors = validateForm();
//     if (Object.keys(errors).length > 0) {
//       setFormErrors(errors);
//       return;
//     }

//     try {
//       // disoatch teh create admin
//       await dispatch(
//         createNewAdmin({
//           name: form.name.trim(),
//           email: form.email.trim(),
//           password: form.password,
//         }),
//       ).unwrap();

//       setSuccess("Admin created successfully");

//       setForm({
//         name: "",
//         email: "",
//         password: "",
//         confirmPassword: "",
//       });
//       setFormErrors({});
//       // nav back
//       navigate(-1);
//     } catch (err) {
//       setError(err || "Failed to create admin");
//     }
//   };
//   // endregion

//   // region render
//   return (
//     <div className='auth-page d-flex justify-content-center align-items-center min-vh-100 p-3'>
//       {loading && <Loader fullScreen text='Creating Admin...' />}

//       <form
//         className='auth-form card p-4 shadow-sm w-100'
//         style={{ maxWidth: "500px" }}
//         onSubmit={handleSubmit}
//         noValidate
//       >
//         <h2 className='mb-4 text-center'>Create New Admin</h2>

//         {error && <div className='alert alert-danger'>{error}</div>}
//         {success && <div className='alert alert-success'>{success}</div>}

//         <Input
//           label='Name'
//           value={form.name}
//           onChange={handleChange("name")}
//           error={formErrors.name}
//           placeholder='Admin Name'
//         />

//         <Input
//           label='Email (@spanadmin.com)'
//           type='email'
//           value={form.email}
//           onChange={handleChange("email")}
//           error={formErrors.email}
//           placeholder='admin@spanadmin.com'
//         />

//         <Input
//           label='Password'
//           type='password'
//           value={form.password}
//           onChange={handleChange("password")}
//           error={formErrors.password}
//           placeholder='Enter a strong password'
//         />

//         <PasswordRules password={form.password} />

//         <Input
//           label='Confirm Password'
//           type='password'
//           value={form.confirmPassword}
//           onChange={handleChange("confirmPassword")}
//           error={formErrors.confirmPassword}
//           placeholder='Confirm password'
//         />

//         <button type='submit' className='btn btn-primary w-100 mt-3'>
//           Create Admin
//         </button>
//       </form>
//     </div>
//   );
//   // endregion
// };

// // region exports
// export default CreateAdmin;
// // endregion

import React from 'react'

const CreateAdmin = () => {
  return (
    <div>
      
    </div>
  )
}

export default CreateAdmin

