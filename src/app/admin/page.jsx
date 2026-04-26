"use client";
import React from "react";
import Link from "next/link";
import { FiGrid, FiPackage, FiTruck, FiShoppingBag, FiDollarSign, FiTrendingUp } from "react-icons/fi";

export default function AdminDashboard() {
    return (
        <div>
            <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Dashboard</h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Welcome to Gram2Ghor Admin Panel</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-4 sm:p-5 text-white">
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center">
                            <FiPackage className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <FiTrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white/70" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold">0</p>
                    <p className="text-[10px] sm:text-xs text-emerald-100 mt-1">Total Products</p>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 sm:p-5 text-white">
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center">
                            <FiShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <FiTrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white/70" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold">0</p>
                    <p className="text-[10px] sm:text-xs text-blue-100 mt-1">Total Orders</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 sm:p-5 text-white">
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center">
                            <FiTruck className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <FiTrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white/70" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold">0</p>
                    <p className="text-[10px] sm:text-xs text-purple-100 mt-1">Pending Orders</p>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 sm:p-5 text-white">
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center">
                            <FiDollarSign className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <FiTrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white/70" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold">৳0</p>
                    <p className="text-[10px] sm:text-xs text-orange-100 mt-1">Total Revenue</p>
                </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                    <Link href="/admin/product" className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-white hover:bg-emerald-50 border border-gray-200 rounded-lg transition-colors group">
                        <FiPackage className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                        <span className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-emerald-700">Upload Product</span>
                    </Link>
                    <Link href="/admin/product/all-products" className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-white hover:bg-blue-50 border border-gray-200 rounded-lg transition-colors group">
                        <FiGrid className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                        <span className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-blue-700">All Products</span>
                    </Link>
                    <Link href="/admin/category" className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-white hover:bg-purple-50 border border-gray-200 rounded-lg transition-colors group">
                        <FiGrid className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                        <span className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-purple-700">Add Category</span>
                    </Link>
                    <Link href="/admin/stock" className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-white hover:bg-orange-50 border border-gray-200 rounded-lg transition-colors group">
                        <FiTruck className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                        <span className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-orange-700">Stock</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}