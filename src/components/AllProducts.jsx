"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiEye, FiPlus } from "react-icons/fi";

export default function AllProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hoveredProduct, setHoveredProduct] = useState(null);
    const router = useRouter();

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${backendUrl}/api/client/product/products?limit=50`);
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

    const goToProduct = (productId) => {
        router.push(`/product/${productId}`);
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

    return (
        <div className="w-full py-8 px-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 text-center mb-6">All Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 max-w-7xl mx-auto">
                {products.map((product) => {
                    const productImage = product.cover_image || (product.weights && product.weights[0]?.images?.[0]) || null;
                    return (
                        <div
                            key={product._id}
                            onClick={() => goToProduct(product._id)}
                            onMouseEnter={() => setHoveredProduct(product._id)}
                            onMouseLeave={() => setHoveredProduct(null)}
                            className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-lg hover:border-emerald-200 transition-all duration-300 cursor-pointer"
                        >
                            <div className="relative aspect-square bg-gray-100 overflow-hidden">
                                {productImage ? (
                                    <img
                                        src={productImage}
                                        alt={product.firstName}
                                        className={`w-full h-full object-cover transition-transform duration-300 ${hoveredProduct === product._id ? 'scale-110' : ''}`}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        No Image
                                    </div>
                                )}

                                {hoveredProduct === product._id && (
                                    <div className="absolute inset-0 bg-black/40 flex items-end justify-center pb-3 sm:pb-4 gap-2 sm:gap-3">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                goToProduct(product._id);
                                            }}
                                            className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-white hover:bg-emerald-600 hover:text-white text-gray-800 text-[10px] sm:text-xs font-medium rounded-full transition-colors"
                                        >
                                            <FiEye className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                                            Quick View
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                goToProduct(product._id);
                                            }}
                                            className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full transition-colors"
                                        >
                                            <FiPlus className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="p-2 sm:p-3 flex flex-col items-center">
                                <h3 className="font-medium text-gray-800 text-xs sm:text-sm truncate text-center w-full">
                                    {product.firstName}
                                </h3>
                                {product.lastName && (
                                    <p className="text-[10px] sm:text-xs text-gray-500 truncate text-center w-full">
                                        {product.lastName}
                                    </p>
                                )}
                                {product.category && (
                                    <p className="text-[10px] sm:text-xs text-emerald-600 mt-1 truncate text-center">
                                        {product.category.category_name}
                                    </p>
                                )}
                                <div className="mt-1 sm:mt-2">
                                    {product.weights && product.weights.length > 0 && (
                                        <p className="text-sm sm:text-base font-bold text-gray-900 text-center">
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
    );
}