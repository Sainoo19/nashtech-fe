// src/pages/Unauthorized.js
import { Link } from 'react-router-dom';

const Unauthorized = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
                <h2 className="text-2xl font-bold mb-4 text-red-600">Access Denied</h2>
                <p className="mb-4">
                    You do not have permission to access the admin dashboard.
                    This area requires administrator privileges.
                </p>
                <Link
                    to="/login"
                    className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Back to Login
                </Link>
            </div>
        </div>
    );
};

export default Unauthorized;
