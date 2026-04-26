"use client";
import React, { useState, useEffect } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function NewArraivals() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const router = useRouter();

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
    const scrollContainerRef = React.useRef(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${backendUrl}/api/client/product/products?limit=20`);
                const data = await res.json();

                if (data.success) {
                    setProducts(data.data);
                } else {
                    setError(data.message);
                }
            } catch (err) {
                setError("Failed to fetch products");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [backendUrl]);

    const updateScrollButtons = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = scrollContainerRef.current.clientWidth;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', updateScrollButtons);
            updateScrollButtons();
            window.addEventListener('resize', updateScrollButtons);
            return () => {
                container.removeEventListener('scroll', updateScrollButtons);
                window.removeEventListener('resize', updateScrollButtons);
            };
        }
    }, [products]);

    if (loading) {
        return (
            <div className="w-full py-10 flex items-center justify-center">
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full py-10 flex items-center justify-center">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="w-full py-10 flex items-center justify-center">
                <p className="text-gray-500">No products available</p>
            </div>
        );
    }

    return (
        <div className="w-full py-8 px-4">
            <div className="flex items-center justify-between mb-6 max-w-7xl mx-auto">
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-800 text-center">New Arrivals</h2>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => scroll('left')}
                        disabled={!canScrollLeft}
                        className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Scroll left"
                    >
                        <FiArrowLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        disabled={!canScrollRight}
                        className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Scroll right"
                    >
                        <FiArrowRight className="w-5 h-5 text-gray-700" />
                    </button>
                </div>
            </div>

            <div className="relative max-w-7xl mx-auto">
                <div
                    ref={scrollContainerRef}
                    className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {products.map((product) => {
                        const productImage = product.cover_image || (product.weights && product.weights[0]?.images?.[0]) || null;
                        return (
                            <div
                                key={product._id}
                                onClick={() => router.push(`/product/${product._id}`)}
                                className="min-w-[calc(50%-8px)] sm:min-w-[calc(50%-12px)] md:min-w-[calc(50%-12px)] bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer flex-shrink-0"
                            >
                                <div className="aspect-square bg-gray-100 relative">
                                    {productImage ? (
                                        <img
                                            src={productImage}
                                            alt={product.firstName}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            No Image
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-800 truncate">
                                        {product.firstName}
                                    </h3>
                                    {product.lastName && (
                                        <p className="text-sm text-gray-500 truncate">
                                            {product.lastName}
                                        </p>
                                    )}
                                    {product.category && (
                                        <p className="text-xs text-emerald-600 mt-1">
                                            {product.category.category_name}
                                        </p>
                                    )}
                                    <div className="mt-2">
                                        {product.weights && product.weights.length > 0 && (
                                            <p className="text-lg font-bold text-gray-900">
                                                ৳{Math.min(...product.weights.map(w => w.price))}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}