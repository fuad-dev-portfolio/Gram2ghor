"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FiSearch, FiShoppingCart, FiTruck, FiMenu, FiX } from "react-icons/fi";

function Navbar() {
    const [categories, setCategories] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isMobile, setIsMobile] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
    const router = useRouter();

    useEffect(() => {
        setIsHydrated(true);
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const fetchCategories = useCallback(async () => {
        try {
            const res = await fetch(`${backendUrl}/api/admin/category/get-all-category`);
            const data = await res.json();
            if (data.success) {
                setCategories(data.data || []);
            }
        } catch (error) {
            console.error("Failed to fetch categories", error);
        }
    }, [backendUrl]);

    const getGuestId = useCallback(() => {
        if (typeof window === 'undefined') return null;
        let guestId = localStorage.getItem('guestId');
        if (!guestId) {
            guestId = `guest_${Date.now()}`;
            localStorage.setItem('guestId', guestId);
        }
        return guestId;
    }, []);

    const fetchCartCount = useCallback(async () => {
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
    }, [backendUrl, getGuestId]);

    useEffect(() => {
        fetchCategories();
        fetchCartCount();

        const handleCartUpdate = () => fetchCartCount();
        window.addEventListener('cart-updated', handleCartUpdate);
        return () => window.removeEventListener('cart-updated', handleCartUpdate);
    }, [fetchCategories, fetchCartCount]);

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [mobileMenuOpen]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery("");
            setMobileMenuOpen(false);
        }
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <>
            <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 sm:h-20">
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="md:hidden p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                            aria-label="Open menu"
                        >
                            <FiMenu className="w-6 h-6" />
                        </button>

                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/" className="flex items-center gap-2">
                                <Image
                                    src="/logo.png"
                                    alt="Gram2Ghor Logo"
                                    width={160}
                                    height={160}
                                    className="object-contain w-12 sm:w-16 h-12 sm:h-16"
                                    priority
                                />
                            </Link>
                        </div>

                        <div className="hidden md:flex space-x-6 lg:space-x-8 items-center">
                            <Link href="/" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">
                                Home
                            </Link>

                            <div className="relative group">
                                <button className="flex items-center text-gray-600 hover:text-emerald-600 font-medium transition-colors py-2 focus:outline-none">
                                    All Categories
                                    <svg className="ml-1 w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                <div className="absolute left-0 mt-0 w-48 bg-white border border-gray-100 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                                    <div className="py-2">
                                        {categories.length > 0 ? (
                                            categories.map((category) => (
                                                <Link
                                                    key={category._id}
                                                    href={`/${encodeURIComponent(category.category_name.toLowerCase().replace(/\s+/g, '-'))}`}
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

                        <div className="flex items-center space-x-2 sm:space-x-4">
                            <button
                                onClick={() => isHydrated && setMobileMenuOpen(true)}
                                className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                                aria-label="Search"
                            >
                                <FiSearch className="w-5 h-5 sm:w-6 sm:h-6" />
                            </button>

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

            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 z-[60] md:hidden"
                    onClick={closeMobileMenu}
                >
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                </div>
            )}

            <div
                className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white z-[70] md:hidden transform transition-transform duration-300 ease-in-out shadow-2xl ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-emerald-600">
                        <Link href="/" onClick={closeMobileMenu}>
                            <Image
                                src="/logo.png"
                                alt="Gram2Ghor Logo"
                                width={50}
                                height={50}
                                className="object-contain"
                            />
                        </Link>
                        <button
                            onClick={closeMobileMenu}
                            className="p-2 text-white hover:bg-emerald-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
                            aria-label="Close menu"
                        >
                            <FiX className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="p-4 border-b border-gray-100">
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search products..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                            />
                            <button
                                type="submit"
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors"
                                aria-label="Search"
                            >
                                <FiSearch className="w-5 h-5" />
                            </button>
                        </form>
                    </div>

                    <div className="flex-1 overflow-y-auto hide-scrollbar">
                        <Link
                            href="/track-order"
                            onClick={closeMobileMenu}
                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors border-b border-gray-100"
                        >
                            <FiTruck className="w-5 h-5" />
                            <span className="font-medium">Track Order</span>
                        </Link>

                        <div className="px-4 py-3 bg-gray-50">
                            <button
                                onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
                                className="flex items-center justify-between w-full text-left"
                            >
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                                    All Categories
                                </h3>
                                <svg
                                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${mobileCategoriesOpen ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>

                        <div className={`overflow-hidden transition-all duration-300 ${mobileCategoriesOpen ? 'max-h-[500px]' : 'max-h-0'}`}>
                            <div className="py-2">
                                {categories.length > 0 ? (
                                    categories.map((category) => (
                                        <Link
                                            key={category._id}
                                            href={`/${encodeURIComponent(category.category_name.toLowerCase().replace(/\s+/g, '-'))}`}
                                            onClick={closeMobileMenu}
                                            className="flex items-center px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors border-b border-gray-50"
                                        >
                                            <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
                                            {category.category_name}
                                        </Link>
                                    ))
                                ) : (
                                    <div className="px-4 py-3 text-sm text-gray-500">No categories found</div>
                                )}
                            </div>
                        </div>

                        <div className="py-2 mt-auto border-t border-gray-100">
                            <Link
                                href="/"
                                onClick={closeMobileMenu}
                                className="flex items-center px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                            >
                                Home
                            </Link>
                            <Link
                                href="/ghee-oil-new"
                                onClick={closeMobileMenu}
                                className="flex items-center px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                            >
                                Ghee & Oil
                            </Link>
                            <Link
                                href="/honey-sweets-new"
                                onClick={closeMobileMenu}
                                className="flex items-center px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                            >
                                Honey & Sweets
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Navbar;