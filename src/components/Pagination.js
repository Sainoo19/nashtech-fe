import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = [];

    // Create an array of page numbers to display
    const getPageNumbers = () => {
        // Always show first page
        pageNumbers.push(1);

        // Calculate start and end of page range around current page
        let startPage = Math.max(2, currentPage - 1);
        let endPage = Math.min(totalPages - 1, currentPage + 1);

        // Add ellipsis after first page if needed
        if (startPage > 2) {
            pageNumbers.push('...');
        }

        // Add pages around current page
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        // Add ellipsis before last page if needed
        if (endPage < totalPages - 1) {
            pageNumbers.push('...');
        }

        // Always show last page if more than one page
        if (totalPages > 1) {
            pageNumbers.push(totalPages);
        }

        return pageNumbers;
    };

    // Handle clicking on a specific page number
    const handlePageClick = (page) => {
        if (page !== '...' && page !== currentPage) {
            onPageChange(page);
        }
    };

    // Handle previous/next page navigation
    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    // Don't render pagination if there's only one page or no pages
    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="flex justify-center items-center my-4">
            <nav className="flex items-center" aria-label="Pagination">
                {/* Previous button */}
                <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-l-md ${currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                        } border border-gray-300`}
                >
                    Previous
                </button>

                {/* Page numbers */}
                <div className="hidden md:flex">
                    {getPageNumbers().map((page, index) => (
                        <button
                            key={index}
                            onClick={() => handlePageClick(page)}
                            disabled={page === '...'}
                            className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border border-gray-300 ${page === currentPage
                                ? 'bg-blue-500 text-white'
                                : page === '...'
                                    ? 'bg-white text-gray-700 cursor-default'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            {page}
                        </button>
                    ))}
                </div>

                {/* Mobile version - just show current/total */}
                <div className="flex md:hidden">
                    <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium bg-white border border-gray-300">
                        {currentPage} / {totalPages}
                    </span>
                </div>

                {/* Next button */}
                <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-r-md ${currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                        } border border-gray-300`}
                >
                    Next
                </button>
            </nav>
        </div>
    );
};

export default Pagination;