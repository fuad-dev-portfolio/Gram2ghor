"use client";
import React, { useState, useEffect } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function NewArraivals() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const router = useRouter();

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
    const productsPerView = 2;
    const containerRef = React.useRef(null);

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

    const canScrollLeft = currentIndex > 0;
    const canScrollRight = currentIndex + productsPerView < products.length;

    const scroll = (direction) => {
        if (direction === 'left' && canScrollLeft) {
            setCurrentIndex(prev => prev - productsPerView);
        } else if (direction === 'right' && canScrollRight) {
            setCurrentIndex(prev => prev + productsPerView);
        }
    };

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

    const visibleProducts = products.slice(currentIndex, currentIndex + productsPerView);

    return (
        <div className="w-full py-8 px-4">
            <div className="flex items-center justify-between mb-6 max-w-7xl mx-auto">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">New Arrivals</h2>
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

            <div 
                ref={containerRef}
                className="max-w-7xl mx-auto"
            >
                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                    {visibleProducts.map((product) => {
                        const productImage = product.cover_image || (product.weights && product.weights[0]?.images?.[0]) || null;
                        return (
                            <div
                                key={product._id}
                                onClick={() => router.push(`/product/${product._id}`)}
                                className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                            >
                                <div className="aspect-square bg-gray-100">
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
                                <div className="p-3 sm:p-4">
                                    <h3 className="font-medium sm:font-semibold text-gray-800 text-sm sm:text-base truncate">
                                        {product.firstName}
                                    </h3>
                                    {product.lastName && (
                                        <p className="text-xs sm:text-sm text-gray-500 truncate">
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
                                            <p className="text-base sm:text-lg font-bold text-gray-900">
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