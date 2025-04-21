import React, { useState, useEffect } from 'react';

const CustomerModal = ({ isOpen, onClose, onSubmit, customer }) => {
    // State for form data
    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        password: '',  // Only for new users
        confirmPassword: '' // Only for new users
    });

    // State for form validation errors
    const [errors, setErrors] = useState({});

    // Set initial form data when editing an existing customer
    useEffect(() => {
        if (customer) {
            setFormData({
                userName: customer.userName || '',
                email: customer.email || '',
                firstName: customer.firstName || '',
                lastName: customer.lastName || '',
                phoneNumber: customer.phoneNumber || '',
                // No password fields when editing
                password: '',
                confirmPassword: ''
            });
        } else {
            // Reset form when adding a new customer
            setFormData({
                userName: '',
                email: '',
                firstName: '',
                lastName: '',
                phoneNumber: '',
                password: '',
                confirmPassword: ''
            });
        }
    }, [customer]);

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

    // Validate the form before submission
    const validateForm = () => {
        const newErrors = {};

        // Email validation
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        // Username validation
        if (!formData.userName) {
            newErrors.userName = 'Username is required';
        }

        // First name validation
        if (!formData.firstName) {
            newErrors.firstName = 'First name is required';
        }

        // Last name validation
        if (!formData.lastName) {
            newErrors.lastName = 'Last name is required';
        }

        // Phone number validation - optional but should be valid if provided
        if (formData.phoneNumber && !/^\d{10,15}$/.test(formData.phoneNumber.replace(/[^\d]/g, ''))) {
            newErrors.phoneNumber = 'Phone number is invalid';
        }

        // Password validation - only for new users
        if (!customer) {
            if (!formData.password) {
                newErrors.password = 'Password is required';
            } else if (formData.password.length < 8) {
                newErrors.password = 'Password must be at least 8 characters';
            }

            if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            // Create a copy of the form data for submission
            const submitData = { ...formData };

            // For existing customers, don't send password fields
            if (customer) {
                delete submitData.password;
                delete submitData.confirmPassword;
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
                        {customer ? "Edit Customer" : "Add New Customer"}
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Email */}
                            <div className="sm:col-span-2">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email*
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`px-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Enter email address"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>

                            {/* Username */}
                            <div className="sm:col-span-2">
                                <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Username*
                                </label>
                                <input
                                    type="text"
                                    id="userName"
                                    name="userName"
                                    value={formData.userName}
                                    onChange={handleInputChange}
                                    className={`px-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.userName ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Enter username"
                                />
                                {errors.userName && (
                                    <p className="mt-1 text-sm text-red-600">{errors.userName}</p>
                                )}
                            </div>

                            {/* First Name */}
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                    First Name*
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className={`px-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Enter first name"
                                />
                                {errors.firstName && (
                                    <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                                )}
                            </div>

                            {/* Last Name */}
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Last Name*
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    className={`px-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Enter last name"
                                />
                                {errors.lastName && (
                                    <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                                )}
                            </div>

                            {/* Phone Number */}
                            <div className="sm:col-span-2">
                                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                    className={`px-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Enter phone number"
                                />
                                {errors.phoneNumber && (
                                    <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                                )}
                            </div>

                            {/* Password fields - only for new customers */}
                            {!customer && (
                                <>
                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                            Password*
                                        </label>
                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className={`px-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="Enter password"
                                        />
                                        {errors.password && (
                                            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                            Confirm Password*
                                        </label>
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            className={`px-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="Confirm password"
                                        />
                                        {errors.confirmPassword && (
                                            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                                        )}
                                    </div>
                                </>
                            )}
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
                            {customer ? "Update Customer" : "Create Customer"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CustomerModal;