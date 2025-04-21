import React, { useState, useEffect } from 'react';

const ProductVariantModal = ({ isOpen, onClose, onSubmit, variant, products, rarities }) => {
    // State for form data
    const [formData, setFormData] = useState({
        productId: '',
        rarityId: '',
        price: '',
        stockQuantity: '',
        imageUrl: ''
    });

    // State for form validation errors
    const [errors, setErrors] = useState({});

    // Set initial form data when editing an existing variant
    useEffect(() => {
        if (variant) {
            setFormData({
                productId: variant.productId || '',
                rarityId: variant.rarityId || '',
                price: variant.price || '',
                stockQuantity: variant.stockQuantity || '',
                imageUrl: variant.imageUrl || ''
            });
        } else {
            // Reset form when adding a new variant
            setFormData({
                productId: products.length > 0 ? products[0].productId : '',
                rarityId: rarities.length > 0 ? rarities[0].rarityId : '',
                price: '',
                stockQuantity: '',
                imageUrl: ''
            });
        }
    }, [variant, products, rarities]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Handle number inputs
        if (name === 'price' || name === 'stockQuantity') {
            // Allow only numbers
            const numericValue = value.replace(/[^0-9]/g, '');
            setFormData({
                ...formData,
                [name]: numericValue
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }

        // Clear validation errors when field is changed
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null
            });
        }
    };

    // Validate the form before submission
    const validateForm = () => {
        const newErrors = {};

        if (!formData.productId) {
            newErrors.productId = 'Product is required';
        }

        if (!formData.rarityId) {
            newErrors.rarityId = 'Rarity is required';
        }

        if (!formData.price) {
            newErrors.price = 'Price is required';
        } else if (parseInt(formData.price) <= 0) {
            newErrors.price = 'Price must be greater than 0';
        }

        if (!formData.stockQuantity && formData.stockQuantity !== '0') {
            newErrors.stockQuantity = 'Stock quantity is required';
        } else if (parseInt(formData.stockQuantity) < 0) {
            newErrors.stockQuantity = 'Stock quantity cannot be negative';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            // Convert string values to appropriate types
            const submitData = {
                ...formData,
                price: parseInt(formData.price),
                stockQuantity: parseInt(formData.stockQuantity)
            };

            // If imageUrl is empty, don't include it in the submission
            if (!submitData.imageUrl) {
                delete submitData.imageUrl;
            }

            onSubmit(submitData);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
                <div className="border-b px-6 py-4 flex justify-between items-center">
                    <h3 className="text-xl font-medium text-gray-900">
                        {variant ? "Edit Product Variant" : "Add New Product Variant"}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        {/* Product dropdown */}
                        <div>
                            <label htmlFor="productId" className="block text-sm font-medium text-gray-700 mb-1">
                                Product*
                            </label>
                            <select
                                id="productId"
                                name="productId"
                                value={formData.productId}
                                onChange={handleInputChange}
                                className={`px-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.productId ? 'border-red-500' : 'border-gray-300'}`}
                                disabled={variant} // Disable changing product for existing variants
                            >
                                <option value="">Select a product</option>
                                {products.map(product => (
                                    <option key={product.productId} value={product.productId}>
                                        {product.name}
                                    </option>
                                ))}
                            </select>
                            {errors.productId && (
                                <p className="mt-1 text-sm text-red-600">{errors.productId}</p>
                            )}
                        </div>

                        {/* Rarity dropdown */}
                        <div>
                            <label htmlFor="rarityId" className="block text-sm font-medium text-gray-700 mb-1">
                                Rarity*
                            </label>
                            <select
                                id="rarityId"
                                name="rarityId"
                                value={formData.rarityId}
                                onChange={handleInputChange}
                                className={`px-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.rarityId ? 'border-red-500' : 'border-gray-300'}`}
                                disabled={variant} // Disable changing rarity for existing variants
                            >
                                <option value="">Select a rarity</option>
                                {rarities.map(rarity => (
                                    <option key={rarity.rarityId} value={rarity.rarityId}>
                                        {rarity.name}
                                    </option>
                                ))}
                            </select>
                            {errors.rarityId && (
                                <p className="mt-1 text-sm text-red-600">{errors.rarityId}</p>
                            )}
                        </div>

                        {/* Price */}
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                                Price (VND)*
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    className={`px-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Enter price"
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500">đ</span>
                                </div>
                            </div>
                            {errors.price && (
                                <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                            )}
                            {formData.price && (
                                <p className="mt-1 text-xs text-gray-500">
                                    {parseInt(formData.price).toLocaleString()} VND
                                </p>
                            )}
                        </div>

                        {/* Stock Quantity */}
                        <div>
                            <label htmlFor="stockQuantity" className="block text-sm font-medium text-gray-700 mb-1">
                                Stock Quantity*
                            </label>
                            <input
                                type="text"
                                id="stockQuantity"
                                name="stockQuantity"
                                value={formData.stockQuantity}
                                onChange={handleInputChange}
                                className={`px-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.stockQuantity ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter stock quantity"
                            />
                            {errors.stockQuantity && (
                                <p className="mt-1 text-sm text-red-600">{errors.stockQuantity}</p>
                            )}
                        </div>

                        {/* Image URL (optional) */}
                        <div>
                            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                                Image URL (Optional)
                            </label>
                            <input
                                type="text"
                                id="imageUrl"
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleInputChange}
                                className="px-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter image URL"
                            />
                            {formData.imageUrl && (
                                <div className="mt-2">
                                    <img
                                        src={formData.imageUrl}
                                        alt="Variant preview"
                                        className="h-24 w-auto object-contain border rounded"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://via.placeholder.com/150?text=Invalid+URL';
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Display variant ID when editing */}
                        {variant && (
                            <div className="text-xs text-gray-500">
                                <p>Variant ID: {variant.variantId}</p>
                                <p>Product: {products.find(p => p.productId === variant.productId)?.name || 'Unknown'}</p>
                                <p>Rarity: {rarities.find(r => r.rarityId === variant.rarityId)?.name || 'Unknown'}</p>
                            </div>
                        )}
                    </div>

                    <div className="border-t px-6 py-4 flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                        >
                            {variant ? "Update" : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductVariantModal;