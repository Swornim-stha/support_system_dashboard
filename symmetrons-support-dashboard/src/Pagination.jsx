import React from "react";
import "./Pagination.css";

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onParamsChange,
}) {
  // Calculate the range of items currently being shown
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Don't render anything if there are no items
  if (totalItems === 0) {
    return null;
  }

  return (
    <div className="pagination">
      {/* "Showing X-Y of Z items" text */}
      <span className="pagination-text">
        Showing {startItem}-{endItem} of {totalItems} items
      </span>

      {/* Page navigation controls */}
      <div className="pagination-controls">
        <button
          onClick={() => onParamsChange("page", currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Go to previous page"
        >
          &lt;
        </button>
        <span className="page-number">{currentPage}</span>
        <button
          onClick={() => onParamsChange("page", currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Go to next page"
        >
          &gt;
        </button>
      </div>

      {/* Items per page dropdown */}
      <select
        className="page-size-select"
        value={itemsPerPage}
        onChange={(e) => onParamsChange("limit", e.target.value)}
        aria-label="Items per page"
      >
        <option value="10">10 / page</option>
        <option value="20">20 / page</option>
        <option value="50">50 / page</option>
      </select>
    </div>
  );
}
