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
  // region helpers
  const getPageNumbers = () => {
    const pages = [];
    const radius = 1;
    const cur = page || 1;
    const total = totalPages || 1;

    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= cur - radius && i <= cur + radius)) {
        pages.push(i);
      } else if (
        (i === cur - radius - 1 && i > 1) ||
        (i === cur + radius + 1 && i < total)
      ) {
        pages.push("...");
      }
    }

    return pages.filter(
      (item, index) => item !== "..." || pages[index - 1] !== "...",
    );
  };
  // endregion

  // region ui
  return (
    <>
      {/* pagination guard */}
      {(totalPages || 1) > 1 && (
        <nav className={`pagination-container ${className}`}>
          <ul className='pagination pagination-sm mb-0'>
            {/* previous button */}
            <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
              <button
                className='page-link border-0 rounded-circle me-1 d-flex align-items-center justify-content-center'
                style={{ width: "32px", height: "32px" }}
                onClick={() => onPageChange((page || 1) - 1)}
                aria-label='Previous'
              >
                <FaChevronLeft size={10} />
              </button>
            </li>

            {/* page numbers */}
            {getPageNumbers().map((p, idx) => (
              <li
                key={idx}
                className={`page-item ${p === page ? "active" : ""} ${
                  p === "..." ? "disabled" : ""
                }`}
              >
                {p === "..." && (
                  <span className='page-link border-0 bg-transparent text-muted px-2'>
                    ...
                  </span>
                )}

                {p !== "..." && (
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

            {/* next button */}
            <li
              className={`page-item ${
                page === (totalPages || 1) ? "disabled" : ""
              }`}
            >
              <button
                className='page-link border-0 rounded-circle ms-1 d-flex align-items-center justify-content-center'
                style={{ width: "32px", height: "32px" }}
                onClick={() => onPageChange((page || 1) + 1)}
                aria-label='Next'
              >
                <FaChevronRight size={10} />
              </button>
            </li>
          </ul>
        </nav>
      )}
    </>
  );
  // endregion
};
// endregion

// region exports
export default Pagination;
// endregion
