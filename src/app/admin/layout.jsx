"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiGrid, FiPackage, FiLayout, FiList, FiTruck, FiMenu, FiX, FiSettings } from "react-icons/fi";

export default function AdminLayout({ children }) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
            if (window.innerWidth >= 1024) {
                setSidebarOpen(false);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (sidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [sidebarOpen]);

    const menuItems = [
        { name: 'Dashboard', path: '/admin', icon: <FiGrid className="w-4 h-4 sm:w-5 sm:h-5" /> },
        { name: 'Orders', path: '/admin/orders', icon: <FiTruck className="w-4 h-4 sm:w-5 sm:h-5" /> },
        { name: 'Add Category', path: '/admin/category', icon: <FiGrid className="w-4 h-4 sm:w-5 sm:h-5" /> },
        { name: 'All Categories', path: '/admin/category/all-categories', icon: <FiList className="w-4 h-4 sm:w-5 sm:h-5" /> },
        { name: 'Upload Product', path: '/admin/product', icon: <FiPackage className="w-4 h-4 sm:w-5 sm:h-5" /> },
        { name: 'All Products', path: '/admin/product/all-products', icon: <FiPackage className="w-4 h-4 sm:w-5 sm:h-5" /> },
        { name: 'Stock Management', path: '/admin/stock', icon: <FiTruck className="w-4 h-4 sm:w-5 sm:h-5" /> },
        { name: 'Headers', path: '/admin/header', icon: <FiLayout className="w-4 h-4 sm:w-5 sm:h-5" /> },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setSidebarOpen(true)}
                className={`fixed top-4 left-4 z-50 p-2.5 sm:p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg-lg shadow-lg transition-all lg:hidden ${sidebarOpen ? 'hidden' : ''}`}
                aria-label="Open menu"
            >
                <FiMenu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Overlay */}
            {sidebarOpen && isMobile && (
                <div 
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed top-0 left-0 h-full z-50 transition-all duration-300 ease-out
                lg:relative lg:translate-x-0
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="h-full w-56 sm:w-64 bg-white/95 backdrop-blur-md border-r border-gray-200 p-4 sm:p-5 flex flex-col shadow-xl lg:shadow-none">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <Link href="/admin" onClick={() => isMobile && setSidebarOpen(false)} className="flex items-center gap-2">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                                <FiSettings className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <div>
                                <span className="text-sm sm:text-base font-bold text-emerald-800 block leading-tight">Admin</span>
                                <span className="text-[10px] sm:text-xs text-gray-500">Panel</span>
                            </div>
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
                            aria-label="Close menu"
                        >
                            <FiX className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Menu Items */}
                    <div className="flex-1 overflow-y-auto space-y-1">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    onClick={() => isMobile && setSidebarOpen(false)}
                                    className={`
                                        flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg font-medium text-xs sm:text-sm transition-all
                                        ${isActive 
                                            ? "bg-emerald-600 text-white shadow-md" 
                                            : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-700"
                                        }
                                    `}
                                >
                                    {item.icon}
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Footer */}
                    <div className="mt-auto pt-4 border-t border-gray-100">
                        <Link 
                            href="/" 
                            target="_blank"
                            className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-gray-500 hover:text-emerald-600 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            View Website
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-h-screen p-3 sm:p-4 lg:p-6 overflow-y-auto">
                <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8">
                    {children}
                </div>
            </div>
        </div>
    );
}