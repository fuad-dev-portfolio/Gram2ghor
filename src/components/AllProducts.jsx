"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AllProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
                            onClick={() => router.push(`/product/${product._id}`)}
                            className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        >
                            <div className="aspect-square bg-gray-100">
                                {productImage ? (
                                    <img
                                        src={productImage}
                                        alt={product.firstName}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        No Image
                                    </div>
                                )}
                            </div>
                            <div className="p-2 sm:p-3">
                                <h3 className="font-medium text-gray-800 text-xs sm:text-sm truncate">
                                    {product.firstName}
                                </h3>
                                {product.lastName && (
                                    <p className="text-[10px] sm:text-xs text-gray-500 truncate">
                                        {product.lastName}
                                    </p>
                                )}
                                {product.category && (
                                    <p className="text-[10px] sm:text-xs text-emerald-600 mt-1 truncate">
                                        {product.category.category_name}
                                    </p>
                                )}
                                <div className="mt-1 sm:mt-2">
                                    {product.weights && product.weights.length > 0 && (
                                        <p className="text-sm sm:text-base font-bold text-gray-900">
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