// region imports
import React from "react";
// endregion

// region component
const Pagination = ({
  page = 1,
  totalPages = 1,
  onPageChange = () => {},
} = {}) => {
  // region guard
  /* Hide pagination if only one page exists */
  if ((totalPages || 1) <= 1) {
    return null;}
  // endregion

  // region getPages
  const getPages = () => {
    /* Calculate page numbers around current page */
    const pages = [];
    let start = Math.max(1, (page || 1) - 2);
    let end = Math.min(totalPages || 1, (page || 1) + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };
  // endregion

  return (
    <nav className='mt-4 d-flex justify-content-center'>
      <ul className='pagination'>
        {/* Previous button */}
        <li className={`page-item ${(page || 1) === 1 ? "disabled" : ""}`}>
          <button
            className='page-link'
            onClick={() => onPageChange?.((page || 1) - 1)}
          >
            Prev
          </button>
        </li>

        {/* Page numbers */}
        {getPages().map((p) => (
          <li
            key={p}
            className={`page-item ${p === (page || 1) ? "active" : ""}`}
          >
            <button className='page-link' onClick={() => onPageChange?.(p)}>
              {p}
            </button>
          </li>
        ))}

        {/* Next button */}
        <li
          className={`page-item ${(page || 1) === (totalPages || 1) ? "disabled" : ""}`}
        >
          <button
            className='page-link'
            onClick={() => onPageChange((page || 1) + 1)}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};
// endregion

// region exports
export default Pagination;
// endregion
