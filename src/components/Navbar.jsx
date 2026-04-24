"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { FiSearch, FiShoppingCart, FiChevronDown, FiTruck } from "react-icons/fi";

function Navbar() {
    const [categories, setCategories] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

    useEffect(() => {
        fetchCategories();
        fetchCartCount();

        // Listen for cart updates
        const handleCartUpdate = () => fetchCartCount();
        window.addEventListener('cart-updated', handleCartUpdate);
        return () => window.removeEventListener('cart-updated', handleCartUpdate);
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${backendUrl}/api/admin/category/get-all-category`);
            const data = await res.json();
            if (data.success) {
                setCategories(data.data || []);
            }
        } catch (error) {
            console.error("Failed to fetch categories", error);
        }
    };

    const getGuestId = () => {
        if (typeof window === 'undefined') return null;
        let guestId = localStorage.getItem('guestId');
        if (!guestId) {
            guestId = `guest_${Date.now()}`;
            localStorage.setItem('guestId', guestId);
        }
        return guestId;
    };

    const fetchCartCount = async () => {
        try {
            const guestId = getGuestId();
            const res = await fetch(`${backendUrl}/api/client/cart/get`, {
                headers: { 'guest-id': guestId }
            });
            const data = await res.json();
            if (data.success && data.data) {
                setCartCount(data.data.items?.length || 0);
            }
        } catch (error) {
            console.error("Failed to fetch cart count", error);
        }
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo Section */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="flex items-center gap-2">
                            <Image
                                src="/logo.png"
                                alt="Gram2Ghor Logo"
                                width={80}
                                height={80}
                                className="object-contain"
                                priority
                            />
                            {/* Optional text logo for larger screens
                            <span className="font-bold text-2xl text-emerald-800 tracking-tight hidden lg:block">
                                Gram2Ghor
                            </span> */}
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex space-x-6 lg:space-x-8 items-center">
                        <Link href="/" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">
                            Home
                        </Link>

                        {/* All Categories Dropdown */}
                        <div className="relative group">
                            <button className="flex items-center text-gray-600 hover:text-emerald-600 font-medium transition-colors py-2 focus:outline-none">
                                All Categories
                                <FiChevronDown className="ml-1 w-4 h-4 transition-transform group-hover:rotate-180" />
                            </button>

                            {/* Dropdown Menu */}
                            <div className="absolute left-0 mt-0 w-48 bg-white border border-gray-100 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                                <div className="py-2">
                                    {categories && categories.length > 0 ? (
                                        categories.map((category) => (
                                            <Link
                                                key={category._id}
                                                href={`/${category.category_name.toLowerCase().replace(/\s+/g, '-')}`}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                                            >
                                                {category.category_name}
                                            </Link>
                                        ))
                                    ) : (
                                        <span className="block px-4 py-2 text-sm text-gray-500">No categories found</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <Link href="/ghee-oil-new" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">
                            Ghee & Oil
                        </Link>
                        <Link href="/honey-sweets-new" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">
                            Honey & Sweets
                        </Link>
                    </div>

                    {/* Icons Section (Search, Track Order & Cart) */}
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        {/* Search Button */}
                        <button
                            className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                            aria-label="Search"
                        >
                            <FiSearch className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>

                        {/* Track Order Button */}
                        <Link
                            href="/track-order"
                            className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                            aria-label="Track Order"
                            title="Track Order"
                        >
                            <FiTruck className="w-5 h-5 sm:w-6 sm:h-6" />
                        </Link>

                        {/* Cart Button */}
                        <Link href="/cart" className="relative">
                            <button
                                className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                                aria-label="Cart"
                            >
                                <FiShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                            </button>
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] sm:text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-emerald-600 rounded-full border-2 border-white">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;