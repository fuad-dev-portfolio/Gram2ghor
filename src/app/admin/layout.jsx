"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiGrid, FiPackage, FiLayout, FiList } from "react-icons/fi";

export default function AdminLayout({ children }) {
    const pathname = usePathname();

    const menuItems = [
        { name: 'Add Category', path: '/admin/category', icon: <FiGrid className="w-5 h-5" /> },
        { name: 'All Categories', path: '/admin/category/all-categories', icon: <FiList className="w-5 h-5" /> },
        { name: 'Products', path: '/admin/product', icon: <FiPackage className="w-5 h-5" /> },
        { name: 'Headers', path: '/admin/header', icon: <FiLayout className="w-5 h-5" /> },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col gap-4 shadow-sm shrink-0">
                <Link href="/admin" className="text-2xl font-bold text-emerald-800 mb-6 tracking-tight block">
                    Admin Panel
                </Link>
                
                <div className="flex flex-col gap-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                                    isActive ? "bg-emerald-600 text-white shadow-md shadow-emerald-200" : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-700"
                                }`}
                            >
                                {item.icon} {item.name}
                            </Link>
                        )
                    })}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-10 overflow-y-auto">
                <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
