// region imports
import React from "react";
import Select from "react-select";
import { FaSearch, FaTimes } from "react-icons/fa";
import { VALID_DEPARTMENTS } from "../../utils/constants";
// endregion


const Filters = ({
  search = "",
  onSearchChange = () => {},
  selectedDepartment = null,
  onDepartmentChange = () => {},
  showDepartment = false,
  placeholder = "Search...",
}) => {
  // region dropdown options
  const departmentOptions = [
    { value: "", label: "All Departments" },
    ...VALID_DEPARTMENTS.map((dept) => ({ value: dept, label: dept })),
  ];

  const customStyles = {
    control: (base) => ({
      ...base,
      borderRadius: "50px",
      paddingLeft: "10px",
      minHeight: "38px",
      borderColor: "#dee2e6",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#0d6efd",
      },
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? "#0d6efd" : state.isFocused ? "#f8f9fa" : "white",
      color: state.isSelected ? "white" : "#212529",
      "&:active": {
        backgroundColor: "#0d6efd",
      },
    }),
  };
  // endregion

  // region ui
  return (
    <div className='d-flex flex-wrap gap-2 align-items-center w-100'>
      {/* Search Input */}
      <div className='position-relative flex-grow-1'>
        <FaSearch className='position-absolute top-50 start-0 translate-middle-y ms-3 text-muted' size={14} />
        <input
          type='text'
          className='form-control rounded-pill ps-5 pe-5'
          placeholder={placeholder}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {search && (
          <button
            className='btn btn-link position-absolute top-50 end-0 translate-middle-y me-2 p-0 text-muted text-decoration-none'
            onClick={() => onSearchChange("")}
            type='button'
          >
            <FaTimes size={14} />
          </button>
        )}
      </div>

      {/* Department Dropdown (Optional) */}
      {showDepartment && (
        <div className="flex-grow-1" style={{ minWidth: "250px" }}>
          <Select
            options={departmentOptions}
            value={departmentOptions.find(opt => opt.value === selectedDepartment) || departmentOptions[0]}
            onChange={(opt) => onDepartmentChange(opt?.value || "")}
            styles={customStyles}
            isSearchable={false}
            placeholder='Select Department'
          />
        </div>
      )}
    </div>
  );
  // endregion
};

// region exports
export default Filters;
// endregion
