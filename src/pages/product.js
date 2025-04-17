import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import Pagination from '../components/Pagination';
import { Search } from 'react-feather';
import ProductCard from '../components/products/ProductCard';
import ProductModal from '../components/products/ProductModal';

const Product = () => {
    // State for products data
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [usingMockData, setUsingMockData] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);

    // Search and filter state
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [ascending, setAscending] = useState(true);
    const [filterTimeout, setFilterTimeout] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [categories, setCategories] = useState([]);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // Mock data for fallback
    const mockProducts = [
        {
            productId: "PROD001",
            name: "Blue-Eyes White Dragon",
            categoryId: "CAT001",
            categoryName: "Yu-Gi-Oh! Trading Card Game",
            description: "High-ATK dragon monster card",
            imageUrl: "https://example.com/blue-eyes.jpg",
            createdDate: "2025-03-15T10:30:00",
            updatedDate: null
        },
        {
            productId: "PROD002",
            name: "Monopoly",
            categoryId: "CAT002",
            categoryName: "Board Games",
            description: "Classic property trading board game",
            imageUrl: "https://example.com/monopoly.jpg",
            createdDate: "2025-03-18T14:45:00",
            updatedDate: null
        },
        {
            productId: "PROD003",
            name: "Dungeons & Dragons Starter Set",
            categoryId: "CAT003",
            categoryName: "Role Playing Games",
            description: "Everything needed to start playing D&D",
            imageUrl: "https://example.com/dnd.jpg",
            createdDate: "2025-03-20T09:15:00",
            updatedDate: null
        }
    ];

    // Fetch products from API
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/Product', {
                params: {
                    pageNumber: currentPage,
                    pageSize,
                    searchTerm,
                    sortBy,
                    ascending,
                    categoryId: categoryFilter // Filter by category
                }
            });

            if (response.data.success) {
                const { items, totalCount, totalPages } = response.data.data;
                setProducts(items);
                setTotalCount(totalCount);
                setTotalPages(totalPages);
                setUsingMockData(false);
            }
        } catch (error) {
            console.error('Failed to fetch products:', error);
            setError('Failed to fetch products. Using mock data instead.');

            // Calculate pagination for mock data
            const filteredMockData = mockProducts.filter(
                product => {
                    // Apply both search term and category filters
                    const matchesSearch = !searchTerm ||
                        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        product.description.toLowerCase().includes(searchTerm.toLowerCase());

                    // Apply category filter if selected
                    const matchesCategory = !categoryFilter ||
                        product.categoryId === categoryFilter;

                    return matchesSearch && matchesCategory;
                }
            );

            // Sort mock data
            const sortedMockData = [...filteredMockData].sort((a, b) => {
                if (sortBy === 'name') {
                    return ascending
                        ? a.name.localeCompare(b.name)
                        : b.name.localeCompare(a.name);
                } else if (sortBy === 'createdDate') {
                    return ascending
                        ? new Date(a.createdDate) - new Date(b.createdDate)
                        : new Date(b.createdDate) - new Date(a.createdDate);
                }
                return 0;
            });

            const start = (currentPage - 1) * pageSize;
            const end = start + pageSize;
            const paginatedMockData = sortedMockData.slice(start, end);

            setProducts(paginatedMockData);
            setTotalCount(filteredMockData.length);
            setTotalPages(Math.ceil(filteredMockData.length / pageSize));
            setUsingMockData(true);
        } finally {
            setLoading(false);
        }
    };

    // Fetch categories for the filter dropdown
    const fetchCategories = async () => {
        try {
            const response = await axios.get('/api/Category', {
                params: {
                    pageSize: 100, // Fetch a large number to get all categories
                    pageNumber: 1
                }
            });

            if (response.data.success) {
                setCategories(response.data.data.items);
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            // Use mock categories as fallback
            setCategories([
                { categoryId: 'CAT001', name: 'Yu-Gi-Oh! Trading Card Game' },
                { categoryId: 'CAT002', name: 'Board Games' },
                { categoryId: 'CAT003', name: 'Role Playing Games' },
                { categoryId: 'CAT004', name: 'Miniatures' },
                { categoryId: 'CAT005', name: 'Accessories' }
            ]);
        }
    };

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
            fetchProducts();
        }, 500);

        setFilterTimeout(timeoutId);
    };

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

    // Handle category filter change
    const handleCategoryFilterChange = (e) => {
        setCategoryFilter(e.target.value);
        setCurrentPage(1);
    };

    // Clear all filters
    const clearFilters = () => {
        setSearchTerm('');
        setCategoryFilter('');
        setSortBy('name');
        setAscending(true);
        setCurrentPage(1);
    };

    // Handle page change from pagination
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Handle edit product
    const handleEdit = (product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    // Handle delete product
    const handleDelete = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axios.delete(`/api/Product/${productId}`);
                fetchProducts(); // Refresh the list
            } catch (error) {
                console.error('Failed to delete product:', error);
                alert('Failed to delete product. Please try again later.');
            }
        }
    };

    // Handle modal close
    const handleModalClose = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    // Handle form submission (create/update)
    const handleFormSubmit = async (formData) => {
        try {
            let response;

            if (editingProduct) {
                // For update, include the product ID in the form data
                response = await axios.put(`/api/Product/${editingProduct.productId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                // Log the response for debugging
                console.log('Update response:', response.data);
            } else {
                // For create
                response = await axios.post('/api/Product', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                // Log the response for debugging
                console.log('Create response:', response.data);
            }

            setIsModalOpen(false);
            setEditingProduct(null);
            fetchProducts(); // Refresh the list
        } catch (error) {
            console.error('Failed to save product:', error);

            // Enhanced error handling to show more details about the error
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error('Error response data:', error.response.data);
                console.error('Error response status:', error.response.status);

                // Display a more specific error message if available - with safer handling of errors array
                let errorMessage = 'Failed to save product. Please try again later.';

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
                // The request was made but no response was received
                console.error('Error request:', error.request);
                alert('No response received from server. Please check your connection and try again.');
            } else {
                // Something happened in setting up the request that triggered an Error
                alert('Failed to save product: ' + error.message);
            }
        }
    };

    // Load products on component mount and when filters or pagination changes
    useEffect(() => {
        fetchProducts();
    }, [currentPage, pageSize, sortBy, ascending, categoryFilter]);

    // Load categories on component mount
    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-4">Products</h1>

                {/* Error notification */}
                {error && (
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
                        <p>{error}</p>
                    </div>
                )}

                {/* Using mock data notification */}
                {usingMockData && (
                    <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4">
                        <p>Using sample data. Could not connect to API.</p>
                    </div>
                )}

                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                    {/* Search bar */}
                    <div className="relative w-full md:w-64">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-gray-400" />
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Sort options */}
                        <div className="flex items-center">
                            <label htmlFor="sortBy" className="mr-2 text-sm text-gray-600">Sort by:</label>
                            <select
                                id="sortBy"
                                value={sortBy}
                                onChange={handleSortChange}
                                className="border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="name">Name</option>
                                <option value="createdDate">Date Created</option>
                            </select>
                        </div>

                        <button
                            onClick={handleSortDirectionChange}
                            className="p-2 border rounded-md focus:outline-none hover:bg-gray-100"
                            title={ascending ? "Ascending" : "Descending"}
                        >
                            {ascending ? "↑" : "↓"}
                        </button>

                        {/* Category filter dropdown */}
                        <div className="flex items-center">
                            <label htmlFor="categoryFilter" className="mr-2 text-sm text-gray-600">Category:</label>
                            <select
                                id="categoryFilter"
                                value={categoryFilter}
                                onChange={handleCategoryFilterChange}
                                className="border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Categories</option>
                                {categories.map(category => (
                                    <option key={category.categoryId} value={category.categoryId}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Clear filters button */}
                        {(searchTerm || categoryFilter) && (
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

                    {/* Add Product button */}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                    >
                        Add Product
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
                    {/* Products card grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.length > 0 ? (
                            products.map(product => (
                                <ProductCard
                                    key={product.productId}
                                    product={product}
                                    onEdit={() => handleEdit(product)}
                                    onDelete={() => handleDelete(product.productId)}
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-10 text-gray-500">
                                No products found. Try adjusting your search filters.
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="mt-6">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </>
            )}

            {/* Product Modal Component */}
            {isModalOpen && (
                <ProductModal
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    onSubmit={handleFormSubmit}
                    product={editingProduct}
                    categories={categories}
                />
            )}
        </div>
    );
};

export default Product;