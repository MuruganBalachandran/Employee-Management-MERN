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
} from "../../validations/employeeValidation";
import { VALID_DEPARTMENTS } from "../../utils/constants";
// endregion

// region component
const EmployeeForm = ({
  initialData = {},
  onSubmit = () => {},
  hideCredentials = false,
}) => {
  // hooks
  const dispatch = useDispatch();
  //  bool values for access check
  const isEdit =
    !!initialData?.Employee_Id ||
    !!initialData?.User_Id ||
    !!initialData?.userId;
  const profileEdit = isEdit && hideCredentials;

  // form state
  const [form, setForm] = useState({
    name: "ram",
    email: "ram@spanemployee.com",
    password: "Pass&135",
    confirmPassword: "Pass&135",
    employeeCode: "EMP001",
    age: "20",
    department: "Full Stack Developer",
    phone: "9834567869",
    address: {
      line1: "ss street",
      line2: "",
      city: "cbe",
      state: "t n",
      zipCode: "456775",
    },
    salary: "560000",
    reportingManager: "kumar",
    joiningDate: "",
  });

  // error state
  const [errors, setErrors] = useState({});

  // region initial data
  useEffect(() => {
    if (isEdit && initialData) {
      setForm({
        name: initialData?.Name || "",
        email: initialData?.Email || "",
        password: "",
        confirmPassword: "",
        employeeCode: initialData?.Employee_Code || "",
        age: initialData?.Age || "",
        department: initialData?.Department || "",
        phone: initialData?.Phone || "",
        address: {
          line1: initialData?.Address?.Line1 || "",
          line2: initialData?.Address?.Line2 || "",
          city: initialData?.Address?.City || "",
          state: initialData?.Address?.State || "",
          zipCode: initialData?.Address?.ZipCode || "",
        },
        salary: initialData?.Salary || "",
        reportingManager: initialData?.Reporting_Manager || "",
        joiningDate: initialData?.Joining_date?.split("T")[0] || "",
      });
    }
  }, [initialData, isEdit]);

  // region live validation
  const handleChange = (field = "", value = "") => {
    setForm((prev) => {
      const updated = { ...prev };
      if (field?.startsWith("address.")) {
        const key = field?.split(".")[1];
        updated.address[key] = value;
      } else {
        updated[field] = value;
      }
      return updated;
    });

    // validation
    let error = "";
    if (field.startsWith("address.")) {
      const key = field.split(".")[1];
      error = addressValidation({ ...form.address, [key]: value })[key] || "";
    } else if (field === "confirmPassword") {
      error = value !== form.password ? "Passwords do not match" : "";
    } else {
      const validationMap = {
        name: (value) => nameValidation(value),
        email: (value) => emailValidation(value, "employee", isEdit),
        password: (value) => passwordValidation(value, isEdit),
        confirmPassword: (value) =>
          value !== form.password ? "Passwords do not match" : "",
        department: (value) => departmentValidation(value),
        phone: (value) => phoneValidation(value),
        salary: (value) => salaryValidation(value),
        reportingManager: (value) => reportingManagerValidation(value),
        joiningDate: (value) => joiningDateValidation(value),
        age: (value) => ageValidation(value),
        employeeCode: (value) => employeeCodeValidation(value, isEdit),
      };

      if (validationMap[field]) error = validationMap[field](value);
    }

    setErrors((prev) => ({ ...prev, [field]: error ? error : undefined }));
  };

  // region submit
  const handleSubmit = (e) => {
    e.preventDefault();
    // data from form
    const payload = {
      name: form.name.trim(),
      age: form.age ? parseInt(form.age, 10) : "",
      phone: form.phone.trim(),
      address: { ...form.address },
      ...(isEdit || profileEdit
        ? {}
        : {
            email: form.email.trim().toLowerCase(),
            password: form.password,
            employeeCode: form.employeeCode.trim(),
          }),
      ...(!profileEdit
        ? {
            department: form.department,
            salary: form.salary ? Number(form.salary) : "",
            reportingManager: form.reportingManager.trim(),
            joiningDate: form.joiningDate,
          }
        : {}),
    };

    const validationErrors = validateEmployee(
      { ...payload, confirmPassword: form.confirmPassword },
      isEdit,
      hideCredentials,
    );
    // if any validation errors
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      dispatch(showToast({ message: "Please fix the errors", type: "error" }));
      return;
    }

    onSubmit(payload, setErrors);
  };
