import React, { useState } from 'react';
import { MoreVertical, Star } from 'react-feather';

const ProductCard = ({ product, onEdit, onDelete }) => {
    const [showActions, setShowActions] = useState(false);

    const toggleActions = () => {
        setShowActions(!showActions);
    };

    // Close actions dropdown when clicking outside
    const closeActions = () => {
        setShowActions(false);
    };

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200 border border-gray-200">
            <div className="flex">
                {/* Image container with fixed dimensions */}
                <div className="relative w-1/3 min-w-[120px]">
                    <div className="aspect-square w-full h-full p-4 flex items-center justify-center bg-gray-50">
                        {product.imageUrl ? (
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="max-w-full max-h-full object-contain"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                                }}
                            />
                        ) : (
                            <div className="text-gray-400 text-sm text-center">No Image</div>
                        )}
                    </div>
                </div>

                {/* Content container */}
                <div className="w-2/3 p-4 flex flex-col relative">
                    {/* Actions menu */}
                    <div className="absolute top-3 right-3">
                        <button
                            onClick={toggleActions}
                            className="p-1 rounded-full hover:bg-gray-100"
                        >
                            <MoreVertical size={18} className="text-gray-500" />
                        </button>

                        {/* Dropdown menu */}
                        {showActions && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={closeActions}
                                ></div>

                                <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg z-20">
                                    <div className="py-1">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                closeActions();
                                                onEdit();
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                closeActions();
                                                onDelete();
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Product info */}
                    <div className="flex-grow">
                        {/* Title */}
                        <h3 className="font-medium text-base mb-1 pr-7 line-clamp-1" title={product.name}>
                            {product.name}
                        </h3>

                        {/* Category badge */}
                        <div className="mb-2">
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                                {product.categoryName}
                            </span>
                        </div>

                        {/* Price Range - New addition */}
                        {product.priceRange && (
                            <div className="mb-2">
                                <span className="font-semibold text-sm text-blue-600">
                                    {product.priceRange}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Product ID and metadata */}
                    <div className="text-xs text-gray-500 mt-auto">
                        <div className="flex justify-between items-center">
                            <span>ID: {product.productId.substring(0, 8)}...</span>
                        </div>
                        <p className="truncate">
                            Created: {new Date(product.createdDate).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;