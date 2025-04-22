import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import Table from '../components/Table';
import Pagination from '../components/Pagination';
import { Search } from 'react-feather';
import ProductVariantModal from '../components/productvariants/ProductVariantModal';

const ProductVariant = () => {
    // State for product variants data
    const [productVariants, setProductVariants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for related data
    const [products, setProducts] = useState([]);
    const [rarities, setRarities] = useState([]);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);

    // Search and filter state
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('productName');
    const [ascending, setAscending] = useState(true);
    const [filterTimeout, setFilterTimeout] = useState(null);
    const [productFilter, setProductFilter] = useState('');
    const [rarityFilter, setRarityFilter] = useState('');

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVariant, setEditingVariant] = useState(null);

    // Table columns definition
    const columns = [
        { field: 'variantId', label: 'Variant ID' },
        { field: 'productName', label: 'Product Name' },
        { field: 'rarityName', label: 'Rarity' },
        { field: 'price', label: 'Price', format: value => `${value.toLocaleString()} đ` },
        { field: 'stockQuantity', label: 'Stock Quantity' },
    ];

    // Fetch product variants
    const fetchProductVariants = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/ProductVariant', {
                params: {
                    pageNumber: currentPage,
                    pageSize,
                    searchTerm,
                    sortBy,
                    ascending,
                    productId: productFilter,
                    rarityId: rarityFilter
                }
            });

            if (response.data.success) {
                const { items, totalCount, totalPages } = response.data.data;
                setProductVariants(items);
                setTotalCount(totalCount);
                setTotalPages(totalPages);
            }
        } catch (error) {
            console.error('Failed to fetch product variants:', error);
            setError('Failed to fetch product variants. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch products for filter dropdown
    const fetchProducts = async () => {
        try {
            const response = await axios.get('/api/Product', {
                params: {
                    pageSize: 100, // Fetch all products for dropdown
                    pageNumber: 1
                }
            });

            if (response.data.success) {
                setProducts(response.data.data.items);
            }
        } catch (error) {
            console.error('Failed to fetch products:', error);
        }
    };

    // Fetch rarities for filter dropdown
    const fetchRarities = async () => {
        try {
            const response = await axios.get('/api/Rarity');
            if (response.data.success) {
                setRarities(response.data.data.items);
            }
        } catch (error) {
            console.error('Failed to fetch rarities:', error);
        }
    };

    // Modify your useEffect and search handler

    // Handle search with debounce
    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        // Debounce search to avoid too many API calls
        if (filterTimeout) {
            clearTimeout(filterTimeout);
        }

        const timeoutId = setTimeout(() => {
            setCurrentPage(1); // Reset to first page on search
        }, 500); // After 500ms, this will trigger the useEffect through currentPage change

        setFilterTimeout(timeoutId);
    };

    // Cleanup the timeout when component unmounts
    useEffect(() => {
        return () => {
            if (filterTimeout) {
                clearTimeout(filterTimeout);
            }
        };
    }, [filterTimeout]);

    // Add searchTerm to the dependency array to ensure fetchProductVariants runs when it changes
    useEffect(() => {
        fetchProductVariants();
    }, [currentPage, pageSize, sortBy, ascending, productFilter, rarityFilter, searchTerm]);

    // Handle sort change
    const handleSortChange = (e) => {
        setSortBy(e.target.value);
        setCurrentPage(1);
    };

    // Handle sort direction change
    const handleSortDirectionChange = () => {
        setAscending(!ascending);
        setCurrentPage(1);
    };

    // Handle product filter change
    const handleProductFilterChange = (e) => {
        setProductFilter(e.target.value);
        setCurrentPage(1);
    };

    // Handle rarity filter change
    const handleRarityFilterChange = (e) => {
        setRarityFilter(e.target.value);
        setCurrentPage(1);
    };

    // Clear all filters
    const clearFilters = () => {
        setSearchTerm('');
        setProductFilter('');
        setRarityFilter('');
        setSortBy('productName');
        setAscending(true);
        setCurrentPage(1);
    };

    // Handle page change from pagination
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Handle edit button click
    const handleEdit = (variantId) => {
        const variant = productVariants.find(v => v.variantId === variantId);
        if (variant) {
            setEditingVariant(variant);
            setIsModalOpen(true);
        }
    };

    // Handle delete button click
    const handleDelete = async (variantId) => {
        if (window.confirm('Are you sure you want to delete this product variant?')) {
            try {
                await axios.delete(`/api/ProductVariant/${variantId}`);
                fetchProductVariants(); // Refresh the list
            } catch (error) {
                console.error('Failed to delete product variant:', error);
                alert('Failed to delete product variant. Please try again later.');
            }
        }
    };

    // Handle modal close
    const handleModalClose = () => {
        setIsModalOpen(false);
        setEditingVariant(null);
    };

    // Handle form submission (create/update)
    const handleFormSubmit = async (formData) => {
        try {
            // Create a FormData object for multipart/form-data submission
            const formDataObj = new FormData();

            // Add each property to the FormData object
            Object.keys(formData).forEach(key => {
                // Only add properties that have values
                if (formData[key] !== null && formData[key] !== undefined) {
                    formDataObj.append(key, formData[key]);
                }
            });

            if (editingVariant) {
                // Update existing variant
                await axios.put(`/api/ProductVariant/${editingVariant.variantId}`, formDataObj, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });
            } else {
                // Create new variant
                await axios.post('/api/ProductVariant', formDataObj, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });
            }

            setIsModalOpen(false);
            setEditingVariant(null);
            fetchProductVariants(); // Refresh the list
        } catch (error) {
            console.error('Failed to save product variant:', error);

            // Enhanced error handling to show more details about the error
            if (error.response) {
                console.error('Error response data:', error.response.data);
                console.error('Error response status:', error.response.status);

                // Display a more specific error message if available
                let errorMessage = 'Failed to save product variant. Please try again later.';

                if (error.response.data?.message) {
                    errorMessage = error.response.data.message;
                } else if (error.response.data?.errors) {
                    // Check if errors is an array before using join
                    if (Array.isArray(error.response.data.errors)) {
                        errorMessage = error.response.data.errors.join(', ');
                    } else if (typeof error.response.data.errors === 'object') {
                        // Handle case where errors is an object instead of array
                        const errorValues = Object.values(error.response.data.errors);
                        if (errorValues.length > 0) {
                            // Flatten nested arrays if needed and join
                            errorMessage = errorValues
                                .flat()
                                .filter(e => e)
                                .join(', ');
                        }
                    } else if (typeof error.response.data.errors === 'string') {
                        errorMessage = error.response.data.errors;
                    }
                }

                alert(errorMessage);
            } else if (error.request) {
                console.error('Error request:', error.request);
                alert('No response received from server. Please check your connection and try again.');
            } else {
                alert('Failed to save product variant: ' + error.message);
            }
        }
    };

    // Load product variants, products, and rarities on component mount
    useEffect(() => {
        fetchProducts();
        fetchRarities();
    }, []);

    // Fetch product variants when filters or pagination changes
    useEffect(() => {
        fetchProductVariants();
    }, [currentPage, pageSize, sortBy, ascending, productFilter, rarityFilter]);

    return (
        <div className="container mx-auto p-4">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-4">Product Variants</h1>

                {/* Error notification */}
                {error && (
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
                        <p>{error}</p>
                    </div>
                )}

                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                    {/* Search bar */}
                    <div className="relative w-full md:w-64">
                        <input
                            type="text"
                            placeholder="Search variants..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-gray-400" />
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        {/* Sort options */}
                        <div className="flex items-center">
                            <label htmlFor="sortBy" className="mr-2 text-sm text-gray-600">Sort by:</label>
                            <select
                                id="sortBy"
                                value={sortBy}
                                onChange={handleSortChange}
                                className="border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="productName">Product Name</option>
                                <option value="rarityName">Rarity</option>
                                <option value="price">Price</option>
                                <option value="stockQuantity">Stock Quantity</option>
                            </select>
                        </div>

                        <button
                            onClick={handleSortDirectionChange}
                            className="p-2 border rounded-md focus:outline-none hover:bg-gray-100"
                            title={ascending ? "Ascending" : "Descending"}
                        >
                            {ascending ? "↑" : "↓"}
                        </button>

                        {/* Product filter dropdown */}
                        <div className="flex items-center">
                            <label htmlFor="productFilter" className="mr-2 text-sm text-gray-600">Product:</label>
                            <select
                                id="productFilter"
                                value={productFilter}
                                onChange={handleProductFilterChange}
                                className="border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Products</option>
                                {products.map(product => (
                                    <option key={product.productId} value={product.productId}>
                                        {product.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Rarity filter dropdown */}
                        <div className="flex items-center">
                            <label htmlFor="rarityFilter" className="mr-2 text-sm text-gray-600">Rarity:</label>
                            <select
                                id="rarityFilter"
                                value={rarityFilter}
                                onChange={handleRarityFilterChange}
                                className="border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Rarities</option>
                                {rarities.map(rarity => (
                                    <option key={rarity.rarityId} value={rarity.rarityId}>
                                        {rarity.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Clear filters button */}
                        {(searchTerm || productFilter || rarityFilter) && (
                            <button
                                onClick={clearFilters}
                                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Clear Filters
                            </button>
                        )}
                    </div>

                    {/* Add Product Variant button */}
                    <button
                        onClick={() => {
                            setEditingVariant(null);
                            setIsModalOpen(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors whitespace-nowrap"
                    >
                        Add Variant
                    </button>
                </div>
            </div>

            {/* Loading state */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <>
                    {/* Product variants table */}
                    {productVariants.length > 0 ? (
                        <>
                            <Table
                                columns={columns}
                                data={productVariants}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                idField="variantId"
                            />

                            {/* Pagination */}
                            <div className="mt-4">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="bg-gray-50 py-12 text-center rounded-lg border border-gray-200">
                            <p className="text-gray-500">No product variants found. Try adjusting your filters or add a new variant.</p>
                        </div>
                    )}
                </>
            )}

            {/* Product Variant Modal Component */}
            {isModalOpen && (
                <ProductVariantModal
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    onSubmit={handleFormSubmit}
                    variant={editingVariant}
                    products={products}
                    rarities={rarities}
                />
            )}
        </div>
    );
};

export default ProductVariant;