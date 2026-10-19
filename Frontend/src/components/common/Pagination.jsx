import React from 'react';
import './pagination.scss';

const Pagination = ({ currentPage = 1, totalPages = 1, onPageChange, totalItems = 0, pageSize = 20 }) => {
    if (totalPages <= 1) return null;

    const startItem = totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0;
    const endItem = totalItems > 0 ? Math.min(currentPage * pageSize, totalItems) : 0;

    // Generate page numbers with ellipses
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible + 2) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);

            let start = Math.max(2, currentPage - 1);
            let end = Math.min(totalPages - 1, currentPage + 1);

            if (currentPage <= 3) {
                end = 4;
            } else if (currentPage >= totalPages - 2) {
                start = totalPages - 3;
            }

            if (start > 2) {
                pages.push('...');
            }

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (end < totalPages - 1) {
                pages.push('...');
            }

            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <div className="careerai-pagination" aria-label="Pagination Navigation">
            {totalItems > 0 && (
                <div className="careerai-pagination__info">
                    Showing <strong>{startItem}–{endItem}</strong> of <strong>{totalItems}</strong> questions
                </div>
            )}

            <div className="careerai-pagination__controls">
                <button
                    type="button"
                    className="careerai-pagination__btn careerai-pagination__btn--prev"
                    disabled={currentPage <= 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    aria-label="Previous Page"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                    Previous
                </button>

                <div className="careerai-pagination__numbers">
                    {getPageNumbers().map((p, index) => {
                        if (p === '...') {
                            return (
                                <span key={`ellipsis-${index}`} className="careerai-pagination__ellipsis">
                                    …
                                </span>
                            );
                        }
                        const isCurrent = p === currentPage;
                        return (
                            <button
                                key={p}
                                type="button"
                                className={`careerai-pagination__num-btn ${isCurrent ? 'careerai-pagination__num-btn--active' : ''}`}
                                onClick={() => onPageChange(p)}
                                aria-current={isCurrent ? 'page' : undefined}
                                aria-label={`Page ${p}`}
                            >
                                {p}
                            </button>
                        );
                    })}
                </div>

                <button
                    type="button"
                    className="careerai-pagination__btn careerai-pagination__btn--next"
                    disabled={currentPage >= totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                    aria-label="Next Page"
                >
                    Next
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Pagination;
