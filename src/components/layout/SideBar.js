import React from "react";
import { Link } from "react-router-dom";
import { Menu, Package, Users, Home } from "react-feather"; // Using react-feather icons

const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: Home },
    { to: "/products", label: "Products", icon: Package },
    { to: "/categories", label: "Categories", icon: Menu },
    { to: "/customers", label: "Customers", icon: Users },
];

const SideBar = ({ isSidebarHidden, setIsSidebarHidden }) => {
    return (
        <div className={`fixed lg:relative z-40 bg-blue-800 h-full transition-all duration-300 ${isSidebarHidden ? "w-0 overflow-hidden" : "w-64"}`}>
            {/* Logo area */}
            <div className="flex items-center justify-center h-16 bg-blue-900">
                <h1 className="text-white text-xl font-bold">Admin Dashboard</h1>
            </div>

            {/* Navigation items */}
            <div className="mt-5">
                {navItems.map((item, index) => (
                    <Link
                        key={index}
                        to={item.to}
                        className="text-white flex p-4 items-center hover:bg-blue-700"
                    >
                        <item.icon size={20} className="mr-3" />
                        {item.label}
                    </Link>
                ))}
            </div>

            {/* Logout option at bottom */}
            <div className="absolute bottom-0 w-full">
                <Link
                    to="/login"
                    className="text-white flex p-4 items-center hover:bg-blue-700 border-t border-blue-700"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                    </svg>
                    Logout
                </Link>
            </div>
        </div>
    );
};

export default SideBar;