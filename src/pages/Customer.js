import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import Table from '../components/Table';
import Pagination from '../components/Pagination';
import { Search } from 'react-feather';
import CustomerModal from '../components/customers/CustomerModal';

const Customer = () => {
    // State for customers data
    const [customers, setCustomers] = useState([]);
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
    const [sortBy, setSortBy] = useState('email');
    const [ascending, setAscending] = useState(true);
    const [filterTimeout, setFilterTimeout] = useState(null);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);

    // Mock data for fallback
    const mockCustomers = [
        {
            id: "cd646b60-f9b5-4963-bf94-2a8e4bc37d64",
            userName: "customer1@example.com",
            email: "customer1@example.com",
            firstName: "John",
            lastName: "Doe",
            phoneNumber: "1234567890"
        },
        {
            id: "df736c72-e2c1-4598-bf24-3b9f6bc54ef5",
            userName: "customer2@example.com",
            email: "customer2@example.com",
            firstName: "Jane",
            lastName: "Smith",
            phoneNumber: "9876543210"
        },
        {
            id: "a8b4c6d9-e2f5-4g7h-8j9k-1l3m5n7p9q1r",
            userName: "customer3@example.com",
            email: "customer3@example.com",
            firstName: "Robert",
            lastName: "Johnson",
            phoneNumber: "5551234567"
        }
    ];

    // Table columns definition
    const columns = [
        { field: 'id', label: 'ID' },
        { field: 'email', label: 'Email' },
        { field: 'firstName', label: 'First Name' },
        { field: 'lastName', label: 'Last Name' },
        { field: 'phoneNumber', label: 'Phone Number' }
    ];

    // Fetch customers from API
    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/Customer', {
                params: {
                    pageNumber: currentPage,
                    pageSize,
                    searchTerm,
                    sortBy,
                    ascending
                }
            });

            if (response.data.success) {
                const { items, totalCount, totalPages } = response.data.data;
                setCustomers(items);
                setTotalCount(totalCount);
                setTotalPages(totalPages);
                setUsingMockData(false);
            }
        } catch (error) {
            console.error('Failed to fetch customers:', error);
            setError('Failed to fetch customers. Using mock data instead.');

            // Calculate pagination for mock data
            const filteredMockData = mockCustomers.filter(
                customer => {
                    // Apply search term filter
                    const matchesSearch = !searchTerm ||
                        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (customer.phoneNumber && customer.phoneNumber.includes(searchTerm));

                    return matchesSearch;
                }
            );

            // Sort mock data
            const sortedMockData = [...filteredMockData].sort((a, b) => {
                if (sortBy === 'email') {
                    return ascending
                        ? a.email.localeCompare(b.email)
                        : b.email.localeCompare(a.email);
                } else if (sortBy === 'firstName') {
                    return ascending
                        ? a.firstName.localeCompare(b.firstName)
                        : b.firstName.localeCompare(a.firstName);
                } else if (sortBy === 'lastName') {
                    return ascending
                        ? a.lastName.localeCompare(b.lastName)
                        : b.lastName.localeCompare(a.lastName);
                }
                return 0;
            });

            const start = (currentPage - 1) * pageSize;
            const end = start + pageSize;
            const paginatedMockData = sortedMockData.slice(start, end);

            setCustomers(paginatedMockData);
            setTotalCount(filteredMockData.length);
            setTotalPages(Math.ceil(filteredMockData.length / pageSize));
            setUsingMockData(true);
        } finally {
            setLoading(false);
        }
    };

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

    // Clear all filters
    const clearFilters = () => {
        setSearchTerm('');
        setSortBy('email');
        setAscending(true);
        setCurrentPage(1);
    };

    // Handle page change from pagination
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Handle edit button click
    const handleEdit = (id) => {
        const customer = customers.find(c => c.id === id);
        if (customer) {
            setEditingCustomer(customer);
            setIsModalOpen(true);
        }
    };

    // Handle delete button click
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            try {
                await axios.delete(`/api/Customer/${id}`);
                fetchCustomers(); // Refresh the list
            } catch (error) {
                console.error('Failed to delete customer:', error);
                alert('Failed to delete customer. Please try again later.');
            }
        }
    };

    // Handle modal close
    const handleModalClose = () => {
        setIsModalOpen(false);
        setEditingCustomer(null);
    };

    // Handle form submit
    const handleFormSubmit = async (customerData) => {
        try {
            if (editingCustomer) {
                // Update existing customer
                await axios.put(`/api/Customer/${editingCustomer.id}`, customerData);
            } else {
                // Create new customer
                await axios.post('/api/Customer', customerData);
            }

            setIsModalOpen(false);
            setEditingCustomer(null);
            fetchCustomers(); // Refresh the list
        } catch (error) {
            console.error('Failed to save customer:', error);

            // Enhanced error handling to show more details about the error
            if (error.response) {
                console.error('Error response data:', error.response.data);
                console.error('Error response status:', error.response.status);

                // Display a more specific error message if available
                let errorMessage = 'Failed to save customer. Please try again later.';

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
                alert('Failed to save customer: ' + error.message);
            }
        }
    };

    // Load customers on component mount and when filters or pagination changes
    useEffect(() => {
        fetchCustomers();
    }, [currentPage, pageSize, sortBy, ascending, searchTerm]);

    return (
        <div className="container mx-auto p-4">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-4">Customers</h1>

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
                            placeholder="Search customers..."
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
                                <option value="email">Email</option>
                                <option value="firstName">First Name</option>
                                <option value="lastName">Last Name</option>
                            </select>
                        </div>

                        <button
                            onClick={handleSortDirectionChange}
                            className="p-2 border rounded-md focus:outline-none hover:bg-gray-100"
                            title={ascending ? "Ascending" : "Descending"}
                        >
                            {ascending ? "↑" : "↓"}
                        </button>

                        {/* Clear filters button */}
                        {searchTerm && (
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

                    {/* Add Customer button */}
                    <button
                        onClick={() => {
                            setEditingCustomer(null);
                            setIsModalOpen(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                    >
                        Add Customer
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
                    {/* Customers table */}
                    <Table
                        columns={columns}
                        data={customers}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        idField="id"
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

            {/* Customer Modal Component */}
            {isModalOpen && (
                <CustomerModal
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    onSubmit={handleFormSubmit}
                    customer={editingCustomer}
                />
            )}
        </div>
    );
};

export default Customer;