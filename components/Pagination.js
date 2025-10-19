import React from "react";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";

function Pagination({ totalItems, itemsPerPage, currentPage, onPageChange }) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handleClick = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            onPageChange(pageNumber);
        }
    };

    return (
        <div className="flex justify-center mt-20">
            <button className="mr-2 px-4 py-2 border border-gray-300 rounded-lg" onClick={() => handleClick(currentPage - 1)}>
                <RiArrowLeftSLine />
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                    key={page}
                    className={`mx-1 px-4 py-2 border border-gray-300 rounded-lg ${currentPage === page ? 'bg-gray-200' : ''}`}
                    onClick={() => handleClick(page)}
                >
                    {page}
                </button>
            ))}
            <button className="ml-2 px-4 py-2 border border-gray-300 rounded-lg" onClick={() => handleClick(currentPage + 1)}>
                <RiArrowRightSLine />
            </button>
        </div>
    );
}

export default Pagination;
