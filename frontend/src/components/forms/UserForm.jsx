// region imports
import React from "react";
import { Input } from "../index";
import { VALID_DEPARTMENTS } from "../../utils/constants";
// endregion

const UserForm = ({
  formData = {},
  onChange = () => {},
  onBlur = () => {},
  errors = {},
  isEdit = false,
  userRole = "EMPLOYEE",
}) => {
  // region options
  const departmentOptions = [
    { value: "", label: "Select Department" },
    ...VALID_DEPARTMENTS.map((dept) => ({
      value: dept,
      label: dept,
    })),
  ];
  // endregion

  // region ui helpers
  const SectionHeader = ({ title = "" }) => (
    <h6 className='text-primary fw-bold text-uppercase small mb-3 mt-4 border-bottom pb-2'>
      {title}
    </h6>
  );
  // endregion

  // region ui
  return (
    <form className='user-form'>
      {/* Basic Details */}
      <SectionHeader title='Basic Details' />
      <div className='row'>
        <div className='col-md-6'>
          <Input
            label='Full Name'
            name='name'
            value={formData?.name || ""}
            onChange={onChange}
            onBlur={onBlur}
            error={errors?.name}
            required
            placeholder='e.g. John Doe'
          />
        </div>

        <div className='col-md-3'>
          <Input
            label='Age'
            name='age'
            value={formData?.age || ""}
            onChange={onChange}
            onBlur={onBlur}
            error={errors?.age}
            placeholder='e.g. 25'
          />
        </div>

        <div className='col-md-3'>
          <Input
            label='Phone Number'
            name='phone'
            value={formData?.phone || ""}
            onChange={onChange}
            onBlur={onBlur}
            error={errors?.phone}
            placeholder='e.g. +91 9876543210'
          />
        </div>
      </div>

      <div className='row'>
        <div className='col-12'>
          <Input
            label='Email Address'
            name='email'
            type='email'
            value={formData?.email || ""}
            onChange={onChange}
            onBlur={onBlur}
            error={errors?.email}
            required
            disabled={isEdit}
            placeholder='e.g. john@example.com'
          />
        </div>
      </div>

      {!isEdit && (
        <div className='row'>
          <div className='col-md-6'>
            <Input
              label='Password'
              name='password'
              type='password'
              value={formData?.password || ""}
              onChange={onChange}
              onBlur={onBlur}
              error={errors?.password}
              required
              placeholder='Minimum 8 characters'
            />
          </div>

          <div className='col-md-6'>
            <Input
              label='Confirm Password'
              name='confirmPassword'
              type='password'
              value={formData?.confirmPassword || ""}
              onChange={onChange}
              onBlur={onBlur}
              error={errors?.confirmPassword}
              required
              placeholder='Re-enter password'
            />
          </div>
        </div>
      )}

      {/* Address Details */}
      <SectionHeader title='Address Details' />
      <div className='row'>
        <div className='col-md-6'>
          <Input
            label='Address Line 1'
            name='address.line1'
            value={formData?.address?.line1 || ""}
            onChange={onChange}
            onBlur={onBlur}
            error={errors?.["address.line1"]}
            placeholder='Street address, P.O. box'
          />
        </div>

        <div className='col-md-6'>
          <Input
            label='Address Line 2'
            name='address.line2'
            value={formData?.address?.line2 || ""}
            onChange={onChange}
            onBlur={onBlur}
            error={errors?.["address.line2"]}
            placeholder='Apartment, suite, unit, etc.'
          />
        </div>
      </div>

      <div className='row'>
        <div className='col-md-4'>
          <Input
            label='City'
            name='address.city'
            value={formData?.address?.city || ""}
            onChange={onChange}
            onBlur={onBlur}
            error={errors?.["address.city"]}
            placeholder='e.g. New York'
          />
        </div>

        <div className='col-md-4'>
          <Input
            label='State'
            name='address.state'
            value={formData?.address?.state || ""}
            onChange={onChange}
            onBlur={onBlur}
            error={errors?.["address.state"]}
            placeholder='e.g. NY'
          />
        </div>

        <div className='col-md-4'>
          <Input
            label='Zip Code'
            name='address.zipCode'
            value={formData?.address?.zipCode || ""}
            onChange={onChange}
            onBlur={onBlur}
            error={errors?.["address.zipCode"]}
            placeholder='e.g. 10001'
          />
        </div>
      </div>

      {/* HR Details */}
      <SectionHeader title='HR Details' />
      <div className='row'>
        <div className='col-md-4'>
          <Input
            label={userRole === "ADMIN" ? "Admin Code" : "Employee Code"}
            name={userRole === "ADMIN" ? "adminCode" : "employeeCode"}
            value={
              userRole === "ADMIN"
                ? formData?.adminCode || ""
                : formData?.employeeCode || ""
            }
            onChange={onChange}
            onBlur={onBlur}
            error={
              userRole === "ADMIN" ? errors?.adminCode : errors?.employeeCode
            }
            required
            disabled={isEdit}
            placeholder={userRole === "ADMIN" ? "e.g. ADMIN001" : "e.g. EMP001"}
          />
        </div>

        <div className='col-md-4'>
          <Input
            label='Joining Date'
            name='joiningDate'
            type='date'
            value={formData?.joiningDate || ""}
            onChange={onChange}
            onBlur={onBlur}
            error={errors?.joiningDate}
            disabled={isEdit}
          />
        </div>

        <div className='col-md-4'>
          <Input
            label='Salary'
            name='salary'
            value={formData?.salary || ""}
            onChange={onChange}
            onBlur={onBlur}
            error={errors?.salary}
            placeholder='e.g. 50000'
          />
        </div>
      </div>

      <div className='row'>
        {userRole === "EMPLOYEE" && (
          <div className='col-md-4'>
            <Input
              label='Department'
              name='department'
              select
              options={departmentOptions}
              value={formData?.department || ""}
              onChange={onChange}
              onBlur={onBlur}
              error={errors?.department}
              required
            />
          </div>
        )}

        {userRole === "EMPLOYEE" && (
          <div className='col-md-8'>
            <Input
              label='Reporting Manager'
              name='reportingManager'
              value={formData?.reportingManager || ""}
              onChange={onChange}
              onBlur={onBlur}
              error={errors?.reportingManager}
              placeholder='e.g. Jane Smith'
            />
          </div>
        )}
      </div>
    </form>
  );
  // endregion
};

// region exports
export default UserForm;
// endregion
