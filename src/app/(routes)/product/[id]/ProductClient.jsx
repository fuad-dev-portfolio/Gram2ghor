"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiShoppingCart, FiCheck } from "react-icons/fi";
import { addToCart } from "@/utils/cart";

export default function ProductClient({ productId }) {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedWeight, setSelectedWeight] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);
    const [added, setAdded] = useState(false);
    const router = useRouter();

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                if (!productId) return;
                
                const res = await fetch(`${backendUrl}/api/client/product/product/${productId}`);
                const data = await res.json();
                
                if (data.success) {
                    setProduct(data.data);
                } else {
                    setError(data.message);
                }
            } catch (err) {
                setError("Failed to fetch product");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchProduct();
        }
    }, [productId, backendUrl]);

    const handleAddToCart = async () => {
        if (!product || !product.weights[selectedWeight]) return;

        setAdding(true);
        try {
            const guestId = (() => {
                let id = localStorage.getItem('guestId');
                if (!id) {
                    id = `guest_${Date.now()}`;
                    localStorage.setItem('guestId', id);
                }
                return id;
            })();

            const res = await fetch(`${backendUrl}/api/client/cart/add`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'guest-id': guestId
                },
                body: JSON.stringify({
                    productId: product._id,
                    productName: product.firstName,
                    productImage: product.cover_image,
                    quantity: quantity,
                    weight: product.weights[selectedWeight].weight,
                    price: product.weights[selectedWeight].price
                })
            });
            const data = await res.json();

            if (data.success) {
                setAdded(true);
                setTimeout(() => setAdded(false), 2000);
            } else {
                alert(data.message || 'Failed to add to cart');
            }
        } catch (err) {
            alert('Failed to add to cart');
        } finally {
            setAdding(false);
        }
    };

    const goToCart = () => {
        router.push('/cart');
    };

    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <p className="text-gray-500">Product not found</p>
            </div>
        );
    }

    const currentWeight = product.weights?.[selectedWeight];
    const allImages = currentWeight?.images?.length > 0 
        ? currentWeight.images 
        : (product.cover_image ? [product.cover_image] : []);

    return (
        <div className="w-full py-8 px-4 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                        {allImages.length > 0 ? (
                            <img 
                                src={allImages[selectedImage]} 
                                alt={product.firstName}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                No Image
                            </div>
                        )}
                    </div>
                    
                    {allImages.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto">
                            {allImages.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 ${
                                        selectedImage === index ? 'border-emerald-500' : 'border-transparent'
                                    }`}
                                >
                                    <img 
                                        src={img} 
                                        alt={`${product.firstName} ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        {product.firstName}
                    </h1>
                    {product.lastName && (
                        <p className="text-lg text-gray-600 mt-1">
                            {product.lastName}
                        </p>
                    )}
                    {product.category && (
                        <p className="text-sm text-emerald-600 mt-2">
                            {product.category.category_name}
                        </p>
                    )}

                    <div className="mt-6">
                        {product.weights && product.weights.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Size/Weight
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {product.weights.map((weight, index) => (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                setSelectedWeight(index);
                                                setSelectedImage(0);
                                            }}
                                            className={`px-4 py-2 rounded-lg border ${
                                                selectedWeight === index 
                                                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                                                    : 'border-gray-300 text-gray-700'
                                            }`}
                                        >
                                            {weight.weight} - ৳{weight.price}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Quantity
                        </label>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center"
                            >
                                -
                            </button>
                            <span className="w-12 text-center text-lg font-medium">
                                {quantity}
                            </span>
                            <button
                                onClick={() => setQuantity(Math.min(currentWeight?.stock || 10, quantity + 1))}
                                className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <div className="mt-6">
                        <p className="text-sm text-gray-500">
                            Available Stock: {currentWeight?.stock || 0}
                        </p>
                    </div>

                    <div className="mt-6 flex items-center gap-4">
                        <p className="text-2xl font-bold text-gray-900">
                            ৳{currentWeight?.price * quantity || 0}
                        </p>
                    </div>

                    <button
                        onClick={added ? goToCart : handleAddToCart}
                        disabled={adding || !currentWeight?.stock}
                        className="mt-6 w-full bg-emerald-600 text-white font-medium py-3 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {adding ? 'Adding...' : added ? <><FiCheck className="w-5 h-5" /> Added - Go to Cart</> : currentWeight?.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </button>

                    {product.description && (
                        <div className="mt-8">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                Description
                            </h3>
                            <p className="text-gray-600">
                                {product.description}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}