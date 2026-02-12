// region imports
import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
// endregion

// region component
const Pagination = ({
  page = 1,
  totalPages = 1,
  onPageChange = () => {},
  className = "",
} = {}) => {
  // region guards
  if ((totalPages || 1) <= 1) {
    return null;
  }
  // endregion

  // region logic helpers
  /**
   * Generates page numbers with ellipsis for large ranges
   * Pattern: 1 ... 4 5 6 ... 10
   */
  const getPageNumbers = () => {
    const pages = [];
    const radius = 1; // Number of pages shown around the current page
    const cur = page || 1;
    const total = totalPages || 1;

    for (let i = 1; i <= total; i++) {
      if (
        i === 1 || // Always show first page
        i === total || // Always show last page
        (i >= cur - radius && i <= cur + radius) // Show pages around current
      ) {
        pages.push(i);
      } else if (
        (i === cur - radius - 1 && i > 1) ||
        (i === cur + radius + 1 && i < total)
      ) {
        pages.push("...");
      }
    }

    // Filter consecutive ellipses
    return pages.filter((item, index) => {
      return item !== "..." || pages[index - 1] !== "...";
    });
  };
  // endregion

  // region ui
  return (
    <nav className={`pagination-container ${className}`}>
      <ul className='pagination pagination-sm mb-0'>
        {/* Previous button */}
        <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
          <button
            className='page-link border-0 rounded-circle me-1 d-flex align-items-center justify-content-center'
            style={{ width: "32px", height: "32px" }}
            onClick={() => onPageChange(page - 1)}
            aria-label='Previous'
          >
            <FaChevronLeft size={10} />
          </button>
        </li>

        {/* Page numbers */}
        {getPageNumbers().map((p, idx) => (
          <li
            key={idx}
            className={`page-item ${p === page ? "active" : ""} ${p === "..." ? "disabled" : ""}`}
          >
            {p === "..." ? (
              <span className='page-link border-0 bg-transparent text-muted px-2'>
                ...
              </span>
            ) : (
              <button
                className={`page-link border-0 rounded-circle mx-1 d-flex align-items-center justify-content-center ${
                  p === page ? "shadow-sm" : "bg-transparent text-dark"
                }`}
                style={{ width: "32px", height: "32px" }}
                onClick={() => onPageChange(p)}
              >
                {p}
              </button>
            )}
          </li>
        ))}

        {/* Next button */}
        <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
          <button
            className='page-link border-0 rounded-circle ms-1 d-flex align-items-center justify-content-center'
            style={{ width: "32px", height: "32px" }}
            onClick={() => onPageChange(page + 1)}
            aria-label='Next'
          >
            <FaChevronRight size={10} />
          </button>
        </li>
      </ul>
    </nav>
  );
  // endregion
};
// endregion

// region exports
export default Pagination;
// endregion
