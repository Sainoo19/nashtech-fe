import React, { useState, useEffect } from 'react';

const ProductModal = ({ isOpen, onClose, onSubmit, product, categories }) => {
    const [formData, setFormData] = useState({
        name: '',
        categoryId: '',
        description: '',
        imageFile: null
    });

    const [previewUrl, setPreviewUrl] = useState('');
    const [errors, setErrors] = useState({});

    // Set initial form data when editing an existing product
    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                categoryId: product.categoryId || '',
                description: product.description || '',
                imageFile: null
            });
            setPreviewUrl(product.imageUrl || '');
        } else {
            // Reset form when adding a new product
            setFormData({
                name: '',
                categoryId: categories.length > 0 ? categories[0].categoryId : '',
                description: '',
                imageFile: null
            });
            setPreviewUrl('');
        }
    }, [product, categories]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Clear validation errors when field is changed
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null
            });
        }
    };

    // Handle image file upload
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                imageFile: file
            });

            // Create a preview URL for the selected image
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Validate the form before submission
    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Product name is required';
        }

        if (!formData.categoryId) {
            newErrors.categoryId = 'Category is required';
        }

        // Only require image for new products
        if (!product && !formData.imageFile) {
            newErrors.imageFile = 'Product image is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            // Create FormData object for multipart/form-data submission
            const submitData = new FormData();

            // Ensure these field names match exactly what your API expects
            submitData.append('Name', formData.name.trim());
            submitData.append('CategoryId', formData.categoryId);

            // For description, check if it's empty and handle accordingly
            if (formData.description && formData.description.trim() !== '') {
                submitData.append('Description', formData.description.trim());
            } else {
                // If your API requires Description field even when empty
                submitData.append('Description', '');
            }

            // Only append the image file if it exists
            if (formData.imageFile) {
                submitData.append('ImageFile', formData.imageFile);
            }

            // Log the form data being sent (for debugging)
            console.log('Submitting form with data:', {
                name: formData.name,
                categoryId: formData.categoryId,
                description: formData.description,
                hasImageFile: !!formData.imageFile
            });

            onSubmit(submitData);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 overflow-hidden">
                <div className="border-b px-6 py-4 flex justify-between items-center">
                    <h3 className="text-xl font-medium text-gray-900">
                        {product ? "Edit Product" : "Add New Product"}
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
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left column - Image upload */}
                            <div className="space-y-4">
                                <div className="flex flex-col">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Product Image
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center text-center">
                                        {previewUrl ? (
                                            <div className="relative w-full">
                                                <img
                                                    src={previewUrl}
                                                    alt="Product preview"
                                                    className="max-h-48 mx-auto my-2"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData({ ...formData, imageFile: null });
                                                        setPreviewUrl('');
                                                    }}
                                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 shadow-md"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <p className="mt-2 text-sm text-gray-500">
                                                    Drag and drop an image, or <span className="text-blue-600">browse</span>
                                                </p>
                                            </>
                                        )}
                                        <input
                                            id="imageFile"
                                            name="imageFile"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => document.getElementById('imageFile').click()}
                                            className="mt-2 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                                        >
                                            Select File
                                        </button>
                                    </div>
                                    {errors.imageFile && (
                                        <p className="mt-1 text-sm text-red-600">{errors.imageFile}</p>
                                    )}
                                    <p className="mt-1 text-xs text-gray-500">
                                        Recommended size: 800x600px. Max file size: 2MB.
                                    </p>
                                </div>
                            </div>

                            {/* Right column - Product details */}
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Product Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className={`px-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Enter product name"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                                        Category *
                                    </label>
                                    <select
                                        id="categoryId"
                                        name="categoryId"
                                        value={formData.categoryId}
                                        onChange={handleInputChange}
                                        className={`px-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.categoryId ? 'border-red-500' : 'border-gray-300'}`}
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map(category => (
                                            <option key={category.categoryId} value={category.categoryId}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.categoryId && (
                                        <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows="5"
                                        className="px-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter product description"
                                    />
                                </div>

                                {product && (
                                    <div className="text-xs text-gray-500">
                                        <p>Product ID: {product.productId}</p>
                                        <p>Created: {new Date(product.createdDate).toLocaleString()}</p>
                                        {product.updatedDate && (
                                            <p>Last Updated: {new Date(product.updatedDate).toLocaleString()}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
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
                            {product ? "Update Product" : "Create Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;