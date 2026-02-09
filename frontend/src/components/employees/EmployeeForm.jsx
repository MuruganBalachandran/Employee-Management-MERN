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
  ageValidation,
  employeeCodeValidation,
  salaryValidation,
  reportingManagerValidation,
  joiningDateValidation,
  VALID_DEPARTMENTS,
} from "../../validations/employeeValidation";
// endregion

// region EmployeeForm component
const EmployeeForm = ({
  initialData = {},
  onSubmit = () => {},
  hideCredentials = false,
}) => {
  // hooks
  const dispatch = useDispatch();
  const isEdit = !!initialData?.Employee_Id || !!initialData?.User_Id || !!initialData?.userId;

  // region form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    employeeCode: "",
    age: "",
    department: "",
    phone: "",
    address: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      zipCode: "",
    },
    salary: "",
    reportingManager: "",
    joiningDate: "",
  });
  const [errors, setErrors] = useState({});
  // endregion

  // region sync form when editing
  useEffect(() => {
    // Sync form state with initial employee data
    if (initialData?.Employee_Id || initialData?.User_Id || initialData?.userId) {
      setForm({
        name: initialData?.Name ?? initialData?.name ?? "",
        email: initialData?.Email ?? initialData?.email ?? "",
        password: "",
        confirmPassword: "",
        employeeCode: initialData?.Employee_Code ?? initialData?.employeeCode ?? "",
        age: initialData?.Age ?? initialData?.age ?? "",
        department: initialData?.Department ?? initialData?.department ?? "",
        phone: initialData?.Phone ?? initialData?.phone ?? "",
        address: {
          line1: initialData?.Address?.Line1 ?? initialData?.address?.line1 ?? "",
          line2: initialData?.Address?.Line2 ?? initialData?.address?.line2 ?? "",
          city: initialData?.Address?.City ?? initialData?.address?.city ?? "",
          state: initialData?.Address?.State ?? initialData?.address?.state ?? "",
          zipCode: initialData?.Address?.ZipCode ?? initialData?.address?.zipCode ?? "",
        },
        salary: initialData?.Salary ?? initialData?.salary ?? "",
        reportingManager: initialData?.Reporting_Manager ?? initialData?.reportingManager ?? "",
        joiningDate: (initialData?.Joining_date || initialData?.joiningDate)
          ? (initialData.Joining_date || initialData.joiningDate).split("T")[0]
          : "",
      });
    }
  }, [initialData]);
  // endregion

  // region handleChange
  const handleChange = (field = "", value = "") => {
    if (field?.startsWith?.("address.")) {
      const key = field.split(".")[1]; // e.g. line1
      const updatedAddress = { ...form.address, [key]: value };
      const addressErrors = addressValidation(updatedAddress);

      setForm((prev) => ({ ...prev, address: updatedAddress }));
      setErrors((prev) => {
        const next = { ...prev };
        if (addressErrors?.[key]) next[`address.${key}`] = addressErrors[key];
        else delete next[`address.${key}`];
        return next;
      });
    } else {
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
          if (value !== form.password) {
            fieldError = "Passwords do not match";
          }
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
          fieldError = employeeCodeValidation(value);
          break;
      }

      setForm((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => {
        const next = { ...prev };
        if (fieldError) {
          next[field] = fieldError;
        } else {
          delete next[field];
        }
        return next;
      });
    }
  };
  // endregion

  // region handleSubmit
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      employeeCode: form.employeeCode,
      age: form.age ? parseInt(form.age) : "",
      department: form.department,
      phone: form.phone,
      address: {
        line1: form.address.line1,
        line2: form.address.line2,
        city: form.address.city,
        state: form.address.state,
        zipCode: form.address.zipCode,
      },
    };

    // Include salary, reportingManager, joiningDate only during creation (and only if provided)
    // Include salary, reportingManager, joiningDate if admin (hideCredentials is false)
    if (!hideCredentials) {
      payload.salary = form.salary ? parseFloat(form.salary) : "";
      payload.reportingManager = form.reportingManager ? form.reportingManager.trim() : "";
      payload.joiningDate = form.joiningDate ? form.joiningDate.trim() : "";
    }

    if (isEdit) {
      delete payload.email;
      delete payload.password;
      delete payload.employeeCode;
    }

    let validationErrors = hideCredentials
      ? {} // profile edit -> skip employee validation
      : validateEmployee(
          { ...payload, confirmPassword: form.confirmPassword },
          isEdit,
        );

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      dispatch(showToast({ message: "Please fix the errors", type: "error" }));
      return;
    }

    onSubmit(payload, setErrors);
  };
  // endregion

  return (
    <form onSubmit={handleSubmit} className='card p-4 shadow-sm'>
      {/* name */}
      <Input
        label='Name'
        placeholder='Enter employee name'
        value={form?.name || ""}
        onChange={(e) => handleChange("name", e?.target?.value || "")}
        error={errors?.name || ""}
      />
      {/* email */}
      <Input
        label='Email'
        type='email'
        placeholder='Enter employee email'
        value={form?.email || ""}
        onChange={(e) => handleChange("email", e?.target?.value || "")}
        error={errors?.email || ""}
        disabled={isEdit || hideCredentials}
      />
      {/* employee code - hide for employee's own profile edit */}
      {!hideCredentials && (
        <Input
          label='Employee Code'
          placeholder='Enter unique employee code (e.g., EMP001)'
          value={form?.employeeCode || ""}
          onChange={(e) => handleChange("employeeCode", e?.target?.value || "")}
          error={errors?.employeeCode || ""}
          disabled={isEdit}
        />
      )}
      {/* password show only when create */}
      {!isEdit && !hideCredentials && (
        <>
          <Input
            label='Password'
            type='password'
            placeholder='Set login password'
            value={form?.password || ""}
            onChange={(e) => handleChange("password", e?.target?.value || "")}
            error={errors?.password || ""}
          />
          {/* password rules */}
          <PasswordRules password={form?.password} />
          {/* confirm password */}
          <Input
            label='Confirm Password'
            type='password'
            placeholder='Confirm password'
            value={form?.confirmPassword || ""}
            onChange={(e) =>
              handleChange("confirmPassword", e?.target?.value || "")
            }
            error={errors?.confirmPassword || ""}
          />
        </>
      )}
      
      {/* Age */}
      {!hideCredentials && (
        <Input
          label='Age'
          type='number'
          placeholder='Enter age'
          value={form?.age || ""}
          onChange={(e) => handleChange("age", e?.target?.value || "")}
          error={errors?.age || ""}
        />
      )}

      {/* department */}
      <Input
        label='Department'
        select
        options={[
          { value: "", label: "Select Department" },
          ...VALID_DEPARTMENTS?.map((d) => ({ value: d, label: d })),
        ]}
        value={form?.department || ""}
        onChange={(e) => handleChange("department", e?.target?.value || "")}
        error={errors?.department || ""}
      />
      {/* phone */}
      <Input
        label='Phone'
        placeholder='Enter 10-digit phone number'
        value={form?.phone || ""}
        onChange={(e) => handleChange("phone", e?.target?.value || "")}
        error={errors?.phone || ""}
      />
      {/* address line */}
      <Input
        label='Address Line 1'
        placeholder='Street address'
        value={form?.address?.line1 || ""}
        onChange={(e) => handleChange("address.line1", e?.target?.value || "")}
        error={errors["address.line1"]}
      />

      <Input
        label='Address Line 2'
        placeholder='Apartment, suite, etc.'
        value={form?.address?.line2 || ""}
        onChange={(e) => handleChange("address.line2", e?.target?.value || "")}
      />
      {/* city */}
      <Input
        label='City'
        placeholder='City'
        value={form?.address?.city || ""}
        onChange={(e) => handleChange("address.city", e?.target?.value || "")}
        error={errors["address.city"]}
      />
      {/* state */}
      <Input
        label='State'
        placeholder='State'
        value={form?.address?.state || ""}
        onChange={(e) => handleChange("address.state", e?.target?.value || "")}
        error={errors["address.state"]}
      />
      {/* zip code */}
      <Input
        label='ZIP'
        placeholder='ZIP / Postal code'
        value={form?.address?.zipCode || ""}
        onChange={(e) =>
          handleChange("address.zipCode", e?.target?.value || "")
        }
        error={errors["address.zipCode"]}
      />


      {/* Salary, Reporting Manager, Joining Date */}
      {!hideCredentials && (
        <>
          {/* Salary */}
          <Input
            label='Salary'
            type='number'
            placeholder='Enter salary'
            value={form?.salary || ""}
            onChange={(e) => handleChange("salary", e?.target?.value || "")}
            error={errors?.salary || ""}
          />
          
          {/* Reporting Manager */}
          <Input
            label='Reporting Manager Name/ID'
            placeholder='Enter reporting manager'
            value={form?.reportingManager || ""}
            onChange={(e) => handleChange("reportingManager", e?.target?.value || "")}
            error={errors?.reportingManager || ""}
          />
          
          {/* Joining Date */}
          <Input
            label='Joining Date'
            type='date'
            value={form?.joiningDate || ""}
            onChange={(e) => handleChange("joiningDate", e?.target?.value || "")}
            error={errors?.joiningDate || ""}
          />
        </>
      )}

      <button type='submit' className='btn btn-primary mt-3'>
        {hideCredentials
          ? "Update Profile"
          : isEdit
            ? "Update Employee"
            : "Create Employee"}
      </button>
    </form>
  );
};
// endregion

// region exports
export default EmployeeForm;
// endregion
