// src/pages/Dashboard.js
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
    const { currentUser, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <div className="flex items-center">
                        <span className="mr-4">Welcome, {currentUser?.email}</span>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>
            <main>
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    {/* Dashboard content goes here */}
                    <div className="px-4 py-6 sm:px-0">
                        <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-4">
                            <h2 className="text-xl font-bold mb-4">Admin Dashboard Content</h2>
                            <p>This area is only accessible to users with the Admin role.</p>
                            <div className="mt-4">
                                <h3 className="font-semibold">Your Account Information:</h3>
                                <p>User ID: {currentUser?.userId}</p>
                                <p>Email: {currentUser?.email}</p>
                                <p>Roles: {currentUser?.roles.join(', ')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
