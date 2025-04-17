import React, { useState } from 'react';
import { MoreVertical } from 'react-feather';

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
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="flex h-full">
                {/* Product image on the left */}
                <div className="w-1/3 bg-gray-100">
                    {product.imageUrl ? (
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/627fe721-846f-4f75-ac61-111ca00b27dd/d9v6xhg-891bc94c-8760-46a5-a3ed-0e48e375e535.jpg/v1/fit/w_813,h_1185,q_70,strp/blue_eyes_white_dragon_by_alanmac95_d9v6xhg-414w-2x.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTE4NSIsInBhdGgiOiJcL2ZcLzYyN2ZlNzIxLTg0NmYtNGY3NS1hYzYxLTExMWNhMDBiMjdkZFwvZDl2NnhoZy04OTFiYzk0Yy04NzYwLTQ2YTUtYTNlZC0wZTQ4ZTM3NWU1MzUuanBnIiwid2lkdGgiOiI8PTgxMyJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.juZUZjEl5mvDVZGPVLZ0SXoCcsGpXBkYwC3zhDr25xk';
                            }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <span className="text-gray-500">No Image</span>
                        </div>
                    )}
                </div>

                {/* Product details on the right */}
                <div className="w-2/3 p-4 flex flex-col relative">
                    {/* Three dots menu */}
                    <div className="absolute top-4 right-4">
                        <button
                            onClick={toggleActions}
                            className="p-1 rounded-full hover:bg-gray-100"
                        >
                            <MoreVertical size={18} className="text-gray-500" />
                        </button>

                        {/* Dropdown menu */}
                        {showActions && (
                            <>
                                {/* Invisible overlay to capture clicks outside */}
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={closeActions}
                                ></div>

                                {/* Dropdown content */}
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

                    {/* Product title with truncation */}
                    <h3 className="font-semibold text-lg mb-1 pr-8 truncate" title={product.name}>
                        {product.name}
                    </h3>

                    {/* Category */}
                    <div className="text-sm text-gray-600 mb-2">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                            {product.categoryName}
                        </span>
                    </div>

                    {/* Description with truncation */}
                    <p className="text-gray-600 text-sm overflow-hidden flex-grow"
                        style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {product.description || "No description available"}
                    </p>

                    {/* Product ID and dates at the bottom */}
                    <div className="mt-3 text-xs text-gray-500">
                        <p>ID: {product.productId}</p>
                        <p>Created: {new Date(product.createdDate).toLocaleDateString()}</p>
                        {product.updatedDate && (
                            <p>Updated: {new Date(product.updatedDate).toLocaleDateString()}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;