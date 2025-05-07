import React from "react";
import { Link } from "react-router-dom";
import { Menu, Package, Users, Home, LogOut } from "react-feather"; // Using react-feather icons

const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: Home },
    { to: "/products", label: "Products", icon: Package },
    { to: "/categories", label: "Categories", icon: Menu },
    { to: "/customers", label: "Customers", icon: Users },
    { to: "/variants", label: "Variants", icon: Package },
];

const SideBar = ({ isSidebarHidden, setIsSidebarHidden }) => {
    return (
        <div className={`fixed lg:relative z-40 bg-primary-dark h-full transition-all duration-300 ${isSidebarHidden ? "w-0 overflow-hidden" : "w-64"}`}>
            {/* Logo area */}
            <div className="flex items-center justify-center h-16 bg-primary">
                <h1 className="text-white text-xl font-bold">Admin Dashboard</h1>
            </div>

            {/* Navigation items */}
            <div className="mt-5">
                {navItems.map((item, index) => (
                    <Link
                        key={index}
                        to={item.to}
                        className="text-white flex p-4 items-center hover:bg-primary-light"
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
                    className="text-white flex p-4 items-center hover:bg-primary-light border-t border-primary"
                >
                    <LogOut size={20} className="mr-3" />
                    Logout
                </Link>
            </div>
        </div>
    );
};

export default SideBar;