import React from 'react';
import { Edit, Trash2 } from 'react-feather'; // Import icons from react-feather

const Table = ({ columns, data, onEdit, onDelete, idField = 'id' }) => {
    return (
        <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.field}
                                className="py-3 px-6 bg-primary text-white font-semibold text-left border-b tracking-wider uppercase text-sm"
                            >
                                {column.label}
                            </th>
                        ))}
                        <th className="py-3 px-6 bg-primary text-white font-semibold text-center border-b tracking-wider uppercase text-sm">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr
                            key={item[idField] || index}
                            className={`
                                ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                                hover:bg-gray-100
                            `}
                        >
                            {columns.map((column) => (
                                <td
                                    key={column.field}
                                    className="py-4 px-6 border-b border-gray-200 text-gray-700"
                                >
                                    {item[column.field]}
                                </td>
                            ))}
                            <td className="py-3 px-4 border-b border-gray-200">
                                <div className="flex justify-center space-x-2">
                                    {/* Edit button */}
                                    <button
                                        onClick={() => onEdit(item[idField])}
                                        className="flex items-center px-3 py-1.5 bg-secondary text-black text-sm font-medium rounded-md hover:bg-yellow-400 transition-colors duration-200"
                                    >
                                        <Edit size={16} className="mr-1" />
                                        Edit
                                    </button>

                                    {/* Delete button */}
                                    <button
                                        onClick={() => onDelete(item[idField])}
                                        className="flex items-center px-3 py-1.5 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600 transition-colors duration-200"
                                    >
                                        <Trash2 size={16} className="mr-1" />
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {data.length === 0 && (
                <div className="py-8 text-center text-gray-500 bg-white border-b border-gray-200">
                    No data to display
                </div>
            )}
        </div>
    );
};

export default Table;