"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FiShoppingCart, FiCheck, FiHelpCircle } from "react-icons/fi";
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
    const [qaExpanded, setQaExpanded] = useState({});
    const router = useRouter();
    const productRef = useRef(null);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                if (!productId) return;
                
                const res = await fetch(`${backendUrl}/api/client/product/product/${productId}`);
                const data = await res.json();
                
                if (data.success) {
                    setProduct(data.data);
                    if (productRef.current) {
                        productRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
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
                    weightIndex: selectedWeight,
                    price: product.weights[selectedWeight].price
                })
            });
            const data = await res.json();

            if (data.success) {
                setAdded(true);
                setTimeout(() => setAdded(false), 2000);
                window.dispatchEvent(new Event('cart-updated'));
            } else {
                alert(data.message || 'Failed to add to cart');
            }
        } catch (err) {
            alert('Failed to add to cart');
        } finally {
            setAdding(false);
        }
    };

    const handleCashOnDelivery = async () => {
        if (!product || !product.weights[selectedWeight]) return;
        
        const currentWeight = product.weights[selectedWeight];
        if (!currentWeight?.stock || currentWeight.stock < 1) {
            alert('This size is out of stock');
            return;
        }

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
                    weight: currentWeight.weight,
                    weightIndex: selectedWeight,
                    price: currentWeight.price
                })
            });
            const data = await res.json();

            if (data.success) {
                window.dispatchEvent(new Event('cart-updated'));
                router.push('/checkout');
            } else {
                alert(data.message || 'Failed to proceed');
            }
        } catch (err) {
            alert('Failed to proceed');
        } finally {
            setAdding(false);
        }
    };

    const goToCart = () => {
        router.push('/cart');
    };

    const toggleQA = (index) => {
        setQaExpanded(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    if (loading) {
        return (
            <div className="w-full min-h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-gray-300 border-t-emerald-600 rounded-full animate-spin" />
                    <p className="text-gray-500">Loading...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full min-h-[60vh] flex items-center justify-center">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="w-full min-h-[60vh] flex items-center justify-center">
                <p className="text-gray-500">Product not found</p>
            </div>
        );
    }

    const currentWeight = product.weights?.[selectedWeight];
    const allImages = currentWeight?.images?.length > 0 
        ? currentWeight.images 
        : (product.cover_image ? [product.cover_image] : []);

    return (
        <div ref={productRef} className="w-full py-6 sm:py-8 px-4 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
                <div className="order-1">
                    <div className="aspect-square bg-gray-100 rounded-lg sm:rounded-xl overflow-hidden mb-3 sm:mb-4">
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
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {allImages.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                                        selectedImage === index ? 'border-emerald-600' : 'border-transparent hover:border-gray-300'
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

                <div className="order-2">
                    {product.category && (
                        <p className="text-xs sm:text-sm text-emerald-600 font-medium mb-2">
                            {product.category.category_name}
                        </p>
                    )}

                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                        {product.firstName}
                    </h1>
                    {product.lastName && (
                        <p className="text-base sm:text-lg text-gray-600 mt-1">
                            {product.lastName}
                        </p>
                    )}

                    <div className="mt-6 sm:mt-8">
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
                                            className={`px-3 sm:px-4 py-2 rounded-lg border text-sm transition-all ${
                                                selectedWeight === index 
                                                    ? 'border-emerald-600 bg-emerald-50 text-emerald-700' 
                                                    : 'border-gray-300 text-gray-700 hover:border-emerald-400'
                                            }`}
                                        >
                                            {weight.weight} - ৳{weight.price}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-5 sm:mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Quantity
                        </label>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors text-lg font-medium"
                            >
                                -
                            </button>
                            <span className="w-12 text-center text-lg font-medium">
                                {quantity}
                            </span>
                            <button
                                onClick={() => setQuantity(Math.min(currentWeight?.stock || 10, quantity + 1))}
                                className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors text-lg font-medium"
                            >
                                +
                            </button>
                            <button
                                onClick={handleCashOnDelivery}
                                disabled={adding || !currentWeight?.stock}
                                className="ml-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                Cash on Delivery
                            </button>
                        </div>
                    </div>

                    <div className="mt-4 sm:mt-6">
                        {currentWeight?.stock > 0 ? (
                            <p className="text-sm text-emerald-600">
                                ✓ In Stock ({currentWeight.stock} available)
                            </p>
                        ) : (
                            <p className="text-sm text-red-500">
                                ✗ Out of Stock
                            </p>
                        )}
                    </div>

                    <div className="mt-5 sm:mt-6">
                        <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                            ৳{currentWeight?.price * quantity || 0}
                        </p>
                    </div>

                    <div className="mt-6 sm:mt-8">
                        <button
                            onClick={added ? goToCart : handleAddToCart}
                            disabled={adding || !currentWeight?.stock}
                            className="w-full bg-emerald-600 text-white font-medium py-3 sm:py-3.5 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                        >
                            {adding ? 'Adding...' : added ? <><FiCheck className="w-5 h-5" /> Added - Go to Cart</> : currentWeight?.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                    </div>

                    {product.description && (
                        <div className="mt-8 sm:mt-10">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                Description
                            </h3>
                            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                                {product.description}
                            </p>
                        </div>
                    )}

                    {product.qa && product.qa.length > 0 && (
                        <div className="mt-8 sm:mt-10">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <FiHelpCircle className="w-5 h-5 text-emerald-600" />
                                Questions & Answers
                            </h3>
                            <div className="space-y-3">
                                {product.qa.map((item, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                                        <button
                                            onClick={() => toggleQA(index)}
                                            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                                        >
                                            <span className="font-medium text-gray-800 text-sm sm:text-base pr-4">
                                                Q: {item.question}
                                            </span>
                                            <span className={`w-6 h-6 flex items-center justify-center text-gray-500 transition-transform ${qaExpanded[index] ? 'rotate-180' : ''}`}>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </span>
                                        </button>
                                        {qaExpanded[index] && (
                                            <div className="p-4 bg-white border-t border-gray-200">
                                                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                                                    A: {item.answer}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}