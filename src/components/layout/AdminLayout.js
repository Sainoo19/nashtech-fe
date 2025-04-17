import React, { useState } from "react";
import SideBar from "./SideBar";
import { Menu } from "react-feather";
import { useAuth } from '../../contexts/AuthContext';

const AdminLayout = ({ children }) => {
    const { currentUser, logout } = useAuth();
    const [isSidebarHidden, setIsSidebarHidden] = useState(false);

    const handleLogout = async () => {
        await logout();
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <SideBar
                isSidebarHidden={isSidebarHidden}
                setIsSidebarHidden={setIsSidebarHidden}
            />

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
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

                {/* Main content area */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;