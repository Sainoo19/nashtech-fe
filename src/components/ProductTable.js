import React from 'react';

const ProductTable = ({ products }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="py-2 px-4 border-b">ID</th>
                        <th className="py-2 px-4 border-b">Name</th>
                        <th className="py-2 px-4 border-b">Price</th>
                        <th className="py-2 px-4 border-b">Category</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                            <td className="py-2 px-4 border-b text-center">{product.id}</td>
                            <td className="py-2 px-4 border-b">{product.name}</td>
                            <td className="py-2 px-4 border-b text-right">${product.price.toFixed(2)}</td>
                            <td className="py-2 px-4 border-b">{product.category}</td>
                            <td className="py-2 px-4 border-b">
                                <div className="flex space-x-2 justify-center">
                                    <button className="bg-blue-500 text-white px-2 py-1 rounded text-sm">
                                        View
                                    </button>
                                    <button className="bg-yellow-500 text-white px-2 py-1 rounded text-sm">
                                        Edit
                                    </button>
                                    <button className="bg-red-500 text-white px-2 py-1 rounded text-sm">
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductTable;