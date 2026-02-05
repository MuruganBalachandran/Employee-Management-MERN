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
  const isEdit = !!initialData?._id;

  // region form state
  const [form, setForm] = useState({
    name: "rajesh",
    email: "rajesh@spanemployee.com",
    password: "Pass&135",
    confirmPassword: "Pass&135",
    department: "Full Stack Developer",
    phone: "9999999999",
    address: {
      line1: "ss stret",
      line2: "",
      city: "coimbatore",
      state: "tamil nadu",
      zipCode: "641556",
    },
  });
  const [errors, setErrors] = useState({});
  // endregion

  // region sync form when editing
  useEffect(() => {
    if (initialData?._id) {
      setForm({
        name: initialData?.Name || "",
        email: initialData?.Email || "",
        password: "",
        confirmPassword: "",
        department: initialData?.Department || "",
        phone: initialData?.Phone || "",
        address: {
          line1: initialData?.Address?.Line1 || "",
          line2: initialData?.Address?.Line2 || "",
          city: initialData?.Address?.City || "",
          state: initialData?.Address?.State || "",
          zipCode: initialData?.Address?.ZipCode || "",
        },
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

    if (isEdit) {
      delete payload.email;
      delete payload.password;
    }

    let validationErrors = hideCredentials
      ? {} // profile edit → skip employee validation
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
