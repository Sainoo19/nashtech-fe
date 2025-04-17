import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import Table from '../components/Table';
import Pagination from '../components/Pagination';
import { Search } from 'react-feather';

const Category = () => {
    // State for categories data
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [usingMockData, setUsingMockData] = useState(false);
    const [filterType, setFilterType] = useState('');

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

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    // Mock data for fallback
    const mockCategories = [
        { categoryId: 'CAT001', name: 'Trading Card Games', description: 'Card games like Yu-Gi-Oh!, Magic: The Gathering, etc.' },
        { categoryId: 'CAT002', name: 'Board Games', description: 'Traditional and modern board games for all ages.' },
        { categoryId: 'CAT003', name: 'Role Playing Games', description: 'Tabletop RPGs and accessories.' },
        { categoryId: 'CAT004', name: 'Miniatures', description: 'Collectible miniatures and miniature games.' },
        { categoryId: 'CAT005', name: 'Accessories', description: 'Gaming accessories like dice, playmats, and more.' }
    ];

    // Table columns definition
    const columns = [
        { field: 'categoryId', label: 'Category ID' },
        { field: 'name', label: 'Name' },
        { field: 'description', label: 'Description' },
    ];


    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/Category', {
                params: {
                    pageNumber: currentPage,
                    pageSize,
                    searchTerm,
                    sortBy,
                    ascending,
                    filterType // Add the filter type parameter
                }
            });

            if (response.data.success) {
                const { items, totalCount, totalPages } = response.data.data;
                setCategories(items);
                setTotalCount(totalCount);
                setTotalPages(totalPages);
                setUsingMockData(false);
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            setError('Failed to fetch categories. Using mock data instead.');

            // Calculate pagination for mock data
            const filteredMockData = mockCategories.filter(
                category => {
                    // Apply both search term and category type filters
                    const matchesSearch = !searchTerm ||
                        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        category.description.toLowerCase().includes(searchTerm.toLowerCase());

                    // Apply category type filter if selected
                    const matchesFilter = !filterType ||
                        category.name.includes(filterType);

                    return matchesSearch && matchesFilter;
                }
            );

            // Sorting logic remains the same
            const sortedMockData = [...filteredMockData].sort((a, b) => {
                if (sortBy === 'name') {
                    return ascending
                        ? a.name.localeCompare(b.name)
                        : b.name.localeCompare(a.name);
                } else if (sortBy === 'categoryId') {
                    return ascending
                        ? a.categoryId.localeCompare(b.categoryId)
                        : b.categoryId.localeCompare(a.categoryId);
                }
                return 0;
            });

            const start = (currentPage - 1) * pageSize;
            const end = start + pageSize;
            const paginatedMockData = sortedMockData.slice(start, end);

            setCategories(paginatedMockData);
            setTotalCount(filteredMockData.length);
            setTotalPages(Math.ceil(filteredMockData.length / pageSize));
            setUsingMockData(true);
        } finally {
            setLoading(false);
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
            fetchCategories();
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

    // Handle filter change
    const handleFilterChange = (e) => {
        setFilterType(e.target.value);
        setCurrentPage(1); // Reset to first page when filter changes
    };

    // Clear all filters
    const clearFilters = () => {
        setSearchTerm('');
        setFilterType('');
        setSortBy('name');
        setAscending(true);
        setCurrentPage(1);
    };

    // Handle page change from pagination
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Handle edit button click
    const handleEdit = (categoryId) => {
        const category = categories.find(c => c.categoryId === categoryId);
        if (category) {
            setEditingCategory(category);
            setFormData({
                name: category.name,
                description: category.description
            });
            setIsModalOpen(true);
        }
    };

    // Handle delete button click
    const handleDelete = async (categoryId) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await axios.delete(`/api/Category/${categoryId}`);
                fetchCategories(); // Refresh the list
            } catch (error) {
                console.error('Failed to delete category:', error);
                alert('Failed to delete category. Please try again later.');
            }
        }
    };

    // Handle form input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingCategory) {
                // Update existing category
                await axios.put(`/api/Category/${editingCategory.categoryId}`, formData);
            } else {
                // Create new category
                await axios.post('/api/Category', formData);
            }

            setIsModalOpen(false);
            setFormData({ name: '', description: '' });
            setEditingCategory(null);
            fetchCategories(); // Refresh the list
        } catch (error) {
            console.error('Failed to save category:', error);
            alert('Failed to save category. Please try again later.');
        }
    };

    // Load categories on component mount and when filters or pagination changes
    useEffect(() => {
        fetchCategories();
    }, [currentPage, pageSize, sortBy, ascending]);

    return (
        <div className="container mx-auto p-4">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-4">Categories</h1>

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
                            placeholder="Search categories..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-gray-400" />
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Existing sort options */}
                        <div className="flex items-center">
                            <label htmlFor="sortBy" className="mr-2 text-sm text-gray-600">Sort by:</label>
                            <select
                                id="sortBy"
                                value={sortBy}
                                onChange={handleSortChange}
                                className="border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="categoryId">Category ID</option>
                                <option value="name">Name</option>
                            </select>
                        </div>

                        <button
                            onClick={handleSortDirectionChange}
                            className="p-2 border rounded-md focus:outline-none hover:bg-gray-100"
                            title={ascending ? "Ascending" : "Descending"}
                        >
                            {ascending ? "↑" : "↓"}
                        </button>

                        {/* Add new filter dropdown */}
                        <div className="flex items-center">
                            <label htmlFor="filterType" className="mr-2 text-sm text-gray-600">Filter:</label>
                            <select
                                id="filterType"
                                value={filterType}
                                onChange={handleFilterChange}
                                className="border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Categories</option>
                                <option value="Trading Card Games">Trading Card Games</option>
                                <option value="Board Games">Board Games</option>
                                <option value="Role Playing Games">Role Playing Games</option>
                                <option value="Accessories">Accessories</option>
                            </select>
                        </div>

                        {/* Add clear filters button */}
                        {(searchTerm || filterType) && (
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

                    {/* Add Category button */}
                    <button
                        onClick={() => {
                            setEditingCategory(null);
                            setFormData({ name: '', description: '' });
                            setIsModalOpen(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                    >
                        Add Category
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
                    {/* Categories table */}

                    <Table
                        columns={columns}
                        data={categories}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        idField="categoryId"  // Specify which field contains the ID
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
            )}

            {/* Modal for adding/editing categories */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
                        <div className="border-b px-6 py-4">
                            <h3 className="text-xl font-medium text-gray-900">
                                {editingCategory ? "Edit Category" : "Add New Category"}
                            </h3>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Category Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="px-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter category name"
                                    />
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
                                        rows="4"
                                        className="px-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter category description"
                                    />
                                </div>
                            </div>

                            <div className="border-t px-6 py-4 flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                                >
                                    {editingCategory ? "Update" : "Create"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Category;