// region ui
  return (
    <form onSubmit={handleSubmit} className='card p-4 shadow-sm'>
      <Input
        label='Name'
        value={form?.name}
        onChange={(e) => handleChange("name", e.target.value)}
        error={errors?.name}
        placeholder='Enter your name'
      />
      {/* email field */}
      <Input
        label='Email (@spanemployee.com)'
        type='email'
        value={form?.email}
        onChange={(e) => handleChange("email", e.target.value)}
        error={errors?.email}
        disabled={isEdit}
        placeholder='Enter your email'
      />

      {/* employee code */}
      <Input
        label='Employee Code'
        value={form?.employeeCode}
        onChange={(e) => handleChange("employeeCode", e.target.value)}
        error={errors?.employeeCode}
        disabled={isEdit}
        placeholder='Enter Employee code (EMP001)'
      />

      {!isEdit && !hideCredentials && (
        <>
          {/* password field */}
          <Input
            label='Password'
            type='password'
            value={form?.password}
            onChange={(e) => handleChange("password", e.target.value)}
            error={errors?.password}
            placeholder='Enter your Password'
          />
          {/* password field */}
          <PasswordRules password={form?.password} />
          {/* confirm password field */}
          <Input
            label='Confirm Password'
            type='password'
            value={form?.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            error={errors?.confirmPassword}
            placeholder='Confirm password'
          />
        </>
      )}
      {/* age field */}
      <Input
        label='Age'
        type='number'
        value={form?.age}
        onChange={(e) => handleChange("age", e.target.value)}
        error={errors?.age}
        placeholder='Enter your Age'
      />
      {/* departments drop down */}
      <Input
        label='Department'
        select
        options={[
          { value: "", label: "Select Department" },
          ...VALID_DEPARTMENTS.map((d) => ({ value: d, label: d })),
        ]}
        value={form?.department}
        onChange={(e) => handleChange("department", e.target.value)}
        error={errors?.department}
        disabled={profileEdit}
      />

      {/* phone field */}
      <Input
        label='Phone'
        value={form?.phone}
        onChange={(e) => handleChange("phone", e.target.value)}
        error={errors?.phone}
        placeholder='Enter your Phone'
      />

      {/* address line 1 */}
      <Input
        label='Address Line 1'
        value={form?.address.line1}
        onChange={(e) => handleChange("address.line1", e.target.value)}
        error={errors["address.line1"]}
        placeholder='Enter your line 1'
      />

      {/* address line 2 */}
      <Input
        label='Address Line 2 (optional)'
        value={form?.address.line2}
        onChange={(e) => handleChange("address.line2", e.target.value)}
        error={errors["address.line2"]}
        placeholder='Enter your line 2'
      />
      {/* city field */}
      <Input
        label='City'
        value={form?.address.city}
        onChange={(e) => handleChange("address.city", e.target.value)}
        error={errors["address.city"]}
        placeholder='Enter your city'
      />
      {/* state field */}
      <Input
        label='State'
        value={form?.address.state}
        onChange={(e) => handleChange("address.state", e.target.value)}
        error={errors["address.state"]}
        placeholder='Enter your state'
      />
      {/* zipcode field */}
      <Input
        label='ZIP Code'
        value={form?.address.zipCode}
        onChange={(e) => handleChange("address.zipCode", e.target.value)}
        error={errors["address.zipCode"]}
        placeholder='Enter your zipcode'
      />

      {/* salary field */}
      <Input
        label='Salary'
        type='number'
        value={form?.salary}
        onChange={(e) => handleChange("salary", e.target.value)}
        error={errors?.salary}
        disabled={profileEdit}
        placeholder='Enter your salary (per year)'
      />
      {/* reporting manager field */}
      <Input
        label='Reporting Manager'
        value={form?.reportingManager}
        onChange={(e) => handleChange("reportingManager", e.target.value)}
        error={errors?.reportingManager}
        disabled={profileEdit}
        placeholder='Enter your reporting manager'
      />
      {/* joining date field */}
      <Input
        label='Joining Date'
        type='date'
        value={form?.joiningDate}
        onChange={(e) => handleChange("joiningDate", e.target.value)}
        error={errors?.joiningDate}
        disabled={profileEdit}
      />

      {/* region submit button */}
      <button type='submit' className='btn btn-primary mt-3'>
        {profileEdit
          ? "Update Profile"
          : isEdit
            ? "Update Employee"
            : "Create Employee"}
      </button>
    </form>
  );
  // endregion
};

// region exports
export default EmployeeForm;
// endregion
