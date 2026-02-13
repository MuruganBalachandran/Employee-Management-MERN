// region imports
import React from "react";
import { VALID_DEPARTMENTS } from "../../utils/constants";
// endregion

const ViewDetails = ({ data = {}, userRole = "EMPLOYEE" }) => {
  // region helpers
  const SectionHeader = ({ title = "" }) => (
    <h6 className='text-primary fw-bold text-uppercase small mb-3 mt-4 border-bottom pb-2'>
      {title}
    </h6>
  );

  const Field = ({ label, value }) => (
    <div className='mb-3'>
      <div className='small text-muted'>{label}</div>
      <div className='fw-semibold'>{value || "—"}</div>
    </div>
  );
  // endregion

  return (
    <div className='user-view-details'>
      {/* Basic Details */}
      <SectionHeader title='Basic Details' />
      <div className='row'>
        <div className='col-md-6'>
          <Field label='Full Name' value={data?.Name || ""} />
        </div>
        <div className='col-md-3'>
          <Field label='Age' value={data?.Age || ""} />
        </div>
        <div className='col-md-3'>
          <Field label='Phone Number' value={data?.Phone || ""} />
        </div>
      </div>

      <div className='row'>
        <div className='col-12'>
          <Field label='Email Address' value={data?.Email || ""} />
        </div>
      </div>

      {/* Address Details */}
      <SectionHeader title='Address Details' />
      <div className='row'>
        <div className='col-md-6'>
          <Field label='Address Line 1' value={data?.Address?.Line1 || ""} />
        </div>
        <div className='col-md-6'>
          <Field label='Address Line 2' value={data?.Address?.Line2 || ""} />
        </div>
      </div>

      <div className='row'>
        <div className='col-md-4'>
          <Field label='City' value={data?.Address?.City || ""} />
        </div>
        <div className='col-md-4'>
          <Field label='State' value={data?.Address?.State || ""} />
        </div>
        <div className='col-md-4'>
          <Field label='Zip Code' value={data?.Address?.ZipCode || ""} />
        </div>
      </div>

      {/* HR Details */}
      <SectionHeader title='HR Details' />
      <div className='row'>
        <div className='col-md-4'>
          <Field
            label={userRole === "ADMIN" ? "Admin Code" : "Employee Code"}
            value={
              userRole === "ADMIN"
                ? data?.Admin_Code || ""
                : data?.Employee_Code || ""
            }
          />
        </div>

        <div className='col-md-4'>
          <Field label='Joining Date' value={data?.Joining_Date || ""} />
        </div>

        <div className='col-md-4'>
          <Field label='Salary' value={data?.Salary || ""} />
        </div>
      </div>

      {userRole === "EMPLOYEE" && (
        <div className='row'>
          <div className='col-md-4'>
            <Field label='Department' value={data?.Department || ""} />
          </div>
          <div className='col-md-8'>
            <Field
              label='Reporting Manager'
              value={data?.Reporting_Manager || ""}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewDetails;
