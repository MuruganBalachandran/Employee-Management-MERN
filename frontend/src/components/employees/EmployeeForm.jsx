// region imports
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Input, PasswordRules } from "../../components";
import { showToast } from "../../features";
import {
  validateEmployee,
  nameValidation,
  emailValidation,
  passwordValidation,
  departmentValidation,
  phoneValidation,
  addressValidation,
  VALID_DEPARTMENTS,
  ageValidation,
  employeeCodeValidation,
  salaryValidation,
  reportingManagerValidation,
  joiningDateValidation,
} from "../../validations/employeeValidation";
// endregion

const EmployeeForm = ({
  initialData = {},
  onSubmit = () => {},
  hideCredentials = false,
}) => {
  const dispatch = useDispatch();

  const isEdit =
    !!initialData?.Employee_Id ||
    !!initialData?.User_Id ||
    !!initialData?.userId;

  // profile edit = employee editing own profile
  const profileEdit = isEdit && hideCredentials;

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    employeeCode: "",
    age: "",
    department: "",
    phone: "",
    address: { line1: "", line2: "", city: "", state: "", zipCode: "" },
    salary: "",
    reportingManager: "",
    joiningDate: "",
  });

  const [errors, setErrors] = useState({});

  // Sync edit data
  useEffect(() => {
    if (isEdit) {
      setForm({
        name: initialData?.Name ?? "",
        email: initialData?.Email ?? "",
        password: "",
        confirmPassword: "",
        employeeCode: initialData?.Employee_Code ?? "",
        age: initialData?.Age ?? "",
        department: initialData?.Department ?? "",
        phone: initialData?.Phone ?? "",
        address: {
          line1: initialData?.Address?.Line1 ?? "",
          line2: initialData?.Address?.Line2 ?? "",
          city: initialData?.Address?.City ?? "",
          state: initialData?.Address?.State ?? "",
          zipCode: initialData?.Address?.ZipCode ?? "",
        },
        salary: initialData?.Salary ?? "",
        reportingManager: initialData?.Reporting_Manager ?? "",
        joiningDate: initialData?.Joining_date
          ? initialData.Joining_date.split("T")[0]
          : "",
      });
    }
  }, [initialData, isEdit]);

  // Handle change
  const handleChange = (field, value) => {
    if (field.startsWith("address.")) {
      const key = field.split(".")[1];
      const updatedAddress = { ...form.address, [key]: value };
      const addressErrors = addressValidation(updatedAddress);

      setForm((p) => ({ ...p, address: updatedAddress }));
      setErrors((p) => {
        const next = { ...p };
        if (addressErrors?.[key]) next[`address.${key}`] = addressErrors[key];
        else delete next[`address.${key}`];
        return next;
      });
      return;
    }

    let fieldError = "";
    switch (field) {
      case "name":
        fieldError = nameValidation(value);
        break;
      case "email":
        fieldError = emailValidation(value, "employee", isEdit);
        break;
      case "password":
        fieldError = passwordValidation(value, isEdit);
        break;
      case "confirmPassword":
        fieldError = value !== form.password ? "Passwords do not match" : "";
        break;
      case "department":
        fieldError = departmentValidation(value);
        break;
      case "phone":
        fieldError = phoneValidation(value);
        break;
      case "salary":
        fieldError = salaryValidation(value);
        break;
      case "reportingManager":
        fieldError = reportingManagerValidation(value);
        break;
      case "joiningDate":
        fieldError = joiningDateValidation(value);
        break;
      case "age":
        fieldError = ageValidation(value);
        break;
      case "employeeCode":
        fieldError = employeeCodeValidation(value, isEdit);
        break;
    }

    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => {
      const next = { ...p };
      fieldError ? (next[field] = fieldError) : delete next[field];
      return next;
    });
  };

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // BASE fields allowed everywhere
    const payload = {
      name: form.name.trim(),
      age: form.age ? parseInt(form.age, 10) : "",
      phone: form.phone.trim(),
      address: { ...form.address },
    };

    // CREATE EMPLOYEE
    if (!isEdit) {
      payload.email = form.email.trim().toLowerCase();
      payload.password = form.password;
      payload.employeeCode = form.employeeCode.trim();
      payload.department = form.department;
      payload.salary = form.salary ? Number(form.salary) : "";
      payload.reportingManager = form.reportingManager.trim();
      payload.joiningDate = form.joiningDate;
    }

    // ADMIN EDIT EMPLOYEE
    if (isEdit && !profileEdit) {
      payload.department = form.department;
      payload.salary = form.salary ? Number(form.salary) : "";
      payload.reportingManager = form.reportingManager.trim();
      payload.joiningDate = form.joiningDate;
    }

    const validationErrors = validateEmployee(
      { ...payload, confirmPassword: form.confirmPassword },
      isEdit,
      hideCredentials,
    );

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      dispatch(showToast({ message: "Please fix the errors", type: "error" }));
      return;
    }

    onSubmit(payload, setErrors);
  };

  return (
    <form onSubmit={handleSubmit} className='card p-4 shadow-sm'>
      <Input
        label='Name'
        value={form.name}
        onChange={(e) => handleChange("name", e.target.value)}
        error={errors.name}
      />

      <Input
        label='Email'
        type='email'
        value={form.email}
        onChange={(e) => handleChange("email", e.target.value)}
        error={errors.email}
        disabled={isEdit}
      />

      {!hideCredentials && (
        <Input
          label='Employee Code'
          value={form.employeeCode}
          onChange={(e) => handleChange("employeeCode", e.target.value)}
          error={errors.employeeCode}
          disabled={isEdit}
        />
      )}

      {!isEdit && !hideCredentials && (
        <>
          <Input
            label='Password'
            type='password'
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            error={errors.password}
          />
          <PasswordRules password={form.password} />
          <Input
            label='Confirm Password'
            type='password'
            value={form.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            error={errors.confirmPassword}
          />
        </>
      )}

      <Input
        label='Age'
        type='number'
        value={form.age}
        onChange={(e) => handleChange("age", e.target.value)}
        error={errors.age}
      />
      <Input
        label='Department'
        select
        options={[
          { value: "", label: "Select Department" },
          ...VALID_DEPARTMENTS.map((d) => ({ value: d, label: d })),
        ]}
        value={form.department}
        onChange={(e) => handleChange("department", e.target.value)}
        error={errors.department}
        disabled={profileEdit}
      />
      <Input
        label='Phone'
        value={form.phone}
        onChange={(e) => handleChange("phone", e.target.value)}
        error={errors.phone}
      />

      <Input
        label='Address Line 1'
        value={form.address.line1}
        onChange={(e) => handleChange("address.line1", e.target.value)}
        error={errors["address.line1"]}
      />
      <Input
        label='City'
        value={form.address.city}
        onChange={(e) => handleChange("address.city", e.target.value)}
        error={errors["address.city"]}
      />
      <Input
  label="State"
  placeholder="State"
  value={form.address.state}
  onChange={(e) => handleChange("address.state", e.target.value)}
  error={errors["address.state"]}
/>

<Input
  label="ZIP Code"
  placeholder="ZIP / Postal code"
  value={form.address.zipCode}
  onChange={(e) => handleChange("address.zipCode", e.target.value)}
  error={errors["address.zipCode"]}
/>

      {!hideCredentials && (
        <>
          <Input
            label='Salary'
            type='number'
            value={form.salary}
            onChange={(e) => handleChange("salary", e.target.value)}
            error={errors.salary}
            disabled={profileEdit}
          />
          <Input
            label='Reporting Manager'
            value={form.reportingManager}
            onChange={(e) => handleChange("reportingManager", e.target.value)}
            error={errors.reportingManager}
            disabled={profileEdit}
          />
          <Input
            label='Joining Date'
            type='date'
            value={form.joiningDate}
            onChange={(e) => handleChange("joiningDate", e.target.value)}
            error={errors.joiningDate}
            disabled={profileEdit}
          />
        </>
      )}

      <button type='submit' className='btn btn-primary mt-3'>
        {profileEdit
          ? "Update Profile"
          : isEdit
            ? "Update Employee"
            : "Create Employee"}
      </button>
    </form>
  );
};

export default EmployeeForm;
