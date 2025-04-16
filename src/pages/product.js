import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
import ProductTable from '../components/ProductTable';
import Pagination from '../components/Pagination';

// Sample mock data - expanded for pagination testing
const mockProducts = [
    { id: 1, name: 'Product 1', price: 19.99, category: 'Electronics' },
    { id: 2, name: 'Product 2', price: 29.99, category: 'Clothing' },
    { id: 3, name: 'Product 3', price: 39.99, category: 'Home & Garden' },
    { id: 4, name: 'Product 4', price: 49.99, category: 'Books' },
    { id: 5, name: 'Product 5', price: 59.99, category: 'Sports' },
    { id: 6, name: 'Product 6', price: 69.99, category: 'Electronics' },
    { id: 7, name: 'Product 7', price: 79.99, category: 'Clothing' },
    { id: 8, name: 'Product 8', price: 89.99, category: 'Home & Garden' },
    { id: 9, name: 'Product 9', price: 99.99, category: 'Books' },
    { id: 10, name: 'Product 10', price: 109.99, category: 'Sports' },
    { id: 11, name: 'Product 11', price: 119.99, category: 'Electronics' },
    { id: 12, name: 'Product 12', price: 129.99, category: 'Clothing' },
];

const ProductPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [usingMockData, setUsingMockData] = useState(false);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage] = useState(5);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Try to fetch from API using the configured axios instance with pagination
                const response = await axiosInstance.get('/products', {
                    params: {
                        page: currentPage - 1, // Assuming backend uses 0-indexed pages
                        size: itemsPerPage
                    }
                });

                // Check if response has pagination structure (Spring Boot style)
                if (response.data.content && response.data.totalPages) {
                    setProducts(response.data.content);
                    setTotalPages(response.data.totalPages);
                } else {
                    // If not paginated response, use full data
                    setProducts(response.data);
                    setTotalPages(Math.ceil(response.data.length / itemsPerPage));
                }

                setUsingMockData(false);
            } catch (err) {
                console.log('API fetch failed, using mock data instead:', err.message);

                // Fall back to mock data if API call fails, with pagination
                const indexOfLastItem = currentPage * itemsPerPage;
                const indexOfFirstItem = indexOfLastItem - itemsPerPage;
                const currentItems = mockProducts.slice(indexOfFirstItem, indexOfLastItem);

                setProducts(currentItems);
                setTotalPages(Math.ceil(mockProducts.length / itemsPerPage));
                setUsingMockData(true);
                setError(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [currentPage, itemsPerPage]); // Re-fetch when page changes

    // Handle page change from pagination component
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        // Scroll to top when changing pages
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Product List</h1>
            {usingMockData && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
                    <p>Using mock data. Could not connect to API.</p>
                </div>
            )}
            {error && !usingMockData && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                    <p>Error: {error}</p>
                </div>
            )}
            <ProductTable products={products} />

            {/* Add pagination component */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default ProductPage;